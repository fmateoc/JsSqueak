	const val = this.valueOf();
	const argType = typeof arg;
	const argVal = argType === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
			if (argVal !== 0n) {
				const thisN = BigInt(val);
				const resultN = thisN / argVal;
				if (resultN * argVal === thisN) {
					const result = Number(resultN);
					return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
				} else {
					//Fraction
					let m = thisN, n = argVal;
					while(n !== 0n) n = m - (m / n * (m = n));
					if(m * argVal < 0) m = -m;
					const numeratorN = thisN / m;
					const numerator = Number(numeratorN);
					const denominatorN = argVal / m;
					const denominator = Number(denominatorN);
					return SmalltalkGlobals._Fraction.from([
						(numerator | 0) === numerator || Number.isSafeInteger(numerator) ? numerator : numeratorN,
						(denominator | 0) === denominator || Number.isSafeInteger(denominator) ? denominator : denominatorN
					]);
				}
			}
		case "number":
			if (argVal !== 0) {
				const result = val / argVal;
				if((argType === "number" || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal))) {
					if((result | 0) === result || Number.isInteger(result))
						return result;
					else {
						//Fraction
						let m = val, n = argVal;
						while(n !== 0) n = m - (Math.floor(m / n) * (m = n));
						if(m * argVal < 0) m = -m;
						return SmalltalkGlobals._Fraction.from([
							val / m,
							argVal / m
						]);
					}
				} else
					return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
			}
	}
