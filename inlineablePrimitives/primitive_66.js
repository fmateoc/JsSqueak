	const pointers = this.pointers, position = pointers[1], collection = pointers[0], storageType = collection.storageType, argVal = arg.valueOf();
	if (position < pointers[3] && storageType !== null) {
		if (storageType === "pointers") {
			if (collection.instSize === 0) {
				collection.pointers[position] = collection.isWeak ? new WeakRef(Object(arg)) : arg;
				pointers[1]++;
				return arg;
			}
		} else if (collection instanceof SmalltalkGlobals._String) {
			if (typeof argVal === "string" && !(arg instanceof SmalltalkGlobals._String) && !(collection instanceof SmalltalkGlobals._Symbol)) {
				const value = arg instanceof SmalltalkGlobals._Character ? arg.pointers[0] : argVal.codePointAt(0);
				if (value !== undefined) {
					if(storageType === "bytes") {
						const bytes = collection.bytes;
						if(value < 256) {
							bytes[position] = value;
						} else {
							const words = new Uint32Array(bytes.length);
							words.set(bytes);
							words[position] = value;
							delete collection.bytes;
							collection.words = words;
							Object.setPrototypeOf(collection, SmalltalkGlobals._WideString.prototype);
						}
					} else {
						collection.words[position] = value;
					}
					collection.dirty = true;
					pointers[1]++;
					return arg;
				}
			}
		} else if (collection.literals === undefined) {
			if (typeof argVal === "number" && (argVal >>> 0) === argVal) {
				if(storageType === "bytes") {
					if(argVal < 256) {
						collection.bytes[position] = argVal;
						if (collection instanceof SmalltalkGlobals._LargePositiveInteger)
							collection.dirty = true;
						pointers[1]++;
						return arg;
					}
				} else {
					collection.words[position] = argVal;
					pointers[1]++;
					return arg;
				}
			}
		} else {
			if (typeof argVal === "number" && (argVal >>> 0) === argVal && storageType === "bytes" && argVal < 256) {
				collection.bytes[position - collection.literals.length * SmalltalkGlobals.BytesPerWord] = argVal;
				pointers[1]++;
				return arg;
			}
		}
	}

