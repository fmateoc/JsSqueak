if (true) {
	const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
	const processListPointers = processList.pointers;
	if(processListPointers[0] !== nil) {
		const previouslyActive = SmalltalkVM.activeProcess;
		processListPointers[1].pointers[0] = previouslyActive;
		processListPointers[1] = previouslyActive;
		previouslyActive.pointers[3] = processList;
		SmalltalkVM.activeProcess = SmalltalkVM.wakeHighestPriority();
		yield "primitive 167 scheduler yield, switching to process with priority " + SmalltalkVM.activePriority + ", defined" + SmalltalkVM.activeProcess.stack;
		if (previouslyActive !== SmalltalkVM.activeProcess)
			yield* SmalltalkVM.debug();
		const e = previouslyActive.exception;
		previouslyActive.exception = null;
		if (e === "DEBUGGER")
			yield* SmalltalkVM.smalltalkDebug();
		else if (e === "TERMINATE")
			throw "TERMINATE";
		else if (e)
			return yield* e._signal();
	}
	return this;
}
