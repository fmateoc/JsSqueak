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

Object.override(SmalltalkGlobals._Debugger.constructor.prototype, {

    _openContext_label_contents_: function *_openContext_label_contents_(_aContext, _aString, _contentsStringOrNil) {
        /*Open a notifier in response to an error, halt, or notify. A notifier view just shows a short view of the sender stack and provides a menu that lets the user open a full debugger.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Debugger class>>openContext:label:contents:, checking interrupts:", false, false);

        yield* SmalltalkVM.smalltalkDebug();
        return nil;
    },

    _openInterrupt_onProcess_: function *_openInterrupt_onProcess_(_aString, _interruptedProcess) {
        /*Open a notifier in response to an interrupt. An interrupt occurs when the user types the interrupt key (cmd-. on Macs, ctrl-c or alt-. on other systems) or when the low-space watcher detects that memory is low.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Debugger class>>openInterrupt:onProcess:, checking interrupts:", false, false);

        if (_interruptedProcess === SmalltalkVM.activeProcess) {
            yield* SmalltalkVM.debug();    //should not happen
        } else {
            _interruptedProcess.exception = "DEBUGGER";
            GlobalActivationCounter = 0;
        }
        return nil;
    },

    _openOn_context_label_contents_fullView_: function *_openOn_context_label_contents_fullView_(_process, _context, _title, _contentsStringOrNil, _bool) {
        /*Open a notifier in response to an error, halt, or notify. A notifier view just shows a short
        view of the sender stack and provides a menu that lets the user open a full debugger.
        Dispatch the request to a method appropriate for the active project.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("Debugger class>>openOn:context:label:contents:fullView:, checking interrupts:", false, false);

        if (_process === SmalltalkVM.activeProcess) {
            yield* SmalltalkVM.smalltalkDebug();
        } else {
            _process.exception = "DEBUGGER";
            GlobalActivationCounter = 0;
        }
        return nil;
    },
})

