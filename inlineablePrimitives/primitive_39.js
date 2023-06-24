    const arg1Val = typeof arg1 === "object" ? arg1.valueOf() : arg1;
    if(arg1Val === 1 || arg1Val === 2) {
        if (typeof this === "number" || this instanceof Number) {
            //Floats are immediates in JavaScript, therefore not modifiable
            yield* SmalltalkVM.debug();
        } else if (this.words === undefined)
            yield* SmalltalkVM.debug();
        else {
            const arg2Val = typeof arg2 === "object" ? arg2.valueOf() : arg2;
            if ((arg2Val >>> 0) === arg2Val && arg2._class() !== SmalltalkGlobals._Float) {
                new DataView(this.words.buffer).setUint32(arg1Val == 1 ? 0 : 4, arg2Val, false);
                this.dirty = true;
                return arg2Val
            }
        }
    }
