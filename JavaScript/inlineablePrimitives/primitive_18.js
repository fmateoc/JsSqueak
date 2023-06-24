	const result = new SmalltalkGlobals._Point();
	if(result) {
		result.pointers[0] = this;
		result.pointers[1] = arg;
		return result;
	}
