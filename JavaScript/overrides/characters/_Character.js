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

Object.override(SmalltalkGlobals._Character.constructor.prototype, {

    *_value_(_anInteger) {
        /*Answer the Character whose value is anInteger.*/
        const argVal = typeof _anInteger === "object" ? _anInteger.valueOf() : _anInteger;
        if((argVal >>> 0) === argVal && argVal < 0x40000000 && (argVal & 0x3FFFFF) < 0x110000) {
            return argVal < 0x110000 ? String.fromCodePoint(argVal) : this.from([argVal]);
        }
        return yield* this._primitiveFailed_(SmalltalkGlobals._ByteSymbol.from(`value:`));
    },

});

Object.override(SmalltalkGlobals._Character.prototype, {

    _eqEq(arg) {
        return arg instanceof SmalltalkGlobals._Character && this.pointers[0] === arg.pointers[0]
    },

    _notEqEq(arg) {
        return !(arg instanceof SmalltalkGlobals._Character) || this.pointers[0] !== arg.pointers[0]
    },

    *_identityHash() {
        return this.pointers[0]
    },

    valueOf() {
        const val = this.pointers[0];
        if(val < 0x40000000 && (val & 0x3FFFFF) < 0x110000) {
            return String.fromCodePoint(val & 0x10FFFF);
        } else
            throw "Should not happen"
    }
});