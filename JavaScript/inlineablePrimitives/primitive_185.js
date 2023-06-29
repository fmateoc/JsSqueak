	if (true) {
		const pointers = this.pointers;
		pointers[2] = nil;
		const first = pointers[0];
		if (first === nil) {
//			console.log("primitive 185 mutex exit critical section, list is empty");
		} else {
			SmalltalkVM.removeFromList(pointers, first);
			if(first.pointers[2] > SmalltalkVM.activePriority) {
				const previouslyActive = SmalltalkVM.activeProcess;
				if (previouslyActive !== undefined) {
					const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
					const processListPointers = processList.pointers;
					if(processListPointers[0] === nil)
						processListPointers[0] = previouslyActive;
					else
						processListPointers[1].pointers[0] = previouslyActive;
					processListPointers[1] = previouslyActive;
					previouslyActive.pointers[3] = processList;
				}
				SmalltalkVM.activeProcess = first;
				yield "primitive 185 mutex exit critical section" +
				"\nswitching to process with priority " + SmalltalkVM.activePriority + ", " + (first.name + first.stack);
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
				const processList = SmalltalkVM.quiescentProcessLists[first.pointers[2] - 1];
				const processListPointers = processList.pointers;
				if(processListPointers[0] === nil)
					processListPointers[0] = first;
				else
					processListPointers[1].pointers[0] = first;
				processListPointers[1] = first;
				first.pointers[3] = processList;
//				console.log("primitive 185 mutex exit critical section, suspended process had lower priority than the active one, moved to quiescent list");
			}
		}
		return this;
	}
