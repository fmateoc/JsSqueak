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

Object.override(SmalltalkGlobals._RunArray.prototype, {

    _at_: function *_at_(_index) {
        return yield* this._at_setRunOffsetAndValue_(
            _index,
            function* zzzBlock1(_run, _offset, _value) {
                return _value; ;
            });
    },

    _at_setRunOffsetAndValue_: function *_at_setRunOffsetAndValue_(_index, _aBlock) {
        /*Supply all run information to aBlock.*/
        /*Tolerates index=0 and index=size+1 for copyReplace: */
        let _run = nil, _offset = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("RunArray>>at:setRunOffsetAndValue:, checking interrupts:", false, false);

        const instvars = this.pointers;
        const runs = instvars[0].pointers;
        const _limit = runs.length;
        if (instvars[2]/* lastIndex */ === nil || _index < instvars[2]/* lastIndex */) {
            /*cache not loaded, or beyond index - start over*/
            _run = 0;
            _offset = _index - 1;
        } else {
            /*cache loaded and before index - start at cache*/
            _run = instvars[3]/* lastRun */ - 1;
            _offset = instvars[4]/* lastOffset */ + _index - instvars[2]/* lastIndex */;
        }
        let newOffset;
        while (_run < _limit && (newOffset = _offset - runs[_run]) >= 0) {
            _offset = newOffset;
            _run++;
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("RunArray>>at:setRunOffsetAndValue:, checking interrupts:", false, true);
        }
        instvars[2]/* lastIndex */ = _index;
        /*Load cache for next access*/
        instvars[3]/* lastRun */ = _run + 1;
        instvars[4]/* lastOffset */ = _offset;
        if (_run >= _limit) {
            /*adjustment for size+1*/
            _run--;
            _offset += runs[_run];
        }
        return yield* _aBlock._value_value_value_(
            _run + 1,
            _offset,
            instvars[1]/* values */.pointers[_run])/*an index into runs and values*/
            /*zero-based offset from beginning of this run*/
            /*value for this run*/;
    },

    _runLengthAt_: function *_runLengthAt_(_index) {
        /*Answer the length remaining in run beginning at index.*/
        const instvars = this.pointers;
        return yield* this._at_setRunOffsetAndValue_(
            _index,
            function* zzzBlock1(_run, _offset, _value) {
                return instvars[0].pointers[_run - 1] - _offset;
            });
    },

})