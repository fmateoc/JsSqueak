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

Object.override(LargeIntegers, {
    /*	anOop has to be a SmallInteger! */

    createLargeFromSmallInteger(anOop) {
        return BigInt(anOop.valueOf());
    }
    ,

    isNormalized(anInteger) {
        //Number.isSafeInteger() does not work for bigInt arguments
        const anInt = anInteger.valueOf();
        return typeof anInt === 'bigint' && (anInt >= 9007199254740992n || anInt <= -9007199254740992n) || Number.isSafeInteger(anInt)
    },

    normalize(aLargeInteger) {
        const val = aLargeInteger.valueOf();
        return val < 9007199254740992n && val > -9007199254740992n ? Number(val) : val
    }
    ,

    normalizeNegative(aLargeNegativeInteger) {
        const val = aLargeNegativeInteger.valueOf();
        return val > -9007199254740992n ? Number(val) : val
    },

    normalizePositive(aLargePositiveInteger) {
        const val = aLargePositiveInteger.valueOf();
        return val < 9007199254740992n ? Number(val) : val
    },

    primDigitDivNegative(secondInteger, neg) {
        let firstAsLargeInteger;
        let secondAsLargeInteger;

        if (typeof neg.valueOf() !== "boolean")
            throw Object.create(PrimitiveFailed).setPayload(1);
        const first = this.valueOf();
        const second = secondInteger.valueOf();
        if (typeof second === 'bigint') {
            if (second < 9007199254740992n && second > -9007199254740992n || second === 0n)
                throw Object.create(PrimitiveFailed).setPayload(1);
            if (typeof first === 'bigint') {
                if (first < 9007199254740992n && first > -9007199254740992n)
                    throw Object.create(PrimitiveFailed).setPayload(1);
                firstAsLargeInteger = first;
            } else {
                if (!Number.isSafeInteger(this.valueOf()))
                    throw Object.create(PrimitiveFailed).setPayload(1);
                firstAsLargeInteger = BigInt(first);
            }
            secondAsLargeInteger = second;
        } else {
            if (!Number.isSafeInteger(second))
                throw Object.create(PrimitiveFailed).setPayload(1);
            if (typeof first === 'bigint') {
                if (first < 9007199254740992n && first > -9007199254740992n)
                    throw Object.create(PrimitiveFailed).setPayload(1);
                firstAsLargeInteger = first;
            } else {
                if (!Number.isSafeInteger(first))
                    throw Object.create(PrimitiveFailed).setPayload(1);
                let signedQuo = Math.trunc(first / second);
                if(neg.valueOf() && signedQuo > 0 || !neg.valueOf() && signedQuo < 0)
                    signedQuo = -signedQuo;
                const rem = first % second;
                return SmalltalkGlobals._Array.from([signedQuo, rem]);
            }
            secondAsLargeInteger = BigInt(second);
        }
        const quoN = firstAsLargeInteger / secondAsLargeInteger;
        const quo = Number(quoN);
        let signedQuo = quo == (quo | 0) || Number.isSafeInteger(quo) ? quo : quoN;
        if(neg.valueOf() && signedQuo > 0 || !neg.valueOf() && signedQuo < 0)
            signedQuo = -signedQuo;
        const remN = firstAsLargeInteger % secondAsLargeInteger;
        const rem = Number(remN);
        let normalizedRem = rem == (rem | 0) || Number.isSafeInteger(rem) ? rem : remN;
        return SmalltalkGlobals._Array.from([signedQuo, normalizedRem]);
    },

    primGetModuleName() {
        return SmalltalkGlobals._ByteString.from("LargeIntegers v1.5 (e)")
    }
    ,

})