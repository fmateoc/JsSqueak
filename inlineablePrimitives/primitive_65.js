	const pointers = this.pointers, position = pointers[1], collection = pointers[0], storageType = collection.storageType;
	if (position < pointers[2] && storageType !== null) {
		if (storageType === "pointers") {
			if (collection.instSize === 0) {
				const result = collection.pointers[position];
				if(result !== undefined) {
					pointers[1]++;
					return collection.isWeak ? result.deref() || nil : result;
				}
			}
		} else if (collection instanceof SmalltalkGlobals._String) {
			if(storageType === "bytes") {
				let byte;
				const result = collection.dirty ? ((byte = collection.bytes[position]) !== undefined ? String.fromCharCode(byte) : undefined) : collection.string[position];
				if(result !== undefined) {
					pointers[1]++;
					return result;
				}
			} else {
				const result = collection.words[position];
				if(result !== undefined && result < 0x40000000 && (result & 0x3FFFFF) < 0x110000) {
					pointers[1]++;
					return result < 0x110000 ? String.fromCodePoint(result) : SmalltalkGlobals._Character.from([result]);
				}
			}
		} else if (collection.literals === undefined) {
			const result = collection[storageType][position];
			if(result !== undefined) {
				pointers[1]++;
				return result;
			}
		} else {
			const result = collection[storageType][position - collection.literals.length * SmalltalkGlobals.BytesPerWord];
			if(result !== undefined) {
				pointers[1]++;
				return result;
			}
		}
	}
