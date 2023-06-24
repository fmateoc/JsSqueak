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

//Behavior is overriden here because the allInstances primitive does not exist in 4.5
Object.override(SmalltalkGlobals._Behavior.prototype, {

    _allInstances: function *_allInstances() {
        /*Answer a collection of all current instances of the receiver.*/

        const all = AllInstances.get(this);
        if (all) {
            const result = [];
            for (const ref of all) {
                const e = ref.deref();
                if (e !== undefined && e._class()._eqEq(this))
                    result.push(e);
            }
            return SmalltalkGlobals._Array.from(result);
        }
        yield* SmalltalkVM.debug();
        return SmalltalkGlobals._Array.Empty;
    },

    _allInstancesDo_: function *_allInstancesDo_(_aBlock) {
        /*Evaluate the argument, aBlock, for each of the current instances of the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>allInstancesDo:, checking interrupts:", false, false);

        const all = AllInstances.get(this);
        if (all) {
            for (const ref of all) {
                const e = ref.deref();
                if (e !== undefined && e._class()._eqEq(this))
                    yield* _aBlock._value_(e);
                if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>allInstancesDo:, checking interrupts:", false, true);
            }
            return this;
        }
        yield* SmalltalkVM.debug();
        return this;
    },

    _allInstancesOrNil: function *_allInstancesOrNil() {
        /*Answer all instances of the receiver, or nil if the primitive
         fails, which it may be due to being out of memory.*/

        const all = AllInstances.get(this);
        if (all) {
            const result = [];
            for (const ref of all) {
                const e = ref.deref();
                if (e !== undefined && e._class()._eqEq(this))
                    result.push(e);
            }
            return SmalltalkGlobals._Array.from(result);
        }
        yield* SmalltalkVM.debug();
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>allInstancesOrNil, checking interrupts:", false, false);

        return nil;
    },

    *_nextInstance() {
        yield* SmalltalkVM.debug();
        return nil;
    },
});


Object.override(SmalltalkGlobals._Class.constructor.prototype, {

    *_nextInstance() {
        if (!this._class().pointers[5]._eqEq(this))
            yield* SmalltalkVM.debug();
        return nil;
    },
});


Object.override(SmalltalkGlobals._Metaclass.prototype, {

    *_allInstances() {
        if (this.pointers[5]._class()._eqEq(this))
            return SmalltalkGlobals._Array.from([this.pointers[5]]);
        yield* SmalltalkVM.debug();
    },

    *_allInstancesDo_(_aBlock) {
        if (this.pointers[5]._class()._eqEq(this))
            yield* _aBlock._value_(this.pointers[5]);
        else
            yield* SmalltalkVM.debug();
        return this;
    },

    *_someInstance() {
        if (this.pointers[5]._class()._eqEq(this))
            return this.pointers[5];
        yield* SmalltalkVM.debug();
        return nil;
    },
});


Object.override(SmalltalkGlobals._UndefinedObject, {

    *_allInstances() {
        return SmalltalkGlobals._Array.from([nil]);
    },

    *_allInstancesDo_(_aBlock) {
        yield* _aBlock._value_(nil);
        return this;
    },

    *_someInstance() {
        return nil;
    },
});

Object.override(SmalltalkGlobals._UndefinedObject.prototype, {

    *_nextInstance() {
        return nil;
    },

});
