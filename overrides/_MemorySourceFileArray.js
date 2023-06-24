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

Object.override(SmalltalkGlobals._MemorySourceFileArray.prototype, {

    _initialize: function *_initialize() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("MemorySourceFileArray>>initialize, checking interrupts:", false, false);

        const instvars = this.pointers;
        instvars[0]/* files */ = yield* SmalltalkGlobals._Array._new_( 2);
        yield* instvars[0]/* files */._at_put_( 1,  nil);
        if (SmalltalkGlobals._MemorySourceFileArray.savedChangesStream !== undefined)
            instvars[0].pointers[1] = SmalltalkGlobals._MemorySourceFileArray.savedChangesStream;
        else {
            SmalltalkGlobals._MemorySourceFileArray.savedChangesStream = instvars[0].pointers[1] = yield* SmalltalkGlobals._ReadWriteStream._on_( yield* SmalltalkGlobals._WideString._new_( 2000));
        }
        return this;
    },
});
