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

//This file contains the image independent part of the bootstrap
//The image dependent part of bootstrap is generated

globalThis.nil = undefined;

const functionPrototypePropertySymbols = Object.getOwnPropertySymbols(Function.prototype);

function setProtoOfFunction(target, aPrototype) {
    target.toString = Function.prototype.toString;
    for (const prop of functionPrototypePropertySymbols)
        if (!target.hasOwnProperty(prop))
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(Function.prototype, prop))
    Object.setPrototypeOf(target, aPrototype);
}

SmalltalkGlobals._ProtoObject = function _ProtoObject() {}
SmalltalkGlobals._ProtoObject.pointers = Object.seal(new Array(11).fill(undefined));
Object.setPrototypeOf(SmalltalkGlobals._ProtoObject.prototype, dnuProxy);

SmalltalkGlobals._Object = function _Object() {}
SmalltalkGlobals._Object.pointers = Object.seal(new Array(11).fill(undefined));
SmalltalkGlobals._Object.pointers[0] = SmalltalkGlobals._ProtoObject;
Object.setPrototypeOf(SmalltalkGlobals._Object.prototype, SmalltalkGlobals._ProtoObject.prototype);

SmalltalkGlobals._Behavior = function _Behavior() {}
SmalltalkGlobals._Behavior.pointers = Object.seal(new Array(11).fill(undefined));
SmalltalkGlobals._Behavior.pointers[0] = SmalltalkGlobals._Object;
Object.setPrototypeOf(SmalltalkGlobals._Behavior.prototype, SmalltalkGlobals._Object.prototype);

SmalltalkGlobals._ClassDescription = function _ClassDescription() {}
SmalltalkGlobals._ClassDescription.pointers = Object.seal(new Array(11).fill(undefined));
SmalltalkGlobals._ClassDescription.pointers[0] = SmalltalkGlobals._Behavior;
Object.setPrototypeOf(SmalltalkGlobals._ClassDescription.prototype, SmalltalkGlobals._Behavior.prototype);

SmalltalkGlobals._Class = function _Class() {}
SmalltalkGlobals._Class.pointers = Object.seal(new Array(11).fill(undefined));
SmalltalkGlobals._Class.pointers[0] = SmalltalkGlobals._ClassDescription;
Object.setPrototypeOf(SmalltalkGlobals._Class.prototype, SmalltalkGlobals._ClassDescription.prototype);

SmalltalkGlobals._Metaclass = function _Metaclass() {}
SmalltalkGlobals._Metaclass.pointers = Object.seal(new Array(11).fill(undefined));
SmalltalkGlobals._Metaclass.pointers[0] = SmalltalkGlobals._ClassDescription;
Object.setPrototypeOf(SmalltalkGlobals._Metaclass.prototype, SmalltalkGlobals._ClassDescription.prototype);


SmalltalkGlobals._ClassDescription.prototype.metaInitialize = function metaInitialize(aSubclass) {
    const meta = function() {}
    meta.pointers = Object.seal(new Array(6).fill(nil));
    meta.pointers[0] = this;
    meta.pointers[5] = aSubclass;
    Object.setPrototypeOf(meta.prototype, this.prototype);
    setProtoOfFunction(meta, SmalltalkGlobals._Metaclass.prototype);
    setProtoOfFunction(aSubclass, meta.prototype);
};

SmalltalkGlobals._ClassDescription.prototype.metaInitialize.call(SmalltalkGlobals._Class, SmalltalkGlobals._ProtoObject);
SmalltalkGlobals._ProtoObject.constructor.metaInitialize(SmalltalkGlobals._Object);
SmalltalkGlobals._Object.constructor.metaInitialize(SmalltalkGlobals._Behavior);
SmalltalkGlobals._Behavior.constructor.metaInitialize(SmalltalkGlobals._ClassDescription);
SmalltalkGlobals._ClassDescription.constructor.metaInitialize(SmalltalkGlobals._Class);
SmalltalkGlobals._ClassDescription.constructor.metaInitialize(SmalltalkGlobals._Metaclass);

//done with the format-independent meta-hierarchy bootstrap


