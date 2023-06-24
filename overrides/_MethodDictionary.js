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

Object.override(SmalltalkGlobals._MethodDictionary.prototype, {

    _grow: function *_grow() {
        let _newSelf = nil, _key = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("MethodDictionary>>grow, checking interrupts:", false, false);

        const instvars = this.pointers;
        _newSelf = yield* (yield* this._species())._newForCapacity_( yield* (yield* this._basicSize())._mul( 2));
        const _iLimiT1 = yield* this._basicSize();
        for (let _i = 1; _i <= _iLimiT1; _i ++) {
            if (!((_key = yield* this._basicAt_( _i))._eqEq( nil)).booleanValueOf("ifFalse:")) {
                yield* _newSelf._at_put_( _key,  yield* instvars[1]._at_( _i));
            }
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("MethodDictionary>>grow, checking interrupts:", false, true);
        }
        this.pointers = _newSelf.pointers;
        return this;
    },

});