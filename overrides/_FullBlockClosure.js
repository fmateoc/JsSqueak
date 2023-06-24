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

Object.override(SmalltalkGlobals._FullBlockClosure.prototype, {

    _numArgs_: function *_numArgs_(_n) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FullBlockClosure>>numArgs:, checking interrupts:", false, false);

        if (this.pointers === undefined)
            yield* SmalltalkVM.debug();
        this.pointers[2] = _n;
        return this;
    },

    _outerContext_: function *_outerContext_(_ctxt) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FullBlockClosure>>outerContext:, checking interrupts:", false, false);

        if (this.pointers === undefined)
            yield* SmalltalkVM.debug();
        this.pointers[0] = _ctxt;
        return this;
    },

    _receiver_: function *_receiver_(_anObject) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FullBlockClosure>>receiver:, checking interrupts:", false, false);

        if (this.pointers === undefined)
            yield* SmalltalkVM.debug();
        this.pointers[3] = _anObject;
        return this;
    },

    _receiver_outerContext_method_copiedValues_: function *_receiver_outerContext_method_copiedValues_(_aReceiver, _aContextOrNil, _aCompiledBlock, _anArrayOrNil) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FullBlockClosure>>receiver:outerContext:method:copiedValues:, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars === undefined)
            yield* SmalltalkVM.debug();
        instvars[3]/* receiver */ = _aReceiver;
        instvars[0]/* outerContext */ = _aContextOrNil;
        instvars[1]/* startpcOrMethod */ = _aCompiledBlock;
        instvars[2]/* numArgs */ = yield* _aCompiledBlock._numArgs();
        const _iLimiT1 = yield* this._numCopiedValues();
        for (let _i = 1; _i <= _iLimiT1; _i ++) {
            yield* this._at_put_( _i,  yield* _anArrayOrNil._at_( _i));
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FullBlockClosure>>receiver:outerContext:method:copiedValues:, checking interrupts:", false, true);
        }
        return this;
    },

});