	const val = this.valueOf();
	switch (typeof arg) {
		case "object":
			if (arg.constructor === Number) {
				arg = arg.valueOf();
			} else
				break;
		case "number":
			if (arg !== 0 && ((arg | 0) === arg || Number.isSafeInteger(arg))) {
				return Math.floor(val / arg);
			}
			break;
		case "bigint":
			if (arg !== 0n) {
				const bigVal = BigInt(val);
				let resultN = bigVal / arg;
				if (bigVal < 0 !== arg < 0 && resultN * arg !== bigVal)
					resultN--;
				const coerced = Number(resultN);
				return (coerced | 0) === coerced || Number.isSafeInteger(coerced) ? coerced : resultN;
			}
	}