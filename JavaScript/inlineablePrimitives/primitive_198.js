	//this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
	if (this.length === 0 && typeof arg === 'function' && arg.length === 0)
		try {
			return yield* this.call();
		} finally {
			yield* arg.call();
		}
