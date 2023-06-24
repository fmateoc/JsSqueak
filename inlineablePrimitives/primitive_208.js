	//this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
	if (arg._class() && arg._class().name === '_Array') {
		if (typeof this === "function" && this.length === arg.pointers.length)
			return yield* this(...arg.pointers);
		else if (this instanceof SmalltalkGlobals._FullBlockClosure) {
			if (Object.getOwnPropertyDescriptor(this.pointers[1], 'func').get)
				console.log("Lazily compiling the compiled method's func from its bytecodes");
			if (this.pointers[1].func === undefined)
				yield* SmalltalkVM.debug();
			else if (this.pointers[1].func.length === arg.pointers.length)
				return yield * this.pointers[1].func(...arg.pointers);
		}
	}
