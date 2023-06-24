
const display = SmalltalkVM.display;
const result = new SmalltalkGlobals._Point();
if(result) {
    result.pointers[0] = display.width || display.context.canvas.width;
    result.pointers[1] = display.height || display.context.canvas.height;
    return result;
}
