    const val = this.valueOf();
	if (val >= 0) {
        const result = Math.sqrt(val);
        return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
	}
