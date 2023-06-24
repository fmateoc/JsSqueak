    const val = this.valueOf();
    if (true) {
        const result = Math.exp(val);
        return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
	}
