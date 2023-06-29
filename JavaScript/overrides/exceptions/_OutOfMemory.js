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

//make this into a real error, we don't have a low space process
Object.override(SmalltalkGlobals._OutOfMemory.prototype, {

    _defaultAction: function *_defaultAction() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("OutOfMemory>>defaultAction, checking interrupts:", false, false);

        yield* SmalltalkGlobals._UnhandledError._signalForException_( this);
        return this;
    },

    _isResumable: function *_isResumable() {
        return false
    }
})