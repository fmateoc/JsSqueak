	const argVal = arg.valueOf();
	if(Number.isSafeInteger(argVal)) {
		SmalltalkVM.lowSpaceThreshold = argVal;
		return this;
	}
