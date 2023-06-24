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

Object.override(SmalltalkGlobals._Behavior.prototype, {

    _compiledMethodAt_ifAbsent_: function *_compiledMethodAt_ifAbsent_(_selector, _aBlock) {
        /*Answer the compiled method associated with the argument, selector (a Symbol), a message selector in the receiver's method dictionary. If the selector is not in the dictionary, return the value of aBlock*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>compiledMethodAt:ifAbsent:, checking interrupts:", false, false);

        if (this.prototype === undefined)
            yield* SmalltalkVM.debug();
        const jsSelector = SmalltalkUtils.mappingForSelector(_selector.valueOf());
        if (this.prototype.hasOwnProperty(jsSelector)) {
            const func = this.prototype[jsSelector];
            if (func === undefined)
                yield* SmalltalkVM.debug();
            const cm = func.compiledMethod;
            if (cm === undefined)
                yield* SmalltalkVM.debug();
            if (!(cm instanceof SmalltalkGlobals._CompiledMethod))
                //objects as methods
                return cm;
            if (cm.literals === undefined || cm.literals !== func.literals)
                yield* SmalltalkVM.debug();
            //this could be a descended method in JavaScript
            return cm.literals[cm.literals.length - 1].pointers[1] === this ? cm : (yield* _aBlock._value());
        }
        return yield* _aBlock._value();
    },

    _includesSelector_: function *_includesSelector_(_aSymbol) {
        /*Answer whether the message whose selector is the argument is in the
        method dictionary of the receiver's class.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>includesSelector:, checking interrupts:", false, false);

        if (this.prototype === undefined)
            yield* SmalltalkVM.debug();
        const jsSelector = SmalltalkUtils.mappingForSelector(_aSymbol.valueOf());
        if (this.prototype.hasOwnProperty(jsSelector)) {
            const func = this.prototype[jsSelector];
            if (func === undefined)
                yield* SmalltalkVM.debug();
            const cm = func.compiledMethod;
            if (cm === undefined)
                yield* SmalltalkVM.debug();
            if (!(cm instanceof SmalltalkGlobals._CompiledMethod))
                //objects as methods
                return true;
            if (cm.literals === undefined || cm.literals !== func.literals)
                yield* SmalltalkVM.debug();
            //this could be a descended method in JavaScript
            return cm.literals[cm.literals.length - 1].pointers[1] === this;
        }
        return false;
    },

    _inheritsFrom_: function *_inheritsFrom_(_aClass) {
        /*Answer whether the argument, aClass, is on the receiver's superclass
        chain.*/
        let _aSuperclass = this.pointers[0];
        while (_aSuperclass !== nil) {
            if (_aSuperclass === _aClass) {
                return true;
            } else {
                _aSuperclass = _aSuperclass.pointers[0];
            }
        }
        return false;
    },

    _lookupSelector_: function *_lookupSelector_(_selector) {
        /*Look up the given selector in my methodDictionary.
        Return the corresponding method if found.
        Otherwise chase the superclass chain and try again.
        Return nil if no method is found.*/
        let _lookupClass = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>lookupSelector:, checking interrupts:", false, false);

        const jsSelector = SmalltalkUtils.mappingForSelector(_selector.valueOf());
        _lookupClass = this;
        while (_lookupClass !== nil) {
            const prototype = _lookupClass.prototype;
            if (prototype === undefined)
                yield* SmalltalkVM.debug();
            if (prototype.hasOwnProperty(jsSelector)) {
                const func = prototype[jsSelector];
                if (func === undefined)
                    yield* SmalltalkVM.debug();
                const cm = func.compiledMethod;
                if (cm === undefined)
                    yield* SmalltalkVM.debug();
                if (!(cm instanceof SmalltalkGlobals._CompiledMethod))
                    //objects as methods
                    return cm;
                if (cm.literals === undefined || cm.literals !== func.literals)
                    yield* SmalltalkVM.debug();
                //this could be a descended method in JavaScript
                if (cm.literals[cm.literals.length - 1].pointers[1] === _lookupClass)
                    return cm;
            }
            _lookupClass = _lookupClass.pointers[0];
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Behavior>>lookupSelector:, checking interrupts:", false, true);
        }
        return nil;
    },

})