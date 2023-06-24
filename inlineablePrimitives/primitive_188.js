	if (arg1._class() && arg1._class().name === '_Array') {
		if (Object.getOwnPropertyDescriptor(arg2, 'func').get)
			console.log("Lazily compiling the compiled method's func from its bytecodes");
		if (arg2.func === undefined)
			yield* SmalltalkVM.debug();
		else
			return yield* arg2.func.apply(this, arg1.pointers);
	}
