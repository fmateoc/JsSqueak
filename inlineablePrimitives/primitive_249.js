	const pointers = this.pointers, argpointers = arg1.pointers;
	if (this._class() === arg1._class() && typeof arg2 === "boolean" && pointers.length === argpointers.length &&
			pointers.every(x => canBecome(x))) {
		try {
			pointers.forEach((x, i) => becomeForward(x, argpointers[i], arg2));
			return this;
		} catch (e) {
			yield* SmalltalkVM.debug();
		}
	}
