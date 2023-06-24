	//this is implemented knowing that it will end up within a method on the mapped type Function, not on _BlockClosure
	if (this.length === 0 && typeof arg2 === 'function' && arg2.length <= 1) {
		const h = new SmalltalkExceptionHandler(arg1, arg2);
		h.install();
		try {
			let block = this;
			while (true)
				try {
					return yield* block._value();
				} catch (e) {
					if (e === h.exitId)
						return e.payload;
					if (e !== h.retryId) {
						if (e instanceof Error) {
							console.log(e.stack);
							yield* SmalltalkVM.debug();
						}
						throw e;
					}
					block = e.payload || this;
				}
		} finally {
			h.uninstall();
		}
	}
	yield* SmalltalkVM.debug();
