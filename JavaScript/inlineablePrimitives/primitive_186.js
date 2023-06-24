while (true) {
	const pointers = this.pointers;
	if (pointers[2] === nil) {
//			console.log("primitive 186 mutex enter currently unowned critical section");
		pointers[2] = SmalltalkVM.activeProcess;
		return false;
	} else if (pointers[2] === SmalltalkVM.activeProcess) {
//			console.log("primitive 186 mutex enter critical section owned by the active process");
		return true;
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
		yield "primitive 186 mutex enter critical section" +
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
			console.log("exception inserted in a process that was suspended in a critical section was signalled, as the process was resumed");
			yield* e._signal();
			console.log("exception that had been inserted in a process that was suspended in a critical section was resumed, continue to wait")
			continue;
		}
	}
	return this;
}
