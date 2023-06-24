    const argVal = arg.valueOf();
    if (typeof argVal === "number") {
        const result = this.words ? this.wordsAsFloat32Array()[argVal - 1] : (this.longs ? this.longsAsFloat64Array()[argVal - 1] : undefined);
        if (result !== undefined)
            return Number.isSafeInteger(result) ? new Float(result) : result;
    }
