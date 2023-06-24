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

const TrailerKinds = SmalltalkGlobals._CompiledMethodTrailer._trailerKinds().next().value.pointers;

Object.override(SmalltalkGlobals._CompiledMethod.prototype, {

    _copyWithTrailerBytes_: function *_copyWithTrailerBytes_(_trailer) {
        /*Testing:
        (CompiledMethod compiledMethodAt: #copyWithTrailerBytes:)
            tempNamesPut: 'copy end '
    */
        let _copy = nil, _end = nil, _start = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>copyWithTrailerBytes:, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();

        _start = SmalltalkGlobals.BytesPerWord * this.literals.length + 1;
        _end = yield* this._endPC();
        _copy = yield* _trailer._createMethod_class_header_(_end - _start + 1, this._class(), this.literals[0]);

        //We are short-circuiting the become: call that follows the call to this method by doing the change in-place within the receiver instead of doing a copy and returning it
        //become: will be a no-op, as the argument will then be the same as the receiver
        _copy.bytes.set(this.bytes.slice(0, _end - _start + 1), 0);
        this.bytes = _copy.bytes;
        return this;
    },

    _endPC: function *_endPC() {
        /*Answer the program counter for the receiver's first bytecode.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>endPC, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();

        const bytes = this.bytes;
        const size = bytes.length;
        const flagByte = bytes[size - 1];
        const index = flagByte >> 2;
        switch (TrailerKinds[index].valueOf()) {
            case "NoTrailer":
            case "SourceBySelector":
                return size - 1 + SmalltalkGlobals.BytesPerWord * this.literals.length;
            case "ClearedTrailer":
            case "TempsNamesQCompress":
            case "TempsNamesZip":
            case "SourceByStringIdentifier":
            case "EmbeddedSourceQCompress":
            case "EmbeddedSourceZip":
                const n = size - (flagByte & 3) - 2;
                let length = 0;
                for (let i = size - 2; i >= n; i--)
                    length = (length << 8) + bytes[i];
                return n - length + SmalltalkGlobals.BytesPerWord * this.literals.length;
            case "VarLengthSourcePointer":
                for (let pos = size - 2; pos > 0; pos--)
                    if (bytes[pos] < 128)
                        return pos + SmalltalkGlobals.BytesPerWord * this.literals.length;
                yield* SmalltalkVM.smalltalkDebug();
            case "SourcePointer":
                return size - 4 + SmalltalkGlobals.BytesPerWord * this.literals.length;
            default:
                yield* SmalltalkVM.smalltalkDebug();
        }
    },

    _hasTempNames: function *_hasTempNames() {
        /*Answer the program counter for the receiver's first bytecode.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>hasTempNames, checking interrupts:", false, false);

        const bytes = this.bytes;
        const size = bytes.length;
        const flagByte = bytes[size - 1];
        const index = flagByte >> 2;
        const trailerKind = TrailerKinds[index].valueOf();
        return trailerKind === "TempsNamesQCompress" || trailerKind === "TempsNamesZip";
    },

    _header: function *_header() {
        /*Answer the word containing the information about the form of the
        receiver and the form of the context needed to run the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>header, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals[0];
    },

    _initialPC: function *_initialPC() {
        /*Answer the program counter for the receiver's first bytecode.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>initialPC, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return SmalltalkGlobals.BytesPerWord * this.literals.length + 1;
    },

    _literals: function *_literals() {
        /*Answer an Array of the literals referenced by the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>literals, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return SmalltalkGlobals._Array.from(this.literals.slice(1));
    },

    _methodClass: function *_methodClass() {
        /*answer the class that I am installed in*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>methodClass, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals[this.literals.length - 1].pointers[1];
    },

    _methodClassAssociation: function *_methodClassAssociation() {
        /*answer the association to the class that I am installed in, or nil if none.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>methodClassAssociation, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals[this.literals.length - 1];
    },

    _numArgs: function *_numArgs() {
        /*Answer the number of arguments the receiver takes.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>numArgs, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return ((this.literals[0] < 0 ? this.literals[0] + 9007199254740992 : this.literals[0]) >>> 24) & 15;
    },

    _numLiterals: function *_numLiterals() {
        /*Answer the number of literals used by the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>numLiterals, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals.length - 1;
    },

    _numTemps: function *_numTemps() {
        /*Answer the number of arguments the receiver takes.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>numTemps, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return ((this.literals[0] < 0 ? this.literals[0] + 9007199254740992 : this.literals[0]) >>> 18) & 63;
    },

    _penultimateLiteral: function *_penultimateLiteral() {
        /*Answer the penultimate literal of the receiver, which holds either
         the receiver's selector or its properties (which will hold the selector).*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>penultimateLiteral, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals.length > 2 ? this.literals[this.literals.length - 2] : nil;
    },

    _selector: function *_selector() {
        /*Answer a method's selector.  This is either the penultimate literal,
	    or, if the method has any properties or pragmas, the selector of
	    the AdditionalMethodState stored in the penultimate literal.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod>>penultimateLiteral, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        const penultimateLiteral = this.literals.length > 2 ? this.literals[this.literals.length - 2] : nil;
        if (penultimateLiteral === nil)
            yield* SmalltalkVM.debug();
        else
            return penultimateLiteral instanceof SmalltalkGlobals._AdditionalMethodState ? penultimateLiteral.pointers[1] : penultimateLiteral
    },

    _trailer: function *_trailer() {
        /*Answer the receiver's trailer*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledCode>>trailer, checking interrupts:", false, false);

        const trailer = yield* SmalltalkGlobals._CompiledMethodTrailer._new();
        const instvars = trailer.pointers;
        instvars[4]/* method */ = this;

        const bytes = this.bytes;
        const size = bytes.length;
        const flagByte = bytes[size - 1];
        const index = flagByte >> 2;
        instvars[2]/* kind */ = TrailerKinds[index];
        switch (instvars[2].valueOf()) {
            case "NoTrailer":
                instvars[3]/* size */ = 1;
                break;
            case "SourceBySelector":
                instvars[3]/* size */ = 1;
                break;
            case "ClearedTrailer":
                yield* trailer._decodeLengthField();
                break;
            case "TempsNamesQCompress":
            case "EmbeddedSourceQCompress":
                yield* trailer._qDecompress();
                break;
            case "TempsNamesZip":
            case "EmbeddedSourceZip":
                yield* trailer._decodeZip();
                break;
            case "SourceByStringIdentifier":
                yield* trailer._decodeSourceByStringIdentifier();
                break;
            case "VarLengthSourcePointer":
                yield* trailer._decodeVarLengthSourcePointer();
                break;
            case "SourcePointer":
                yield* trailer._decodeSourcePointer();
                break;
            default:
                yield* SmalltalkVM.smalltalkDebug();
        }
        return trailer;
    },

});

Object.override(SmalltalkGlobals._CompiledMethod.constructor.prototype, {

    _receiver_withArguments_executeMethod_: function *_receiver_withArguments_executeMethod_(_receiver, _argArray, _compiledMethod) {
        /*Execute compiledMethod against the receiver and the arguments in argArray*/


        //Start inlined primitive 188
            if (_argArray._class() && _argArray._class().name === '_Array') {
                if (Object.getOwnPropertyDescriptor(_compiledMethod, 'func').get)
                    console.log("Lazily compiling the compiled method's func from its bytecodes");
                if (_compiledMethod.func !== undefined)
                    return yield* _compiledMethod.func.apply(_receiver, _argArray.pointers);
                else
                    yield* SmalltalkVM.debug();
            }
        //End inlined primitive 188

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledMethod class>>receiver:withArguments:executeMethod:, checking interrupts:", false, false);

        yield* this._primitiveFailed_(SmalltalkGlobals._ByteSymbol.from(`receiver:withArguments:executeMethod:`));
        return this;
    },

});