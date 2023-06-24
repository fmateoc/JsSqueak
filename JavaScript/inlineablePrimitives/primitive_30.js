	const val = this.valueOf();
	const argType = typeof arg;
	const argVal = argType === "object" ? arg.valueOf() : arg;
	if(argVal != 0) {
		let argValN = argVal;
		if(typeof argVal === "number") {
			if((argType === "number" || arg.constructor === Number) && ((argVal | 0) === argVal || Number.isSafeInteger(argVal)))
				argValN = BigInt(argVal);
			else {
				const result = Number(val) / argVal;
				return (result | 0) === result || Number.isSafeInteger(result) ? new Float(result) : result;
			}
		}
		if(typeof argValN === "bigint") {
			const resultN = val / argValN;
			if (resultN * argValN === val) {
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result : resultN;
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
