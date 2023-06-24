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

Object.override(SmalltalkGlobals._Symbol.prototype, {

    *_eq(_aString) {
        /*Answer whether the receiver sorts equally as aString.
        The collation order is simple ascii (with case differences).*/

        if (this === _aString)
            return true;
        if (this._class() === _aString._class())
            return false;
        return this.valueOf() === _aString.valueOf();
    },

    _printOn_: function *_printOn_(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        let _x = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>printOn:, checking interrupts:", false, false);

        let escapedString = this.valueOf().replaceAll("'", "''");
        if (!(yield* SmalltalkGlobals._Scanner._isLiteralSymbol_(this)))
            escapedString = "'" + escapedString + "'";
        yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from("#" + escapedString));
        return this;
    },

    _printString: function *_printString(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        let _x = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>printString, checking interrupts:", false, false);

        let escapedString = this.valueOf().replaceAll("'", "''");
        if (!(yield* SmalltalkGlobals._Scanner._isLiteralSymbol_(this)))
            escapedString = "'" + escapedString + "'";
        return SmalltalkGlobals._ByteString.from("#" + escapedString);
    },

    _storeOn_: function *_storeOn_(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        let _x = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>storeOn:, checking interrupts:", false, false);

        let escapedString = this.valueOf().replaceAll("'", "''");
        if (!(yield* SmalltalkGlobals._Scanner._isLiteralSymbol_(this)))
            escapedString = "'" + escapedString + "'";
        yield* _aStream._nextPutAll_( SmalltalkGlobals._ByteString.from("#" + escapedString));
        return this;
    },

    _storeString: function *_storeString(_aStream) {
        /*Print inside string quotes, doubling inbedded quotes.*/
        let _x = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>storeString, checking interrupts:", false, false);

        let escapedString = this.valueOf().replaceAll("'", "''");
        if (!(yield* SmalltalkGlobals._Scanner._isLiteralSymbol_(this)))
            escapedString = "'" + escapedString + "'";
        return SmalltalkGlobals._ByteString.from("#" + escapedString);
    },

    *_translateToLowercase() {
        /*Translate all characters to lowercase, in place*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>translateToLowercase", false, false);

        yield* this._shouldNotImplement();
    },

    *_translateToUppercase() {
        /*Translate all characters to uppercase, in place*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("String>>translateToUppercase", false, false);

        yield* this._shouldNotImplement();
    },

})

Object.override(SmalltalkGlobals._Symbol.constructor.prototype, {
    *_allSymbolTablesDo_(_aBlock) {
        const allSymbols = SmalltalkGlobals._Symbol.allSymbols;
        for (const s in allSymbols) {
            const _symbol = allSymbols[s].deref();
            if (_symbol)
                yield* _aBlock._value_(_symbol);
        }
    },

    *_allSymbolTablesDo_after_(_aBlock, _aSymbol) {
        const allSymbols = SmalltalkGlobals._Symbol.allSymbols;
        const primString = _aSymbol.valueOf();
        if (_aSymbol === nil || allSymbols[primString] === undefined)
            for (const s in allSymbols) {
                const _symbol = allSymbols[s].deref();
                if (_symbol)
                    yield* _aBlock._value_(_symbol);
            }
        else {
            let found = false;
            for (const s in allSymbols) {
                if (found) {
                    const _symbol = allSymbols[s].deref();
                    if (_symbol)
                        yield* _aBlock._value_(_symbol);
                } else
                    found = s === primString;
            }
        }
    },

    *_allSymbols() {
        return SmalltalkGlobals._Array.from(Object.values(SmalltalkGlobals._Symbol.allSymbols).map(s => s.deref()).filter(s => s !== undefined));
    },

    *_compactSymbolTable() {
        const allSymbols = SmalltalkGlobals._Symbol.allSymbols;
        const newSymbols = Object.create(null);
        for (const s in allSymbols) {
            const _symbol = allSymbols[s].deref();
            if (_symbol)
                newSymbols[s] = _symbol;
        }
    },

    *_intern_(_aStringOrSymbol) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Symbol class>>newProcess", false, false);

        const primitiveString = _aStringOrSymbol.valueOf();
        const allSymbols = SmalltalkGlobals._Symbol.allSymbols;
        if(primitiveString in allSymbols) {
            const result = allSymbols[primitiveString].deref();
            if(result !== undefined) return result;
        }
        let _aSymbol = nil;
        if ((yield* _aStringOrSymbol._isSymbol()).booleanValueOf("ifTrue:ifFalse:")) {
            _aSymbol = _aStringOrSymbol;
        } else {
            if ((yield* _aStringOrSymbol._isOctetString()).booleanValueOf("questionMark:colon:")) {
                _aSymbol = new SmalltalkGlobals._ByteSymbol;
                _aSymbol.string = primitiveString;
                const bytes = new Uint8Array(primitiveString.length);
                let p = 0;
                for (const c of primitiveString)
                    bytes[p++] = c.codePointAt(0);
                _aSymbol.bytes = bytes;

            } else {
                _aSymbol = new SmalltalkGlobals._WideSymbol;
                _aSymbol.string = primitiveString;
                let out = [], p = 0;
                for (const c of primitiveString)
                    out[p++] = c.codePointAt(0);
                _aSymbol.words = Uint32Array.from(out);

            }
        }
        allSymbols[primitiveString] = new WeakRef(_aSymbol);
        return _aSymbol;
    },

    *_lookup_(_aStringOrSymbol) {
        const primitiveString = _aStringOrSymbol.valueOf();
        const allSymbols = SmalltalkGlobals._Symbol.allSymbols;
        if(primitiveString in allSymbols) {
            const result = allSymbols[primitiveString].deref();
            if(result !== undefined) return result;
        }
        return nil;
    },

    *_rehash() {
    }
})