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

Object.override(SmalltalkGlobals._Generator.prototype, {

    _atEnd: function *_atEnd() {
        /*Answer whether the receiver can access any more objects.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Generator>>atEnd, checking interrupts:", false, false);

        return this.pointers[2] === nil;
    },

    _close: function *_close() {
        /*Close the receiving generator and unwind its ensure-blocks.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Generator>>close, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars[2] !== nil) {
            const currentActivationCounter = GlobalActivationCounter;
            GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
            try {
                instvars[2].return();
            } finally {
                GlobalActivationCounter = Math.max(currentActivationCounter - Number.MAX_SAFE_INTEGER + GlobalActivationCounter, 0);
            }
            instvars[2]/* continue */ = instvars[0]/* block */ = instvars[1]/* next */ = nil;
        }
        return this;
    },

    _next: function *_next() {
        /*Generate and answer the next object in the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Generator>>next, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars[2] === nil) {
            return nil;
        }
        const value = instvars[1];
        const currentActivationCounter = GlobalActivationCounter;
        GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
        try {
            const yielded = instvars[2].next();
            if (yielded.done) {
                instvars[1]/* next */ = nil;
                instvars[2]/* continue */ = nil;
            } else {
                instvars[1]/* next */ = yielded.value;
            }
        } finally {
            GlobalActivationCounter = Math.max(currentActivationCounter - Number.MAX_SAFE_INTEGER + GlobalActivationCounter, 0);
        }
        return value;
    },

    _nextPut_: function *_nextPut_(_anObject) {
        /*Add anObject into the generator. A synonym to #yield: and value:.*/
        let _previous = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Generator>>nextPut:, checking interrupts:", false, false);

        yield _anObject
    },

    _reset: function *_reset() {
        /*Reset the generator, i.e., start it over*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Generator>>reset, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars[2] !== nil) {
            const currentActivationCounter = GlobalActivationCounter;
            GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
            try {
                instvars[2].return();
            } finally {
                GlobalActivationCounter = Math.max(currentActivationCounter - Number.MAX_SAFE_INTEGER + GlobalActivationCounter, 0);
            }
            instvars[1]/* next */ = nil;
        }
        instvars[2]/* continue */ = instvars[0]/* block */._value_( this);
        const currentActivationCounter = GlobalActivationCounter;
        GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
        try {
            const yielded = instvars[2].next();
            if (yielded.done) {
                instvars[1]/* next */ = nil;
                instvars[2]/* continue */ = nil;
            } else {
                instvars[1]/* next */ = yielded.value;
            }
        } finally {
            GlobalActivationCounter = Math.max(currentActivationCounter - Number.MAX_SAFE_INTEGER + GlobalActivationCounter, 0);
        }
        return this;
    },

});

