while (true) {
	const semaphoreId = this.name + this.stack;
	const pointers = this.pointers;
	if (pointers[2] > 0) {
//			console.log("primitive 86 semaphore wait, decreasing excessSignals (from " + pointers[2] + ") of " + semaphoreId);
		pointers[2]--;
	} else {
		const previouslyActive = SmalltalkVM.activeProcess;
		if (pointers[0] === nil) {
			pointers[0] = previouslyActive;
		} else {
			pointers[1].pointers[0] = previouslyActive;
		}
		pointers[1] = previouslyActive;
		previouslyActive.pointers[3] = this;
		const first = SmalltalkVM.wakeHighestPriority();
		SmalltalkVM.activeProcess = first;
		yield "primitive 86 semaphore wait, sent to " + semaphoreId +
		"\nswitching to process with priority " + SmalltalkVM.activePriority + ", " + (first.name + first.stack);
		if (previouslyActive !== SmalltalkVM.activeProcess)
			yield* SmalltalkVM.debug();
		const e = previouslyActive.exception;
		previouslyActive.exception = null;
		if (e === "DEBUGGER")
			yield* SmalltalkVM.smalltalkDebug();
		else if (e === "TERMINATE")
			throw "TERMINATE";
		else if (e === "WAIT_SUSPEND")
			continue;
		else if (e) {
			console.log("exception that had been inserted in a process that was waiting on a semaphore is being signalled, as the process was resumed");
			yield* e._signal();
			console.log("exception that had been inserted in a process that was waiting on a semaphore was resumed, continue to wait")
			continue;
		}
	}
	return this;
}
