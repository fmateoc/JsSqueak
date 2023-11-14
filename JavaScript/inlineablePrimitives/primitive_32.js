	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	if(argVal != 0) {
		const argValN = typeof argVal === "number" && (arg === argVal || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))
			? BigInt(argVal) : argVal;
		if (typeof argValN === "bigint") {
			const val = this.valueOf();
			let resultN = val / argValN;
			if (val < 0 !== argValN < 0 && resultN * argValN !== val)
				resultN--;
			const coerced = Number(resultN);
			return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
		}
	}