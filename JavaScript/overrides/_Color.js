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

Object.override(SmalltalkGlobals._Color.prototype, {

    _pixelValueForDepth_: function *_pixelValueForDepth_(_d) {
        /*Answers an integer representing the bits that appear in a single pixel of this color in a Form of the given depth.
         The depth must be one of 1, 2, 4, 8, 16, or 32. Contrast with pixelWordForDepth: and bitPatternForDepth:, which
         answer either a 32-bit word packed with the given pixel value or a multiple-word Bitmap containing a pattern.
         The inverse is the class message colorFromPixelValue:depth:*/
        /*Details:
            For depths of 8 or less, the result is a colorMap index.
            For depths of 16 and 32, it is a direct color value with 5 or 8 bits per color component.*/
        /*Transparency:
            The pixel value zero is reserved for transparent.
            For depths greater than 8, black maps to the darkest possible blue.*/
        let _val = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Color>>pixelValueForDepth:, checking interrupts:", false, false);

        const rgb = this.pointers[0];
        switch (_d.valueOf()) {
            case 32:
                /*eight bits per component; top 8 bits set to all ones (opaque alpha)*/
                /*this subexpression is a SmallInteger in both 32- and 64-bits.*/
                _val = yield* (yield* (yield* rgb._bitShift_( -6))._bitAnd_( 16711680))._bitOr_( yield* (yield* (yield* rgb._bitShift_( -4))._bitAnd_( 65280))._bitOr_( yield* (yield* rgb._bitShift_( -2))._bitAnd_( 255)));
                /*16rFF000000 & 16rFF000001 are LargeIntegers in 32-bits, SmallIntegers in 64-bits.*/
                return _val == 0 ? 0xFF000001 : (yield* _val._add( 4278190080));
            case 16:
                /*five bits per component; top bits ignored*/
                _val = yield* (yield* (yield* (yield* rgb._bitShift_( -15))._bitAnd_( 31744))._bitOr_( yield* (yield* rgb._bitShift_( -10))._bitAnd_( 992)))._bitOr_( yield* (yield* rgb._bitShift_( -5))._bitAnd_( 31));
                return _val == 0 ? 1 : _val;
            case 12:
                /*for indexing a color map with 4 bits per color component*/
                _val = yield* (yield* (yield* (yield* rgb._bitShift_( -18))._bitAnd_( 3840))._bitOr_( yield* (yield* rgb._bitShift_( -12))._bitAnd_( 240)))._bitOr_( yield* (yield* rgb._bitShift_( -6))._bitAnd_( 15));
                return _val == 0 ? 1 : _val;
            case 9:
                /*for indexing a color map with 3 bits per color component*/
                _val = yield* (yield* (yield* (yield* rgb._bitShift_( -21))._bitAnd_( 448))._bitOr_( yield* (yield* rgb._bitShift_( -14))._bitAnd_( 56)))._bitOr_( yield* (yield* rgb._bitShift_( -7))._bitAnd_( 7));
                return _val == 0 ? 1 : _val;
            case 8:
                return yield* this._closestPixelValue8();
            case 4:
                return yield* this._closestPixelValue4();
            case 2:
                return yield* this._closestPixelValue2();
            case 1:
                return yield* this._closestPixelValue1();
            default:
                yield* this._error_( yield* SmalltalkGlobals._ByteString.from("unknown pixel depth: ")._concat( yield* d._printString()));
        }
    }

});