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

Object.override(SmalltalkGlobals._FileDirectory.prototype, {

_writeSourceCodeFrom_baseName_isSt_useHtml_: function *_writeSourceCodeFrom_baseName_isSt_useHtml_(_aStream, _baseName, _stOrCsFlag, _useHtml) {
    /*Write the source code from aStream into a file.*/
    let _extension = nil;
    if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("FileDirectory>>writeSourceCodeFrom:baseName:isSt:useHtml:, checking interrupts:", false, false);

    if ((yield* (yield* _aStream._contents())._isAsciiString()).booleanValueOf("ifTrue:ifFalse:")) {
        _extension = _stOrCsFlag.booleanValueOf("questionMark:colon:") ? (yield* (yield* SmalltalkGlobals._FileDirectory._dot())._concat( yield* SmalltalkGlobals._FileStream._st())) : (yield* (yield* SmalltalkGlobals._FileDirectory._dot())._concat( yield* SmalltalkGlobals._FileStream._cs()));
    } else {
        _extension = _stOrCsFlag.booleanValueOf("questionMark:colon:") ? (yield* (yield* SmalltalkGlobals._FileDirectory._dot())._concat( yield* SmalltalkGlobals._FileStream._st())) : (yield* (yield* SmalltalkGlobals._FileDirectory._dot())._concat( yield* SmalltalkGlobals._FileStream._cs()));
    }
    let _fileName = _useHtml.booleanValueOf("questionMark:colon:") ? (yield* _baseName._concat( SmalltalkGlobals._ByteSymbol.from(".html"))) : (yield* _baseName._concat( _extension));
    _fileName = yield* this._checkName_fixErrors_( _fileName,  true);
    Squeak.download(_fileName.valueOf(), (yield* _aStream._contents()).valueOf());
    return this;
},
});