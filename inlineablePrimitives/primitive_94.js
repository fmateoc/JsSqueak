const argVal = arg.valueOf();
if(typeof argVal === 'object') {
	const getNextEvent = SmalltalkVM.display.getNextEvent;
	if (getNextEvent) {
		getNextEvent(argVal.pointers, SmalltalkGlobals.MillisecondClockValue);
		return this;
	}
}