function setPrototypeFormat(target, format) {
    let instSpec;
    switch (SmalltalkGlobals.ImageFormat) {
        case 6502:  //untested
        case 6504:
        case 6505:
        case 68000: //untested
        case 68002:
            instSpec = format >> 7 & 0xF;
            target.instSize = (format >> 10 & 0xC0) + (format >> 1 & 0x3F) - 1;
            target.storageType = instSpec < 5 ? (instSpec >= 2 || target.instSize > 0 ? "pointers" : null) : (instSpec === 6 ? "words" : "bytes");
            target.isWeak = instSpec === 4;
            target.isVariable = instSpec >= 2;
            break;
        case 6521:
        case 7033:
        case 68021:
        case 68533:
            instSpec = format >> 16 & 0x1F;
            target.instSize = format & 0xFFFF;
            target.storageType = instSpec < 7 ? (instSpec >= 2 || target.instSize > 0 ? "pointers" : null) : (instSpec === 9 ? "longs" : (instSpec === 10 ? "words" : (instSpec === 12 ? "shorts" : (instSpec >= 16 ? "bytes" : null))));
            target.isWeak = instSpec === 4 || instSpec === 5;
            target.isVariable = instSpec >= 2 && (instSpec < 5 || instSpec > 8);
            break;
        default:
            throw "Unsupported image format " + SmalltalkGlobals.ImageFormat;
    }
}

//Class creation
SmalltalkGlobals._Behavior.constructor.prototype.primitive_70_impl = function primitive_70_impl() {
    const result = function(indexableSize = 0) {
        const storageType = this.storageType;
        if (storageType) {
            this[storageType] = storageType === "pointers" ? new Array(this.instSize + indexableSize).fill(nil) : (storageType === "longs" ? new BigUint64Array(indexableSize) : (storageType === "words" ? new Uint32Array(indexableSize) : (storageType === "shorts" ? new Uint16Array(indexableSize) : new Uint8Array(indexableSize))));
            Object.seal(this[this.storageType]);
        }
    }
    Object.assign(result.prototype, {
        primitive_60_impl(arg) {
            const argVal = arg.valueOf();
            const result = typeof argVal === "number" && this.isVariable ? this[this.storageType][this.instSize + argVal - 1] : undefined;
            return [result !== undefined, result !== undefined && this.isWeak ? result.deref() || nil : result];
        },
        primitive_61_impl(arg1, arg2) {
            const arg1Val = arg1.valueOf(), storageType = this.storageType, instSize = this.instSize;
            if (arg1Val <= 0 || (arg1Val | 0) !== arg1Val || !this.isVariable || instSize + arg1Val > this[storageType].length) return [false];
            const i = arg1Val - 1, storage = this[storageType];
            if (this.isWeak) {
                storage[instSize + i] = arg2 === nil ? nil : new WeakRef(Object(arg2));
                return [true, arg2]
            } else {
                if (storageType === "pointers")
                    return [true, storage[instSize + i] = arg2];
                const previous = storage[i];
                storage[i] = arg2;
                return storage[i] === arg2 || storage[i] === arg2.valueOf() ? [true, arg2] : [false, storage[i] = previous];
            }
        },
        primitive_62_impl() {
            return this.isVariable ? [true, this[this.storageType].length - this.instSize] : [false];
        },
        primitive_73_impl(arg) {
            const argVal = arg.valueOf();
            const result = typeof argVal === "number" && this.storageType ? this[this.storageType][argVal - 1] : undefined;
            return [result !== undefined, result !== undefined && this.isWeak && argVal > this.instSize ? (result.deref() || nil) : result]
        },
        primitive_74_impl(arg1, arg2) {
            const arg1Val = arg1.valueOf(), storageType = this.storageType;
            if (arg1Val <= 0 || (arg1Val | 0) !== arg1Val || !storageType || arg1Val > this[storageType].length) return [false];
            const i = arg1Val - 1, storage = this[storageType];
            if (this.isWeak) {
                storage[i] = arg2 === nil ? nil : (arg1Val > this.instSize ? new WeakRef(Object(arg2)) : arg2);
                return [true, arg2]
            } else {
                if (storageType === "pointers")
                    return [true, storage[i] = arg2];
                const previous = storage[i];
                storage[i] = arg2;
                return storage[i] === arg2 || storage[i] === arg2.valueOf() ? [true, arg2] : [false, storage[i] = previous];
            }
        },
        primitive_132_impl(arg) {
            return [this.pointers !== undefined, this.pointers && this.pointers.some((x) => arg === x)]
        },
        primitive_148_impl() {
            const copy = this.constructor.primitive_70_impl()[1];
            const storageType = this.storageType;
            if (storageType)
                copy[storageType] = copy[storageType].constructor.from(this[storageType]);
            return [true, copy]
        },
        primitive_173_impl(arg) {
            const argVal = arg.valueOf();
            const result = typeof argVal === "number" && this.storageType ? this[this.storageType][argVal - 1] : undefined;
            return [result !== undefined, result !== undefined && this.isWeak && argVal > this.instSize ? (result.deref() || nil) : result]
        },
        primitive_174_impl(arg1, arg2) {
            const arg1Val = arg1.valueOf(), storageType = this.storageType;
            if (arg1Val <= 0 || (arg1Val | 0) !== arg1Val || !storageType || arg1Val > this[storageType].length) return [false];
            const i = arg1Val - 1, storage = this[storageType];
            if (this.isWeak) {
                storage[i] = arg2 === nil ? nil : (arg1Val > this.instSize ? new WeakRef(Object(arg2)) : arg2);
                return [true, arg2]
            } else {
                if (storageType === "pointers")
                    return [true, storage[i] = arg2];
                const previous = storage[i];
                storage[i] = arg2;
                return storage[i] === arg2 || storage[i] === arg2.valueOf() ? [true, arg2] : [false, storage[i] = previous];
            }
        },
    });
    setProtoOfFunction(result, this.prototype);
    result.setBehaviorPointers(Object.seal(new Array(this.prototype.instSize).fill(nil)));
    Object.setPrototypeOf(result.prototype, dnuProxy);
    AllInstances.set(result, new Instances());
    const thisAllInstances = AllInstances.get(this);
    if (thisAllInstances)
        thisAllInstances.addWeakly(result);	//we just instantiated the behavior (function), but if it is the singleton class instantiated by its meta, we skip it
    return [true, result];
};

