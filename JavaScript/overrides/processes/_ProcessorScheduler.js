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

Object.override(SmalltalkGlobals._ProcessorScheduler.prototype, {

    _debugContext_title_full_contents_: function *_debugContext_title_full_contents_(_aContext, _title, _aBoolean, _contents) {
        /*Open a debugger on the currently running (i.e. genuine) process. Note that that process might actually simulate another process, which ends up here by checking #isActiveProcess. If no code simulation is involved, the genuine process will be suspended along the way -- and hopefully replaced to keep the system responsive. For the simulated case, an existing debugger should take over and leave the genuine process running, that is, simulating. Examples include (a) handling unhandled errors in a tool set and (b) introspecting thisContext to reveal dialog invocation.

            Processor debugWithTitle: 'Debug' full: false contents: 'Carpe Squeak!'

        Note that, outside code simulation, suspended processes can be debugged directly via Process >> #debugWithTitle:. */
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("ProcessorScheduler>>debugContext:title:full:contents:, checking interrupts:", false, false);

        const instvars = this.pointers;
        return ((yield* instvars[1]/* genuineProcess */._isTerminated()).booleanValueOf("and:")
                && ((yield* _title._isNil()).booleanValueOf("or:") || (yield* _title._beginsWith_('Debug it')))).booleanValueOf("questionMark:colon:")
            ? (yield* (yield* SmalltalkGlobals._Project._uiManager())._inform_('Nothing to debug. Process has terminated'))
            : (yield* SmalltalkGlobals._Debugger._openOn_context_label_contents_fullView_(
                instvars[1]/* genuineProcess */,
                _aContext,
                _title,
                _contents,
                _aBoolean));
    },

});
