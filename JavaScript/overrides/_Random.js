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

Object.override(SmalltalkGlobals._Random.prototype, {

    _nextLargeInt_: function *_nextLargeInt_(_anInteger) {
        /*Answer a random integer value from the interval [1, anInteger]. This method works for arbitrarily large integers.*/
        let _byteCount = nil, _bigRandom = nil, _result = nil, _firstDigit = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Random>>nextLargeInt:, checking interrupts:", false, false);

        _byteCount = yield* (yield* _anInteger._digitLength())._add( 4);
        /*Extend the space with at least 32 bits for a fairer distribution.*/
        _bigRandom = yield* SmalltalkGlobals._LargePositiveInteger._new_( _byteCount);
        yield* this._nextBytes_into_startingAt_(
            _byteCount,
            _bigRandom,
            1);
        _bigRandom = yield* _bigRandom._normalize();
        /*Make sure that there are no leading zero bytes.*/
        _result = yield* (yield* _anInteger._mul( _bigRandom))._bitShift_( yield* (-8)._mul( _byteCount));
        return yield* _result._add( 1);
    },

});