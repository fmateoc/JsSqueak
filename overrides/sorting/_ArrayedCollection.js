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

Object.override(SmalltalkGlobals._ArrayedCollection.prototype, {

    *_sort_(_aSortBlock) {
        const size = yield* this._size();
        if (size > 1) {
            let func;
            if (_aSortBlock === nil)
                func = (a, b) => b._le(a).next().value - 0.5;
            else if (typeof _aSortBlock === 'function' && _aSortBlock.length === 2) {
                func = (a, b) => _aSortBlock(b, a).next().value - 0.5;
            }
            if (func && this.pointers) {
                //We have to avoid interrupt checks, since we cannot yield inside the non-generator native function sort
                GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
                try {
                    this.pointers.sort(func);
                } finally {
                    GlobalActivationCounter = 0;
                }
            } else {
                yield* this._mergeSortFrom_to_by_(
                    1,
                    size,
                    _aSortBlock);
            }
        }
        return this;
    },

})