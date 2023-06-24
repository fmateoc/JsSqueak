	const val = this.valueOf();
	switch (typeof arg) {
		case "object":
			const argVal = arg.valueOf();
			if (arg.constructor !== Number) {
				if (typeof argVal === "number") {
					const result = val - argVal;
					return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
				}
				break;
			} else
				arg = argVal;
		case "number":
			const result = val - arg;
			if ((arg | 0) === arg || Number.isSafeInteger(arg))
				return (result | 0) === result || Number.isSafeInteger(result) ? result : BigInt(val) - BigInt(arg);
			return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
		case "bigint":
			const resultN = BigInt(val) - arg;
			const coerced = Number(resultN);
			return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? coerced : resultN;
	}