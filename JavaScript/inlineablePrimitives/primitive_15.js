	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
			const resultN = BigInt(val) | argVal;
			const coerced = Number(resultN);
			return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
		case "number":
			if ((argVal | 0) === argVal && (val | 0) === val) {
				return val | argVal;
			} else if (Number.isSafeInteger(argVal)) {
				const resultN = BigInt(val) | BigInt(argVal);
				const coerced = Number(resultN);
				return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
			}
	}
