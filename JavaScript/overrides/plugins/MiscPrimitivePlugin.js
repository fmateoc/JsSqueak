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

Object.override(MiscPrimitivePlugin, {

    primitiveCompareString(string1Oop, string2Oop, orderOop) {

        const string1 = string1Oop.storageType !== "bytes" ? PrimitiveFailed.signal() : string1Oop.bytes;
        const string2 = string2Oop.storageType !== "bytes" ? PrimitiveFailed.signal() : string2Oop.bytes;
        const order = orderOop.storageType !== "bytes" ? PrimitiveFailed.signal() : orderOop.bytes;
        const len1 = string1.length, len2 = string2.length, len = Math.min(len1, len2);
        if (orderOop === SmalltalkGlobals._String._initialize.literals[1].pointers[1]) {
            for (let i = 0; i < len; i++) {
                const c = string1[i] - string2[i];
                if (c !== 0) {
                    throw Object.create(PrimitiveReturn).setPayload(((c < 0) ? 1 : 3));
                }
            }
        } else {
            for (let i = 0; i < len; i++) {
                const c = order[string1[i]] - order[string2[i]];
                if (c !== 0) {
                    throw Object.create(PrimitiveReturn).setPayload(((c < 0) ? 1 : 3));
                }
            }
        }
        throw Object.create(PrimitiveReturn).setPayload(((len1 === len2) ? 2 : ((len1 < len2) ? 1 : 3)));
    },

    primitiveFindFirstInString(aStringOop, inclusionMapOop, start) {

        const aString = aStringOop.storageType !== "bytes" ? PrimitiveFailed.signal() : aStringOop.bytes;
        const inclusionMap = inclusionMapOop.storageType !== "bytes" ? PrimitiveFailed.signal() : inclusionMapOop.bytes;
        if ((start >> 0) !== start || start <= 0) throw Object.create(PrimitiveFailed).setPayload(1);
        if (inclusionMap.length !== 256) {
            throw Object.create(PrimitiveReturn).setPayload(0);
        } else {
            const stringSize = aString.length;
            for (let i = start - 1; i < stringSize; i++) {
                if (inclusionMap[aString[i]] !== 0)
                    throw Object.create(PrimitiveReturn).setPayload(i + 1);
            }
            throw Object.create(PrimitiveReturn).setPayload(0);
        }
    }
    ,

    primitiveFindSubstring(keyOop, bodyOop, start, matchTableOop) {

        const key = keyOop.storageType !== "bytes" ? PrimitiveFailed.signal() : keyOop.bytes;
        const body = bodyOop.storageType !== "bytes" ? PrimitiveFailed.signal() : bodyOop.bytes;
        if ((start >> 0) !== start || start <= 0) throw Object.create(PrimitiveFailed).setPayload(1);
        const matchTable = matchTableOop.storageType !== "bytes" ? PrimitiveFailed.signal() : matchTableOop.bytes;

        let startIndex;
        if (key.length === 1) {
            const byte = matchTable[key[0]], limit = body.length;
            for (startIndex = start - 1; startIndex < limit; startIndex++) {
                if (matchTable[body[startIndex]] === byte) {
                    throw Object.create(PrimitiveReturn).setPayload(startIndex + 1);
                }
            }
        } else if (key.length !== 0) {
            const limit = body.length - key.length;
            for (startIndex = start - 1; startIndex <= limit; startIndex++) {
                let index = 0;
                while (matchTable[body[startIndex + index]] === matchTable[key[index]]) {
                    if (index === key.length - 1) {
                        throw Object.create(PrimitiveReturn).setPayload(startIndex + 1);
                    } else {
                        ++index;
                    }
                }
            }
        }
        throw Object.create(PrimitiveReturn).setPayload(0);
    }
    ,

    primitiveStringHash(aByteArrayOop, speciesHash) {

        if (arguments.length === 1) {
            speciesHash = aByteArrayOop;
            aByteArrayOop = this;
        }
        const aByteArray = aByteArrayOop.storageType !== "bytes" ? PrimitiveFailed.signal() : aByteArrayOop.bytes;
        let hash = speciesHash.valueOf();
        if (!Number.isSafeInteger(hash))
            throw Object.create(PrimitiveFailed).setPayload(1);
        const byteArraySize = aByteArray.length;
        for (let pos = 0; pos < byteArraySize; pos++) {
            /* Begin hashMultiply */
            hash = Math.imul(hash + aByteArray[pos], 1664525);
        }
        return hash >>> 0;
    }
    ,

    primitiveTranslateStringWithTable(aStringOop, start, stop, tableOop) {

        const aString = aStringOop.storageType !== "bytes" ? PrimitiveFailed.signal() : aStringOop.bytes;
        start = !Number.isSafeInteger(start.valueOf()) ? PrimitiveFailed.signal() : start - 1;
        stop = !Number.isSafeInteger(stop.valueOf()) ? PrimitiveFailed.signal() : stop - 1;
        const table = tableOop.storageType !== "bytes" ? PrimitiveFailed.signal() : tableOop.bytes;
        const newBytes = new Uint8Array(aString.length);
        for (let i = start; i <= stop; i++) {
            newBytes[i] = table[aString[i]];
        }
        aStringOop.bytes = newBytes;
        aStringOop.dirty = true;
        return aStringOop;
    }
})