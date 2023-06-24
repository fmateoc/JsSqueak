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

const DigitValues = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
const _prefAllowUnderscoreSelectors = SmalltalkGlobals._Scanner._prefAllowUnderscoreSelectors.literals[2].pointers;


Object.override(String.prototype, {

    *_asInteger() {
        /*Answer the value of the receiver.*/
        return this.codePointAt(0)
    },

    *_asLowercase() {
        return this.toLowerCase();
    },

    *_asUnicode() {
        return this.codePointAt(0)
    },

    *_asUppercase() {
        return this.toUpperCase();
    },

    *_asciiValue() {
        /*Answer the value of the receiver that represents its ascii encoding.*/
        return this.codePointAt(0)
    },

    *_basicSqueakToIso() {
        return this;
    },

    *_charCode() {
        return this.codePointAt(0)
    },

    *_clone() {
        return this
    },

    *_comeFullyUpOnReload_(_smartRefStream) {
        /*Use existing an Character.  Don't use the new copy.*/
        return this;
    },

    *_copy() {
        return this
    },

    *_deepCopy() {
        return this
    },

    *_digitValue() {
        /*Answer 0-9 if the receiver is $0-$9, 10-35 if it is $A-$Z, and < 0
        otherwise. This is used to parse literal numbers of radix 2-36.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>digitValue", false, false);
            if (e) yield* e._signal()}

        const asInt = this.codePointAt(0);
        return asInt > 255 ? (yield* (yield* SmalltalkGlobals._EncodedCharSet._charsetAt_( yield* this._leadingChar()))._digitValueOf_( this)) : DigitValues[asInt];
    },

    *_hash() {
        return this.codePointAt(0)
    },

    *_identityHash() {
        return this.codePointAt(0)
    },

    *_instVarAt_(arg1) {
        if (GlobalActivationCounter-- < 0) {
	const e = yield* CheckInterruptsOrException("Character>>instVarAt:", false, false);
	if (e) yield* e._signal()}

        if (arg1.valueOf() !== 1) {
            yield* this._error_( SmalltalkGlobals._ByteString.from(`argument too big for character instVarAt:`));
        }
        return this.codePointAt(0);
    },

    *_instVarsInclude_(_anObject) {
        /*Answers true if anObject is among my named or indexed instance variables, and false otherwise*/
        /*primitiveObjectPointsTo*/

        return false;
    },

    *_isAlphaNumeric() {
        /*Answer whether the receiver is a letter or a digit.*/
        return /^[\p{L}\p{N}]$/u.test(this.valueOf());
    },

    *_isDigit() {
        return /^\p{Nd}$/u.test(this.valueOf());
    },

    *_isLetter() {
        return /^\p{L}$/u.test(this.valueOf());
    },

    *_isLowercase() {
        return /^\p{Ll}$/u.test(this.valueOf());
    },

    *_isOctetCharacter() {
        return this.codePointAt(0) < 256;
    },

    *_isSeparator() {
        /*Answer whether the receiver is one of the separator characters--space,
        cr, tab, line feed, or form feed.*/

        switch (this.valueOf()) {
            case ' ':
            case '\t':
            case '\n':
            case '\r':
            case '\f':
                return true;
            default:
                return false;
        }
    },

    *_isSpecial() {
        return /[\+/\\\*~<>=@,%\|&\?!-]/.test(this.valueOf());
    },

    *_isUppercase() {
        return /^\p{Lu}$/u.test(this.valueOf());
    },

    *_leadingChar() {
        /*Answer the value of the 8 highest bits which is used to identify the language.
        This is mostly used for east asian languages CJKV as a workaround against unicode han-unification.*/

        return this.codePointAt(0) >> 22;
    },

    *_nextInstance() {
        if (GlobalActivationCounter-- < 0) {
	const e = yield* CheckInterruptsOrException("Character>>nextInstance", false, false);
	if (e) yield* e._signal()}

        yield* this._shouldNotImplement();
    },

    *_nextObject() {
        if (GlobalActivationCounter-- < 0) {
	const e = yield* CheckInterruptsOrException("Character>>nextObject", false, false);
	if (e) yield* e._signal()}

        yield* this._shouldNotImplement();
    },

    *_printOn_(_aStream) {
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>printOn:", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        if (val > 32 && val !== 127) {
            yield* _aStream._nextPut_( `\$`);
            yield* _aStream._nextPut_( this.valueOf());
        } else {
            const _name = yield* (this._class())._constantNameFor_( this);
            if (_name !== nil) {
                if (_name.string === undefined)
                    yield* SmalltalkVM.debug();
                yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from('Character ' + _name.string));
            } else {
                yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from('Character value: ' + val));
            }
        }
        return this;
    },

    *_printString() {
        /*Answer a String whose characters are a description of the receiver.
        If you want to print without a character limit, use fullPrintString.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Object>>printString", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        if (val > 32 && val !== 127) {
            return SmalltalkGlobals._ByteString.from(`\$` + this.valueOf());
        } else {
            const _name = yield* (this._class())._constantNameFor_( this);
            if (_name !== nil) {
                if (_name.string === undefined)
                    yield* SmalltalkVM.debug();
                return SmalltalkGlobals._ByteString.from('Character ' + _name.string);
            } else {
                return SmalltalkGlobals._ByteString.from('Character value: ' + val);
            }
        }
    },

    *_printStringLimitedTo_(_limit) {
        /*Answer a String whose characters are a description of the receiver.
        If you want to print without a character limit, use fullPrintString.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Object>>printStringLimitedTo:", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        if (val > 32 && val !== 127) {
            return SmalltalkGlobals._ByteString.from(`\$` + this.valueOf());
        } else {
            const _name = yield* (this._class())._constantNameFor_( this);
            if (_name !== nil) {
                if (_name.string === undefined)
                    yield* SmalltalkVM.debug();
                let string = 'Character ' + _name.string;
                if (string.length > _limit)
                    string = string.substring(0, _limit) + '...etc...';
                return SmalltalkGlobals._ByteString.from(string);
            } else {
                let string = 'Character value: ' + val;
                if (string.length > _limit)
                    string = string.substring(0, _limit) + '...etc...';
                return SmalltalkGlobals._ByteString.from(string);
            }
        }
    },

    *_scaledIdentityHash() {
        return this.codePointAt(0)
    },

    *_shallowCopy() {
        return this
    },

    *_shouldBePrintedAsLiteral() {
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>shouldBePrintedAsLiteral", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        return val > 32 && val < 256 && val !== 127;
    },

    *_squeakToMac() {
        /*Convert the receiver from Squeak to MacRoman encoding.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>squeakToMac", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        return val < 128 ? this : (val > 255 ? this : (yield* SmalltalkGlobals._Character._value_(
            yield* SmalltalkGlobals._Character.prototype._squeakToMac.literals[4] /* #[173 176 226 196 227 201 160 22...etc... */._at_( val - 127))));
    },

    *_storeBinaryOn_(_aStream) {
        /*Store the receiver on a binary (file) stream*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>storeBinaryOn:", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        if (val < 256) {
            yield* _aStream._basicNextPut_( this);
        } else {
            yield* _aStream._nextInt32Put_( val);
        }
        return this;
    },

    *_storeOn_(_aStream) {
        /*Common character literals are preceded by '$', however special need to be encoded differently: for some this might be done by using one of the shortcut constructor methods for the rest we have to create them by ascii-value.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Character>>storeOn:", false, false);
            if (e) yield* e._signal()}

        if (yield* this._shouldBePrintedAsLiteral()) {
            yield* _aStream._nextPut_( `\$`);
            yield* _aStream._nextPut_( this);
        } else {
            const _name = yield* (this._class())._constantNameFor_( this);
            if (_name !== nil) {
                if (_name.string === undefined)
                    yield* SmalltalkVM.debug();
                yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from('Character ' + _name.string));
            } else {
                yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from('(Character value: ' + this.codePointAt(0) + ')'));
            }
        }
        return this;
    },

    *_storeString() {
        /*Answer a String whose characters are a description of the receiver.
        If you want to print without a character limit, use fullPrintString.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Object>>storeString", false, false);
            if (e) yield* e._signal()}

        const val = this.codePointAt(0);
        if (yield* this._shouldBePrintedAsLiteral()) {
            return SmalltalkGlobals._ByteString.from(`\$` + this.valueOf());
        } else {
            const _name = yield* (this._class())._constantNameFor_( this);
            if (_name !== nil) {
                if (_name.string === undefined)
                    yield* SmalltalkVM.debug();
                return SmalltalkGlobals._ByteString.from('Character ' + _name.string);
            } else {
                return SmalltalkGlobals._ByteString.from('(Character value: ' + val + ')');
            }
        }
    },

    *_tokenish() {
        /*Answer whether the receiver is a valid token-character--letter, digit, or colon.*/

        const val = this.valueOf();
        return val === '_' ? (_prefAllowUnderscoreSelectors[1] === nil ? false : _prefAllowUnderscoreSelectors[1]) : /^[\p{L}\p{N}:]$/u.test(val);
    },

    *_verDeepCopyWith_(_deepCopier) {
        return this
    },
});

Object.defineProperty(String.prototype, 'pointers', {
    get() {
        return [this.codePointAt(0)]
    }
})
