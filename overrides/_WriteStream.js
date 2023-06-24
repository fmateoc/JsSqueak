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

Object.override(SmalltalkGlobals._WriteStream.prototype, {

    _nextPutAll_: function *_nextPutAll_(_aCollection) {
        let _newEnd = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("WriteStream>>nextPutAll:, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars[0]/* collection */._class()._eqEq( _aCollection._class()) ||
            instvars[0]/* collection */ instanceof SmalltalkGlobals._String && !(instvars[0]/* collection */ instanceof SmalltalkGlobals._Symbol) && _aCollection instanceof SmalltalkGlobals._String) {
            _newEnd = yield* instvars[1]/* position */._add( yield* _aCollection._size());
            if ((yield* _newEnd._gt( instvars[3]/* writeLimit */)).booleanValueOf("ifTrue:")) {
                yield* this._growTo_( yield* _newEnd._add( 10));
            }
            yield* instvars[0]/* collection */._replaceFrom_to_with_startingAt_(
                yield* instvars[1]/* position */._add( 1),
                _newEnd,
                _aCollection,
                1);
            instvars[1]/* position */ = _newEnd;
            return _aCollection;
        } else {
            return yield* SmalltalkGlobals._PositionableStream.prototype._nextPutAll_.call(this,  _aCollection);
        }
    },

})