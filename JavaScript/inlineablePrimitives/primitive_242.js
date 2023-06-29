const arg1Val = arg1.valueOf();
const arg2Val = arg2.valueOf();
if(typeof arg1Val === 'object' && Number.isSafeInteger(arg2Val)) {
    if (arg1Val instanceof SmalltalkGlobals._Semaphore) {
        SmalltalkVM.specialObjectsArray[29] = arg1Val;
        SmalltalkVM.previousTick = Date.now();
        const msTime = Math.floor(arg2Val / 1000);
        SmalltalkVM.nextWakeupTick = msTime + SmalltalkVM.EpochUTC;
//        console.log("Setting timing semaphore's nextWakeupTick " + (SmalltalkVM.nextWakeupTick - SmalltalkVM.previousTick) + "ms from now, in primitive 242");
    } else {
        SmalltalkVM.specialObjectsArray[29] = nil;
        SmalltalkVM.nextWakeupTick = 0;
    }
    return this;
}
