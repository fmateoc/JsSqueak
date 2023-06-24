	const pointers = this.pointers, argpointers = arg.pointers;
	if (this._class() === arg._class() && pointers.length === argpointers.length &&
			pointers.every((x, i) => canBecome(x) && canBecome(argpointers[i]))) {
		try {
			pointers.forEach((x, i) => become(argpointers[i], x));
			return this;
		} catch (e) {
			yield* SmalltalkVM.debug();
		}
	}
