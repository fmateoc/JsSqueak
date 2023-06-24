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

Object.override(SmalltalkGlobals._CompiledBlock.prototype, {

    _endPC: function *_endPC() {
        /*Answer the program counter for the receiver's first bytecode.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>endPC, checking interrupts:", false, false);

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

    _header: function *_header() {
        /*Answer the word containing the information about the form of the
        receiver and the form of the context needed to run the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>header, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals[0];
    },

    _initialPC: function *_initialPC() {
        /*Answer the program counter for the receiver's first bytecode.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>initialPC, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return SmalltalkGlobals.BytesPerWord * this.literals.length + 1;
    },

    _literals: function *_literals() {
        /*Answer an Array of the literals referenced by the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>literals, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return SmalltalkGlobals._Array.from(this.literals.slice(1));
    },

    _numArgs: function *_numArgs() {
        /*Answer the number of arguments the receiver takes.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>numArgs, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return ((this.literals[0] < 0 ? this.literals[0] + 9007199254740992 : this.literals[0]) >>> 24) & 15;
    },

    _numLiterals: function *_numLiterals() {
        /*Answer the number of literals used by the receiver.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>numLiterals, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals.length - 1;
    },

    _numTemps: function *_numTemps() {
        /*Answer the number of arguments the receiver takes.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>numTemps, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return ((this.literals[0] < 0 ? this.literals[0] + 9007199254740992 : this.literals[0]) >>> 18) & 63;
    },

    _outerCode: function *_outerCode() {
        /*answer the association to the class that I am installed in, or nil if none.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("CompiledBlock>>outerCode, checking interrupts:", false, false);

        if (this.literals === undefined)
            yield* SmalltalkVM.debug();
        return this.literals[this.literals.length - 1];
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