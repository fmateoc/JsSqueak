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

Object.override(SmalltalkGlobals._Encoder.prototype, {

    _undeclared_: function *_undeclared_(_name) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Encoder>>undeclared:, checking interrupts:", false, false);

        const instvars = this.pointers;
        if (instvars[5]/* requestor */ !== nil && (yield* instvars[5]/* requestor */._interactive()).booleanValueOf("ifTrue:ifFalse:")) {
            if (((yield* instvars[5]/* requestor */._requestor())._eqEq( SmalltalkGlobals._ByteSymbol.from('error:')))) {
                yield* instvars[5]/* requestor */._error_( SmalltalkGlobals._ByteString.from('Undeclared'));
            }
            return yield* this._notify_( SmalltalkGlobals._ByteString.from('Undeclared'));
        } else {
            const _sym = yield* _name._asSymbol();
            let _association;
            const undeclaredNotificationClass = SmalltalkGlobals._UndeclaredVariableNotification || SmalltalkGlobals._UndeclaredVariableWarning;
            if ((yield* (yield* (yield* undeclaredNotificationClass._new())._name_selector_class_(
                _name,
                instvars[7]/* selector */,
                yield* instvars[16]/* cue */._getClass())
            )._signal()).booleanValueOf("ifTrue:ifFalse:")) {
                const _undeclared = yield* (yield* instvars[16]/* cue */._environment())._undeclared();
                yield* (function* zzzBlock1() {
                    const _index = yield* _undeclared._scanFor_( _sym);
                    _association = yield* _undeclared.pointers[1]/* array */._at_( _index);
                    if (_association === nil || _association === _undeclared.pointers[2]/* vacuum */) {
                        _association = yield* _undeclared._atNewIndex_put_( _index,  yield* SmalltalkGlobals._Association._key_( _sym));
                        if (_undeclared === SmalltalkGlobals._Smalltalk[1].pointers[0].pointers[3]) {
                            SmalltalkGlobals['_' + _sym.valueOf()] = _association.pointers;
                        }
                    }
                })._on_do_(
                    SmalltalkGlobals._AttemptToWriteReadOnlyGlobal,
                    function* zzzBlock2(_noti) {
                        return yield* _noti._resume_( true);
                    });
            } else {
                _association = yield* SmalltalkGlobals._Association._key_( _sym);
            }
            return yield* this._global_name_( _association,  _sym);
                /*Allow knowlegeable clients to squash the undeclared warning if they want (e.g.
	 Diffing pretty printers that are simply formatting text).  As this breaks
	 compilation it should only be used by clients that want to discard the result
	 of the compilation.  To squash the warning use e.g.
		[Compiler format: code in: class notifying: nil decorated: false]
			on: UndeclaredVariableWarning
			do: [:ex| ex resume: false]*/;
        }
    },

})