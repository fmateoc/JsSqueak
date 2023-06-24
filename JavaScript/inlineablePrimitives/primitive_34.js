	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	const argValN = typeof argVal === "number" && ((argVal | 0) === argVal || Number.isSafeInteger(argVal)) ? BigInt(argVal) : argVal;
	if (typeof argValN === "bigint") {
		const resultN = val & argValN;
		const result = Number(resultN);
		return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
	}
