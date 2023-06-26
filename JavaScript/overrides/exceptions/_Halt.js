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

Object.override(SmalltalkGlobals._Halt.prototype, {

    *_defaultAction() {
        /*The current computation is terminated. The cause of the error should be logged or reported to the user. If the program is operating in an interactive debugging environment the computation should be suspended and the debugger activated.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("UnhandledError>>defaultAction", false, false);
            if (e) yield* e._signal()}

        const t = performance.now();
        GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
        debugger;
        if (performance.now() - t < 30) {
            //we did not pause in the debugger, it means we are in runtime mode
            if (confirm("Halt signalled\n\nTo resume, just hit OK\nTo debug, open Dev Tools (Shift-Ctrl-I) prior to hitting OK\nOtherwise, hit Cancel to abandon the current process")) {
                yield "DEBUGGER";
                debugger; //there should be a debugger statement in the halt methods in Object as well, right after the signal call (you can check in the debugger stack if that is the case),
                        // so you can hit run in the debugger to skip stepping until after the exception resumes, where step will return to the method raising the halt
                return nil;
            } else {
                yield* (yield* SmalltalkGlobals._Project._current())._spawnNewProcessIfThisIsUI_(SmalltalkVM.activeProcess);
                console.log("abandoning active process");
                throw "TERMINATE";
            }
        }
    }
})