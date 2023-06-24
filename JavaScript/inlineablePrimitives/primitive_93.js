const argVal = arg.valueOf();
if(Number.isSafeInteger(argVal)) {
	SmalltalkVM.display.signalInputEvent = function() {
		if (!this.semaphoresToSignal.includes(argVal))
			this.semaphoresToSignal.push(argVal);
	}.bind(SmalltalkVM);
	SmalltalkVM.display.signalInputEvent();
	return this;
}
