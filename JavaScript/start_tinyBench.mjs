"use strict";

await import('./startupNode.mjs');

(function* () {
    console.log("Starting tinyBenchmarks");
    let start = Date.now();
    const n = 1;
    const result = yield* n._tinyBenchmarks();
    console.log(result.valueOf());
    console.log("Elapsed " + -(start - (start = Date.now())) + "ms");
})._forkAt_(50).next();
