	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	if(argVal != 0) {
		const val = this.valueOf();
		const argValN = typeof argVal === "number" && (arg === argVal || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))
			? BigInt(argVal) : argVal;
		switch (typeof argValN) {
			case "number":
				const result = Number(val) / argValN;
				return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
			case "bigint":
				const resultN = val / argValN;
				if (resultN * argValN === val) {
					const coerced = Number(resultN);
					return coerced == resultN && ((coerced | 0) === coerced || Number.isSafeInteger(coerced)) ? coerced : resultN;
				} else {
					//Fraction
					let m = val, n = argValN;
					while(n !== 0n) n = m - (m / n * (m = n));
					if(m * argValN < 0) m = -m;
					const numeratorN = val / m;
					const numerator = Number(numeratorN);
					const denominatorN = argValN / m;
					const denominator = Number(denominatorN);
					return SmalltalkGlobals._Fraction.from([
						(numerator | 0) === numerator || Number.isSafeInteger(numerator) ? numerator : numeratorN,
						(denominator | 0) === denominator || Number.isSafeInteger(denominator) ? denominator : denominatorN
					]);
				}
		}
	}
