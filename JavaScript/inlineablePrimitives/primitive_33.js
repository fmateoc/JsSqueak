	const val = this.valueOf();
	switch (typeof arg) {
		case "object":
			if (arg.constructor === Number) {
				arg = arg.valueOf();
			} else
				break;
		case "number":
			if (arg !== 0 && ((arg | 0) === arg || Number.isSafeInteger(arg)))
				arg = BigInt(arg);
			else
				break;
		case "bigint":
			if (arg !== 0n) {
				const resultN = val / arg;
				const coerced = Number(resultN);
				return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? coerced : resultN;
			}
	}