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

Object.override(SmalltalkGlobals._ProgressInitiationException.prototype, {

    _sendNotificationsTo_: function *_sendNotificationsTo_(_aNewBlock) {
        const p = SmalltalkVM.activeProcess, instvars = this.pointers;
        let handlers, index;
        if (this.currentHandler !== nil && (index = (handlers = p.exceptionHandlers).indexOf(this.currentHandler)) >= 0) {
            p.exceptionHandlers = handlers.slice(index + 1);
            try {
                throw (this.resumeException = Object.create(NonLocalReturn)).setPayload(yield* instvars[5]/* workBlock */._value_(
                    (function* zzzBlock2(_barVal) {
                        return yield* _aNewBlock._value_value_value_(
                            instvars[7]/* minVal */,
                            instvars[6]/* maxVal */,
                            _barVal);
                    }).set(this, 1, _sendNotificationsTo_)));
            } finally {
                p.exceptionHandlers = handlers;
            }
        } else {
            throw (this.resumeException = Object.create(NonLocalReturn)).setPayload(yield* instvars[5]/* workBlock */._value_(
                (function* zzzBlock2(_barVal) {
                    return yield* _aNewBlock._value_value_value_(
                        instvars[7]/* minVal */,
                        instvars[6]/* maxVal */,
                        _barVal);
                }).set(this, 1, _sendNotificationsTo_)));
        }
        return this;
    }
});



