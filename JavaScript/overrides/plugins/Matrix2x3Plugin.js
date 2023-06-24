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

/*** Functions ***/
function SIZEOF(obj) { return obj.pointers ? obj.pointers.length : obj.words ? obj.words.length : obj.bytes ? obj.bytes.length : typeof obj === "bigint" ? ((obj >= 0 ? obj : -obj).toString(16).length + 1) >>> 1 : 0 }

Object.override(Matrix2x3Plugin, {

    primitiveComposeMatrix(matrix1, result) {
        let m1;
        let m2;
        let m3;
        let matrix;

        /* begin loadArgumentMatrix: */
        matrix = ((typeof result === "number") ? PrimitiveFailed.signal() : result);
        if ((matrix.storageType === "words") && (SIZEOF(matrix) === 6)) {
            m3 = matrix.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }

        /* end loadArgumentMatrix: */
        /* begin loadArgumentMatrix: */
        if (typeof matrix1.valueOf() === "number")
            PrimitiveFailed.signal();
        if ((matrix1.storageType === "words") && (SIZEOF(matrix1) === 6)) {
            m2 = matrix1.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }

        /* end loadArgumentMatrix: */
        /* begin loadArgumentMatrix: */
        if ((this.storageType === "words") && (SIZEOF(this) === 6)) {
            m1 = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        m3[0] = (m1[0] * m2[0]) + (m1[1] * m2[3]);
        m3[1] = (m1[0] * m2[1]) + (m1[1] * m2[4]);
        m3[2] = ((m1[0] * m2[2]) + (m1[1] * m2[5])) + m1[2];
        m3[3] = (m1[3] * m2[0]) + (m1[4] * m2[3]);
        m3[4] = (m1[3] * m2[1]) + (m1[4] * m2[4]);
        m3[5] = ((m1[3] * m2[2]) + (m1[4] * m2[5])) + m1[5];
        throw Object.create(PrimitiveReturn).setPayload(result);
    }
    ,
    primitiveInvertPoint(_arg2) {
        let matrix;

        if (typeof _arg2.valueOf() === "number")
            PrimitiveFailed.signal();
        let oop, m23ArgX, m23ArgY;

        if (_arg2._class() === SmalltalkGlobals._Point) {
            oop = _arg2.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = _arg2.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* begin loadArgumentMatrix: */
        if (this.storageType === "words" && this.words.length === 6) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        let det;
        let m23ResultX;
        let m23ResultY;
        let x;
        let y;

        x = m23ArgX - matrix[2];
        y = m23ArgY - matrix[5];
        det = (matrix[0] * matrix[4]) - (matrix[1] * matrix[3]);
        if (det === 0.0) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        det = 1.0 / det;
        m23ResultX = ((x * matrix[4]) - (matrix[1] * y)) * det;
        m23ResultY = ((matrix[0] * y) - (x * matrix[3])) * det;

        m23ResultX += 0.5;
        m23ResultY += 0.5;
        if (!((m23ResultX > -9007199254740992) && (m23ResultX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (!((m23ResultY > -9007199254740992) && (m23ResultY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        throw Object.create(PrimitiveReturn).setPayload(SmalltalkVM.makePointwithxValueyValue(Math.trunc(m23ResultX), Math.trunc(m23ResultY)));
    }
    ,

    primitiveInvertRectInto(srcOop, dstOop) {
        let cornerX;
        let cornerY;
        let matrix;
        let maxX;
        let maxY;
        let minX;
        let minY;
        let originX;
        let originY;
        let det;
        let m23ResultX;
        let m23ResultY;
        let x;
        let y;


        if (typeof dstOop.valueOf() === "number")
            PrimitiveFailed.signal();
        if (typeof srcOop.valueOf() === "number")
            PrimitiveFailed.signal();

        /* begin loadArgumentMatrix: */
        if (this.storageType === "words" && this.words.length === 6) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        if (srcOop._class() !== dstOop._class()) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (srcOop.storageType !== "pointers") {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (srcOop.pointers.length !== 2) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        let oop, m23ArgX, m23ArgY, point = srcOop.pointers[0];
        if (point._class() === SmalltalkGlobals._Point) {
            oop = point.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = point.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        originX = m23ArgX;
        originY = m23ArgY;
        x = m23ArgX - matrix[2];
        y = m23ArgY - matrix[5];
        det = (matrix[0] * matrix[4]) - (matrix[1] * matrix[3]);
        if (det === 0.0) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        det = 1.0 / det;
        m23ResultX = ((x * matrix[4]) - (matrix[1] * y)) * det;
        m23ResultY = ((matrix[0] * y) - (x * matrix[3])) * det;
        minX = (maxX = m23ResultX);
        minY = (maxY = m23ResultY);

        /* Load bottom-right point */

        point = srcOop.pointers[1];
        if (point._class() === SmalltalkGlobals._Point) {
            oop = point.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = point.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        cornerX = m23ArgX;
        cornerY = m23ArgY;
        x = m23ArgX - matrix[2];
        y = m23ArgY - matrix[5];
        det = (matrix[0] * matrix[4]) - (matrix[1] * matrix[3]);
        if (det === 0.0) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        det = 1.0 / det;
        m23ResultX = ((x * matrix[4]) - (matrix[1] * y)) * det;
        m23ResultY = ((matrix[0] * y) - (x * matrix[3])) * det;
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);

        /* Load top-right point */

        maxY = Math.max(maxY, m23ResultY);
        m23ArgX = cornerX;
        m23ArgY = originY;
        x = m23ArgX - matrix[2];
        y = m23ArgY - matrix[5];
        det = (matrix[0] * matrix[4]) - (matrix[1] * matrix[3]);
        if (det === 0.0) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        det = 1.0 / det;
        m23ResultX = ((x * matrix[4]) - (matrix[1] * y)) * det;
        m23ResultY = ((matrix[0] * y) - (x * matrix[3])) * det;
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);

        /* Load bottom-left point */

        maxY = Math.max(maxY, m23ResultY);
        m23ArgX = originX;
        m23ArgY = cornerY;
        x = m23ArgX - matrix[2];
        y = m23ArgY - matrix[5];
        det = (matrix[0] * matrix[4]) - (matrix[1] * matrix[3]);
        if (det === 0.0) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        det = 1.0 / det;
        m23ResultX = ((x * matrix[4]) - (matrix[1] * y)) * det;
        m23ResultY = ((matrix[0] * y) - (x * matrix[3])) * det;
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);
        maxY = Math.max(maxY, m23ResultY);
        minX += 0.5;
        if (!((minX > -9007199254740992) && (minX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        maxX += 0.5;
        if (!((maxX > -9007199254740992) && (maxX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        minY += 0.5;
        if (!((minY > -9007199254740992) && (minY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        maxY += 0.5;
        if (!((maxY > -9007199254740992) && (maxY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        dstOop.pointers[0] = SmalltalkVM.makePointwithxValueyValue(Math.trunc(minX), Math.trunc(minY));
        dstOop.pointers[1] = SmalltalkVM.makePointwithxValueyValue(Math.trunc(maxX), Math.trunc(maxY));
        throw Object.create(PrimitiveReturn).setPayload(dstOop);
    },

    primitiveIsIdentity() {
        let matrix;

        /* begin loadArgumentMatrix: */
        if ((this.storageType === "words") && (SIZEOF(this) === 6)) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        throw Object.create(PrimitiveReturn).setPayload((((((matrix[0] === 1.0) && (matrix[1] === 0.0)) && (matrix[2] === 0.0)) && (matrix[3] === 0.0)) && (matrix[4] === 1.0)) && (matrix[5] === 0.0));
    }
    ,
    primitiveIsPureTranslation() {
        let matrix;

        /* begin loadArgumentMatrix: */
        if ((this.storageType === "words") && (SIZEOF(this) === 6)) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        throw Object.create(PrimitiveReturn).setPayload((((matrix[0] === 1.0) && (matrix[1] === 0.0)) && (matrix[3] === 0.0)) && (matrix[4] === 1.0));
    }
    ,
    primitiveTransformPoint( _arg2) {
        let matrix;

        if (typeof _arg2.valueOf() === "number")
            PrimitiveFailed.signal();
        let oop, m23ArgX, m23ArgY;

        if (_arg2._class() === SmalltalkGlobals._Point) {
            oop = _arg2.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = _arg2.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* begin loadArgumentMatrix: */
        if (this.storageType === "words" && this.words.length === 6) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        let m23ResultX = ((m23ArgX * matrix[0]) + (m23ArgY * matrix[1])) + matrix[2];
        let m23ResultY = ((m23ArgX * matrix[3]) + (m23ArgY * matrix[4])) + matrix[5];
        m23ResultX += 0.5;
        m23ResultY += 0.5;
        if (!((m23ResultX > -9007199254740992) && (m23ResultX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (!((m23ResultY > -9007199254740992) && (m23ResultY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        throw Object.create(PrimitiveReturn).setPayload(SmalltalkVM.makePointwithxValueyValue(Math.trunc(m23ResultX), Math.trunc(m23ResultY)));
    }
    ,

    primitiveTransformRectInto(srcOop, dstOop) {
        let cornerX;
        let cornerY;
        let matrix;
        let maxX;
        let maxY;
        let minX;
        let minY;
        let originX;
        let originY;

        if (typeof dstOop.valueOf() === "number")
            PrimitiveFailed.signal();
        if (typeof srcOop.valueOf() === "number")
            PrimitiveFailed.signal();
        /* begin loadArgumentMatrix: */
        if (this.storageType === "words" && this.words.length === 6) {
            matrix = this.wordsAsFloat32Array();
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        /* end loadArgumentMatrix: */

        if (srcOop._class() !== dstOop._class()) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (srcOop.storageType !== "pointers") {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        if (srcOop.pointers.length !== 2) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        let oop, m23ArgX, m23ArgY, point = srcOop.pointers[0];
        if (point._class() === SmalltalkGlobals._Point) {
            oop = point.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = point.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }

        originX = m23ArgX;
        originY = m23ArgY;
        let m23ResultX = ((m23ArgX * matrix[0]) + (m23ArgY * matrix[1])) + matrix[2];
        let m23ResultY = ((m23ArgX * matrix[3]) + (m23ArgY * matrix[4])) + matrix[5];
        minX = (maxX = m23ResultX);
        minY = (maxY = m23ResultY);

        /* Load bottom-right point */

        point = srcOop.pointers[1];
        if (point._class() === SmalltalkGlobals._Point) {
            oop = point.pointers[0];
            if (typeof oop.valueOf() === "number") {
                m23ArgX = oop;
                oop = point.pointers[1];
                if (typeof oop.valueOf() === "number") {
                    m23ArgY = oop;
                } else {
                    throw Object.create(PrimitiveFailed).setPayload(1);
                }
            } else {
                throw Object.create(PrimitiveFailed).setPayload(1);
            }
        } else {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }

        cornerX = m23ArgX;
        cornerY = m23ArgY;
        m23ResultX = ((m23ArgX * matrix[0]) + (m23ArgY * matrix[1])) + matrix[2];
        m23ResultY = ((m23ArgX * matrix[3]) + (m23ArgY * matrix[4])) + matrix[5];
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);

        /* Load top-right point */

        maxY = Math.max(maxY, m23ResultY);
        m23ArgX = cornerX;
        m23ArgY = originY;
        m23ResultX = ((m23ArgX * matrix[0]) + (m23ArgY * matrix[1])) + matrix[2];
        m23ResultY = ((m23ArgX * matrix[3]) + (m23ArgY * matrix[4])) + matrix[5];
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);

        /* Load bottom-left point */

        maxY = Math.max(maxY, m23ResultY);
        m23ArgX = originX;
        m23ArgY = cornerY;
        m23ResultX = ((m23ArgX * matrix[0]) + (m23ArgY * matrix[1])) + matrix[2];
        m23ResultY = ((m23ArgX * matrix[3]) + (m23ArgY * matrix[4])) + matrix[5];
        minX = Math.min(minX, m23ResultX);
        maxX = Math.max(maxX, m23ResultX);
        minY = Math.min(minY, m23ResultY);
        maxY = Math.max(maxY, m23ResultY);
        minX += 0.5;
        if (!((minX > -9007199254740992) && (minX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        maxX += 0.5;
        if (!((maxX > -9007199254740992) && (maxX < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        minY += 0.5;
        if (!((minY > -9007199254740992) && (minY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        maxY += 0.5;
        if (!((maxY > -9007199254740992) && (maxY < 9007199254740992))) {
            throw Object.create(PrimitiveFailed).setPayload(1);
        }
        dstOop.pointers[0] = SmalltalkVM.makePointwithxValueyValue(Math.trunc(minX), Math.trunc(minY));
        dstOop.pointers[1] = SmalltalkVM.makePointwithxValueyValue(Math.trunc(maxX), Math.trunc(maxY));
        throw Object.create(PrimitiveReturn).setPayload(dstOop);
    },
})