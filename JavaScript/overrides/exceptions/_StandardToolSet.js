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

Object.override(SmalltalkGlobals._StandardToolSet.constructor.prototype, {

    _handleSyntaxError_: function* _handleSyntaxError_(_aSyntaxErrorNotification) {
        /*Double dispatch. Let the current project manage processes, which usually calls back into #debugSyntaxError:.*/
        if (GlobalActivationCounter-- < 0) yield* CheckInterruptsOrException("StandardToolSet class>>handleSyntaxError:, checking interrupts:", false, false);

        const _code = yield* (yield* _aSyntaxErrorNotification._errorCode())._asString();
        console.log("Syntax error:");
        console.log(_code.valueOf());

        yield* SmalltalkVM.smalltalkDebug();
        return nil;
    },

})