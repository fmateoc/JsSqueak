	//this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
	if (arg._class() && arg._class().name === '_Array' && this.length === arg.pointers.length)
		return yield* this(...arg.pointers);
