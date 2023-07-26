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

const LowBitPerByteTable = [1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 7, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 8, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 7, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1];
const HighBitPerByteTable = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
const stringNaN = SmalltalkGlobals._ByteString.from('NaN');
const stringInfinity = SmalltalkGlobals._ByteString.from('Infinity');
const stringNegativeInfinity = SmalltalkGlobals._ByteString.from('-Infinity');

Object.override(Number.prototype, {

    _eqEq: function _eqEq(arg) {return this._class() === arg._class() && this.valueOf() === arg.valueOf() || Number.isNaN(this.valueOf()) && Number.isNaN(arg.valueOf())},
    _notEqEq: function _notEqEq(arg) {return this._class() !== arg._class() || this.valueOf() !== arg.valueOf() && (!Number.isNaN(this.valueOf()) || !Number.isNaN(arg.valueOf()))},

    absPrintStringBase: function absPrintStringBase(_base) {
        const val = this.valueOf();
        if (Number.isInteger(val)) {
            const inBase = _base > 10 ? val.toString(_base).toUpperCase() : val.toString(_base);
            const eIndex = inBase.indexOf('e');
            if (eIndex < 0) {
                return inBase + (!Number.isSafeInteger(val) || this instanceof Float ? '.0' : '');
            } else {
                return inBase.slice(0, eIndex + 1) + inBase.slice(eIndex + 2);  //skip the '+'
            }
        }
        if (!Number.isFinite(val)) {
            return 'Infinity';
        }
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
        const upperHalf = data.getUint32(0, false);
        const _expPart = upperHalf >>> 20 & 2047;
        /* Extract fractional part*/
        const _fractionPart = (upperHalf & 1048575) * 0x0100000000 + data.getUint32(4, false);
        /* Replace omitted leading 1 in fraction unless gradual underflow*/
        const _fraction = _expPart === 0 ? BigInt(_fractionPart) << 1n : BigInt(_fractionPart) | 0x10000000000000n;
        const _exp = 1075 - _expPart;
        if (_exp <= 0) {
            return _base > 10 ? (_fraction << BigInt(-_exp)).toString(_base).toUpperCase() : (_fraction << BigInt(-_exp)).toString(_base);
        } else {
            const asBinary = _fraction.toString(2);
            const _zeroBitsCount = asBinary.length - asBinary.lastIndexOf('1') - 1;
            let fractionalDigitsInBase, shiftedFractionInBase;
            if (_base === 2) {
                fractionalDigitsInBase = _exp - _zeroBitsCount;
                shiftedFractionInBase = _fraction >> BigInt(_zeroBitsCount);
            } else {
                const bigBase = BigInt(_base);
                fractionalDigitsInBase = BigInt(Math.ceil(_exp / Math.log2(_base) - 1e-10));
                const bigExp = BigInt(_exp - _zeroBitsCount);
                const shiftedFraction = _fraction >> BigInt(_zeroBitsCount);
                const integerPart = shiftedFraction >> bigExp;
                const fractionPart = integerPart === 0n ? shiftedFraction : shiftedFraction - (integerPart << bigExp);
                const baseRaisedToPower = bigBase ** fractionalDigitsInBase;
                shiftedFractionInBase = (((fractionPart * baseRaisedToPower * bigBase) >> bigExp) + bigBase / 2n) / bigBase + integerPart * baseRaisedToPower;
                while (shiftedFractionInBase % bigBase === 0n) {
                    fractionalDigitsInBase--;
                    shiftedFractionInBase = shiftedFractionInBase / bigBase;
                }
                const rounded = BigInt(Number(shiftedFractionInBase));
                if (BigInt(Math.abs(Number(rounded - shiftedFractionInBase))) << 54n < shiftedFractionInBase) {
                    shiftedFractionInBase = rounded;
                    while (shiftedFractionInBase % bigBase === 0n) {
                        fractionalDigitsInBase--;
                        shiftedFractionInBase = shiftedFractionInBase / bigBase;
                    }
                }
            }
            fractionalDigitsInBase = Number(fractionalDigitsInBase);
            let asString = _base > 10 ? shiftedFractionInBase.toString(_base).toUpperCase() : shiftedFractionInBase.toString(_base);
            let result = asString.length <= fractionalDigitsInBase ? '0.' : asString.slice(0, asString.length - fractionalDigitsInBase) + '.';
            for (let i = asString.length; i < fractionalDigitsInBase; i++)
                result += '0';
            if (asString.length >= fractionalDigitsInBase)
                result += asString.slice(asString.length - fractionalDigitsInBase);
            else
                result += asString;
            return result;
        }
    },

    _abs: function *_abs() {
        const val = this.valueOf();
        return val <= 0 ? 0 - val : val;
    },

    _absPrintExactlyOn_base_: function *_absPrintExactlyOn_base_(_aStream, _base) {
        /*Print my value on a stream in the given base.  Assumes that my value is strictly
        positive; negative numbers, zero, and NaNs have already been handled elsewhere.
        Based upon the algorithm outlined in:
        Robert G. Burger and R. Kent Dybvig
        Printing Floating Point Numbers Quickly and Accurately
        ACM SIGPLAN 1996 Conference on Programming Language Design and Implementation
        June 1996.
        This version guarantees that the printed representation exactly represents my value
        by using exact integer arithmetic.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>absPrintExactlyOn:base:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(SmalltalkGlobals._ByteString.from(this.absPrintStringBase(_base)));
        return this;
    },

    *_adaptToFraction_andCompare_(_rcvr, _selector) {
        /*If I am involved in comparison with a Fraction, convert myself to a
        Fraction. This way, no bit is lost and comparison is exact.*/
        let _signexp = nil, _positive = nil, _expPart = nil, _exp = nil, _fraction = nil, _fractionPart = nil, _signedFraction = nil, _firstHalf = nil, _leftSide = nil, _rightSide = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>adaptToFraction:andCompare:", false, false);

        const val = this.valueOf();
        const selectorString = _selector.valueOf();

        if (!Number.isFinite(val)) {
            if (selectorString === '=') {
                return false;
            }
            if (selectorString === '~=') {
                return true;
            }
            return Number.isNaN(val) ? false : (selectorString === '<' || selectorString === '<=' ? this >= 0 : (selectorString === '>' || selectorString === '>=' ? this < 0 :
                (yield* this._error_(SmalltalkGlobals._Float.prototype._adaptToFraction_andCompare_.literals[11] /* ''unknow comparison selector'' */))));
        }
        const denominator = yield* _rcvr._denominator();
        const is32BitInt = (val | 0) === val;
        if (selectorString === '=') {
            if (is32BitInt || Number.isInteger(val) || !(yield* denominator._isPowerOfTwo()).booleanValueOf("ifTrue:")) {
                return false;
            }
        }
        if (selectorString === '~=') {
            if (is32BitInt || Number.isInteger(val) || !(yield* denominator._isPowerOfTwo()).booleanValueOf("ifTrue:")) {
                return true;
            }
        }
        const numerator = yield* _rcvr._numerator();
        if (is32BitInt || Number.isInteger(val)) {
            const asInt = is32BitInt || Number.isSafeInteger(val) ? val : BigInt(val);
            const timesDenominator = yield* asInt._mul(denominator);
            switch(selectorString) {
                case `>`: {
                    return numerator > timesDenominator;
                }
                case `>=`: {
                    return numerator >= timesDenominator;
                }
                case `<`: {
                    return numerator < timesDenominator;
                }
                case `<=`: {
                    return numerator <= timesDenominator;
                }
                default: {
                    return yield* numerator._perform_with_( _selector,  timesDenominator);
                }}
        }
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
        _firstHalf = data.getUint32(0, false);
        _signexp = _firstHalf >>> 20;
        _positive = !(_signexp & 2048);
        _expPart = _signexp & 2047;
        /* Extract fractional part*/
        _fractionPart = (_firstHalf & 1048575) * 0x0100000000 + data.getUint32(4, false);
        /* Replace omitted leading 1 in fraction unless gradual underflow*/
        _fraction = _expPart === 0 ? BigInt(_fractionPart) << 1n : BigInt(_fractionPart) | 0x10000000000000n;
        _signedFraction = _positive ? _fraction : -_fraction;
        _exp = 1075 - _expPart;
        if (_exp < 0) {
            _leftSide = numerator;
            _rightSide = (_signedFraction << BigInt( -_exp)) * BigInt(denominator);
        } else {
            _leftSide =  BigInt(numerator) << BigInt( _exp);
            _rightSide = _signedFraction * BigInt(denominator);
        }
        switch(selectorString) {
            case `=`: {
                return _leftSide == _rightSide;
            }
            case `~=`: {
                return _leftSide != _rightSide;
            }
            case `>`: {
                return _leftSide > _rightSide;
            }
            case `>=`: {
                return _leftSide >= _rightSide;
            }
            case `<`: {
                return _leftSide < _rightSide;
            }
            case `<=`: {
                return _leftSide <= _rightSide;
            }
            default: {
                return yield* _leftSide._perform_with_( _selector,  _rightSide);
            }}
    },

    *_adaptToInteger_andCompare_(_rcvr, _selector) {
        /*If I am involved in comparison with a Fraction, convert myself to a
        Fraction. This way, no bit is lost and comparison is exact.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>adaptToInteger:andCompare:", false, false);

        const val = this.valueOf();
        const selectorString = _selector.valueOf();

        if (!Number.isFinite(val)) {
            if (selectorString === '=') {
                return false;
            }
            if (selectorString === '~=') {
                return true;
            }
            return Number.isNaN(val) ? false : (selectorString === '<' || selectorString === '<=' ? this >= 0 : (selectorString === '>' || selectorString === '>=' ? this < 0 :
                (yield* this._error_(SmalltalkGlobals._Float.prototype._adaptToInteger_andCompare_.literals[11] /* ''unknow comparison selector'' */))));
        }
        const rcvrVal = _rcvr.valueOf();
        switch(selectorString) {
            case `=`: {
                return rcvrVal == val;
            }
            case `~=`: {
                return rcvrVal != val;
            }
            case `>`: {
                return rcvrVal > val;
            }
            case `>=`: {
                return rcvrVal >= val;
            }
            case `<`: {
                return rcvrVal < val;
            }
            case `<=`: {
                return rcvrVal <= val;
            }
            default: {
                yield* SmalltalkVM.debug();
            }}
    },

    *_asFloat() {
        const val = this.valueOf();
        return (val | 0) === val || Number.isSafeInteger(val) ? new Float(val) : val;
    },

    *_asTrueFraction() {
        /* Answer a fraction that EXACTLY represents self,
          a double precision IEEE floating point number.
          Floats are stored in the same form on all platforms.
          (Does handle gradual underflow but not NANs.)
          By David N. Smith with significant performance
          improvements by Luciano Esteban Notarfrancesco.
          (Version of 11April97)*/
        let _signexp = nil, _positive = nil, _expPart = nil, _exp = nil, _fraction = nil, _fractionPart = nil, _signedFraction = nil, _firstHalf = nil, _zeroBitsCount = nil;

        const val = this.valueOf();
        if (!Number.isFinite(val)) {
            yield* this._error_(SmalltalkGlobals._Float.prototype._asTrueFraction.literals[2] /* 'Cannot represent infinity as a ...etc... */);
        }
        const is32BitInt = (val | 0) === val;
        if (is32BitInt || Number.isInteger(val)) {
            return is32BitInt || Number.isSafeInteger(val) ? val : BigInt(val);
        }
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
        _firstHalf = data.getUint32(0, false);
        _signexp = _firstHalf >>> 20;
        _positive = !(_signexp & 2048);
        _expPart = _signexp & 2047;
        /* Extract fractional part*/
        _fractionPart = (_firstHalf & 1048575) * 0x0100000000 + data.getUint32(4, false);
        if (_expPart === 0 && _fractionPart === 0)
            return 0;
        /* Replace omitted leading 1 in fraction unless gradual underflow*/
        _fraction = _expPart === 0 ? BigInt(_fractionPart) << 1n : BigInt(_fractionPart) | 0x10000000000000n;
        _signedFraction = _positive ? _fraction : -_fraction;
        _exp = 1075 - _expPart;
        if (_exp <= 0) {
            const resultN = _signedFraction << BigInt(-_exp);
            const result = Number(resultN);
            return result == resultN && Number.isSafeInteger(result) ? result : resultN;
        } else {
            _zeroBitsCount = (yield* _fraction._lowBit()) - 1;
            if (_exp <= _zeroBitsCount) {
                return Number(_signedFraction >> BigInt(_exp));
            } else {
                const numerator = Number(_signedFraction >> BigInt(_zeroBitsCount));
                const denominatorN = 1n << BigInt(_exp - _zeroBitsCount);
                let denominator = Number(denominatorN);
                denominator = denominator == denominatorN && Number.isSafeInteger(denominator) ? denominator : denominatorN;
                return yield* SmalltalkGlobals._Fraction._numerator_denominator_(numerator, denominator);
            }
        }
    },

    *_basicSize() {
        return 0;
    },

    *_bitAt_(_anInteger) {
        const val = this.valueOf();
        return (val < 4294967296 ? val >>> (_anInteger - 1) : Number(BigInt(val) >> BigInt(_anInteger - 1))) & 1;
    },

    *_bitCount() {
        if (this < 0) {
            yield* this._error_(SmalltalkGlobals._Integer.prototype._bitCount.literals[2] /* 'Cannot count bits of negative i...etc... */);
        }
        return this.toString(2).replaceAll('0', '').length
    },

    *_clone() {
        return this
    },

    *_decimalDigitLength() {
        const val = this.valueOf();
            if (val <= 99999999) {
                if (val <= 9999) {
                    if (val <= 99) {
                        if (val <= 9) {
                            return 1
                        } else {
                            return 2
                        }
                    } else {
                        if (val <= 999) {
                            return 3
                        } else {
                            return 4
                        }
                    }
                } else {
                    if (val <= 999999) {
                        if (val <= 99999) {
                            return 5
                        } else {
                            return 6
                        }
                    } else {
                        if (val <= 9999999) {
                            return 7
                        } else {
                            return 8
                        }
                    }
                }
            } else {
                if (val <= 999999999999) {
                    if (val <= 9999999999) {
                        if (val <= 999999999) {
                            return 9
                        } else {
                            return 10
                        }
                    } else {
                        if (val <= 99999999999) {
                            return 11
                        } else {
                            return 12
                        }
                    }
                } else {
                    if (val <= 99999999999999) {
                        if (val <= 9999999999999) {
                            return 13
                        } else {
                            return 14
                        }
                    } else {
                        if (val <= 999999999999999) {
                            return 15
                        } else {
                            return 16
                        }
                    }
                }
            }
    },

    *_deepCopy() {
        return this
    },

    *_digitLength() {
            const val = this.valueOf();
            return val < 0 ?
                (val > -4294967296 ?
                    (val > -65536 ?
                        (val > -256 ?
                            1
                        :
                            2
                        )
                    :
                        (val > -16777216 ?
                            3
                        :
                            4
                        )
                    )
                :
                    ((val > -281474976710656) ?
                        ((val > -1099511627776) ?
                            5
                        :
                            6
                        )
                    :
                        7
                    )
                )
            :
                (val < 4294967296 ?
                    (val < 65536 ?
                        (val < 256 ?
                            1
                        :
                            2
                        )
                    :
                        (val < 16777216 ?
                            3
                        :
                            4
                        )
                    )
                :
                    (val < 281474976710656 ?
                        (val < 1099511627776 ?
                            5
                        :
                            6
                        )
                    :
                        7
                    )
                )
    },

    *_gcd_(_anInteger) {
        let _n = this.valueOf(),
            _m = _anInteger.valueOf();

            if (typeof _m === 'bigint') {
                _n = BigInt(_n < 0 ? -_n : _n);
                _m = _anInteger < 0 ? -_anInteger : _anInteger;
                while (_n !== 0n) {
                    _n = _m - _m / _n * ( _m = _n);
                }
                const resultN = _m;
                const result = Number(resultN);
                return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
            }

            while (_n !== 0) {
                _n = _m - Math.floor(_m / _n) * ( _m = _n);
            }
            return _m < 0 ? -_m : _m;
    },

    _highBit: function *_highBit() {
        const val = this.valueOf();
        if ((val >>> 0) === val || Number.isSafeInteger(val) && val > 0) {
            /*Answer the index of the high order bit of the receiver, or zero if the
        receiver is zero. Raise an error if the receiver is negative, since
        negative integers are defined to have an infinite number of leading 1's
        in 2's-complement arithmetic. Use >>highBitOfMagnitude if you want to
        get the highest bit of the magnitude.*/

            return yield* this._highBitOfPositiveReceiver();
        }
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("SmallInteger>>highBit, checking interrupts:", false, false);

        return (yield* this._lt( 0)).booleanValueOf("questionMark:colon:") ? (yield* this._error_( SmalltalkGlobals._SmallInteger.prototype._highBit.literals[3]/* 'highBit is not defined for negative integers' */)) : (yield* this._highBitOfPositiveReceiver());
    },

    *_highBitOfByte() {
        return HighBitPerByteTable[this]
    },

    _highBitOfMagnitude: function *_highBitOfMagnitude() {
        const val = this.valueOf();
        if ((val >>> 0) === val || Number.isSafeInteger(val) && val > 0) {
            /*Answer the index of the high order bit of the receiver, or zero if the
        receiver is zero. Raise an error if the receiver is negative, since
        negative integers are defined to have an infinite number of leading 1's
        in 2's-complement arithmetic. Use >>highBitOfMagnitude if you want to
        get the highest bit of the magnitude.*/

            return yield* this._highBitOfPositiveReceiver();
        } else if ((val | 0) === val || Number.isSafeInteger(val) && val < 0)
            return yield* Number(-val)._highBitOfPositiveReceiver();

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("SmallInteger>>highBit, checking interrupts:", false, false);

        return (yield* this._lt( 0)).booleanValueOf("questionMark:colon:") ? (yield* (yield* this._negated())._highBit()) : (yield* this._highBitOfPositiveReceiver());
    },

    *_highBitOfPositiveReceiver() {
        let _shifted, _bitNo;
        const val = this.valueOf();

        if (val < 4294967296) {
            if (val < 65536) {
                if (val < 256) {
                    _shifted = val;
                    _bitNo = 0;
                } else {
                    _shifted = val >>> 8;
                    _bitNo = 8;
                }
            } else {
                if (val < 16777216) {
                    _shifted = val >>> 16;
                    _bitNo = 16;
                } else {
                    _shifted = val >>> 24;
                    _bitNo = 24;
                }
            }
        } else {
            if (val < 281474976710656) {
                if (val < 1099511627776) {
                    _shifted = val / 4294967296 | 0;
                    _bitNo = 32;
                } else {
                    _shifted = val / 1099511627776 | 0;
                    _bitNo = 40;
                }
            } else {
                _shifted = val / 281474976710656 | 0;
                _bitNo = 48;
            }
        }
        return _bitNo + HighBitPerByteTable[_shifted];
    },

    *_identityHash() {
        const val = this.valueOf();
        if ((val | 0) === val || Number.isSafeInteger(val)) { // Effective (inherited or local) source for #identityHash in SmallInteger
            return val
        } else { // Effective (inherited or local) source for #identityHash in Float
//Start inlined primitive 171
            const data = new DataView(new ArrayBuffer(8));
            data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
            return (data.getUint32(0, false) & 1048575) * 0x0100000000 + data.getUint32(4, false);
//End inlined primitive 171
        }
    },

    *_instVarAt_(_i) {
        const val = this.valueOf();
        if ((val | 0) === val || Number.isSafeInteger(val)) { // Effective (inherited or local) source for #identityHash in SmallInteger
            /*Immediate has to be specially handled.*/
            if (!(yield* _i._eq( 1)).booleanValueOf("ifFalse:")) {
                yield* this._error_( SmalltalkGlobals._ByteString.from(`argument too big for immediate instVarAt:`));
            }
            return this;
        } else { // Effective (inherited or local) source for #identityHash in Float
            return yield* this._basicAt_(_i);
        }
    },

    _isFinite: function *_isFinite() {
        return Number.isFinite(this.valueOf());
    },

    *_isNaN() {
        return Number.isNaN(this.valueOf());
    },

    *_isPowerOfTwo() {
        const val = this.valueOf();
        return val > 0 && ((val >>> 0) === val && (val & val - 1) === 0 || Number.isSafeInteger(val) && (BigInt(val) & BigInt(val - 1)) === 0n);
    },

    *_lowBit() {
        if (this == 0) {
                return 0;
            } else {
                let _n = this.valueOf(), _result = 0, _last4Byte, _last2Byte, _lastByte;

                if ((_last4Byte = _n >>> 0) === 0) {
                    _result = 32;
                    _last4Byte = _n / 4294967296 | 0;
                }
                if ((_last2Byte = _last4Byte & 65535) === 0) {
                    _result += 16;
                    _last2Byte = _last4Byte >>> 16;
                }
                if ((_lastByte = _last2Byte & 255) === 0) {
                    _result += 8;
                    _lastByte = _last2Byte >>> 8;
                }
                return _result + LowBitPerByteTable[_lastByte - 1];
            }
    },

    *_nextInstance() {
        return nil
    },

    *_noMask_(_mask) {
            /*Treat the argument as a bit mask. Answer whether none of the bits that
        are 1 in the argument are 1 in the receiver.*/

            const argVal = _mask.valueOf();
            if((argVal | 0) === argVal || Number.isSafeInteger(argVal)) {
                const val = this.valueOf();
                if((argVal >> 0) === argVal && (val >> 0) === val)
                    return (val & argVal) === 0;
                else
                    return (BigInt(val) & BigInt(argVal)) === 0n;
            } else if (typeof argVal === "bigint") {
                return (BigInt(this.valueOf()) & argVal) === 0n;
            }
            return yield* (0)._eq( yield* this._bitAnd_( _mask));
    },

    *_printOn_(_aStream) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printOn:, checking interrupts:", false, false);

        yield * _aStream._nextPutAll_(yield* this._printStringBase_(10));
        return this;
    },

    _printOn_base_: function *_printOn_base_(_aStream, _base) {
        /*Print the receiver with the minimal number of digits that describes it unambiguously.
        This way, every two different Float will have a different printed representation.
        More over, every Float can be reconstructed from its printed representation with #readFrom:.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printOn:base:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._printStringBase_(_base));
        return this;
    },

    *_printString() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printString, checking interrupts:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + (-val).absPrintStringBase( 10));
            } else {
                return SmalltalkGlobals._ByteString.from(this.absPrintStringBase( 10));
            }
        } else {
            if (Number.isNaN(val)) {
                return stringNaN;
            } else {
                if (val > 0) {
                    return stringInfinity;
                } else {
                    return stringNegativeInfinity;
                }
            }
        }
    },

    *_printStringBase_(_base) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printStringBase:, checking interrupts:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + (-val).absPrintStringBase( _base));
            } else {
                return SmalltalkGlobals._ByteString.from(this.absPrintStringBase( _base));
            }
        } else {
            if (Number.isNaN(val)) {
                return stringNaN;
            } else {
                if (val > 0) {
                    return stringInfinity;
                } else {
                    return stringNegativeInfinity;
                }
            }
        }
    },

    *_printStringRadix_(_base) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printStringRadix:, checking interrupts:", false, false);

        const absToStringBase = this < 0 ? (-this.valueOf()).toString(_base) : this.toString(_base);
        return SmalltalkGlobals._ByteString.from((this < 0 ? '-' : '') + _base + 'r' + (_base > 10 ? absToStringBase.toUpperCase() :  absToStringBase));
    },

    *_raisedTo_modulo_(_n, _m) {
        /*Answer the modular exponential.
        Note: this implementation is optimized for case of large integers raised to large powers.*/
        let _a = nil, _s = nil, _mInv = nil, _zzzTemp3 = nil, _zzzTemp2 = nil, _zzzTemp1 = nil, _zzzTemp = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Integer>>raisedTo:modulo:, checking interrupts:", false, false);

        if (_n == 0) {
            return 1;
        } else if (_n < 0) {
            return  yield* (yield* this._reciprocalModulo_( _m))._raisedTo_modulo_( yield* _n._negated(),  _m);
        } else {
            if (_m < 94906266 && _n < 2147483648) {     // the modulo's square is a safe integer and the exponent is 32 bits
                const mod = Number(_m);
                let base = this.valueOf() % mod, result = 1;
                for (let i = _n; i > 1; i >>= 1) {
                    if (i % 2 === 1) {
                        result = result * base % mod;
                    }
                    base = base * base % mod;
                }
                return result * base % mod
            } else if (_n <= 4096) {
                const mod = BigInt(_m);
                let base = BigInt(this.valueOf()) % mod;
                const asString = _n.toString(2);
                const bitLength = asString.length;
                let lastIndex = asString.lastIndexOf('1');
                for (let i = lastIndex + 1; i < bitLength; i++) {
                    base = base * base % mod;
                }
                let result = base;
                if (lastIndex !== 0) {
                    let previousLastIndex = lastIndex + 1;
                    while ((lastIndex = asString.lastIndexOf('1', lastIndex - 1)) > 0) {
                        for (let i = lastIndex + 1; i < previousLastIndex; i++) {
                            base = base * base % mod;
                        }
                        result = result * base % mod;
                        previousLastIndex = lastIndex + 1;
                    }
                    for (let i = 1; i < previousLastIndex; i++) {
                        base = base * base % mod;
                    }
                    result = result * base % mod;
                }
                const resultN = Number(result);
                return resultN === (resultN | 0) || Number.isSafeInteger(resultN) ? resultN : result;
            } else {
                _mInv = yield* (yield* this._montgomeryDigitBase())._sub( yield* (yield* _m._bitAnd_( yield* this._montgomeryDigitMax()))._reciprocalModulo_( yield* this._montgomeryDigitBase()));
                /*Initialize the result to R=self montgomeryDigitModulo raisedTo: m montgomeryNumberOfDigits*/
                _a = yield* (yield* (1)._bitShift_( yield* (yield* _m._montgomeryNumberOfDigits())._mul( yield* _m._montgomeryDigitLength())))._mod( _m);
                /*Montgomerize self (multiply by R)*/
                if (((_s = yield* this._montgomeryTimes_modulo_mInvModB_(
                    yield* (yield* _a._mul( _a))._mod( _m),
                    _m,
                    _mInv))._eqEq( nil)).booleanValueOf("ifTrue:ifFalse:")) {
                    /*No Montgomery primitive available ? fallback to naive divisions*/
                    return yield* this._slidingLeftRightRaisedTo_modulo_( _n,  _m);
                } else {
                    _a = yield* _s._montgomeryRaisedTo_times_modulo_mInvModB_(
                        _n,
                        _a,
                        _m,
                        _mInv);
                    /*Demontgomerize the result (divide by R)*/
                    return yield* _a._montgomeryTimes_modulo_mInvModB_(
                        1,
                        _m,
                        _mInv);
                }
            }
        }
    },

    _raisedToInteger_: function *_raisedToInteger_(_anInteger) {
        /*The 0 raisedToInteger: 0 is an special case. In some contexts must be 1 and in others must
        be handled as an indeterminate form.
        I take the first context because that's the way that was previously handled.
        Maybe further discussion is required on this topic.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>raisedToInteger:, checking interrupts:", false, false);

        const argVal = _anInteger.valueOf();
        if (argVal < 0) {
            return yield* (yield* this._raisedToInteger_(-argVal))._reciprocal();
        } else {
            const val = this.valueOf();
            if (this instanceof Float || (val | 0) !== val && !Number.isSafeInteger(val))
                return new Float(val ** argVal);
            const resultN = BigInt(val) ** BigInt(argVal);
            const result = Number(resultN);
            return Number.isSafeInteger(result) && result == resultN ? result : resultN;
        }
    },

    *_rem_(_aNumber) {
        /*Remainder defined in terms of quo:. Answer a Number with the same
        sign as self. e.g. 9 rem: 4 = 1, -9 rem: 4 = -1. 0.9 rem: 0.4 = 0.1.*/

        const val = this.valueOf();
        const argType = typeof _aNumber;
        const argVal = argType === "object" ? _aNumber.valueOf() : _aNumber;
        switch (typeof argVal) {
            case "bigint":
                if (argVal !== 0n) {
                    const resultN = BigInt(val) % argVal;
                    const result = Number(resultN);
                    return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
                }
            case "number":
                if (argVal !== 0) {
                    const result = val % argVal || 0; //we have to get rid of -0
                    if((argType === "number" || _aNumber.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))) {
                        if((result | 0) === result || Number.isInteger(result))
                            return result;
                    } else
                        return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
                }
        }

        if (GlobalActivationCounter-- < 0) {
	        const e = yield* CheckInterruptsOrException("Number>>rem:", false, false);
	        if (e) yield* e._signal()}

        return yield* this._sub( yield* (yield* this._quo_( _aNumber))._mul( _aNumber));
    },

    _scaledIdentityHash: function *_scaledIdentityHash() {
        const val = this.valueOf();
        if ((val >>> 0) === val || Number.isSafeInteger(val)) { // Effective (inherited or local) source for #_scaledIdentityHash in SmallInteger
            return val;
        }
//Start inlined primitive 171
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
        return (data.getUint32(0, false) & 1048575) * 0x0100000000 + data.getUint32(4, false);
//End inlined primitive 171
    },

    *_shallowCopy() {
        return this
    },

    _sign: function *_sign() {
        /*Answer 1 if the receiver is greater than 0, -1 if less than 0, else 0.
        Handle IEEE-754 negative-zero by reporting a sign of -1*/

        const val = this.valueOf();
        return val > 0 ? 1 : (val < 0 || Object.is(val, -0) ? (-1) : 0);
    },

    *_size() {
        return 0;
    },

    _storeOn_: function *_storeOn_(_aStream) {
        /*Print the Number exactly so it can be interpreted back unchanged*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeOn:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._storeStringBase_(10));
        return this;
    },

    _storeOn_base_: function *_storeOn_base_(_aStream, _base) {
        /*Print the Number exactly so it can be interpreted back unchanged*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeOn:base:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._storeStringBase_(_base));
        return this;
    },

    *_storeString() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeString, checking interrupts:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + (-val).absPrintStringBase( 10));
            } else {
                return SmalltalkGlobals._ByteString.from(this.absPrintStringBase( 10));
            }
        } else {
            const thisMethodLiterals = SmalltalkGlobals._Float.prototype._storeOn_base_.literals;
            if (Number.isNaN(val)) {
                return thisMethodLiterals[5] /* 'Float nan' */;
            } else {
                if (val > 0) {
                    return thisMethodLiterals[3] /* 'Float infinity' */;
                } else {
                    return thisMethodLiterals[2] /* 'Float infinity negated' */;
                }
            }
        }
    },

    *_storeStringBase_(_base) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeStringBase:, checking interrupts:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + (_base === 10 ? '' : _base + 'r') + (-val).absPrintStringBase( _base));
            } else {
                return SmalltalkGlobals._ByteString.from((_base === 10 ? '' : _base + 'r') + this.absPrintStringBase( _base));
            }
        } else {
            const thisMethodLiterals = SmalltalkGlobals._Float.prototype._storeOn_base_.literals;
            if (Number.isNaN(val)) {
                return SmalltalkGlobals._ByteString.from(thisMethodLiterals[5] /* 'Float nan' */);
            } else {
                if (val > 0) {
                    return SmalltalkGlobals._ByteString.from(thisMethodLiterals[3] /* 'Float infinity' */);
                } else {
                    return SmalltalkGlobals._ByteString.from(thisMethodLiterals[2] /* 'Float infinity negated' */);
                }
            }
        }
    },


    *_truncated() {
        const val = this.valueOf();
        if (Number.isSafeInteger(val))
            return val;
        if (val < 9007199254740992 && val > -9007199254740992)
            return Math.trunc(val);
        if (Number.isFinite(val))
            return BigInt(val)
        yield* this._error_( SmalltalkGlobals._ByteString.from('Cannot truncate this number'));
    },

    *_veryDeepCopyWith_(_deepCopier) {
        /*Return self.  I can't be copied.  Do not record me.*/
        return this
    },


})