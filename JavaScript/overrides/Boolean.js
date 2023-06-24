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

Object.override(SmalltalkGlobals._False, {

    *_allInstances() {
        return SmalltalkGlobals._Array.from([false]);
    },

    *_allInstancesDo_(_aBlock) {
        yield* _aBlock._value_(false);
        return this;
    },

    *_someInstance() {
        return false;
    },
});

Object.override(SmalltalkGlobals._True, {

    *_allInstances() {
        return SmalltalkGlobals._Array.from([true]);
    },

    *_allInstancesDo_(_aBlock) {
        yield* _aBlock._value_(true);
        return this;
    },

    *_someInstance() {
        return true;
    },
});

Object.override(Boolean.prototype, {

    *_identityHash() {
        return this + 2;
    },

    *_nextInstance() {
        return nil;
    },

    *_not() {
        return !this.valueOf();
    },

})