if (true) {
	const pointers = this.pointers;
	if (pointers[2] === nil) {
//			console.log("primitive 187 mutex test and set ownership of currently unowned critical section");
		pointers[2] = SmalltalkVM.activeProcess;
		return false;
	} else if (pointers[2] === SmalltalkVM.activeProcess) {
//			console.log("primitive 187 mutex test ownership of critical section currently owned by the active process");
		return true;
	} else {
//			console.log("primitive 187 mutex test ownership of critical section currently owned by a process other than the active process");
		return nil;
	}
}
