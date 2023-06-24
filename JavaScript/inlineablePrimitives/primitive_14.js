	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
			const resultN = BigInt(val) & argVal;
			const result = Number(resultN);
			return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
		case "number":
			if ((argVal | 0) === argVal && (val | 0) === val) {
				return val & argVal;
			} else if (Number.isSafeInteger(argVal)) {
				const resultN = BigInt(val) & BigInt(argVal);
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN
			}
	}
