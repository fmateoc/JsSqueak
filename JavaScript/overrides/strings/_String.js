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

const caseSensitiveCollator = new Intl.Collator('en', { caseFirst: 'upper' });
const caseInsensitiveCollator = new Intl.Collator('en', {sensitivity: 'base'});

const CaseInsensitiveOrder = SmalltalkGlobals._ByteArray.from(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]));
const CaseSensitiveOrder = SmalltalkGlobals._ByteArray.from(Uint8Array.from([63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 0, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 110, 111, 112, 113, 114, 115, 116, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 117, 118, 119, 120, 121, 122, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]));
const AllowUnderscoreSelectors = SmalltalkGlobals._Scanner._prefAllowUnderscoreSelectors.literals[2].pointers;

Object.override(SmalltalkGlobals._String.prototype, {

    *_asLowercase() {
        /*Answer a String made up from the receiver whose characters are all
        lowercase.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>asLowercase", false, false);
            if (e) yield* e._signal()}

        return this._class().from(this.valueOf().toLowerCase());
    },

    *_asNumber() {
        /*Answer the Number created by interpreting the receiver as the string
        representation of a number.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>asNumber", false, false);
            if (e) yield* e._signal()}

        const trimmed = this.valueOf().trimEnd();
        if (trimmed !== this.string.trim() || trimmed.indexOf('r') > -1)
            return yield* SmalltalkGlobals._Number._readFromString_( this);
        if (trimmed.indexOf('.') > (-1)) {
            const result = Number(trimmed);
            if (Number.isNaN(result))
                return yield* SmalltalkGlobals._Number._readFromString_( this);
            else
                return Number.isSafeInteger(result) ? new Float(result) : result;
        } else {
            try {
                const resultN = BigInt(trimmed);
                const result = Number(resultN);
                return Number.isSafeInteger(result) && result == resultN ? result : resultN;
            } catch (e) {
                return yield* SmalltalkGlobals._Number._readFromString_( this);
            }
        }
    },

    *_asUppercase() {
        /*Answer a String made up from the receiver whose characters are all
        uppercase.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>asUppercase", false, false);
            if (e) yield* e._signal()}

        return this._class().from(this.valueOf().toUpperCase());
    },

    *_caseInsensitiveLessOrEqual_(_aString) {
        /*Answer whether the receiver sorts before or equal to aString.
        The collation order is case insensitive.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>caseInsensitiveLessOrEqual:", false, false);

        return _aString instanceof SmalltalkGlobals._String ? caseInsensitiveCollator.compare(this.valueOf(), _aString.valueOf()) <= 0 : (yield* this._compareWith_collated_(_aString, CaseInsensitiveOrder)) <= 0;
    },

    _caseSensitiveLessOrEqual_: function *_caseSensitiveLessOrEqual_(_aString) {
        /*Answer whether the receiver sorts before or equal to aString.
        The collation order is case sensitive.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>caseSensitiveLessOrEqual:, checking interrupts:", false, false);

        return _aString instanceof SmalltalkGlobals._String ? caseSensitiveCollator.compare(this.valueOf(), _aString.valueOf()) <= 0 : (yield* this._compareWith_collated_( _aString,  CaseSensitiveOrder)) <= 0;
    },

    *_compare_caseSensitive_(_aString, _aBool) {
        /*Answer a comparison code telling how the receiver sorts relative to aString:
            1 - before
            2 - equal
            3 - after.
        */
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>compare:caseSensitive:", false, false);
            if (e) yield* e._signal()}

        if (_aBool.booleanValueOf("ifTrue:ifFalse:"))
            return _aString instanceof SmalltalkGlobals._String ? caseSensitiveCollator.compare(this.valueOf(), _aString.valueOf()) + 2 : (yield* this._compareWith_collated_(_aString, CaseSensitiveOrder)) + 2;
        else
            return _aString instanceof SmalltalkGlobals._String ? caseInsensitiveCollator.compare(this.valueOf(), _aString.valueOf()) + 2 : (yield* this._compareWith_collated_(_aString, CaseInsensitiveOrder)) + 2;
    },

    *_concat(_anObject) {
        /*Concatenate the argument to the receiver.
            Transcript cr; show: 'The value is: ', 3.
        */
        if (GlobalActivationCounter-- < 0) {
        	const e = yield* CheckInterruptsOrException("String>>,", false, false);
	        if (e) yield* e._signal()}

        const arg = yield* _anObject._asString();
        if (this.storageType === 'bytes' && arg.storageType === 'bytes') {
            if (!this.dirty && !arg.dirty)
                return SmalltalkGlobals._ByteString.from(this.string + arg.string);
            const result = SmalltalkGlobals._ByteString.primitive_70_impl()[1];
            const bytes = new Uint8Array(this.bytes.length + arg.bytes.length);
            bytes.set(this.bytes);
            bytes.set(arg.bytes, this.bytes.length);
            result.bytes = bytes;
            return result;
        }
        const words = new Uint32Array((this.storageType === 'bytes' ? this.bytes.length : this.words.length) + (arg.storageType === 'bytes' ? arg.bytes.length : arg.words.length));
        words.set(this.storageType === 'bytes' ? this.bytes : this.words);
        words.set(arg.storageType === 'bytes' ? arg.bytes : arg.words, this.storageType === 'bytes' ? this.bytes.length : this.words.length);
        return SmalltalkGlobals._WideString.fromWords(words);
    },

    _copyFrom_to_: function *_copyFrom_to_(_start, _stop) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("WideString>>copyFrom:to:, checking interrupts:", false, false);

        if (this.dirty) {
            const bytes = new Uint8Array(_stop - _start + 1);
            const thisStorage = this[this.storageType];
            for (let i = _start - 1; i < _stop; i++) {
                const codePoint = thisStorage[i];
                if (codePoint >= 256)
                    return SmalltalkGlobals._WideString.fromWords(thisStorage.slice(_start - 1, _stop));
                bytes[i - _start + 1] = codePoint;
            }
            const result = SmalltalkGlobals._ByteString.primitive_70_impl()[1];
            result.bytes = bytes;
            return result;
        } else {
            return SmalltalkGlobals._ByteString.from(this.string.slice(_start - 1, _stop));
        }
    },

    *_endsWithAColon() {
        /*Answer whether the final character of the receiver is a colon*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>endsWithAColon", false, false);
            if (e) yield* e._signal()}

        let storage;
        return this.dirty ? (storage = this[this.storageType])[storage.length - 1] === 58 : this.string.endsWith(':');
    },

    *_eq(_aString) {
        /*Answer whether the receiver sorts equally as aString.
        The collation order is simple ascii (with case differences).*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>=", false, false);
            if (e) yield* e._signal()}

        let thisStorage, _aStringStorage;
        return this === _aString || _aString instanceof SmalltalkGlobals._String &&
           (thisStorage = this[this.storageType]).length === (_aStringStorage = _aString[_aString.storageType]).length && thisStorage.every((val, index) => val === _aStringStorage[index]);
    },

    *_findLastOccurrenceOfString_startingAt_(_subString, _start) {
        /*Answer the index of the last occurrence of subString within the receiver, starting at start. If
        the receiver does not contain subString, answer 0.  Case-sensitive match used.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>findLastOccurrenceOfString:startingAt:", false, false);
            if (e) yield* e._signal()
        }

        if (_subString instanceof SmalltalkGlobals._String) {
            if (!this.dirty && !_subString.dirty) {
                const thisStorage = this.string, _subStringStorage = _subString.string;
                if (_subStringStorage.length === 0)
                    return 0;
                let position = thisStorage.indexOf(_subStringStorage, _start - 1);
                if (position === -1)
                    return 0;
                let last = position;
                position = thisStorage.indexOf(_subStringStorage, position + 1);
                while (position !== -1) {
                    last = position;
                    position = thisStorage.indexOf(_subStringStorage, position + 1);
                }
                return last + 1;
            }

            const thisStorage = this[this.storageType], thisLen = thisStorage.length,
                _subStringStorage = _subString[_subString.storageType], _subStringLen = _subStringStorage.length, maxOffset = thisLen - _subStringLen + 1;
            if (maxOffset < _start || _subStringLen === 0)
                return 0;
            const _subStringFirst = _subStringStorage[0];
            try {
                return Array.prototype.findLastIndex.call(thisStorage,
                    (element, index, array) => {
                        if (maxOffset < index)
                            return false;
                        if (index < _start - 1)
                            throw 0;
                        if (element !== _subStringFirst)
                            return false;
                        for (let i = 1; i < _subStringLen; i++)
                            if (array[index + i] !== _subStringStorage[i])
                                return false;
                        return true
                    }
                ) + 1;
            } catch (e) {
                if (e === 0)
                    return 0;
                throw e;
            }
        } else {
            let _last = yield* this._findString_startingAt_( _subString,  _start);
            if ((yield* _last._eq( 0)).booleanValueOf("ifTrue:ifFalse:")) {
                return 0;
            } else {
                let _now = _last;
                _last = yield* this._findString_startingAt_( _subString,  yield* _last._add( 1));
                while ((yield* _last._gt( 0)).booleanValueOf("whileTrue:")) {
                    _now = _last;
                    _last = yield* this._findString_startingAt_( _subString,  yield* _last._add( 1));
                    if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>findLastOccurrenceOfString:startingAt:, checking interrupts:", false, true);
                }
                return _now;
            }
        }
    },

    *_findString_startingAt_caseSensitive_(_key, _start, _caseSensitive) {
        /*Answer the index in this String at which the substring key first occurs,
        at or beyond start. The match can be case-sensitive or not. If no match
        is found, zero will be returned.*/
        /*IMPLEMENTATION NOTE: do not use CaseSensitiveOrder because it is broken for WideString
        This is a temporary work around until Wide CaseSensitiveOrder search is fixed
        Code should revert to:
        caseSensitive
            ifTrue: [^ self findSubstring: key in: self startingAt: start matchTable: CaseSensitiveOrder]
            ifFalse: [^ self findSubstring: key in: self startingAt: start matchTable: CaseInsensitiveOrder]*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>findString:startingAt:caseSensitive:", false, false);
            if (e) yield* e._signal()}

        if (_key instanceof SmalltalkGlobals._String) {
            if (_caseSensitive.booleanValueOf("ifTrue:ifFalse:")) {
                if (!this.dirty && !_key.dirty) {
                    return _key.string.length === 0 ? 0 : this.string.indexOf(_key.string, _start - 1) + 1;
                }
                const thisStorage = this[this.storageType], thisLen = thisStorage.length,
                    _keyStorage = _key[_key.storageType], _keyLen = _keyStorage.length, maxOffset = thisLen - _keyLen + 1;
                if (maxOffset < _start || _keyLen === 0)
                    return 0;
                const _keyFirst = _keyStorage[0];
                try {
                    return Array.prototype.findIndex.call(thisStorage,
                        (element, index, array) => {
                            if (index < _start - 1)
                                return false;
                            if (maxOffset < index)
                                throw 0;
                            if (element !== _keyFirst)
                                return false;
                            for (let i = 1; i < _keyLen; i++)
                                if (array[index + i] !== _keyStorage[i])
                                    return false;
                            return true
                        }
                    ) + 1;
                } catch (e) {
                    if (e === 0)
                        return 0;
                    throw e;
                }
            } else {
                return this.storageType === 'bytes' && _key.storageType === 'bytes' ? (yield* this._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    CaseInsensitiveOrder)) : (yield* (yield* SmalltalkGlobals._WideString._new())._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    CaseInsensitiveOrder));
            }
        } else {
            if (_caseSensitive.booleanValueOf("ifTrue:ifFalse:")) {
                return ((yield* this._class()._isBytes()).booleanValueOf("and:") && (yield* _key._class()._isBytes())).booleanValueOf("questionMark:colon:") ? (yield* this._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    CaseSensitiveOrder)) : (yield* (yield* SmalltalkGlobals._WideString._new())._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    nil));
            } else {
                return ((yield* this._class()._isBytes()).booleanValueOf("and:") && (yield* _key._class()._isBytes())).booleanValueOf("questionMark:colon:") ? (yield* this._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    CaseInsensitiveOrder)) : (yield* (yield* SmalltalkGlobals._WideString._new())._findSubstring_in_startingAt_matchTable_(
                    _key,
                    this,
                    _start,
                    CaseInsensitiveOrder));
            }
        }
    },

    *_ge(_aString) {
        /*Answer whether the receiver sorts after or equal to aString.
        The collation order is simple ascii (with case differences).*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>> >=", false, false);
            if (e) yield* e._signal()}

        return _aString instanceof SmalltalkGlobals._String ? this.valueOf() >= _aString.valueOf() : (yield* this._compareWith_(_aString)) >= 0;
    },

    *_gt(_aString) {
        /*Answer whether the receiver sorts after aString.
        The collation order is simple ascii (with case differences).*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>> >", false, false);
            if (e) yield* e._signal()}

        return _aString instanceof SmalltalkGlobals._String ? this.valueOf() > _aString.valueOf() : (yield* this._compareWith_(_aString)) > 0;
    },

    *_isAllDigits() {
        /*whether the receiver is composed entirely of digits*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>isAllDigits", false, false);
            if (e) yield* e._signal()}

        return /^\p{Nd}*$/u.test(this.valueOf());
    },

    *_isAllSeparators() {
        /*whether the receiver is composed entirely of separators*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>isAllSeparators", false, false);
            if (e) yield* e._signal()}

        return /^[ \t\n\r\f]*$/.test(this.valueOf());
    },

    *_isAsciiString() {
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>isAsciiString", false, false);
            if (e) yield* e._signal()}

        const storage = this[this.storageType];
        for (let e of storage)
            if (e >= 128)
                return false;
        return true;
    },

    *_isOctetString() {
        /*Answer whether the receiver can be represented as a byte string.
        This is different from asking whether the receiver //is// a ByteString
        (i.e., #isByteString)*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>isOctetString", false, false);
            if (e) yield* e._signal()}

        const storage = this[this.storageType];
        for (let e of storage)
            if (e >= 256)
                return false;
        return true;
    },

    *_le(_aString) {
        /*Answer whether the receiver sorts before or equal to aString.
        The collation order is simple ascii (with case differences).*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>> <=", false, false);
            if (e) yield* e._signal()}

        return _aString instanceof SmalltalkGlobals._String ? this.valueOf() <= _aString.valueOf() : (yield* this._compareWith_(_aString)) <= 0;
    },

    *_lt(_aString) {
        /*Answer whether the receiver sorts before aString.
        The collation order is simple ascii (with case differences).*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>> <", false, false);
            if (e) yield* e._signal()}

        return _aString instanceof SmalltalkGlobals._String ? this.valueOf() < _aString.valueOf() : (yield* this._compareWith_(_aString)) < 0;
    },

    *_numArgs() {
        /*Answer either the number of arguments that the receiver would take if considered a selector.  Answer -1 if it couldn't be a selector. It is intended mostly for the assistance of spelling correction.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>numArgs, checking interrupts:", false, false);

        const val = this.valueOf();
        if (/^[+/\\*~<>=@,%|&?!-]/.test(val)) {
            if (/^[+/\\*~<>=@,%|&?!-]+$/.test(val)) {
                return 1;
            }
            return -1;
        } else {
            if (AllowUnderscoreSelectors[1] || this instanceof SmalltalkGlobals._Symbol) {
                if (/^([\p{L}_][\p{L}\p{N}_]*:)+$/u.test(val)) {
                    const regex = /:/g;
                    let i = 0;
                    for (; regex.test(val); i++);
                    return i;
                    } else if (/^(_+[\p{L}\p{N}][\p{L}\p{N}_]*|\p{L}[\p{L}\p{N}_]*)$/u.test(val))
                        return 0;
                    else
                        return -1;
            } else {
                if (/^(\p{L}[\p{L}\p{N}]*:)+$/u.test(val)) {
                    const regex = /:/g;
                    let i = 0;
                    for (; regex.test(val); i++);
                    return i;
                } else if (/^\p{L}[\p{L}\p{N}]*$/u.test(val))
                return 0;
            else
                return -1;
            }
        }
    },

    _printOn_: function *_printOn_(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>printOn:, checking interrupts:", false, false);
            if (e) yield* e._signal()}

        yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from("'" + this.valueOf().replaceAll("'", "''") + "'"));
        return this;
    },

    _printString: function *_printString(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Object>>printString, checking interrupts:", false, false);
            if (e) yield* e._signal()}

        return SmalltalkGlobals._ByteString.from("'" + this.valueOf().replaceAll("'", "''") + "'");
    },

    *_startsWithDigit() {
        /*Answer whether the receiver's first character represents a digit*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>startsWithDigit", false, false);
            if (e) yield* e._signal()}

        return /^\p{Nd}/u.test(this.valueOf());
    },

    _storeOn_: function *_storeOn_(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>storeOn:, checking interrupts:", false, false);
            if (e) yield* e._signal()}

        if (this.storageType === 'bytes')
            yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from("'" + this.valueOf().replaceAll("'", "''") + "'"));
        else {
            const array = [39];
            for (const c of this.words) {
                if (c === 39)
                    array.push(39);
                array.push(c);
            }
            array.push(39);
            yield* _aStream._nextPutAll_( SmalltalkGlobals._WideString.fromWords(array));
        }
        return this;
    },

    _storeString: function *_storeString(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Object>>storeString, checking interrupts:", false, false);
            if (e) yield* e._signal()}

        if (this.storageType === 'bytes')
            return SmalltalkGlobals._ByteString.from("'" + this.valueOf().replaceAll("'", "''") + "'");
        else {
            const array = [39];
            for (const c of this.words) {
                if (c === 39)
                    array.push(39);
                array.push(c);
            }
            array.push(39);
            return SmalltalkGlobals._WideString.fromWords(array);
        }
    },

    *_translateToLowercase() {
        /*Translate all characters to lowercase, in place*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>translateToLowercase", false, false);
            if (e) yield* e._signal()}

        const toLowerCase = this._class().from(this.valueOf().toLowerCase());
        if (toLowerCase.storageType === "bytes") {
            this.bytes = toLowerCase.bytes;
        } else {
            this.words = toLowerCase.words;
        }
        this.string = toLowerCase.string;
        this.dirty = false;
        return this;
    },

    *_translateToUppercase() {
        /*Translate all characters to uppercase, in place*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>translateToUppercase", false, false);
            if (e) yield* e._signal()}

        const toUpperCase = this._class().from(this.valueOf().toUpperCase());
        if (toUpperCase.storageType === "bytes") {
            this.bytes = toUpperCase.bytes;
        } else {
            this.words = toUpperCase.words;
        }
        this.string = toUpperCase.string;
        this.dirty = false;
        return this;
    },

    *_truncateTo_(_smallSize) {
        /*return myself or a copy shortened to smallSize.  1//18//96 sw*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("String>>truncateTo:", false, false);
            if (e) yield* e._signal()}

        if (!(yield* (yield* this._size())._le( _smallSize)).booleanValueOf("ifFalse:")) {
            return this._class().from(this.valueOf().slice(0, _smallSize));
        }
        return this;
    },

});


Object.override(SmalltalkGlobals._String.constructor.prototype, {

    _adoptInstance_: function *_adoptInstance_(_anObject) {
        yield* SmalltalkGlobals._Behavior.prototype._adoptInstance_.call(this, _anObject);
        _anObject.dirty = true;
        return this;
    }
});
