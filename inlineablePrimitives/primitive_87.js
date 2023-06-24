	const pointers = this.pointers;
	if (pointers[3] === nil) {
		if(pointers[2] > SmalltalkVM.activePriority) {
			const previouslyActive = SmalltalkVM.activeProcess;
			if (previouslyActive !== nil) {
				const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
				const processListPointers = processList.pointers;
				if(processListPointers[0] === nil)
					processListPointers[0] = previouslyActive;
				else
					processListPointers[1].pointers[0] = previouslyActive;
				processListPointers[1] = previouslyActive;
				previouslyActive.pointers[3] = processList;
			}
			SmalltalkVM.activeProcess = this;
			yield "primitive 87 resume, switching to process with priority " + SmalltalkVM.activePriority + ", defined" + this.stack;
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
		} else {
			const processList = SmalltalkVM.quiescentProcessLists[pointers[2] - 1];
			const processListPointers = processList.pointers;
			if(processListPointers[0] === nil)
				processListPointers[0] = this;
			else
				processListPointers[1].pointers[0] = this;
			processListPointers[1] = this;
			pointers[3] = processList;
		}
		return this;
	}