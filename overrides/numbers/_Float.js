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

Object.override(SmalltalkGlobals._Float.constructor.prototype, {

    _adoptInstance_: function *_adoptInstance_(_anObject) {
        yield* SmalltalkGlobals._Behavior.prototype._adoptInstance_.call(this, _anObject);
        _anObject.dirty = true;
        return this;
    },

    *_one() {
        return Float.ONE
    },

    *_zero() {
        return Float.ZERO
    },

})