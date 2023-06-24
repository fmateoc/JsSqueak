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

function messageFrom(prop, args) {
    const message = new SmalltalkGlobals._Message();
    message.pointers[0] = SmalltalkUtils.reverseMappingForSelector(prop);
    message.pointers[1] = SmalltalkGlobals._Array.from(args);
    return message;
}
const DNU = function *DNU (prop, ...args) {
    return yield* this._doesNotUnderstand_(messageFrom(prop, args));
}
const CI = function *CI (prop, ...args) {
    return yield* this._cannotInterpret_(messageFrom(prop, args));
}
const functionOnlyHandler = new Proxy(Function.prototype, {
    get(target, prop, receiver) {
        switch (prop) {
            case 'bind':
            case 'apply':
            case 'call':
            case 'toString':
                return Reflect.get(target, prop, receiver);
            case 'compiledMethod':
                return undefined;
        }
        debugger;
        throw new TypeError("Cannot read property '" + prop + "' of undefined");
    }, set(target, prop, value, receiver) {
        throw new TypeError("Cannot set property '" + prop + "' of undefined");
    }});
Object.setPrototypeOf(DNU, functionOnlyHandler);
Object.setPrototypeOf(CI, functionOnlyHandler);

const missed = new Map();
const dnuHandler = {
    get(target, prop, receiver) {
        if (typeof prop === 'string' && prop.startsWith('_')) {
            const objectReceiver = Object(receiver);
            if ('_doesNotUnderstand_' in objectReceiver) {
                return DNU.bind(objectReceiver, prop);
            }
            if ('_cannotInterpret_' in objectReceiver) {
                return CI.bind(objectReceiver, prop);
            }
            throw new Error("Neither a #doesNotUnderstand: nor a #cannotInterpret: implementation has been found in the hierarchy of " + objectReceiver.constructor.name + " while looking for nonexistent method " + prop);
        } else {
//            missed.set(prop, (missed.get(prop) || 0) + 1);
            return undefined;
        }
    }
}
const actualDnuProxy = new Proxy(Object.create(null), dnuHandler);
//don't let all nonexistent property lookups reach the actual DNU proxy, some are exceptions
const dnuProxy = Object.create(actualDnuProxy);
//these (Smalltalk-equivalent) methods are optimized/not looked-up in the hierarchy (as if they existed everywhere)
dnuProxy._class = function _class() {return this.constructor}
dnuProxy._eqEq = function _eqEq(arg) {return this === arg}
dnuProxy._notEqEq = function _notEqEq(arg) {return this !== arg}
//and these methods are basic JavaScript methods that are expected to be implemented by everybody
for (const prop of Object.getOwnPropertyNames(Object.prototype))
    Object.defineProperty(dnuProxy, prop, Object.getOwnPropertyDescriptor(Object.prototype, prop))
//this is to support mustBeBoolean/DNU for non-boolean receivers of (optimized) boolean messages
dnuProxy.booleanValueOf = function booleanValueOf(selector) {return this[SmalltalkUtils.mappingForSelector(selector)]()}
//this is to avoid triggering the proxy handler when JavaScript performs automatic conversions
dnuProxy[Symbol.match] = undefined;
dnuProxy[Symbol.matchAll] = undefined;
dnuProxy[Symbol.replace] = undefined;
dnuProxy[Symbol.search] = undefined;
dnuProxy[Symbol.split] = undefined;
dnuProxy[Symbol.toPrimitive] = undefined;
dnuProxy[Symbol.toStringTag] = undefined;
//and this is to avoid triggering the proxy handler when we check for storage (not everyone will have these defined, but when we check whether or not they are defined, it should not hit the proxy)
dnuProxy.longs = undefined;
dnuProxy.words = undefined;
dnuProxy.shorts = undefined;
dnuProxy.bytes = undefined;
dnuProxy.pointers = undefined;
dnuProxy.string = undefined;
dnuProxy.literals = undefined;
dnuProxy.hash = undefined;
dnuProxy.pinned = undefined;

dnuProxy.primitive_60_impl = function primitive_60_impl() {return [false]}
dnuProxy.primitive_61_impl = function primitive_61_impl() {return [false]}
dnuProxy.primitive_62_impl = function primitive_62_impl() {return [false]}
dnuProxy.primitive_73_impl = function primitive_73_impl() {return [false]}
dnuProxy.primitive_74_impl = function primitive_74_impl() {return [false]}
dnuProxy.primitive_105_impl = function primitive_105_impl() {return [false]}
dnuProxy.primitive_132_impl = function primitive_132_impl() {return [false]}
dnuProxy.primitive_145_impl = function primitive_145_impl() {return [false]}
dnuProxy.primitive_148_impl = function primitive_148_impl() {return [false]}
dnuProxy.primitive_173_impl = function primitive_173_impl() {return [false]}
dnuProxy.primitive_174_impl = function primitive_174_impl() {return [false]}

globalThis.dnuProxy = dnuProxy;

const mappedPrimitiveWrappers = [BigInt, Boolean, Function, Number, String];
for (const wrapper of mappedPrimitiveWrappers) {
    Object.setPrototypeOf(wrapper.prototype, dnuProxy);
}
Boolean.prototype.booleanValueOf = Boolean.prototype.valueOf;

//and this is to avoid triggering the proxy handler when we check for function attributes (not everyone will have these defined, but when we check whether or not they are defined, it should not hit the proxy)
Function.prototype.compiledMethod = undefined;

//this is also to avoid triggering the proxy handler when JavaScript performs automatic checks
Function.prototype.prepareStackTrace = undefined;
