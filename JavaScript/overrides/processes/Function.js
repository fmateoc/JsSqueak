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

Object.override(Function.prototype, {

    compiledMethodOrFuncParent: undefined,

    primitive_62_impl() {return [true, this.numCopiedValues]},

    *_clone() {
        return this
    },

    *_deepCopy() {
        return this
    },

    *_ensure_(_aBlock) {
        /*Evaluate a termination block after evaluating the receiver, regardless of
         whether the receiver's evaluation completes.  N.B.  This method is //not//
         implemented as a primitive.  Primitive 198 always fails.  The VM uses prim
         198 in a context's method as the mark for an ensure://ifCurtailed: activation.*/

//Start inlined primitive 198
        //this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
        if (this.length === 0 && typeof _aBlock === 'function' && _aBlock.length === 0)
            try {
                return yield* this();
            } finally {
                yield* _aBlock();
            }

//End inlined primitive 198

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>ensure:", false, false);

        if (this.length !== 0) {
            yield* this._numArgsError_( 0);
        }
        yield* this._primitiveFailed_(SmalltalkGlobals._ByteSymbol.from(`valueNoContextSwitch`));
        return this;
    },

    *_hasMethodReturn() {
        /*Answer whether the receiver has a method-return ('^') in its code.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>hasMethodReturn", false, false);

        return this.toString().includes("const nonLocalReturnException =");
    },

    *_ifCurtailed_(_aBlock) {
        /*Evaluate the receiver with an abnormal termination action.
         Evaluate aBlock only if execution is unwound during execution
         of the receiver.  If execution of the receiver finishes normally do
         not evaluate aBlock.  N.B.  This method is //not// implemented as a
         primitive.  Primitive 198 always fails.  The VM uses prim 198 in a
         context's method as the mark for an ensure://ifCurtailed: activation.*/

//Start inlined primitive 198
        //this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
        if (this.length === 0 && typeof _aBlock === 'function' && _aBlock.length === 0)
            try {
                return yield* this();
            } catch(e) {
                if (e === "TERMINATE" || e.isNonLocalReturn)
                    yield* _aBlock();
                throw e;
            }

//End inlined primitive 198

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>ifCurtailed:", false, false);

        if (this.length !== 0) {
            yield* this._numArgsError_( 0);
        }
        yield* this._primitiveFailed_(SmalltalkGlobals._ByteSymbol.from(`valueNoContextSwitch`));
        return this;
    },

    *_method() {
        if (this.compiledMethod)
            return this.compiledMethod;
        let current = this;
        while (typeof current.compiledMethodOrFuncParent === "function")
            current = current.compiledMethodOrFuncParent;
        return current.compiledMethodOrFuncParent || current.compiledMethod || nil;
    },

    *_newProcess() {
        /*Answer a Process running the code in the receiver. The process is not
        scheduled.*/
        /*Simulation guard*/
        /*primitiveFail*/

//Start inlined primitive 19
// SIMULATION GUARD
//End inlined primitive 19

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>newProcess", false, false);

        const process = yield* SmalltalkGlobals._Process._forContext_priority_(
            yield* (new SmalltalkGlobals._MethodContext(0))._setSender_receiver_method_closure_startpc_(
                nil,
                this.receiver,
                yield* this._method(),
                this,
                0),
            SmalltalkVM.activePriority);

        const self = this;
        process.generator = (function* () {
            try {
                const e = process.exception;
                process.exception = null;
                if (e === "DEBUGGER")
                    yield* SmalltalkVM.smalltalkDebug();
                else if (e === "TERMINATE")
                    throw "TERMINATE";
                else if (e) {
                    console.log("exception inserted in a process before it started running is being signalled, as the process was resumed");
                    yield* e._signal();
                }
                yield* self._value();
            } catch (e) {
                if (e === "TERMINATE") {
                    if ((yield* (yield* SmalltalkGlobals._Project._current())._uiProcess()) === process)
                        yield* SmalltalkVM.debug();
                    console.log("terminate request caught at the bottom of generator, terminated process with priority " + process.pointers[2] + ", " + process.name + process.stack);
                } else {
                    console.log("terminated process with priority " + process.pointers[2] + ", " + process.name + process.stack);
                    console.log("because of unhandled JavaScript error " + e);
                    console.log(e.stack);
                    yield* SmalltalkVM.debug();
                }
            } finally {
                process.pointers[1] = nil;
            }
            if (process === SmalltalkVM.activeProcess) {
                console.log("end of active process " + (process.name + process.stack));
                SmalltalkVM.activeProcess = SmalltalkVM.wakeHighestPriority();
                process.generator = undefined;
                /*Since control is now at the bottom, all unwnds have been run.  Simply yield.*/
                yield "PROCESS_TERMINATED\nswitching to process " + (SmalltalkVM.activeProcess.name + SmalltalkVM.activeProcess.stack);
            } else
                yield* SmalltalkVM.debug();
        })();

        const s = Error().stack;
        let startIndex = s.indexOf('at _forkAt_.next ');
        if (startIndex === -1)
            startIndex = s.indexOf('at _fork.next ');
        if (startIndex === -1)
            startIndex = s.indexOf('at _forkAt_named_.next ');
        if (startIndex === -1)
            startIndex = s.indexOf('at _forkNamed_.next ');
        if (startIndex === -1)
            startIndex = s.indexOf('at _newProcess.next ');
        startIndex = s.indexOf('\n', startIndex);
        let finalIndex = s.indexOf('._startUp ');
        if (finalIndex === -1)
            finalIndex = s.indexOf('._startUp_ ');
        if (finalIndex === -1)
            finalIndex = s.indexOf('at http://');
        if (finalIndex === -1)
            finalIndex = s.indexOf('at Object.<anonymous> ');
        if (finalIndex === -1)
            finalIndex = startIndex + 1;
        finalIndex = s.indexOf('\n', finalIndex) + 1 || s.length;
        process.stack = s.slice(startIndex, finalIndex);
        if (!process.stack)
            yield* SmalltalkVM.debug();
        return process;
    },

    *_newProcessWith_(_anArray) {
        /*Answer a Process running the code in the receiver. The process is not
        scheduled.*/
        /*Simulation guard*/
        /*primitiveFail*/

//Start inlined primitive 19
// SIMULATION GUARD
//End inlined primitive 19

        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("BlockClosure>>newProcesWith:", false, false);

        const process = yield* SmalltalkGlobals._Process._forContext_priority_(
            yield* (new SmalltalkGlobals._MethodContext(0))._setSender_receiver_method_closure_startpc_(
                nil,
                this.receiver,
                yield* this._method(),
                this,
                0),
            SmalltalkVM.activePriority);

        const self = this;
        process.generator = (function* () {
            try {
                const e = process.exception;
                process.exception = null;
                if (e === "DEBUGGER")
                    yield* SmalltalkVM.smalltalkDebug();
                else if (e === "TERMINATE")
                    throw "TERMINATE";
                else if (e) {
                    console.log("exception inserted in a process before it started running is being signalled, as the process was resumed");
                    yield* e._signal();
                }
                yield* self._valueWithArguments_( _anArray);
            } catch (e) {
                if (e === "TERMINATE") {
                    if ((yield* (yield* SmalltalkGlobals._Project._current())._uiProcess()) === process)
                        yield* SmalltalkVM.debug();
                    console.log("terminate request caught at the bottom of generator, terminated process with priority " + process.pointers[2] + ", " + process.name + process.stack);
                } else {
                    console.log("terminated process with priority " + process.pointers[2] + ", " + process.name + process.stack);
                    console.log("because of unhandled JavaScript error " + e);
                    console.log(e.stack);
                    yield* SmalltalkVM.debug();
                }
            } finally {
                process.pointers[1] = nil;
            }
            if (process === SmalltalkVM.activeProcess) {
                console.log("end of active process " + (process.name || process.stack));
                SmalltalkVM.activeProcess = SmalltalkVM.wakeHighestPriority();
                process.generator = undefined;
                /*Since control is now at the bottom, all unwnds have been run.  Simply yield.*/
                yield "PROCESS_TERMINATED\nswitching to process " + (SmalltalkVM.activeProcess.name || SmalltalkVM.activeProcess.stack);
            } else
                yield* SmalltalkVM.debug();
        })();

        const s = Error().stack;
        process.stack = s.slice(s.indexOf('\n', s.indexOf('_newProcessWith_.next')));
        return process;
    },

    *_nextInstance() {
        return nil
    },

    *_numArgs() {
        /*Answer the number of arguments that must be used to evaluate this block*/
        return this.length;
    },

    _outerContext: function *_outerContext() {
        return nil;
    },

    _printOn_: function *_printOn_(_aStream) {
        let string = '[closure] in ';
        let current = this;
        while (typeof current.compiledMethodOrFuncParent === "function") {
            current = current.compiledMethodOrFuncParent;
            string += '[] in ';
        }
        const compiledMethod = current.compiledMethodOrFuncParent || current.compiledMethod || nil;
        if (compiledMethod !== nil && this.receiver) {
            string += yield* this.receiver._class()._name();
            const methodClass = yield* compiledMethod._methodClass();
            if (methodClass !== this.receiver._class())
                string += '(' + (yield* methodClass._name()) + ')';
        } else
            string += 'unknown method';
        yield* _aStream._nextPutAll_(SmalltalkGlobals._ByteString.from(string));
    },

    *_receiver() {
        return this.receiver || nil;
    },

    *_scaledIdentityHash() {
        try {
            return (this.hash || (this.hash = Math.floor(Math.random() * 0x10000000))) * 4;
        } catch (e) {
            yield* SmalltalkVM.debug();
        }
    },

    _sender: function *_sender() {
        return nil;
    },

    *_shallowCopy() {
        return this
    },

    *_startpc() {
        return this.compiledMethod ? (yield* this.compiledMethod._initialPC()) : this.startpc || 0;
    },

    *_veryDeepCopyWith_(_deepCopier) {
        return this
    },

})


