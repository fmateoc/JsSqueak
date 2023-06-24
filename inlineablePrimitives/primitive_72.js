	const pointers = this.pointers, argpointers = arg.pointers;
	if (this._class() === arg._class() && pointers.length === argpointers.length &&
			pointers.every(x => canBecome(x))) {
		try {
			pointers.forEach((x, i) => becomeForward(x, argpointers[i]));
			return this;
		} catch (e) {
			yield* SmalltalkVM.debug();
		}
	}
