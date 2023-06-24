	const val = this.valueOf();
	switch (typeof arg) {
		case "object":
			const argVal = arg.valueOf();
			if (arg.constructor !== Number) {
				if (typeof argVal === "number") {
					const result = Number(val) - argVal;
					return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
				}
				break;
			} else
				arg = argVal;
		case "number":
			if ((arg | 0) === arg || Number.isSafeInteger(arg))
				arg = BigInt(arg);
			else {
				const result = Number(val) - arg;
				return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
			}
		case "bigint":
			const resultN = val - arg;
			const coerced = Number(resultN);
			return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? coerced : resultN;
	}