
const cursorCanvas = SmalltalkVM.display.cursorCanvas;
if (cursorCanvas) {
    const argVal = arg === undefined ? nil : arg.valueOf();
    if (typeof argVal === 'object') {
        const thisPointers = this.pointers;
        const cursorForm = SmalltalkVM.loadForm(thisPointers);
        if (cursorForm) {
            const context = cursorCanvas.getContext("2d"),
                bounds = {left: 0, top: 0, right: cursorForm.width, bottom: cursorForm.height};
            cursorCanvas.width = cursorForm.width;
            cursorCanvas.height = cursorForm.height;
            if (cursorForm.depth === 1) {
                const maskForm = SmalltalkVM.loadForm(argVal.pointers);
                if (maskForm) {
                    // make 2-bit form from cursor and mask 1-bit forms
                    const bits = new Uint32Array(16);
                    for (let y = 0; y < 16; y++) {
                        const c = cursorForm.bits[y],
                            m = maskForm.bits[y];
                        let bit = 0x80000000,
                            merged = 0;
                        for (let x = 0; x < 16; x++) {
                            merged = merged | ((m & bit) >> x) | ((c & bit) >> (x + 1));
                            bit = bit >>> 1;
                        }
                        bits[y] = merged;
                    }
                    SmalltalkVM.showForm(context, {bits: bits, depth: 2, width: 16, height: 16},
                        bounds, [0x00000000, 0xFF0000FF, 0xFFFFFFFF, 0xFF000000]);
                } else {
                    SmalltalkVM.showForm(context, cursorForm, bounds, [0x00000000, 0xFF000000]);
                }
            } else {
                SmalltalkVM.showForm(context, cursorForm, bounds, true);
            }
            const canvas = SmalltalkVM.display.context.canvas,
                scale = canvas.offsetWidth / canvas.width;
            cursorCanvas.style.width = (cursorCanvas.width * scale|0) + "px";
            cursorCanvas.style.height = (cursorCanvas.height * scale|0) + "px";
            const offsetPointers = thisPointers[4].pointers;
            if (offsetPointers) {
                SmalltalkVM.display.cursorOffsetX = offsetPointers[0] * scale|0;
                SmalltalkVM.display.cursorOffsetY = offsetPointers[1] * scale|0;

            } else {
                SmalltalkVM.display.cursorOffsetX = 0;
                SmalltalkVM.display.cursorOffsetY = 0;
            }
            return this;
        }
    }
} else
    return this;
