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

const stringNaN = SmalltalkGlobals._ByteString.from('NaN');
const stringInfinity = SmalltalkGlobals._ByteString.from('Infinity');
const stringNegativeInfinity = SmalltalkGlobals._ByteString.from('-Infinity');


Object.override(Float.prototype, {

    _eqEq: function _eqEq(arg) {return this._class() === arg._class() && this.valueOf() === arg.valueOf() || Number.isNaN(this.valueOf()) && Number.isNaN(arg.valueOf())},
    _notEqEq: function _notEqEq(arg) {return this._class() !== arg._class() || this.valueOf() !== arg.valueOf() && (!Number.isNaN(this.valueOf()) || !Number.isNaN(arg.valueOf()))},

    *_abs() {
        const val = this.valueOf();
        if ((val | 0) === val || Number.isSafeInteger(val)) {
            if (val <= 0) {
                return new Float(0 - val);
            } else {
                return this;
            }
        } else
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
        return this;
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

    *_clone() {
        return this
    },

    *_deepCopy() {
        return this
    },

    *_identityHash() {
//Start inlined primitive 171
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, this.valueOf(), false);      // for accessing IEEE-754 exponent bits
        return (data.getUint32(0, false) & 1048575) * 0x0100000000 + data.getUint32(4, false);
//End inlined primitive 171
    },

    *_instVarAt_(_i) {
        /*Immediate has to be specially handled.*/
        if (!(yield* _i._eq( 1)).booleanValueOf("ifFalse:")) {
            yield* this._error_( SmalltalkGlobals._ByteString.from(`argument too big for immediate instVarAt:`));
        }
        return this;
    },

    *_isFinite() {
        return Number.isFinite(this.valueOf());
    },

    *_isNaN() {
        return Number.isNaN(this.valueOf());
    },

    *_nextInstance() {
        return nil
    },

    *_printOn_(_aStream) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>printOn:, checking interrupts:", false, false);

        yield * _aStream._nextPutAll_(yield* this._printStringBase_(10));
        return this;
    },

    _printOn_base_: function *_printOn_base_(_aStream, _base) {
        /*Print the receiver with the minimal number of digits that describes it unambiguously.
        This way, every two different Float will have a different printed representation.
        More over, every Float can be reconstructed from its printed representation with #readFrom:.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>printOn:base:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._printStringBase_(_base));
        return this;
    },

    *_printString() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printString", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + new Float(-val).absPrintStringBase( 10));
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
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>printStringBase:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + new Float(-val).absPrintStringBase( _base));
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

    *_rem_(_aNumber) {
        /*Remainder defined in terms of quo:. Answer a Number with the same
        sign as self. e.g. 9 rem: 4 = 1, -9 rem: 4 = -1. 0.9 rem: 0.4 = 0.1.*/

        const val = this.valueOf();
        const argVal = typeof arg === "object" ? arg.valueOf() : arg;
        if (typeof argVal === "number" && argVal !== 0) {
            const result = val % argVal || 0; //we have to get rid of -0
            return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
        } else if (typeof argVal === "bigint" && argVal !== 0n) {
            const coerced = val % Number(argVal) || 0; //we have to get rid of -0
            return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? new Float(coerced) : coerced;
        }

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>rem:", false, false);

        return yield* this._sub( yield* (yield* this._quo_( _aNumber))._mul( _aNumber));
    },

    _scaledIdentityHash: function *_scaledIdentityHash() {
//Start inlined primitive 171
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, this.valueOf(), false);      // for accessing IEEE-754 exponent bits
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
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>storeOn:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._storeStringBase_(10));
        return this;
    },

    _storeOn_base_: function *_storeOn_base_(_aStream, _base) {
        /*Print the Number exactly so it can be interpreted back unchanged*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Float>>storeOn:base:, checking interrupts:", false, false);

        yield* _aStream._nextPutAll_(yield* this._storeStringBase_(_base));
        return this;
    },

    *_storeString() {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeString", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + new Float(-val).absPrintStringBase( 10));
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
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Number>>storeStringBase:", false, false);

        const val = this.valueOf();
        if (Number.isFinite(val)) {
            if (val < 0 || Object.is(val, -0)) {
                return SmalltalkGlobals._ByteString.from('-' + (_base === 10 ? '' : _base + 'r') + new Float(-val).absPrintStringBase( _base));
            } else {
                return SmalltalkGlobals._ByteString.from((_base === 10 ? '' : _base + 'r') + this.absPrintStringBase( _base));
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