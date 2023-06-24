	if (arguments.length > 0) {
		const args = Array.prototype.slice.call(arguments);
		const compiledMethod = args.pop();
		if (Object.getOwnPropertyDescriptor(compiledMethod, 'func').get)
			console.log("Lazily compiling the compiled method's func from its bytecodes");
		if (compiledMethod.func === undefined)
			yield* SmalltalkVM.debug();
		else
			return yield* compiledMethod.func.apply(this, args);
	}
