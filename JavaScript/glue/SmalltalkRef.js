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

globalThis.AllInstances = new Map();

//We use the FinalizationRegistry callbacks to auto-shrink the weak collections holding allInstances per class
//Every time we get a callback, we shrink from the end all the freed slots, without waiting for their own callbacks
globalThis.Instances = class Instances extends Array {
    addWeakly(element) {
        const newIndex = this.length;
        if (newIndex === 0) {
            const self = this;
            this.finalizationRegistry = new FinalizationRegistry(indexAsHeldValue =>
            {
                //by the time we get the callback, we may have already popped the callback's own freed slot
                if (indexAsHeldValue < self.length) {
                    let last = self.pop();
                    while (last.deref() === undefined && indexAsHeldValue < self.length)
                        last = self.pop();
                    if (indexAsHeldValue < self.length)
                        self[indexAsHeldValue] = last;
                }
            });
        }
        this.finalizationRegistry.register(element, newIndex);
        this.push(new WeakRef(element));
        return element;
    }
}


globalThis.canBecome = function canBecome(a) {
    return typeof a.valueOf() === "object" && !nil._eqEq(a) ||
            a instanceof SmalltalkGlobals._String && !(a instanceof SmalltalkGlobals._Symbol) ||    //exclude Character but include String (except Symbol), the typeof of both their valueOf() is "string"
            a instanceof SmalltalkGlobals._ClassDescription                                         //classes (and metaclasses) have a typeof of "function", but so do blocks, so be specific...

}

globalThis.become = function become(a, b) {
    if (a._eqEq(b))
        return;

    if (typeof a === "function" && typeof b !== "function" || typeof b === "function" && typeof a !== "function" ||
        a instanceof SmalltalkGlobals._Class && !(b instanceof SmalltalkGlobals._Class) ||
        !(a instanceof SmalltalkGlobals._Class) && b instanceof SmalltalkGlobals._Class ||
        a instanceof SmalltalkGlobals._Metaclass && !(b instanceof SmalltalkGlobals._Metaclass) ||
        !(a instanceof SmalltalkGlobals._Metaclass) && b instanceof SmalltalkGlobals._Metaclass)
        throw "Primitive failed";
    if (a instanceof SmalltalkGlobals._LookupKey && !(b instanceof SmalltalkGlobals._LookupKey) ||
        !(a instanceof SmalltalkGlobals._LookupKey) && b instanceof SmalltalkGlobals._LookupKey)
        throw "Primitive failed";
    if (a instanceof SmalltalkGlobals._CompiledMethod && !(b instanceof SmalltalkGlobals._CompiledMethod) ||
        !(a instanceof SmalltalkGlobals._CompiledMethod) && b instanceof SmalltalkGlobals._CompiledMethod)
        throw "Primitive failed";

    const aProps = Object.create(null);
    if (typeof a === "function") {
        for (const prop of Object.keys(a)) {
            if (prop !== 'pointers' && prop !== 'hash') {
                aProps[prop] = a[prop];
                delete a[prop];
            }
        }
        for (const prop of Object.keys(b)) {
            if (prop !== 'pointers' && prop !== 'hash') {
                a[prop] = b[prop];
                delete b[prop];
            }
        }
        Object.assign(b, aProps);
        if (a.name !== b.name) {
            const name = Object.getOwnPropertyDescriptor(a, 'name');
            Object.defineProperty(a, 'name', Object.getOwnPropertyDescriptor(b, 'name'));
            Object.defineProperty(b, 'name', name);
        }

        aProps.pointers = a.pointers.slice();
        a.setBehaviorPointers(b.pointers.slice());
        b.setBehaviorPointers(aProps.pointers);

        //of course, the following is not really a become operation, as the prototypes are not Smalltalk objects, we are just reusing the code
        become(a.prototype, b.prototype);
    } else {
        for (const prop of Object.keys(a)) {
            if (prop !== 'hash') {
                aProps[prop] = a[prop];
                delete a[prop];
            }
        }
        for (const prop of Object.keys(b)) {
            if (prop !== 'hash') {
                a[prop] = b[prop];
                delete b[prop];
            }
        }
        Object.assign(b, aProps);

        if (a instanceof SmalltalkGlobals._LookupKey) {
            if (b.pointers[2] === a)
                b.pointers[2] = b;
            else if (b.pointers[2] !== undefined)
                throw "Primitive failed";
            if (a.pointers[2] === b)
                a.pointers[2] = a;
            else if (a.pointers[2] !== undefined)
                throw "Primitive failed";
            if (a.pointers[0].valueOf() !== b.pointers[0].valueOf()) {
                const aKey = '_' + a.pointers[0].valueOf();
                if (a.pointers === SmalltalkGlobals[aKey])
                    SmalltalkGlobals[aKey] = b.pointers;   //global var bindings
                else if (SmalltalkGlobals[aKey] !== undefined) {
                    if (a.pointers[1] === SmalltalkGlobals[aKey]) {
                        SmalltalkGlobals[aKey] = b.pointers[1];   //class bindings
                        SmalltalkGlobals[aKey][2] = b;   //class bindings
                    } else
                        throw "Primitive failed";
                }
                const bKey = '_' + b.pointers[0].valueOf();
                if (b.pointers === SmalltalkGlobals[bKey])
                    SmalltalkGlobals[bKey] = a.pointers;   //global var bindings
                else if (SmalltalkGlobals[bKey] !== undefined) {
                    if (b.pointers[1] === SmalltalkGlobals[bKey]) {
                        SmalltalkGlobals[bKey] = a.pointers[1];   //class bindings
                        SmalltalkGlobals[bKey][2] = a;   //class bindings
                    } else
                        throw "Primitive failed";
                }
            }
        } else if (a instanceof SmalltalkGlobals._CompiledMethod) {
            if (b.func === undefined || b.func.compiledMethod !== a)
                throw "Primitive failed";
            b.func.compiledMethod = b;
            if (a.func === undefined || a.func.compiledMethod !== b)
                throw "Primitive failed";
            a.func.compiledMethod = a;
            const a_methodClass = a.literals[a.literals.length - 1].pointers[1];
            const b_methodClass = b.literals[b.literals.length - 1].pointers[1];
            if (a_methodClass !== b_methodClass) {
                if (a_methodClass.prototype[a.func.name] !== b.func)
                    throw "Primitive failed";
                a_methodClass.prototype[a.func.name] = a.func;
                if (b_methodClass.prototype[b.func.name] !== a.func)
                    throw "Primitive failed";
                b_methodClass.prototype[b.func.name] = b.func;
            }
        }
    }

    const aPrototype = Object.getPrototypeOf(a);
    const bPrototype = Object.getPrototypeOf(b);
    if (aPrototype !== bPrototype) {
        Object.setPrototypeOf(a, bPrototype);
        Object.setPrototypeOf(b, aPrototype);
        if (a.hasOwnProperty('constructor')) {
            if (a.constructor.prototype !== a || !b.hasOwnProperty('constructor') || b.constructor.prototype !== b)
                throw "Primitive failed";
        } else if (b.hasOwnProperty('constructor'))
            throw "Primitive failed";
        else {
            const aInstances = AllInstances.get(a._class());
            if (aInstances)
                aInstances.addWeakly(a);
            const bInstances = AllInstances.get(b._class());
            if (bInstances)
                bInstances.addWeakly(b);
        }
    }
}

