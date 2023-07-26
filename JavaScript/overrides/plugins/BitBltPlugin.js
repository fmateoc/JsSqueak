/*
 * Copyright (c) 2023  Florin Mateoc
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

Object.override(BitBltPlugin, {

    /*	Return the integer value of the given field of the given object. If the field contains a Float, truncate it and return its integral part. Fail if the given field does not contain a small integer or Float, or if the truncated Float is out of the range of small integers. */

    fetchIntOrFloatofObject(fieldIndex, objectPointer) {
        const fieldOop = objectPointer.pointers[fieldIndex];

        if (typeof fieldOop === "number" || fieldOop instanceof Number) {
            const truncated = Math.trunc(fieldOop);
            if ((truncated | 0) === truncated || Number.isSafeInteger(truncated))
                return truncated;
        }
        throw Object.create(PrimitiveFailed).setPayload(1);
    }
    ,

    /*	Return the integer value of the given field of the given object. If the field contains a Float, truncate it and return its integral part. Fail if the given field does not contain a small integer or Float, or if the truncated Float is out of the range of small integers. */

    fetchIntOrFloatofObjectifNil(fieldIndex, objectPointer, defaultValue) {
        const fieldOop = objectPointer.pointers[fieldIndex];

        if (typeof fieldOop === "number" || fieldOop instanceof Number) {
            const truncated = Math.trunc(fieldOop);
            if ((truncated | 0) === truncated || Number.isSafeInteger(truncated))
                return truncated;
        } else if (fieldOop === nil) {
            return defaultValue;
        }
        throw Object.create(PrimitiveFailed).setPayload(1);
    }
    ,
})