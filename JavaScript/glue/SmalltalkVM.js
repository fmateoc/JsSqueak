/*
 * Copyright (c) 2022  Florin Mateoc
 *
 * This file is part of JsSqueak.
 *
 * JsSqueak is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JsSqueak is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JsSqueak.  If not, see <https://www.gnu.org/licenses/>.
 */

Error.stackTraceLimit = 50;

const smalltalkVM = Object.create(null);

smalltalkVM.EpochUTC = Date.UTC(1901,0,1);
smalltalkVM.Epoch = smalltalkVM.EpochUTC + new Date().getTimezoneOffset()*60000;        // local timezone
smalltalkVM.MillisecondClockValueOffset = Date.now() - SmalltalkGlobals.MillisecondClockValue;
smalltalkVM.totalSeconds = function() {
    // seconds since 1901-01-01, local time
    return Math.floor((Date.now() - smalltalkVM.Epoch) / 1000);
}

smalltalkVM.lowSpaceThreshold = 0;
smalltalkVM.nextWakeupTick = 0;
smalltalkVM.previousTick = 0;
smalltalkVM.interruptPending = false;
smalltalkVM.pendingFinalizations = false;

smalltalkVM.specialObjectsArray = SmalltalkGlobals._specialObjectsArray[1].pointers;
const processor = smalltalkVM.specialObjectsArray[3].pointers[1].pointers;
smalltalkVM.quiescentProcessLists = processor[0].pointers;
smalltalkVM.activePriority = 10;   //SystemRockBottomPriority

Object.defineProperty(smalltalkVM, 'activeProcess', {
    get() { return processor[1] },
    set(newValue) { processor[1] = newValue; this.activePriority = newValue.pointers[2]},
    enumerable: true,
    configurable: true
});


smalltalkVM.removeFromList = function(processListPointers, process) {
    const first = processListPointers[0];
    const last = processListPointers[1];
    if (process === first) {
        if (first === last) {
            if (process.pointers[0] !== nil) {
                debugger;
                throw Error("should not happen");
            }
            processListPointers[0] = nil;
            processListPointers[1] = nil;
        } else {
            const next = first.pointers[0];
            processListPointers[0] = next;
        }
    } else if (first !== nil) {
        let next = first;
        while (next.pointers[0] !== process && next.pointers[0] !== nil)
            next = next.pointers[0];
        if (next.pointers[0] === process) {
            if (process === last) {
                if (process.pointers[0] !== nil) {
                    debugger;
                    throw Error("should not happen");
                }
                processListPointers[1] = next;
            } else {
                if (process.pointers[0] === nil) {
                    debugger;
                    throw Error("should not happen");
                }
            }
            next.pointers[0] = process.pointers[0];
        }
    }
    process.pointers[0] = nil;
    process.pointers[3] = nil;
}

smalltalkVM.wakeHighestPriority = function() {
    const lists = this.quiescentProcessLists;
    const lowest = 10;   //SystemRockBottomPriority
    for(let p = lists.length; p >= lowest; p--) {
        const processListPointers = lists[p - 1].pointers;
        const first = processListPointers[0];
        if (first !== nil) {
            this.removeFromList(processListPointers, first);
            return first;
        }
    }
    debugger;
    throw Error("scheduler could not find a runnable process");
}

smalltalkVM.ioLoadFunctionFrom = function ioLoadFunctionFrom(funcName, pluginName) {
    const plugin = globalThis[pluginName.valueOf()];
    if (plugin && plugin[funcName.valueOf()])
        return plugin[funcName.valueOf()];
    return null;
}

smalltalkVM.makePointwithxValueyValue = function makePointwithxValueyValue(x, y) {
    if (Number.isSafeInteger(x) && Number.isSafeInteger(y)) {
        const result = new SmalltalkGlobals._Point();
        result.pointers[0] = x;
        result.pointers[1] = y;
        return result;
    } else
        throw new TypeError("Not integer arguments");
}

smalltalkVM.totalJSHeapSize = function totalJSHeapSize() {
    return performance.memory.totalJSHeapSize;
}

smalltalkVM.bytesLeft = function bytesLeft() {
    const memory = performance.memory;
    return memory.totalJSHeapSize - memory.usedJSHeapSize;
}

smalltalkVM.processPreemptionYields = SmalltalkGlobals.ProcessPreemptionYields === undefined ? true : SmalltalkGlobals.ProcessPreemptionYields;

globalThis.SmalltalkVM = smalltalkVM;

//The following are not needed, since we do not serialize these two class variables
/*
SmalltalkGlobals._Symbol._NewSymbols[1]._initialize_(0).next();
SmalltalkGlobals._Symbol._SymbolTable[1]._initialize_(0).next();
*/

