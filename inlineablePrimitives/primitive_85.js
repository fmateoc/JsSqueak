	if (true) {
		const semaphoreId = this.name + this.stack;
		const pointers = this.pointers;
		const first = pointers[0];
		if (first === nil) {
//			console.log("primitive 85 semaphore signal, increasing excessSignals (from " + pointers[2] + ") of " + semaphoreId);
			pointers[2]++;
		} else {
			SmalltalkVM.removeFromList(pointers, first);
			if(first.pointers[2] > SmalltalkVM.activePriority) {
				const previouslyActive = SmalltalkVM.activeProcess;
				if (previouslyActive !== undefined) {
					const processList = SmalltalkVM.quiescentProcessLists[SmalltalkVM.activePriority - 1];
					const processListPointers = processList.pointers;
					previouslyActive.pointers[3] = processList;
					if (SmalltalkVM.processPreemptionYields) {
						if(processListPointers[0] === nil)
							processListPointers[0] = previouslyActive;
						else
							processListPointers[1].pointers[0] = previouslyActive;
						processListPointers[1] = previouslyActive;
					} else {
						if(processListPointers[0] === nil)
							processListPointers[1] = previouslyActive;
						else
							previouslyActive.pointers[0] = processListPointers[0];
						processListPointers[0] = previouslyActive;
					}
				}
				SmalltalkVM.activeProcess = first;
				yield "primitive 85 semaphore signal, sent to " + semaphoreId +
				"\nswitching to process with priority " + SmalltalkVM.activePriority + ", " + (first.name + first.stack);
				const p = SmalltalkVM.activeProcess, e = p.exception;
				p.exception = null;
				if (e === "DEBUGGER")
					yield* SmalltalkVM.smalltalkDebug();
				else if (e === "WAIT_SUSPEND")
					yield* SmalltalkVM.debug();
				else if (e === "TERMINATE")
					throw "TERMINATE";
				else if (e) {
					return yield* e._signal();
				}
			} else {
				const processList = SmalltalkVM.quiescentProcessLists[first.pointers[2] - 1];
				const processListPointers = processList.pointers;
				if(processListPointers[0] === nil)
					processListPointers[0] = first;
				else
					processListPointers[1].pointers[0] = first;
				processListPointers[1] = first;
				first.pointers[3] = processList;
				console.log("primitive 85 semaphore signal, signalled process had lower priority than the active one, moved to quiescent list - " + semaphoreId);
			}
		}
		return this;
	}
