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

Object.override(SmalltalkGlobals._Semaphore.prototype, {

    *_initSignals() {
        /*Consume any excess signals the receiver may have accumulated.*/
        if (GlobalActivationCounter-- < 0) {
            const e = yield* CheckInterruptsOrException("Semaphore>>initSignals", false, false);
            if (e) yield* e._signal()}

        const instvars = this.pointers;
        if (instvars[2] === nil && this.name !== 'TimingSemaphore') {
            let s = Error().stack;
            let start = s.indexOf('._forMutualExclusion ');
            if (start === -1) {
                start = s.indexOf('._new ');
                if (start === -1)
                    yield* SmalltalkVM.debug();
            }
            let end = s.indexOf('\n', s.indexOf('at ', start));
            const nextLine = s.indexOf('at ', end);
            if (s.startsWith('at _SharedQueue._initialize_ ', nextLine) || s.startsWith('at _Mutex._initialize ', nextLine) || s.startsWith('at _Monitor._initialize ', nextLine))
                end = s.indexOf('at ', s.indexOf('t _new.next ', end));
            else {
                let indexOfFor = s.indexOf('._forMilliseconds_', nextLine), indexOfNewline = s.indexOf('\n', indexOfFor);
                if (indexOfFor === -1 || indexOfFor > indexOfNewline) {
                    indexOfFor = s.indexOf('._forSeconds_', nextLine);
                    indexOfNewline = s.indexOf('\n', indexOfFor);
                }
                if (indexOfFor !== -1 && indexOfFor < indexOfNewline) {
                    this.name = 'a Delay semaphore';
                    s = '';
                }
            }
            this.stack = s === '' ? ' ' : s.slice(s.indexOf('\n', start), s.indexOf('\n', end + 1));
            if (!this.stack)
                yield* SmalltalkVM.debug();
        }
        instvars[2] = 0;

        return this;
    }

})