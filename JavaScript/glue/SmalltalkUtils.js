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

// Setup a storage for settings
// Try (a working) localStorage and fall back to regular dictionary otherwise
let localStorage = globalThis.localStorage;
try {
    localStorage["squeak-foo:"] = "bar";
    if (localStorage["squeak-foo:"] !== "bar") throw Error();
    delete localStorage["squeak-foo:"];
} catch(e) {
    localStorage = {};
}

globalThis.Squeak = {
    Mouse_Blue: 1,
    Mouse_Yellow: 2,
    Mouse_Red: 4,
    Keyboard_Shift: 8,
    Keyboard_Ctrl: 16,
    Keyboard_Alt: 32,
    Keyboard_Cmd: 64,
    Mouse_All: 1 + 2 + 4,
    Keyboard_All: 8 + 16 + 32 + 64,
    EventTypeNone: 0,
    EventTypeMouse: 1,
    EventTypeKeyboard: 2,
    EventTypeDragDropFiles: 3,
    EventKeyChar: 0,
    EventKeyDown: 1,
    EventKeyUp: 2,
    EventDragEnter: 1,
    EventDragMove: 2,
    EventDragLeave: 3,
    EventDragDrop: 4,
    Settings: localStorage,
    bytesAsString: function (bytes) {

    }
}

function binarySelectorMapping() {

    const binarySelectorMapping = {};

    binarySelectorMapping['=='] = '_eqEq';
    binarySelectorMapping['~~'] = '_notEqEq';
    binarySelectorMapping['='] = '_eq';
    binarySelectorMapping['~='] = '_notEq';
    binarySelectorMapping['|'] = '_or';
    binarySelectorMapping['&'] = '_and';
    binarySelectorMapping['*'] = '_mul';
    binarySelectorMapping['+'] = '_add';
    binarySelectorMapping['-'] = '_sub';
    binarySelectorMapping['/'] = '_div';
    binarySelectorMapping['>'] = '_gt';
    binarySelectorMapping['<'] = '_lt';
    binarySelectorMapping['>='] = '_ge';
    binarySelectorMapping['<='] = '_le';
    binarySelectorMapping['->'] = '_assoc';
    binarySelectorMapping[','] = '_concat';
    binarySelectorMapping['@'] = '_at';
    binarySelectorMapping['//'] = '_quo';
    binarySelectorMapping['\\\\'] = '_mod';
    binarySelectorMapping['<<'] = '_lshift';
    binarySelectorMapping['>>'] = '_rshift';
    binarySelectorMapping['=>'] = '_bind';
    binarySelectorMapping['\\\\\\'] = '_modulo';
    binarySelectorMapping['*='] = '_mulArray';
    binarySelectorMapping['==>'] = '_implies';
    binarySelectorMapping['<=>'] = '_spaceship';
    binarySelectorMapping['+*'] = '_preMul';
    binarySelectorMapping[',,'] = '_matrixConcat';
    binarySelectorMapping['+='] = '_plusEq';
    binarySelectorMapping['-='] = '_minusEq';
    binarySelectorMapping['\\\\='] = '_modEq';
    binarySelectorMapping['/='] = '_divEq';
    binarySelectorMapping['**'] = '_raisedTo';
    binarySelectorMapping['>>='] = '_then';
    binarySelectorMapping['>>|'] = '_asJavaScript';
    binarySelectorMapping['>><'] = '_asPluginJavaScript';

        return binarySelectorMapping;
}

function reverseBinarySelectorMapping() {

    const reverseBinarySelectorMapping = {};

    reverseBinarySelectorMapping._eqEq = SmalltalkGlobals._ByteSymbol.from('==');
    reverseBinarySelectorMapping._notEqEq = SmalltalkGlobals._ByteSymbol.from('~~');
    reverseBinarySelectorMapping._eq = SmalltalkGlobals._ByteSymbol.from('=');
    reverseBinarySelectorMapping._notEq = SmalltalkGlobals._ByteSymbol.from('~=');
    reverseBinarySelectorMapping._or = SmalltalkGlobals._ByteSymbol.from('|');
    reverseBinarySelectorMapping._and = SmalltalkGlobals._ByteSymbol.from('&');
    reverseBinarySelectorMapping._mul = SmalltalkGlobals._ByteSymbol.from('*');
    reverseBinarySelectorMapping._add = SmalltalkGlobals._ByteSymbol.from('+');
    reverseBinarySelectorMapping._sub = SmalltalkGlobals._ByteSymbol.from('-');
    reverseBinarySelectorMapping._div = SmalltalkGlobals._ByteSymbol.from('/');
    reverseBinarySelectorMapping._gt = SmalltalkGlobals._ByteSymbol.from('>');
    reverseBinarySelectorMapping._lt = SmalltalkGlobals._ByteSymbol.from('<');
    reverseBinarySelectorMapping._ge = SmalltalkGlobals._ByteSymbol.from('>=');
    reverseBinarySelectorMapping._le = SmalltalkGlobals._ByteSymbol.from('<=');
    reverseBinarySelectorMapping._assoc = SmalltalkGlobals._ByteSymbol.from('->');
    reverseBinarySelectorMapping._concat = SmalltalkGlobals._ByteSymbol.from(',');
    reverseBinarySelectorMapping._at = SmalltalkGlobals._ByteSymbol.from('@');
    reverseBinarySelectorMapping._quo = SmalltalkGlobals._ByteSymbol.from('//');
    reverseBinarySelectorMapping._mod = SmalltalkGlobals._ByteSymbol.from('\\\\');
    reverseBinarySelectorMapping._lshift = SmalltalkGlobals._ByteSymbol.from('<<');
    reverseBinarySelectorMapping._rshift = SmalltalkGlobals._ByteSymbol.from('>>');
    reverseBinarySelectorMapping._bind = SmalltalkGlobals._ByteSymbol.from('=>');
    reverseBinarySelectorMapping._modulo = SmalltalkGlobals._ByteSymbol.from('\\\\\\');
    reverseBinarySelectorMapping._mulArray = SmalltalkGlobals._ByteSymbol.from('*=');
    reverseBinarySelectorMapping._implies = SmalltalkGlobals._ByteSymbol.from('==>');
    reverseBinarySelectorMapping._spaceship = SmalltalkGlobals._ByteSymbol.from('<=>');
    reverseBinarySelectorMapping._preMul = SmalltalkGlobals._ByteSymbol.from('+*');
    reverseBinarySelectorMapping._matrixConcat = SmalltalkGlobals._ByteSymbol.from(',,');
    reverseBinarySelectorMapping._plusEq = SmalltalkGlobals._ByteSymbol.from('+=');
    reverseBinarySelectorMapping._minusEq = SmalltalkGlobals._ByteSymbol.from('-=');
    reverseBinarySelectorMapping._modEq = SmalltalkGlobals._ByteSymbol.from('\\\\=');
    reverseBinarySelectorMapping._divEq = SmalltalkGlobals._ByteSymbol.from('/=');
    reverseBinarySelectorMapping._raisedTo = SmalltalkGlobals._ByteSymbol.from('**');
    reverseBinarySelectorMapping._then = SmalltalkGlobals._ByteSymbol.from('>>=');
    reverseBinarySelectorMapping._asJavaScript = SmalltalkGlobals._ByteSymbol.from('>>|');
    reverseBinarySelectorMapping._asPluginJavaScript = SmalltalkGlobals._ByteSymbol.from('>><');

    return reverseBinarySelectorMapping;
}

