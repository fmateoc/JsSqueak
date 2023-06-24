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

Object.override(SmalltalkGlobals._Process.prototype, {

    *_debug_title_full_(_context, _title, _bool) {
        /*Open debugger on self with context shown on top*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Process>>debug:title:full:", false, false);

        if (this === SmalltalkVM.activeProcess) {
            yield* SmalltalkVM.smalltalkDebug();    //should not happen
        } else {
            this.exception = "DEBUGGER";
            GlobalActivationCounter = 0;
        }
        return this;
    },

    *_debugWithTitle_full_contents_(_title, _bool, _contents) {
        /*Open debugger on self with context shown on top*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Process>>debug:title:full:", false, false);

        if (this === SmalltalkVM.activeProcess) {
            yield* SmalltalkVM.smalltalkDebug();    //should not happen
        } else {
            this.exception = "DEBUGGER";
            GlobalActivationCounter = 0;
        }
        return this;
    },

    *_isTerminated() {
        return this.generator === undefined;
    },

    *_signalException_(_anException) {
        /*Signal an exception in the receiver process...if the receiver is currently
        suspended, the exception will get signaled when the receiver is resumed.  If
        the receiver is blocked on a Semaphore, it will be immediately re-awakened
        and the exception will be signaled; if the exception is resumed, then the receiver
        will return to a blocked state unless the blocking Semaphore has excess signals*/
        /*If we are the active process, go ahead and signal the exception*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Process>>signalException:", false, false);

        if (this === SmalltalkVM.activeProcess) {
            return yield* _anException._signal();
        } else {
            if (this.pointers[1] === nil)
                return this;
            console.log("setting up exception to be thrown within another process with priority " + this.pointers[2] + ", defined" + this.stack);
            this.exception = _anException;
            if (this.pointers[3] instanceof SmalltalkGlobals._Semaphore) {
                //waiting on semaphores is usually time-sensitive, so switch right away
                const sema = this.pointers[3], pointers = sema.pointers;
                SmalltalkVM.removeFromList(pointers, this);
                this.pointers[3] = nil;
                const previouslyActive = SmalltalkVM.activeProcess;
                const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
                const processListPointers = processList.pointers;
                if(processListPointers[0] === nil)
                    processListPointers[0] = previouslyActive;
                else
                    processListPointers[1].pointers[0] = previouslyActive;
                processListPointers[1] = previouslyActive;
                previouslyActive.pointers[3] = processList;
                SmalltalkVM.activeProcess = this;
                yield "exception signalled within process waiting on semaphore, resuming"
                if (previouslyActive !== SmalltalkVM.activeProcess)
                    yield* SmalltalkVM.debug();
                const e = previouslyActive.exception;
                previouslyActive.exception = null;
                if (e === "DEBUGGER")
                    yield* SmalltalkVM.smalltalkDebug();
                else if (e === "TERMINATE")
                    throw "TERMINATE";
                else if (e) {
                    return yield* e._signal();
                }
            }
        }
        return this;
    },

    *_terminate() {
        /*Stop the process that the receiver represents forever.  Unwind to execute pending ensure://ifCurtailed: blocks before terminating.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Process>>terminate", false, false);

        const p = SmalltalkVM.activeProcess;
        if (this === p) {
            console.log("terminating active process");
            throw "TERMINATE";
        } else {
            const pointers = this.pointers;
            while (this.generator !== undefined) {
                console.log("terminating inactive process with priority " + this.pointers[2] + ", " + this.name + this.stack);
                //first make the receiver runnable at the current activePriority
                const oldList = pointers[3];
                if (oldList !== nil)
                    SmalltalkVM.removeFromList(oldList.pointers, this);
                pointers[2] = SmalltalkVM.activePriority;
                console.log("parking the active process " + (p.name + p.stack));
                const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
                const processListPointers = processList.pointers;
                if(processListPointers[0] === nil)
                    processListPointers[0] = p;
                else
                    processListPointers[1].pointers[0] = p;
                processListPointers[1] = p;
                p.pointers[3] = processList;
                SmalltalkVM.activeProcess = this;
                this.exception = "TERMINATE";
                yield "switching to the process to be terminated so we can execute the unwind blocks/exception handlers as the active process";
                if (p !== SmalltalkVM.activeProcess)
                    yield* SmalltalkVM.debug();
                if (this.generator !== undefined) {
                    console.log("termination did not succeed in one scheduler slice, some of the unwind blocks/exception handlers must have interfered, retrying");
                    this.exception = "TERMINATE";
                }
                const e = p.exception;
                p.exception = null;
                if (e === "DEBUGGER")
                    yield* SmalltalkVM.smalltalkDebug();
                else if (e === "TERMINATE")
                    throw "TERMINATE";
                else if (e) {
                    return yield* e._signal();
                }
            }
        }
        return this;
    },

    *_terminateAggressively() {
        /*Stop the process that the receiver represents forever.  Unwind to execute pending ensure://ifCurtailed: blocks before terminating.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Process>>terminateAggressively", false, false);

        const p = SmalltalkVM.activeProcess;
        if (this === p) {
            console.log("terminating active process");
            throw "TERMINATE";
        } else {
            const pointers = this.pointers;
            while (this.generator !== undefined) {
                console.log("terminating inactive process with priority " + this.pointers[2] + ", " + this.name + this.stack);
                //first make the receiver runnable at the current activePriority
                const oldList = pointers[3];
                if (oldList !== nil)
                    SmalltalkVM.removeFromList(oldList.pointers, this);
                pointers[2] = SmalltalkVM.activePriority;
                console.log("parking the active process " + (p.name + p.stack));
                const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
                const processListPointers = processList.pointers;
                if(processListPointers[0] === nil)
                    processListPointers[0] = p;
                else
                    processListPointers[1].pointers[0] = p;
                processListPointers[1] = p;
                p.pointers[3] = processList;
                SmalltalkVM.activeProcess = this;
                this.exception = "TERMINATE";
                yield "switching to the process to be terminated so we can execute the unwind blocks/exception handlers as the active process";
                if (p !== SmalltalkVM.activeProcess)
                    yield* SmalltalkVM.debug();
                if (this.generator !== undefined) {
                    console.log("termination did not succeed in one scheduler slice, some of the unwind blocks/exception handlers must have interfered, retrying");
                    this.exception = "TERMINATE";
                }
                const e = p.exception;
                p.exception = null;
                if (e === "DEBUGGER")
                    yield* SmalltalkVM.smalltalkDebug();
                else if (e === "TERMINATE")
                    throw "TERMINATE";
                else if (e) {
                    return yield* e._signal();
                }
            }
        }
        return this;
    }

});


Object.override(SmalltalkGlobals._Process.constructor.prototype, {

    *_forBlock_runUntil_(_aBlock, _aConditionBlock) {
        /*Create a process for the given block. Simulate code execution until the provided condition is fulfilled.*/

        //Ignore simulation

        return yield* _aBlock._newProcess();
    }
});
