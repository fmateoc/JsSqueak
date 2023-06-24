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

Object.override(SmalltalkGlobals._ClassBuilder.prototype, {

    _update_to_: function *_update_to_(_oldClass, _newClass) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("ClassBuilder>>update:to:, checking interrupts:", false, false);

        yield* ((function* zzzBlock1() {
            const _meta = yield* _oldClass._isMeta();
            /*Note: The following removal may look somewhat obscure and needs an explanation.
              When we mutate the class hierarchy we create new classes for any existing subclass.
              So it may look as if we don't have to remove the old class from its superclass. However,
              at the top of the hierarchy (the first class we reshape) that superclass itself is not newly
              created so therefore it will hold both the oldClass and newClass in its (obsolete or not)
              subclasses. Since the #become: below will transparently replace the pointers to oldClass
              with newClass the superclass would have newClass in its subclasses TWICE. With rather
              unclear effects if we consider that we may convert the meta-class hierarchy itself (which
              is derived from the non-meta class hierarchy).
              Due to this problem ALL classes are removed from their superclass just prior to converting
              them. Here, breaking the superclass//subclass invariant really doesn't matter since we will
              effectively remove the oldClass (becomeForward:) just a few lines below.*/

            /*JavaScript note: since our become does not switch pointers, but modifies existing objects in-place,
                our "real" object is the old class, and we have to discard/avoid creating any references to the new class instead,
                so we remove newClass from the subclasses.
                We also keep the existing hidden class pointers in the oldClass instances
             */
            yield* (yield* _oldClass._superclass())._removeSubclass_( _newClass);
            yield* (yield* _oldClass._superclass())._removeObsoleteSubclass_( _newClass);
            /*Convert the instances of oldClass into instances of newClass*/
            const _oldInstances = yield* (yield* _oldClass._allInstances())._asArray();
            if ((yield* _oldInstances._notEmpty()).booleanValueOf("ifTrue:")) {
                if (_meta.booleanValueOf("ifTrue:")) {
                    if (!((yield* (yield* _oldInstances._size())._eq( 1)).booleanValueOf("and:") && ((yield* _newClass._soleInstance())._class()._eqEq( _newClass) || (yield* _newClass._soleInstance())._class()._eqEq( _oldClass))).booleanValueOf("ifFalse:")) {
                        yield* _oldClass._error_( zzzBlock1.literals[7]/* 'Metaclasses can only have one instance' */);
                    }
                }
                let _map = yield* _newClass._instVarMappingFrom_( _oldClass);
                let _variable = yield* _newClass._isVariable();
                let _instSize = yield* _newClass._instSize();
                let _newInstances = yield* SmalltalkGlobals._Array._new_( yield* _oldInstances._size());
                const _iLimiT1 = yield* _oldInstances._size();
                for (let _i = 1; _i <= _iLimiT1; _i++) {
                    yield* _newInstances._at_put_(
                        _i,
                        yield* _newClass._newInstanceFrom_variable_size_map_(
                            yield* _oldInstances._at_( _i),
                            _variable,
                            _instSize,
                            _map));
                }
                /*Now perform a bulk mutation of old instances into new ones*/
                try {
                    const pointers = _oldInstances.pointers, argpointers = _newInstances.pointers;
                    if (pointers.length === argpointers.length && pointers.every(x => canBecome(x))) {
                        pointers.forEach((x, i) => becomeForward(x, argpointers[i], true, true));
                    }
                } catch (catchVar) {
                    yield* SmalltalkVM.debug();
                    if (!catchVar.isPrimitiveFailed)
                        throw catchVar;
                }
            }
            try {
                if (canBecome(_oldClass)) {
                    becomeForward(_oldClass, _newClass, true, true);
                }
            } catch (catchVar) {
                yield* SmalltalkVM.debug();
                if (!catchVar.isPrimitiveFailed)
                    throw catchVar;
            }
            if (_meta.booleanValueOf("ifTrue:ifFalse:")) {
                yield* _oldClass._updateMethodBindingsTo_( yield* _oldClass._binding());
            } else {
                yield* _oldClass._updateMethodBindingsTo_( yield* _oldClass._binding());
                try {
                    if (canBecome(_oldClass._class())) {
                        becomeForward(_oldClass._class(), _newClass._class(), true, true);
                    }
                } catch (catchVar) {
                    yield* SmalltalkVM.debug();
                    if (!catchVar.isPrimitiveFailed)
                        throw catchVar;
                }
                yield* _oldClass._class()._updateMethodBindingsTo_( yield* _oldClass._class()._binding());
            }
        }).setFull(this, 4, _update_to_, 3))._valueUnpreemptively();
        return this;
    }
})