globalThis.SmalltalkUtils = Object.freeze({
    binarySelectorMapping: binarySelectorMapping(),
    reverseBinarySelectorMapping: reverseBinarySelectorMapping(),
    mappingForSelector(aString) {
        if (/^[A-Za-z_][A-Za-z_0-9]*(\:([A-Za-z_][A-Za-z_0-9]*\:)*)?$/.test(aString)) {
            return '_' + aString.replace(/\:/g, '_');
        } else {
            return this.binarySelectorMapping[aString] || ('_unmappedBinarySelector' + aString);
        }
    },
    reverseMappingForSelector(aString) {
        if (aString.endsWith('_')) {
            return SmalltalkGlobals._ByteSymbol.from(aString.substring(1).replace(/_/g, ':'))
        } else {
            const perhapsBinary = reverseBinarySelectorMapping()[aString];
            if (perhapsBinary)
                return perhapsBinary;
            else if (aString.startsWith('_unmappedBinarySelector'))
                return SmalltalkGlobals._ByteSymbol.from(aString.substring(23));
            else
                return SmalltalkGlobals._ByteSymbol.from(aString.substring(1));
        }
    }
});



globalThis.NonLocalReturn = Object.seal({isNonLocalReturn: true, setPayload(p) {this.payload = p; return this}});
globalThis.PrimitiveFailed = Object.seal({isPrimitiveFailed: true, setPayload(p) {this.payload = p; return this}, signal(arg = 1){throw Object.create(this).setPayload(arg)}});
globalThis.PrimitiveReturn = Object.seal({isPrimitiveReturn: true, setPayload(p) {this.payload = p; return this}, signal(arg){throw Object.create(this).setPayload(arg)}});
globalThis.PrimitiveYield = Object.seal({isPrimitiveYield: true, setPayload(p) {this.payloadHolder = p; return this}, signal(arg){throw Object.create(this).setPayload(arg)}});

globalThis._HANDLER_MARKER = Object.freeze(Object.create(dnuProxy));
globalThis._MISSING_MARKER = Object.freeze(Object.create(dnuProxy));

Object.override = function override(target, sourceObject) {
    for (const prop of Object.getOwnPropertyNames(sourceObject)) {
        const override = sourceObject[prop];
        if (prop in target) {
            const orig = target[prop];
            const cm = orig.compiledMethod;
            if (cm) {
                if (target.hasOwnProperty(prop)) {
                    override.compiledMethod = cm;
                } else {    //inherited
                    const cmCopy = Object.create(Object.getPrototypeOf(cm));
                    Object.assign(cmCopy, cm);
                    override.compiledMethod = cmCopy;
                }
                override.compiledMethod.func = override;
                override.compiledMethod.orig = orig;
                override.literals = override.compiledMethod.literals;
            }
        }
        target[prop] = override;
    }
}


Function.prototype.set = function set(receiver, numCopiedValues, compiledMethodOrParentFunc, startpc) {
    this.receiver = receiver;
    this.numCopiedValues = numCopiedValues;
    this.compiledMethodOrFuncParent = compiledMethodOrParentFunc;
    this.startpc = startpc;
    return this;
}

Function.prototype.setFull = function setFull(receiver, numCopiedValues, parentCompiledCodeOrFunc, litIndex) {
    this.receiver = receiver;
    this.numCopiedValues = numCopiedValues;
    this.compiledMethodOrFuncParent = parentCompiledCodeOrFunc;
    const compiledCode = parentCompiledCodeOrFunc.literals[litIndex];
    compiledCode.func = this;
    this.compiledMethod = compiledCode;
    this.literals = compiledCode.literals;
    return this;
}
