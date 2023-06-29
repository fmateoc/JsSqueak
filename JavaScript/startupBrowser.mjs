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

"use strict";

console.log(performance.memory);
console.log("Loading initial glue code")
await Promise.all([import('./glue/SmalltalkRef.js'), import('./glue/dnuProxy.js'), import('./glue/SmalltalkGlobals.js')]);
await import(`./generated/${imageName}/imageFormat.js`);
await import(`./generated/${imageName}/testExclusions.js`);
await import('./glue/coreBootstrap.js');

console.log("Loading translated Squeak image " + imageName);
let start = Date.now();

console.log("Loading generated classes (all the code, plus minimal reflection data)")
await import(`./generated/${imageName}/bootstrap.js`);
await import(`./generated/${imageName}/classes.mjs`);
await import(`./generated/${imageName}/mapped_types.mjs`);
await import(`./plugins.mjs`);
console.log("Elapsed " + -(start - (start = Date.now())) + "ms\n")

console.log("Loading more glue code");
await import('./glue/SmalltalkUtils.js');
await import('./glue/SmalltalkExceptionHandler.js');

console.log(performance.memory);
console.log("Loading serialized image state");
await import(`./generated/${imageName}/global_bindings.js`);
//close the loop between "Smalltalk organization" and the global "SystemOrganization", which both point to the same thing, from two different global roots,
//as early as possible, since many instvars (within all the browsers) also point to it (and they were stored as SmalltalkGlobals._SystemOrganization[1])
SmalltalkGlobals._SystemOrganization[1] = SmalltalkGlobals._Smalltalk[1].pointers[0].pointers[0].pointers[1];
await import(`./generated/${imageName}/serialized_Smalltalk_globals.js`);
console.log("Elapsed " + -(start - (start = Date.now())) + "ms\n")

console.log(performance.memory);
gc();

console.log("Loading manual overrides for the generated code")
await Promise.all([
    import('./overrides/allInstances.js'), import('./overrides/compiler_hooks.js'),

    import('./overrides/sorting/_ArrayedCollection.js'), import('./overrides/_Behavior.js'), import('./overrides/_BlockClosure.js'), import('./overrides/sorting/_ByteArray.js'),
    import('./overrides/characters/_Character.js'), import('./overrides/_ClassBuilder.js'), import('./overrides/_Color.js'), import('./overrides/_CompiledMethod.js'),
    import('./overrides/_CompiledBlock.js'), import('./overrides/exceptions/_Debugger.js'), import('./overrides/_Encoder.js'), import('./overrides/_Environment.js'),
    import('./overrides/exceptions/_Exception.js'), import('./overrides/_FileDirectory.js'), import('./overrides/numbers/_Float.js'), import('./overrides/_FullBlockClosure.js'),
    import('./overrides/_Generator.js'), import('./overrides/exceptions/_Halt.js'), import('./overrides/numbers/_LargeNegativeInteger.js'),import('./overrides/numbers/_LargePositiveInteger.js'),
    import('./overrides/_MethodDictionary.js'), import('./overrides/_MemorySourceFileArray.js'), import('./overrides/exceptions/_Object.js'), import('./overrides/exceptions/_OutOfMemory.js'),
    import('./overrides/processes/_Process.js'), import('./overrides/exceptions/_ProgressInitiationException.js'), import('./overrides/processes/_ProcessorScheduler.js'),
    import('./overrides/_ProtoObject.js'), import('./overrides/_Random.js'), import('./overrides/_RunArray.js'), import('./overrides/processes/_Semaphore.js'),
    import('./overrides/numbers/_SmallInteger.js'), import('./overrides/_SmalltalkImage.js'), import('./overrides/exceptions/_StandardToolSet.js'), import('./overrides/strings/_String.js'),
    import('./overrides/strings/_Symbol.js'), import('./overrides/testing/_TestCase.js'), import('./overrides/exceptions/_UnhandledError.js'), import('./overrides/exceptions/_UnhandledWarning.js'),

    import('./overrides/numbers/BigInt.js'), import('./overrides/Boolean.js'), import('./overrides/numbers/Float.js'), import('./overrides/processes/Function.js'),
    import('./overrides/numbers/Number.js'), import('./overrides/characters/String.js'),

    import('./overrides/plugins/B2DPlugin.js'), import('./overrides/plugins/FilePlugin.js'), import('./overrides/plugins/FloatArrayPlugin.js'), import('./overrides/numbers/LargeIntegers.js'),
    import('./overrides/plugins/Matrix2x3Plugin.js'), import('./overrides/strings/MiscPrimitivePlugin.js')
]);

console.log("Loading VM/scheduler");
globalThis.memoryLogger = () => console.log(performance.memory);
await import('./glue/SmalltalkVM.js');

Object.assign(globalThis.SmalltalkVM, {
    vmPath: "/",
    platformName: "unix",
    platformSubtype: "Browser",
    osVersion: navigator.userAgent,     // might want to parse
    windowSystem: "HTML",
    vmVersion: "JsSqueak",
    imageName: SmalltalkGlobals._ByteString.from(imageName)
});

globalThis.BitBltPlugin.initialiseModule();
globalThis.B2DPlugin.initialiseModule();
globalThis.KedamaPlugin.initialiseModule();
globalThis.KedamaPlugin2.initialiseModule();

await import('./vm.files.browser.js');

try {
    await navigator.clipboard.readText();   //ask for permission
} catch (e) {
}