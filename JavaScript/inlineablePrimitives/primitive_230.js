	const argVal = arg.valueOf();
	if(typeof argVal === "number" && (argVal >>> 0) === argVal) {
		// when the idle loop is running, there are too few interruptable calls, add an unconditional check here
		yield* CheckInterruptsOrException("ProcessorScheduler class>>relinquishProcessorForMicroseconds:, checking interrupts inside primitive 230:", false, false);
		return yield "relinquishing Processor for " + (argVal / 1000 | 0);
	}