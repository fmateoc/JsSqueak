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


Object.override(SmalltalkGlobals._Object.prototype, {

    _break: function *_break() {
        /*This is a simple message to use for inserting breakpoints during debugging.
        The debugger is opened by sending a signal. This gives a chance to restore
        invariants related to multiple processes.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>break, checking interrupts:", false, false);

        yield* (yield* SmalltalkGlobals._BreakPoint._new()).setReceiver(this, _break.compiledMethod)._signal();
        /*nil break.*/
        debugger;
        GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
        return this;
    },

    _halt: function *_halt() {
        /*This is the typical message to use for inserting breakpoints during
        debugging. It behaves like halt:, but does not call on halt: in order to
        avoid putting this message on the stack. Halt is especially useful when
        the breakpoint message is an arbitrary one.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>halt, checking interrupts:", false, false);

        yield* (yield* SmalltalkGlobals._Halt._new()).setReceiver(this, _halt.compiledMethod)._signal();
        debugger;
        GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
        return this;
    },

    _halt_: function *_halt_(_aString) {
        /*This is the typical message to use for inserting breakpoints during
        debugging. It creates and schedules a Notifier with the argument,
        aString, as the label.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>halt:, checking interrupts:", false, false);

        yield* (yield* SmalltalkGlobals._Halt._new()).setReceiver(this, _halt_.compiledMethod)._signal_( _aString);
        debugger;
        GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
        return this;
    },

    _haltIf_: function *_haltIf_(_condition) {
        /*This is the typical message to use for inserting breakpoints during
        debugging.  Param can be a block or expression, halt if true.
        If the Block has one arg, the receiver is bound to that.
         If the condition is a selector, we look up in the callchain. Halt if
          any method's selector equals selector.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Object>>haltIf:, checking interrupts:", false, false);

        if ((yield* _condition._isSymbol()).booleanValueOf("ifTrue:ifFalse:")) {
            /*only halt if a method with selector symbol is in callchain*/
            //We don't know how to walk the call chain in JavaScript, just halt here
            yield* (yield* SmalltalkGlobals._Halt._new()).setReceiver(this, _haltIf_.compiledMethod)._signal();
            debugger;
            GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
        } else {
            let _zzzTemp = (yield* _condition._isBlock()).booleanValueOf("questionMark:colon:") ? (yield* _condition._cull_( this)) : _condition;
            if (_zzzTemp.booleanValueOf("ifTrue:")) {
                yield* (yield* SmalltalkGlobals._Halt._new()).setReceiver(this, _haltIf_.compiledMethod)._signal();
                debugger;
                GlobalActivationCounter = SmalltalkVM.SkippedForDebugging;
            }
        }
        return this;
    },

})