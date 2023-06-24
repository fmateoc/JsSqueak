	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	if (typeof argVal === "number" && argVal !== 0) {
		const result = val / argVal;
		return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
	} else if (typeof argVal === "bigint" && argVal !== 0n) {
		const coerced = val / Number(argVal);
		return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? new Float(coerced) : coerced;
	}