//The following is not needed (nor do we need to worry about semaphores in the image), since we do not deserialize processes (we deserialize them as nil)
/*
for (const processList of smalltalkVM.quiescentProcessLists) {
    processList.pointers[0] = nil;
    processList.pointers[1] = nil;
}
*/
const specials = smalltalkVM.specialObjectsArray;
const externalSemaphores = specials[38].pointers;
for (let i=0; i < externalSemaphores.length; i++)
    if (externalSemaphores[i] !== nil) {
        externalSemaphores[i] = nil;
    }

globalThis.GlobalActivationCounter = Number.MAX_SAFE_INTEGER;   //we don't want any interrupts before the processes have started

SmalltalkGlobals.rehashAll();


// (async function() {
//     await import('../overrides/sourceFiles/sourceFiles_hook.js');
// }());

gc();
memoryLogger();
//console.log(process.memoryUsage());

//while image data is stored, the environment prefix is set to "this" (and restored (in Smalltalk) only after the export is finished)
//here we do it when waking up on the JavaScript side
SmalltalkGlobals._JavaScriptTranspiler._instance().next().value._jsEnvironmentPrefix_(SmalltalkGlobals._ByteString.from('SmalltalkGlobals._')).next();


const globalCheckForInterruptsThreshold = 2000;
smalltalkVM.SkippedForDebugging = 5000; //compromise for debuggability - temporarily disable interrupts for stepping, but don't make the system run without interrupts for long after resuming the run

smalltalkVM.semaphoresToSignal = [];
globalThis.CheckInterruptsOrException = function* CheckInterruptsOrException(classAndSelector, insideClosure, insideLoop) {
    const yielded = GlobalCheckForInterrupts.next("preempted").value;
//    const yielded = GlobalCheckForInterrupts.next((insideLoop ?  "preempted loop within " : "preempted activation of ") + (insideClosure ?  "closure defined in " : "") + classAndSelector).value;
    if (yielded) {
        yield yielded;
        const p = SmalltalkVM.activeProcess, e = p.exception;
        p.exception = null;
        if (e === "DEBUGGER") {
            yield* SmalltalkVM.smalltalkDebug();
        }
        else if (e === "TERMINATE")
            throw "TERMINATE";
        else if (e)
            yield* e._signal();
    }
}
globalThis.GlobalCheckForInterrupts = (function* checkForInterrupts() {
    let fromNext;
    while(true) {
        GlobalActivationCounter = globalCheckForInterruptsThreshold;
        if (smalltalkVM.interruptPending) {
            smalltalkVM.interruptPending = false; // reset interrupt flag
            const sema = specials[30];
            if (sema !== nil) {
                if (typeof fromNext === 'string')
                    console.log(fromNext);
                console.log("Signalling interrupt semaphore ")
                fromNext = yield* sema._signal();
            } else {
                debugger;
                throw Error("should not happen");
            }
        }
        let now;
        const scheduled = smalltalkVM.nextWakeupTick;
        if (scheduled != 0 && (now = Date.now()) >= scheduled) {
            smalltalkVM.nextWakeupTick = 0; // reset timer interrupt
            const sema = specials[29];
            if (sema !== nil) {
//                if (typeof fromNext === 'string')
//                    console.log(fromNext);
//                console.log("Signalling timing semaphore after " + (now - smalltalkVM.previousTick) + "ms (vs " + (scheduled - smalltalkVM.previousTick) + "ms scheduled)");
                smalltalkVM.previousTick = now;   //see primitive_136 as well
                fromNext = yield* sema._signal();
            } else {
                debugger;
                throw Error("should not happen");
            }
        }
        if (smalltalkVM.pendingFinalizations) { // signal any pending finalizations
            smalltalkVM.pendingFinalizations = false;
            smalltalkVM.finalizationRegistry.register(new Object())
            const sema = specials[41];
            if (sema !== nil) {
                if (typeof fromNext === 'string')
                    console.log(fromNext);
                console.log("Signalling finalization semaphore ")
                fromNext = yield* sema._signal();
            } else {
                debugger;
                throw Error("should not happen");
            }
        }
        const semaphoresToSignal = smalltalkVM.semaphoresToSignal;
        if (semaphoresToSignal.length > 0) {
            while (semaphoresToSignal.length) {
                const index = semaphoresToSignal.shift();
                const sema = externalSemaphores[index - 1];
                if (sema !== nil) {
                    if (typeof fromNext === 'string')
//                        console.log(fromNext);
//                    console.log("signalling " + (sema.name.startsWith("no-name ") ? "external semaphore at index " + index : sema.name));
                    fromNext = yield* sema._signal();
                } else {
                    debugger;
                    throw Error("should not happen");
                }
            }
        }
        fromNext = yield
    }
})();

