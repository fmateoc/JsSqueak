	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
			const resultN = BigInt(val) << argVal;
			const result = Number(resultN);
			return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
		case "number":
			const is32bitInt = (argVal | 0) === argVal;
			let shifted;
			if (is32bitInt && argVal < 0) {
				return argVal > -32 && val < 2147483648 && val >= -2147483648 ? val >> -argVal : Number(BigInt(val) >> BigInt(-argVal));
			} else if(is32bitInt && argVal < 32 && (shifted = val << argVal) >> argVal === val) {
				return shifted;
			} else if (Number.isSafeInteger(argVal)) {
				const resultN = BigInt(val) << BigInt(argVal);
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN
			}
	}
