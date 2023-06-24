	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	if(argVal === 1 || argVal === 2) {
		if (typeof this === "number" || this instanceof Number) {
			const data = new DataView(new ArrayBuffer(8));
			data.setFloat64(0, this.valueOf(), false);
			return data.getUint32((argVal - 1) * 4, false);
		} else if (this.words === undefined)
			yield* SmalltalkVM.debug();
		else
			return new DataView(this.words.buffer).getUint32((argVal - 1) * 4, false);
	}
