    const val = this.valueOf();
    if (true) {
        const result = val - Math.trunc(val);
        return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
    }
