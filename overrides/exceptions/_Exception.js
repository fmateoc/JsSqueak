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

Object.override(SmalltalkGlobals._Exception.prototype, {

    setReceiver(receiver, compiledMethod) {
        this.receiver = receiver;
        this.compiledMethod = compiledMethod;
        return this;
    },

    *_isNested() {
        /*Determine whether the current exception handler is within the scope of another handler for the same exception.*/
        const p = SmalltalkVM.activeProcess,
            handlers = p.exceptionHandlers;
        for (let i = handlers.indexOf(this.currentHandler) + 1; i < handlers.length; i++) {
            const handler = handlers[i];
            if (handler.canHandle(this)) {
                return true;
            }
        }
        return false;
    },

    *_outer() {
        /*Evaluate the enclosing exception action and return to here instead of signal if it resumes (see #resumeUnchecked:).*/
        return yield* this._signal();
    },

    *_pass() {
        /*Yield control to the enclosing exception action for the receiver.*/
        const p = SmalltalkVM.activeProcess,
            handlers = p.exceptionHandlers;
        for (let i = handlers.indexOf(this.currentHandler) + 1; i < handlers.length; i++) {
            const handler = handlers[i];
            if (handler.canHandle(this)) {
                return yield* handler.handle(this);
            }
        }
        if (!(this instanceof SmalltalkGlobals._Notification) && !(this instanceof SmalltalkGlobals._CurrentReadOnlySourceFiles)) {
            let message = this.pointers[0] === nil ? "" : this.pointers[0].valueOf();
            const className = this.constructor.name;
            if (className === "_MessageNotUnderstood")
                message = "selector: #" + this.pointers[5].pointers[0].valueOf();
            else if (className === "_SyntaxErrorNotification")
                console.log("SyntaxErrorNotification - maybe should be a breakpoint");
            console.log(message + Error().stack.slice(5));
        }
        return yield* nil._handleSignal_(this);
    },

    _rearmHandlerDuring_: function *_rearmHandlerDuring_(_aBlock) {
        /*Make the current error handler re-entrant while it is running aBlock. Only works in a closure-enabled image*/
        return yield* _aBlock._value();
    },

    *_receiver() {
        return this.receiver || nil;
    },

    *_resignalAs_(_replacementException) {

        throw (this.resumeException = Object.create(NonLocalReturn)).setPayload(yield* _replacementException._signal());
    },

    *_resumeEvaluating_(_aBlock) {
        /*Return resumptionValue as the value of #signal, unless this was called after an #outer message, then return resumptionValue as the value of #outer.*/

        throw (this.resumeException = Object.create(NonLocalReturn)).setPayload(yield* _aBlock._value());
    },

    *_resumeUnchecked_(_resumptionValue) {
        /*Return resumptionValue as the value of #signal, unless this was called after an #outer message, then return resumptionValue as the value of #outer.*/

//	(self isKindOf: ParserNotification) ifTrue: [
// 		Transcript cr; show: 'Resuming parser notification ', self class, ((self instVarAt: Notification instSize + 1) ifNotNil: [:n | ' ', n]); cr].
        if (this instanceof SmalltalkGlobals._ParserNotification)
            console.log('Resuming parser notification ' + this.constructor.name + ' ' + (this.pointers[5] === nil ? '' : this.pointers[5].valueOf()))
        throw (this.resumeException = Object.create(NonLocalReturn)).setPayload(_resumptionValue);
    },

    *_retry() {
        /*Abort an exception handler and re-evaluate its protected block.*/

        this.currentHandler.restart();
    },

    *_retryUsing_(_alternativeBlock) {
        /*Abort an exception handler and evaluate a new block in place of the handler's protected block.*/

        this.currentHandler.restart(_alternativeBlock);
    },

    *_return_(_returnValue) {
        /*Return the argument as the value of the block protected by the active exception handler.*/

        this.currentHandler.exitWith(_returnValue);
    },

    *_signal() {
        /*Ask ContextHandlers in the sender chain to handle this signal.  The default is to execute and return my defaultAction.*/
        let message = this.pointers[0];
        if (message === nil)
            message = "";
        else{
            message = message.valueOf();
            if (this instanceof SmalltalkGlobals._TestFailure)
                console.log(message + Error().stack.slice(5));
        }
        try {
            const p = SmalltalkVM.activeProcess,
                handlers = p.exceptionHandlers;
            for (let i = handlers.indexOf(this.currentHandler) + 1; i < handlers.length; i++) {
                const handler = handlers[i];
                if (handler.canHandle(this)) {
                    yield* handler.handle(this);
                    yield* SmalltalkVM.debug(); //should never reach
                }
            }
            if (!(this instanceof SmalltalkGlobals._Notification) && !(this instanceof SmalltalkGlobals._CurrentReadOnlySourceFiles)) {
                const className = this.constructor.name;
                if (className === "_MessageNotUnderstood")
                    message = "selector: #" + this.pointers[5].pointers[0].valueOf();
                else if (className === "_SyntaxErrorNotification")
                    console.log("SyntaxErrorNotification - maybe should be a breakpoint");
                console.log(message + Error().stack.slice(5));
            }
            return yield* nil._handleSignal_(this);
        } catch(aJavaScriptException) {
            if(aJavaScriptException === this.resumeException) {
                return this.resumeException.payload;
            } else
                throw aJavaScriptException;
        }
    },

    _signalerContext: function *_signalerContext() {
        /*Find the first sender of signal(:)*/
        return SmalltalkGlobals._MethodContext.from([nil, nil, 0, this.compiledMethod || nil, nil, this.receiver || nil]);
    }
});
