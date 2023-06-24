	if (typeof this === "function" && this.length === arguments.length)
		return yield* this(...arguments);
	else if (this instanceof SmalltalkGlobals._FullBlockClosure) {
		if (Object.getOwnPropertyDescriptor(this.pointers[1], 'func').get)
			console.log("Lazily compiling the compiled method's func from its bytecodes");
		if (this.pointers[1].func === undefined)
			yield* SmalltalkVM.debug();
		else if (this.pointers[1].func.length === arguments.length)
			return yield * this.pointers[1].func(...arguments);
	}

