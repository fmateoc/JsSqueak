	//this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
	if (this.length === arguments.length)
		return yield* this(...arguments);
