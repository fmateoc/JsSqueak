	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	const argValN = typeof argVal === "number" && (arg === argVal || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))
		? BigInt(argVal) : argVal;
	switch (typeof argValN) {
		case "number":
			const result = Number(val) - argValN;
			return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
		case "bigint":
			const resultN = val - argValN;
			const coerced = Number(resultN);
			return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
	}
