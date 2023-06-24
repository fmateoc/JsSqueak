	if (globalThis.gc) {
		gc();
		GlobalActivationCounter = 0;	//make sure an interrupt check occurs soon
		yield "garbageCollect";		//allow garbage collection to actually happen
		if (globalThis.process && process.memoryUsage) {
			const mem = process.memoryUsage();
			return mem.heapTotal - mem.heapUsed;
		}
		return 0;
	}