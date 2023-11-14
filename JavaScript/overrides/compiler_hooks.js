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

const original_generate_using_ = SmalltalkGlobals._MethodNode.prototype._generate_using_;

Object.override(SmalltalkGlobals._MethodNode.prototype, {

    *_generate_using_(_trailer, _aCompiledMethodClass) {
        const prepared = yield* (yield* this._prepareForImageSideGeneration())._asCleanedUpParseTree();
        const emptyTrailer = yield* SmalltalkGlobals._CompiledMethodTrailer._empty();
        const cm = yield* original_generate_using_.call(prepared, emptyTrailer, SmalltalkGlobals._CompiledMethod);
        this.pointers[7] = prepared.pointers[7];    //copy the initialized encoder

        cm.func = new Array(cm.literals[0] >>> 24 & 15);    //hack for the decompiler, which asks (in _JSPropertiesFor_) for numArgs (func's length), and our (real) func is not set up yet
        const props = yield* prepared._JSPropertiesFor_(cm);
        const jsSource = (yield* SmalltalkGlobals._String._streamContents_(
            function* (_s) {
                yield* prepared._printJSOn_properties_(_s, props);
            })).valueOf();
        const declaration = '(' + jsSource.slice(jsSource.indexOf('function'), jsSource.lastIndexOf('}') + 1) + ')';
        try {
            const func = eval(declaration);
            cm.func = func;
            func.literals = cm.literals;
            return func.compiledMethod = cm;
        } catch (e) {
            console.log("Error while evaluating function definition:");
            console.log(declaration);
            console.log(e);
            const lines = declaration.split(/\r?\n/);
            if (e.lineNumber !== undefined && e.lineNumber < lines.length && e.columnNumber !== undefined) {
                const line = lines[e.lineNumber];
                const lineWithError = line.slice(0, e.columnNumber) + ' ' + e.name + ': ' + e.message + ' ->' + line.slice(e.columnNumber);
                const sourceWithErrorMessage = lines.slice(0, e.lineNumber).concat(lineWithError).join('\n');
                const _notification = yield* SmalltalkGlobals._SyntaxErrorNotification._inClass_withCode_doitFlag_errorMessage_location_(
                    yield* this.pointers[7]/* encoder */._classEncoding(),
                    yield* SmalltalkGlobals._ByteString.from(sourceWithErrorMessage)._asText(),
                    (yield* this._selector()).valueOf() === '_DoIt',
                    SmalltalkGlobals._ByteString.from('JavaScript ' + e.name + ': ' + e.message),
                    sourceWithErrorMessage.indexOf(' ' + e.name + ': ' + e.message + ' ->') + 1);
                yield* _notification._signal();
                yield* _notification._tryNewSourceIfAvailable();
            } else
                yield* SmalltalkVM.debug();
        }
    }
});

SmalltalkGlobals._MethodNode.prototype._generate_using_.compiledMethod = original_generate_using_.compiledMethod;



const original_basicAddSelector_withMethod_ = SmalltalkGlobals._Behavior.prototype._basicAddSelector_withMethod_;

Object.override(SmalltalkGlobals._Behavior.prototype, {

    *_basicAddSelector_withMethod_(_selector, _compiledMethod) {
        yield* original_basicAddSelector_withMethod_.call(this, _selector, _compiledMethod);
        const methodHolder = this.prototype;
        const prop = SmalltalkUtils.mappingForSelector(_selector.valueOf());
        if (_compiledMethod instanceof SmalltalkGlobals._CompiledMethod) {
            if (Object.getOwnPropertyDescriptor(_compiledMethod, 'func').get)
                console.log("Lazily compiling the compiled method's func from its bytecodes");
            if (typeof _compiledMethod.func === 'function') {
                methodHolder[prop] = _compiledMethod.func;
                if (_compiledMethod.func.compiledMethod !== undefined && _compiledMethod.func.compiledMethod !== _compiledMethod)
                    yield* SmalltalkVM.debug();
                else {
                    _compiledMethod.func.compiledMethod = _compiledMethod;
                    _compiledMethod.func.literals = _compiledMethod.literals;
                }
            } else
                yield* SmalltalkVM.debug();
        } else {
            //objects as methods?
            methodHolder[prop] = function* () {
                return yield* _compiledMethod._run_with_in_(_selector, SmalltalkGlobals._Array.from([...arguments]), this)
            };
            methodHolder[prop].compiledMethod = _compiledMethod;
        }
        return this;
    }
});

SmalltalkGlobals._Behavior.prototype._basicAddSelector_withMethod_.compiledMethod = original_basicAddSelector_withMethod_.compiledMethod;


const original_generateWithTempNames = SmalltalkGlobals._MethodNode.prototype._generateWithTempNames;

Object.override(SmalltalkGlobals._MethodNode.prototype, {

    *_generateWithTempNames() {
        const cm = yield* original_generateWithTempNames.call(this);
        cm.func.literals = cm.literals;
        return cm.func.compiledMethod = cm;
    }
});

SmalltalkGlobals._MethodNode.prototype._generateWithTempNames.compiledMethod = original_generateWithTempNames.compiledMethod;


const original_removeSelector_ = SmalltalkGlobals._ClassDescription.prototype._removeSelector_;

Object.override(SmalltalkGlobals._ClassDescription.prototype, {

    *_removeSelector_(_selector) {
        const result = yield* original_removeSelector_.call(this, _selector);
        if (result === nil)
            return nil;
        const methodHolder = this.prototype;
        const prop = SmalltalkUtils.mappingForSelector(_selector.valueOf());
        if (methodHolder.hasOwnProperty(prop)) {
            delete methodHolder[prop];
        } else
            yield* SmalltalkVM.debug();
        return this;
    }
});

SmalltalkGlobals._ClassDescription.prototype._removeSelector_.compiledMethod = original_removeSelector_.compiledMethod;
