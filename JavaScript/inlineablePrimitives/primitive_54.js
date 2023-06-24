	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	if(Number.isSafeInteger(argVal)) {
		if (argVal > -1075 && argVal < 1024)
			return new Float(val * Math.pow(2, argVal));
		const positive = val > 0;
		const data = new DataView(new ArrayBuffer(8));
		data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
		const _firstHalf = data.getUint32(0, false);
		const _expPart = (_firstHalf >>> 20) & 2047;
		/* Extract fractional part*/
		const _fractionPart = (_firstHalf & 1048575) * 0x0100000000 + data.getUint32(4, false);
		if (_expPart === 0 && _fractionPart === 0)
			return Float.ZERO;
		/* Replace omitted leading 1 in fraction unless gradual underflow*/
		const _fraction = _expPart === 0 ? BigInt(_fractionPart) << 1n : BigInt(_fractionPart) | 0x10000000000000n;
		const _signedFraction = positive ? _fraction : -_fraction;
		const _exp = _expPart + argVal - 1075;
		if (_exp >= 0) {
			if (_exp > 1023) {
				const resultN = _signedFraction << BigInt(_exp - 1023);
				const result = Number(resultN);
				return (result | 0) === result || Number.isSafeInteger(result) ? result * Math.pow(2, 1023) : positive ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
			}
			return new Float(Number(_signedFraction) * Math.pow(2, _exp));
		} else {
			const asBinary = _fraction.toString(2);
			const _zeroBitsCount = asBinary.length - asBinary.lastIndexOf('1') - 1;
			if ((-_exp) <= _zeroBitsCount) {
				return new Float(Number(_signedFraction >> BigInt(-_exp)));
			} else {
				return new Float(Number(_signedFraction >> BigInt(_zeroBitsCount))) * Math.pow(2, _exp + _zeroBitsCount);
			}
		}
	}