smalltalkVM.finalizationRegistry = new FinalizationRegistry(heldValue => smalltalkVM.pendingFinalizations = true);

console.log("setting up the scheduler loop");
let qualifier = "entering new";
setTimeout(function run () {
    const current = SmalltalkVM.activeProcess;
//    console.log(qualifier + " active process with priority " + SmalltalkVM.activePriority /*+ " at " + performance.now()*/);
    const yielded = current.generator.next().value;
//    console.log(yielded/* + " at " + performance.now()*/);
    let nextTimeout = 0;
    if (typeof yielded === "string" && yielded.startsWith("relinquishing Processor for ")) {
        nextTimeout = Number(yielded.slice(28));
    } else if (yielded === undefined) {
        debugger;
        throw Error("should not happen");
    }
    if (yielded !== "Quitting") {
        qualifier = current === SmalltalkVM.activeProcess ? "re-entering" : "entering new";
        setTimeout(run, nextTimeout);
    }
});


smalltalkVM.debug = function* runtimeJsDebug() {
    const t = performance.now();
    GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
    debugger;
    if (performance.now() - t < 30) {
        //we did not pause in the debugger, it means we are in runtime mode
        console.log(Error().stack);
        console.log("VM assert failure - attempting to open DevTools/JavaScript debugger");
        alert("VM assert failure - While this alert is still on, open Dev Tools (Shift-Ctrl-I) to switch to debug mode - the application will then pause in the debugger as soon as you hit ok");
        yield "DEBUGGER";
        debugger;
    }
};

smalltalkVM.smalltalkDebug = function* runtimeSmalltalkDebug() {
    const t = performance.now();
    GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
    debugger;
    if (performance.now() - t < 30) {
        //we did not pause in the debugger, it means we are in runtime mode
        if (confirm("Squeak debugger request\n\nTo resume, just hit OK\nTo debug, open Dev Tools (Shift-Ctrl-I) prior to hitting OK\nOtherwise, hit Cancel to abandon the current process")) {
            yield "DEBUGGER";
            debugger;
        } else {
            yield* (yield* SmalltalkGlobals._Project._current())._spawnNewProcessIfThisIsUI_(SmalltalkVM.activeProcess);
            console.log("abandoning active process");
            throw "TERMINATE";
        }
    }
};


console.log("initializing class Delay");
const delayClassPool = SmalltalkGlobals._Delay.pointers[7];
delayClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("SuspendedDelays"), new SmalltalkGlobals._Array(0)).next();
delayClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("ScheduledDelay"), nil).next();
delayClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("FinishedDelay"), nil).next();
delayClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("ActiveDelay"), nil).next();
const timingSemaphore = SmalltalkGlobals._Semaphore._new().next().value;
timingSemaphore.name = 'TimingSemaphore';
timingSemaphore.stack = '';
delayClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("TimingSemaphore"), timingSemaphore).next();
SmalltalkGlobals._Delay._initialize().next();
delayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("AccessProtect")).next().value.name = '_Delay.AccessProtect';
delayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("AccessProtect")).next().value.stack = '';
delayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("TimerEventLoop")).next().value.name = 'TimerEventLoop';
delayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("TimerEventLoop")).next().value.stack = '';

console.log("running Delay class>>startUp:");
SmalltalkGlobals._Delay._startUp_(true).next();
SmalltalkGlobals._Smalltalk[1]._removeFromStartUpList_(SmalltalkGlobals._Delay).next();

console.log("running ProcessorScheduler class>>startUp:");
SmalltalkGlobals._ProcessorScheduler._startUp_(true).next();
const processorSchedulerClassPool = SmalltalkGlobals._ProcessorScheduler.pointers[7];
processorSchedulerClassPool._at_(SmalltalkGlobals._ByteSymbol.from("BackgroundProcess")).next().value.name = 'BackgroundIdleProcess';
processorSchedulerClassPool._at_(SmalltalkGlobals._ByteSymbol.from("BackgroundProcess")).next().value.stack = '';
SmalltalkGlobals._Smalltalk[1]._removeFromStartUpList_(SmalltalkGlobals._ProcessorScheduler).next();

globalThis.GlobalActivationCounter = globalCheckForInterruptsThreshold;
smalltalkVM.finalizationRegistry.register(new Object());

console.log("finished SmalltalkVM initialization");