Object.assign(SmalltalkGlobals._Behavior.prototype, {
    setBehaviorPointers(anArray) {
        if (typeof this !== "function" || !(this instanceof SmalltalkGlobals._Behavior) || !Array.isArray(anArray))
            debugger;

        const self = this;
        this.pointers = new Proxy(anArray, {
            set(target, prop, value) {
                if (prop === "0") {
                    Object.setPrototypeOf(self.prototype, value.prototype || dnuProxy);
                } else if (prop === "1") {
                    if (target[1] !== nil && target[1].pointers[0] !== 0) {
                        if (value.pointers[0] !== 0 && value.pointers[0] !== target[1].pointers[0])
                            throw new Error("should not happen")
                        const existingMethods = target[1].pointers[1].pointers;
                        for (const cm of existingMethods)
                            if (cm !== nil) {
                                if (cm.literals === undefined)
                                    throw new Error("should not happen")
                                const penultimateLiteral = cm.literals.length > 2 ? cm.literals[cm.literals.length - 2] : nil;
                                if (penultimateLiteral === nil)
                                    throw new Error("should not happen")
                                else {
                                    const selector = penultimateLiteral instanceof SmalltalkGlobals._AdditionalMethodState ? penultimateLiteral.pointers[1] : penultimateLiteral
                                    const mappedSelector = SmalltalkUtils.mappingForSelector(selector.string);
                                    delete self.prototype[mappedSelector];
                                }
                            }
                    }
                    const newMethods = value.pointers[1].pointers;
                    for (const cm of newMethods)
                        if (cm !== nil) {
                            if (cm.literals === undefined)
                                throw new Error("should not happen")
                            const penultimateLiteral = cm.literals.length > 2 ? cm.literals[cm.literals.length - 2] : nil;
                            if (penultimateLiteral === nil)
                                throw new Error("should not happen")
                            else {
                                const selector = penultimateLiteral instanceof SmalltalkGlobals._AdditionalMethodState ? penultimateLiteral.pointers[1] : penultimateLiteral
                                const mappedSelector = SmalltalkUtils.mappingForSelector(selector.string);
                                if (Object.getOwnPropertyDescriptor(cm, 'func').get)
                                    throw new Error("should not happen")
                                if (cm.func === undefined)
                                    throw new Error("should not happen")
                                self.prototype[mappedSelector] = cm.func;
                            }
                        }
                } else if (prop === "2") {
                    if (value !== nil) {
                        setPrototypeFormat(self.prototype, value);
                    } else {
                        delete self.prototype.instSize;
                        delete self.prototype.storageType;
                        delete self.prototype.isWeak;
                        delete self.prototype.isVariable;
                    }
                }
                target[prop] = value;
                return true;
            }});
    },

    //Object creation
    primitive_70_impl() {
        return [true, AllInstances.get(this).addWeakly(new this)];
    },
    primitive_71_impl(arg) {
        const argVal = arg.valueOf();
        if (argVal === 0) return [true, AllInstances.get(this).addWeakly(new this)];
        return (argVal >>> 0) === argVal && this.prototype.isVariable ? [true, AllInstances.get(this).addWeakly(new this(argVal))] : [false];
    },
});


