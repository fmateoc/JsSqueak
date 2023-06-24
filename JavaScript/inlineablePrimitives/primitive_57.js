    const val = this.valueOf();
    if (true) {
        const result = Math.atan(val);
        return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
	}
