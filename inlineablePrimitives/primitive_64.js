	const arg1Val = arg1.valueOf(), arg2Val = arg2.valueOf();
	if (typeof arg1Val === "number" && arg1Val > 0 && typeof arg2Val === "string" && !(arg2 instanceof SmalltalkGlobals._String)) {
		const value = arg2 instanceof SmalltalkGlobals._Character ? arg2.pointers[0] : arg2Val.codePointAt(0);
		if (value !== undefined) {
			if (this.storageType === "bytes") {
				const bytes = this.bytes;
				if(arg1Val <= bytes.length) {
					if(value < 256) {
						bytes[arg1Val - 1] = value;
					} else {
						const words = Uint32Array.from(bytes);
						words[arg1Val - 1] = value;
						Object.setPrototypeOf(this, SmalltalkGlobals._WideString.prototype);
						AllInstances.get(this._class()).addWeakly(this);
						this.words = words;
						delete this.bytes;
					}
					this.dirty = true;
					return arg2;
				}
			} else {
				const words = this.words;
				if(arg1Val <= words.length) {
					words[arg1Val - 1] = value;
					this.dirty = true;
					return arg2;
				}
			}
		}
	}
