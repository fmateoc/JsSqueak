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

Object.override(SmalltalkGlobals._BlockClosure.prototype, {

    _outerContext_startpc_numArgs_copiedValues_: function *_outerContext_startpc_numArgs_copiedValues_(_aContext, _aStartpc, _argCount, _anArrayOrNil) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>outerContext:startpc:numArgs:copiedValues:, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars === undefined)
            yield* SmalltalkVM.debug();
        instvars[0]/* outerContext */ = _aContext;
        instvars[1] = _aStartpc;
        instvars[2] = _argCount;
        const _iLimiT1 = yield* this._numCopiedValues();
        for (let _i = 1; _i <= _iLimiT1; _i ++) {
            yield* this._at_put_( _i,  yield* _anArrayOrNil._at_( _i));
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>outerContext:startpc:numArgs:copiedValues:, checking interrupts:", false, true);
        }
        return this;
    },

});