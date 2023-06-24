	const val = this.valueOf();
	switch (typeof arg) {
		case "object":
			if (arg.constructor === Number) {
				arg = arg.valueOf();
			} else
				break;
		case "number":
			if (arg !== 0 && ((arg | 0) === arg || Number.isSafeInteger(arg))) {
				const resultN = val % BigInt(arg);
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
			}
			break;
		case "bigint":
			if (arg !== 0n) {
				const resultN = val % arg;
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
			}
	}