Object.assign(SmalltalkGlobals._ClassDescription.prototype, {
    //full initialization requires the existence of base support classes like Array, ByteString, ByteSymbol...
    //so it was split in two, a part that can be called based on just the six core classes defined here, and the rest
    fullInitialize(aSubclass, format, metaFormat, category, instvars, classinstvars, ...methods) {
        this.initialize(aSubclass, format, metaFormat);
        aSubclass.postInitialize(category, instvars, classinstvars, ...methods);
    },

    initialize(aSubclass, format, metaFormat) {
        this.metaInitialize(aSubclass);
        setPrototypeFormat(aSubclass.constructor.prototype, metaFormat);
        aSubclass.constructor.pointers[2] = metaFormat;
        const superclass = this instanceof SmalltalkGlobals._Metaclass ? this.pointers[5] : nil;
        aSubclass.pointers = Object.seal(new Array(aSubclass.instSize).fill(nil));
        aSubclass.pointers[0] = superclass;
        Object.setPrototypeOf(aSubclass.prototype, superclass.prototype || dnuProxy);
        setPrototypeFormat(aSubclass.prototype, format);
        aSubclass.pointers[2] = format;
    },

    //this is a further split of the initialize method to be called on classes that were already meta-initialized
    // (the six core classes defined in this file).
    //It is not invoked in this file because the arguments (class format values) change with (some of) the image formats
    setFormat(format, metaFormat) {
        setPrototypeFormat(this.prototype, format);
        this.pointers[2] = format;
        setPrototypeFormat(this.constructor.prototype, metaFormat);
        this.constructor.pointers[2] = metaFormat;
    }
});

Object.assign(SmalltalkGlobals._Class.prototype, {
    addSubclass(aSubclass) {
        if (this.pointers[5] === nil)
            this.pointers[5] = new SmalltalkGlobals._Array(1);
        const subclasses = this.pointers[5].pointers;
        if(subclasses === undefined)
            throw "Should not happen";
        if(Object.isSealed(subclasses)) {
            this.pointers[5].pointers = [aSubclass];
        } else
            subclasses.push(aSubclass);
    },

    postInitialize(category, instvars, classinstvars, ...methods) {
        const meta = this.constructor;
        meta.pointers[3] = SmalltalkGlobals._Array.from(classinstvars.map(s => SmalltalkGlobals._ByteString.from(s)));
        for (const method of methods) {
            meta.prototype[method.name] = method;
        }
        const storage = this.pointers;
        const superclass = storage[0];
        if (superclass !== nil)
            superclass.addSubclass(this);
        storage[3] = SmalltalkGlobals._Array.from(instvars.map(s => SmalltalkGlobals._ByteString.from(s)));
        storage[6] = SmalltalkGlobals._ByteSymbol.from(this.name.slice(1));
        storage[10] = SmalltalkGlobals._ByteSymbol.from(category);
    },
});

SmalltalkGlobals._Metaclass.prototype.primitive_70_impl = SmalltalkGlobals._Behavior.constructor.prototype.primitive_70_impl;

