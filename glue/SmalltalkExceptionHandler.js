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

globalThis.SmalltalkExceptionHandler = class SmalltalkExceptionHandler {

    exceptionClass;
    block;
    process;
    exitId;
    retryId;

    constructor(cls, b) {
        this.exceptionClass = cls;
        this.block = b;
        this.process = SmalltalkVM.activeProcess;
    }

    exitWith(value) {
        throw (this.exitId = Object.create(NonLocalReturn)).setPayload(value);
    }

    restart(alternativeBlock) {
        throw (this.retryId = Object.create(NonLocalReturn)).setPayload(alternativeBlock);
    }

    install() {
        this.process.exceptionHandlers.unshift(this);
    }

    uninstall() {
        const topHandler = this.process.exceptionHandlers.shift();
        if (topHandler !== this)
            throw "Should not happen!";
        this.process = null;
        this.block = null;
        this.exitId = null;
        this.retryId = null;
    }

    canHandle(ex) {
        return this.exceptionClass instanceof SmalltalkGlobals._Class && ex instanceof this.exceptionClass ||
            this.exceptionClass instanceof SmalltalkGlobals._ExceptionSet && this.exceptionClass.pointers[0].pointers[0].pointers.some(arrVal => (arrVal !== nil && ex instanceof arrVal));
    }

    *handle(ex) {
        const p = this.process,
            previous = ex.currentHandler,
            previousHandlers = p.exceptionHandlers;
        ex.currentHandler = this;
        p.exceptionHandlers = previousHandlers.slice(previousHandlers.indexOf(this) + 1);
        ex.resumeException = undefined; //do not trigger dnuProxy when checking for resumeException
        try {
            const value = this.block.length === 1 ? yield* this.block._value_(ex) : yield* this.block._value();
            this.exitWith(value);
        } finally {
            ex.currentHandler = previous;
            p.exceptionHandlers = previousHandlers;
        }
    }

}
