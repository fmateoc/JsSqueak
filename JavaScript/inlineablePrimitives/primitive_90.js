const display = SmalltalkVM.display;
const x = display.mouseX.valueOf();
const y = display.mouseY.valueOf();
if (typeof x === "number" && (x | 0) === x && typeof y === "number" && (y | 0) === y) {
    const result = new SmalltalkGlobals._Point();
    result.pointers[0] = x;
    result.pointers[1] = y;
    return result;
}
