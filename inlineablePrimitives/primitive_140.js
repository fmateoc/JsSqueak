
const ctx = SmalltalkVM.startAudioOut();
if (ctx) {
    const beep = ctx.createOscillator();
    beep.connect(ctx.destination);
    beep.type = 'square';
    beep.frequency.value = 880;
    beep.start();
    beep.stop(ctx.currentTime + 0.05);
    return this;
} else {
    SmalltalkVM.warnOnce("could not initialize audio");
}
