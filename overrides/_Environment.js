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

const original_binding_addedTo_ = SmalltalkGlobals._Environment.prototype._binding_addedTo_;
const original_binding_removedFrom_ = SmalltalkGlobals._Environment.prototype._binding_removedFrom_;

Object.override(SmalltalkGlobals._Environment.prototype, {

    _binding_addedTo_: function *_binding_addedTo_(_aBinding, _anEnvironment) {
        if (_anEnvironment === SmalltalkGlobals._Smalltalk[1].pointers[0]) {
            if (_aBinding instanceof SmalltalkGlobals._ClassBinding) {
                SmalltalkGlobals['_' + _aBinding.pointers[0].valueOf()] = _aBinding.pointers[1];
                _aBinding.pointers[1][2] = _aBinding;
            } else if (_aBinding instanceof SmalltalkGlobals._Global)
                SmalltalkGlobals['_' + _aBinding.pointers[0].valueOf()] = _aBinding.pointers;
            else
                yield* SmalltalkVM.debug();
        }
        return yield* original_binding_addedTo_.call(this, _aBinding, _anEnvironment);
    },

    _binding_removedFrom_: function *_binding_removedFrom_(_aBinding, _anEnvironment) {
        if (_anEnvironment === SmalltalkGlobals._Smalltalk[1].pointers[0]) {
            if (_aBinding instanceof SmalltalkGlobals._ClassBinding) {
                delete SmalltalkGlobals['_' + _aBinding.pointers[0].valueOf()];
                delete _aBinding.pointers[1][2];
            } else if (_aBinding instanceof SmalltalkGlobals._Global)
                delete SmalltalkGlobals['_' + _aBinding.pointers[0].valueOf()];
            else
                yield* SmalltalkVM.debug();
        }
        return yield* original_binding_removedFrom_.call(this, _aBinding, _anEnvironment);
    },

});

SmalltalkGlobals._Environment.prototype._binding_addedTo_.compiledMethod = original_binding_addedTo_.compiledMethod;
SmalltalkGlobals._Environment.prototype._binding_removedFrom_.compiledMethod = original_binding_removedFrom_.compiledMethod;


Object.override(SmalltalkGlobals._Dictionary.prototype, {

    _declare_from_: function *_declare_from_(_key, _aDictionary) {
        /*Add key to the receiver. If key already exists, do nothing. If aDictionary
        includes key, then remove it from aDictionary and use its association as
        the element of the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Dictionary>>declare:from:, checking interrupts:", false, false);

        if (!(yield* this._includesKey_( _key)).booleanValueOf("ifFalse:")) {
            let assoc;
            if ((yield* _aDictionary._includesKey_( _key)).booleanValueOf("ifTrue:ifFalse:")) {
                assoc = yield* this._add_( yield* _aDictionary._associationAt_( _key));
                yield* _aDictionary._removeKey_( _key);
                if (_aDictionary === SmalltalkGlobals._Smalltalk[1].pointers[0].pointers[3]) {
                    delete SmalltalkGlobals['_' + _key.valueOf()];
                }
            } else {
                assoc = yield* this._add_( yield* _key._assoc( nil));
            }
            if (this === SmalltalkGlobals._Smalltalk[1].pointers[0].pointers[3]) {
                SmalltalkGlobals['_' + _key.valueOf()] = assoc.pointers;
            }
        }
        return this;
    },

})