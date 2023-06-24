	const argVal = arg.valueOf();
	if(typeof argVal === "number") {
		if (this.storageType === "bytes") {
			let byte;
			const result = this.dirty ? ((byte = this.bytes[argVal - 1]) !== undefined ? String.fromCharCode(byte) : undefined) : this.string[argVal - 1];
			if(result !== undefined)
				return result;
		} else {
			const val = this.words[argVal - 1];
			if(val !== undefined && val < 0x40000000 && (val & 0x3FFFFF) < 0x110000) {
				return val < 0x110000 ? String.fromCodePoint(val) : SmalltalkGlobals._Character.from([val]);
			}

		}
	}
