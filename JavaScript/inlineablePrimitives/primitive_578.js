	if (true) {
		if (this === SmalltalkVM.activeProcess) {
			SmalltalkVM.activeProcess = SmalltalkVM.wakeHighestPriority();
			yield "primitive 578 suspend, switching to process with priority " + SmalltalkVM.activePriority + ", defined" + SmalltalkVM.activeProcess.stack;
			if (this !== SmalltalkVM.activeProcess)
				yield* SmalltalkVM.debug();
			const e = this.exception;
			this.exception = null;
			if (e === "DEBUGGER")
				yield* SmalltalkVM.smalltalkDebug();
			else if (e === "TERMINATE")
				throw "TERMINATE";
			else if (e)
				return yield* e._signal();
			return nil;
		} else {
			const pointers = this.pointers;
			const oldList = pointers[3];
			if (oldList !== nil) {
				SmalltalkVM.removeFromList(oldList.pointers, this);
				pointers[3] = nil;
				if (oldList !== SmalltalkVM.quiescentProcessLists[pointers[2] - 1]) {
					this.exception = "WAIT_SUSPEND";
					return nil;
				}
				return oldList;
			}
		}
	}
