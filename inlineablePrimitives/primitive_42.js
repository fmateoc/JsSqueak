	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
			const coerced = val - Number(argVal);
			return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? new Float(coerced) : coerced;
		case "number":
			const result = val - argVal;
			return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
	}