	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	const argValN = typeof argVal === "number" && (arg === argVal || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))
		? BigInt(argVal) : argVal;
	if (typeof argValN === "bigint") {
		const val = this.valueOf();
		const resultN = argValN < 0n ? val >> -argValN : val << argValN;
		const coerced = Number(resultN);
		return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
	}
