    const arg1Val = arg1.valueOf(), arg2Val = arg2.valueOf();
    if (arg1Val > 0 && (arg1Val | 0) === arg1Val && (typeof arg2Val === "number" || typeof arg2Val === "bigint")) {
        const storage = this.words ? this.wordsAsFloat32Array() : (this.float64Array ? this.float64Array : undefined);
        if (storage) {
            const previous = storage[arg1Val - 1];
            if (previous !== undefined) {
                const next = Number(arg2Val);
                storage[arg1Val - 1] = next;
                if (storage[arg1Val - 1] === next || Number.isNaN(next) && Number.isNaN(storage[arg1Val - 1]))
                    return arg2;
                storage[arg1Val - 1] = previous;
            }
        }
    }