globalThis.becomeForward = function becomeForward(a, b, keepHash = true, keepClass = false) {
    if (a._eqEq(b))
        return;

    function doBecomeForward(a, b, keepHashes, keepClasses) {
        if (typeof a === "function" && typeof b !== "function" || typeof b === "function" && typeof a !== "function" ||
            a instanceof SmalltalkGlobals._Class && !(b instanceof SmalltalkGlobals._Class) ||
            !(a instanceof SmalltalkGlobals._Class) && b instanceof SmalltalkGlobals._Class ||
            a instanceof SmalltalkGlobals._Metaclass && !(b instanceof SmalltalkGlobals._Metaclass) ||
            !(a instanceof SmalltalkGlobals._Metaclass) && b instanceof SmalltalkGlobals._Metaclass)
            throw "Primitive failed";
        if (a instanceof SmalltalkGlobals._LookupKey && !(b instanceof SmalltalkGlobals._LookupKey) ||
            !(a instanceof SmalltalkGlobals._LookupKey) && b instanceof SmalltalkGlobals._LookupKey)
            throw "Primitive failed";
        if (a instanceof SmalltalkGlobals._CompiledMethod && !(b instanceof SmalltalkGlobals._CompiledMethod) ||
            !(a instanceof SmalltalkGlobals._CompiledMethod) && b instanceof SmalltalkGlobals._CompiledMethod)
            throw "Primitive failed";

        if (typeof a === "function") {
            for (const prop of Object.keys(a))
                if (prop !== 'pointers' && (prop !== 'hash' || !keepHashes))
                    delete a[prop];
            for (const prop of Object.keys(b))
                if (prop !== 'pointers' && (prop !== 'hash' || !keepHashes))
                    a[prop] = b[prop];
            if (a.name !== b.name)
                Object.defineProperty(a, 'name', Object.getOwnPropertyDescriptor(b, 'name'));

            a.setBehaviorPointers(b.pointers.slice());

            const aProto = a.prototype, bProto = b.prototype;
            for (const prop of Object.keys(aProto))
                delete aProto[prop];
            for (const prop of Object.keys(bProto))
                aProto[prop] = bProto[prop];
            Object.setPrototypeOf(aProto, Object.getPrototypeOf(bProto));
        } else {
            const original_a_pointers = a.pointers, original_a_literals = a instanceof SmalltalkGlobals._CompiledMethod ? a.literals : undefined;
            for (const prop of Object.keys(a))
                if (prop !== 'hash' || !keepHashes)
                    delete a[prop];
            for (const prop of Object.keys(b))
                if (prop !== 'hash' || !keepHashes)
                    a[prop] = b[prop];

            if (a instanceof SmalltalkGlobals._LookupKey) {
                if (a.pointers[2]._eqEq(b))
                    a.pointers[2] = a;
                else if	 (a.pointers[2] !== undefined)
                    throw new Error("should not happen")

                if (a.pointers[0].valueOf() !== original_a_pointers[0].valueOf()) {
                    const original_a_key = '_' + original_a_pointers[0].valueOf();
                    if (original_a_pointers === SmalltalkGlobals[original_a_key])
                        SmalltalkGlobals[original_a_key] = b.pointers;   //global var bindings
                    else if (SmalltalkGlobals[original_a_key] !== undefined) {
                        if (original_a_pointers[1]._eqEq(SmalltalkGlobals[original_a_key])) {
                            SmalltalkGlobals[original_a_key] = b.pointers[1];   //class bindings
                            SmalltalkGlobals[original_a_key][2] = b;   //class bindings
                        } else
                            throw new Error("should not happen")
                    }
                }
            } else if (original_a_literals) {
                if (a.func === undefined || a.func.compiledMethod !== b)
                    throw new Error("should not happen")
                a.func.compiledMethod = a;
                const original_a_methodClass = original_a_literals[original_a_literals.length - 1].pointers[1];
                const a_methodClass = a.literals[a.literals.length - 1].pointers[1];
                if (original_a_methodClass !== a_methodClass) {
                    if (a_methodClass.prototype[a.func.name] !== b.func)
                        throw new Error("should not happen")
                    a_methodClass.prototype[a.func.name] = a.func;
                }
            }
        }
        if (keepHashes && a.hasOwnProperty('hash'))
            b.hash = a.hash;

        if (!keepClasses) {
            const aPrototype = Object.getPrototypeOf(a);
            const bPrototype = Object.getPrototypeOf(b);
            if (aPrototype !== bPrototype) {
                Object.setPrototypeOf(a, bPrototype);
                const bInstances = AllInstances.get(a._class());
                if (bInstances)
                    bInstances.addWeakly(a);
            }
        }
    }

    doBecomeForward(a, b, keepHash, keepClass);

    if (a.hasOwnProperty('equivalent')) {
        const aEquiv = a.equivalent;
        const aEquivOrig = aEquiv.slice();
        if (b.hasOwnProperty('equivalent')) {
            const bEquiv = b.equivalent;
            for (const e of bEquiv)
                if (e.deref() !== undefined)
                    aEquiv.push(e);
        } else {
            Object.defineProperty(b, 'equivalent', {value: []});
            Object.defineProperty(b, '_eqEq', {value: function _eqEq(arg) {const argEquiv = arg.hasOwnProperty('equivalent') ? arg.equivalent : false, self = this; return this === arg || this.equivalent.some(x => x.deref() === arg) || argEquiv && (argEquiv.some(x => x.deref() === self) || this.equivalent.some(x => {const xDeref = x.deref(); return xDeref !== undefined && argEquiv.some(y => y.deref() === xDeref)}))}});
        }
        const bEquiv = b.equivalent;
        for (const e of aEquivOrig)
            if (e.deref() !== undefined) {
                bEquiv.push(e);
                doBecomeForward(e.deref(), b, keepHash, keepClass);
            }
    } else {
        Object.defineProperty(a, 'equivalent', {value: []});
        if (b.hasOwnProperty('equivalent')) {
            const aEquiv = a.equivalent;
            const bEquiv = b.equivalent;
            for (const e of bEquiv)
                if (e.deref() !== undefined)
                    aEquiv.push(e);
        } else {
            Object.defineProperty(b, 'equivalent', {value: []});
            Object.defineProperty(b, '_eqEq', {value: function _eqEq(arg) {const argEquiv = arg.hasOwnProperty('equivalent') ? arg.equivalent : false, self = this; return this === arg || this.equivalent.some(x => x.deref() === arg) || argEquiv && (argEquiv.some(x => x.deref() === self) || this.equivalent.some(x => {const xDeref = x.deref(); return xDeref !== undefined && argEquiv.some(y => y.deref() === xDeref)}))}});
        }
        Object.defineProperty(a, '_eqEq', {value: function _eqEq(arg) {const argEquiv = arg.hasOwnProperty('equivalent') ? arg.equivalent : false, self = this; return this === arg || this.equivalent.some(x => x.deref() === arg) || argEquiv && (argEquiv.some(x => x.deref() === self) || this.equivalent.some(x => {const xDeref = x.deref(); return xDeref !== undefined && argEquiv.some(y => y.deref() === xDeref)}))}});
    }
    a.equivalent.push(new WeakRef(b));
    b.equivalent.push(new WeakRef(a));
}


Array.Empty = Object.freeze([]);
Uint8Array.Empty = Object.freeze(new Uint8Array());
Uint16Array.Empty = Object.freeze((new Uint16Array()));
Uint32Array.Empty = Object.freeze((new Uint32Array()));
Int16Array.Empty = Object.freeze((new Int16Array()));
Int32Array.Empty = Object.freeze((new Int32Array()));
BigUint64Array.Empty = Object.freeze((new BigUint64Array()));
Float64Array.Empty = Object.freeze((new Float64Array()));
Float32Array.Empty = Object.freeze((new Float32Array()));

