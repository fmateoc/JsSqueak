	if (globalThis.process && process.memoryUsage) {
		const mem = process.memoryUsage();
		return mem.heapTotal - mem.heapUsed;
	}
