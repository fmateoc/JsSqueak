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

Object.override(SmalltalkGlobals._UnhandledError.prototype, {

    *_defaultAction() {
        /*The current computation is terminated. The cause of the error should be logged or reported to the user. If the program is operating in an interactive debugging environment the computation should be suspended and the debugger activated.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("UnhandledError>>defaultAction", false, false);

        const error = this.pointers[5];
        yield* SmalltalkVM.smalltalkDebug();
        yield* (yield* SmalltalkGlobals._Project._current())._spawnNewProcessIfThisIsUI_(SmalltalkVM.activeProcess);
        console.log("terminating active process because of unhandled error");
        throw "TERMINATE";
    }
})