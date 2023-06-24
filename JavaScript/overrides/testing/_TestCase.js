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

Object.override(SmalltalkGlobals._TestCase.prototype, {

    _assert_: function *_assert_(_aBooleanOrBlock) {
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("TestCase>>assert:, checking interrupts:", false, false);

        if (!(yield* _aBooleanOrBlock._value()).booleanValueOf("ifFalse:")) {
            const message = SmalltalkGlobals._ByteString.from('Assertion failed for ' + this.constructor.name + '.' + this.pointers[0].valueOf());
            yield* this._signalFailure_( message);
        }
        return this;
    },

    _assert_description_: function *_assert_description_(_aBooleanOrBlock, _aStringOrBlock) {
        let _description = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("TestCase>>assert:description:, checking interrupts:", false, false);

        if (!(yield* _aBooleanOrBlock._value()).booleanValueOf("ifFalse:")) {
            _description = yield* _aStringOrBlock._value();
            yield* this._logFailure_( _description);
            const message = SmalltalkGlobals._ByteString.from('Assertion failed for ' + this.constructor.name + '.' + this.pointers[0].valueOf() + ', ' + _description.valueOf());
            yield* (yield* SmalltalkGlobals._TestResult._failure())._signal_( message);
        }
        return this;
    },

    _timeout_after_: function *_timeout_after_(_aBlock, _seconds) {
        /*Evaluate the argument block. Time out if the evaluation is not
        complete after the given number of seconds. Handle the situation
        that a timeout may occur after a failure (during debug)*/
        /*the block will be executed in the current process*/
        let _delay = nil, _watchdog = nil, _theProcess = nil;
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("TestCase>>timeout:after:, checking interrupts:", false, false);

        console.log("Starting test " + this.constructor.name + '.' + this.pointers[0].valueOf());
        _theProcess = yield* SmalltalkGlobals._Processor[1]._activeProcess();
        _delay = yield* SmalltalkGlobals._Delay._forSeconds_( _seconds);
        /*make a watchdog process*/
        const message = this.constructor.name + '.' + this.pointers[0].valueOf() + ' timed out after a scheduled ' + _seconds + 's delay, actually ';
        _watchdog = yield* ((function* zzzBlock1() {
            if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("TestCase>>timeout:after:, checking interrupts:", true, false);

            const t = Date.now();
            console.log("Starting the timeout watchdog for " + (_seconds * 1000) + "ms");
            yield* _delay._wait();
            console.log("The timeout watchdog was signalled after " + (Date.now() - t) + "ms vs " + (_seconds * 1000) + "ms scheduled, the watched evaluation is " + (_theProcess === nil ? "already done" : "still running, signalling exception"));
            /*wait for timeout or completion*/
            return (_theProcess._eqEq( nil)) ? nil : (yield* _theProcess._signalException_( yield* (yield* SmalltalkGlobals._TestFailure._new())._messageText_( SmalltalkGlobals._ByteString.from(message + (Date.now() - t) / 1000))));
        }).set(this, 2, _timeout_after_))._newProcess();
        /*Watchdog needs to run at high priority to do its job (but not at timing priority)*/
        yield* _watchdog._priority_( yield* (yield* SmalltalkGlobals._Processor[1]._timingPriority())._sub( 1));
        /*catch the timeout signal*/
        yield* _watchdog._resume();
        /*start up the watchdog*/
        try {
            const self = this;
            console.log("Starting test evaluation");
            return yield* _aBlock._on_do_(
                yield* (yield* SmalltalkGlobals._TestFailure._concat(SmalltalkGlobals._Error))._concat(SmalltalkGlobals._Halt),
                function* zzzBlock2(_ex) {
                    if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("TestCase>>timeout:after:, checking interrupts:", true, false);

                    console.log("Terminating the testcase evaluation because of exception " + _ex.constructor.name);
                    _theProcess = nil;
                    if (!(_ex instanceof SmalltalkGlobals._Halt) && !(_ex instanceof SmalltalkGlobals._TestFailure)) {
                        let message = _ex.pointers[0] === nil ? "" : _ex.pointers[0].valueOf();
                        const className = _ex.constructor.name;
                        if (className === "_MessageNotUnderstood")
                            message = "selector: #" + _ex.pointers[5].pointers[0].valueOf();
                        else if (className === "_SyntaxErrorNotification")
                            console.log("maybe breakpoint");
                        console.log("Error during test " + self.constructor.name + '.' + self.pointers[0].valueOf() + " - " + message + Error().stack.slice(5));
                    }
                    return yield* _ex._pass();
                });
        } catch (e) {
            if (!e.isNonLocalReturn && e !== "TERMINATE") {
                console.log("JavaScript error during test " + this.constructor.name + '.' + this.pointers[0].valueOf() + " - " + e + "\n" + e.stack);
                yield* SmalltalkVM.debug();
            }
            throw e;
        } finally {
            /*evaluate the receiver*/
            _theProcess = nil;
            /*it has completed, so ...*/
            console.log("Signalling the timeout watchdog delay semaphore in the testcase evaluation's finally block");
            yield* (yield* _delay._delaySemaphore())._signal();
        }
        return this;
    },

});