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

Object.override(SmalltalkGlobals._SmalltalkImage.prototype, {

    _calcEndianness: function *_calcEndianness() {
        /*What endian-ness is the current hardware?  The String '1234' will be stored into a machine word.  On BigEndian machines (the Mac), $1 will be the high byte if the word.  On LittleEndian machines (the PC), $4 will be the high byte.*/
        /*Smalltalk endianness*/
        let words = new Uint32Array([0x01020304]);
        let bytes = new Uint8Array(words.buffer);
        if (bytes[0] === 1) {
            return SmalltalkGlobals._ByteSymbol.from("big");
        } else {
            if (bytes[0] === 4) {
                return SmalltalkGlobals._ByteSymbol.from("little");
            } else {
                yield* this._error_( SmalltalkGlobals._ByteString.from('The author is confused'));
                return this;
            }
        }
    },

    *_installLowSpaceWatcher() {
        return this;
    },

    *_openSourceFiles() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("SmalltalkImage>>openSourceFiles, checking interrupts:", false, false);

//        yield* SmalltalkGlobals._FileDirectory._openSources_andChanges_forImage_(
//            yield* this._sourcesName(),
//            yield* this._changesName(),
//            SmalltalkGlobals._SmalltalkImage._LastImageName[1]);
//        yield* SmalltalkGlobals._SourceFileArray._install();

        SmalltalkGlobals._SourceFiles[1] = yield* SmalltalkGlobals._MemorySourceFileArray._new_(2);

        if (SmalltalkGlobals.classComments === undefined) {
            return this;
        }

        yield* this._changeImageNameTo_(yield* this._imageName());

        const utilitiesClassPool = SmalltalkGlobals._Utilities.pointers[7];
        yield* utilitiesClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("AuthorInitials"), SmalltalkGlobals._ByteString.Empty);
        yield* utilitiesClassPool._at_put_(SmalltalkGlobals._ByteSymbol.from("AuthorName"), SmalltalkGlobals._ByteString.Empty);

        yield* SmalltalkGlobals._Smalltalk[1]._lastQuitLogPosition_(1);
        console.log("Installing class comments");
        const start = Date.now();
        yield* (yield* SmalltalkGlobals._SystemChangeNotifier._uniqueInstance())._doSilently_(
            function* zzzBlock() {
                for (const [cls, comment] of SmalltalkGlobals.classComments)
                    yield* cls._comment_(SmalltalkGlobals._WideString.from(comment));
            });
        console.log("Done installing class comments in " + (Date.now() - start) + "ms");
        delete SmalltalkGlobals.classComments;

        return this;
    }
})
