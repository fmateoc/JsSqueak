
// Force the given rectangular section of the Display to be copied to the screen.
const left = arg1.valueOf(),
    right = arg2.valueOf(),
    top = arg3.valueOf(),
    bottom = arg4.valueOf();

if (typeof left === "number" &&
    typeof right === "number" &&
    typeof top === "number" &&
    typeof bottom === "number")
{
    const theDisplay = SmalltalkVM.loadForm(SmalltalkVM.specialObjectsArray[14].pointers),
        bounds = {left: 0, top: 0, right: theDisplay.width, bottom: theDisplay.height};
    if (left > 0) bounds.left = left;
    if (right < bounds.right) bounds.right = right;
    if (top > 0) bounds.top = top;
    if (bottom < bounds.bottom) bounds.bottom = bottom;
    if (bounds.left < bounds.right && bounds.top < bounds.bottom) {
        SmalltalkVM.showForm(SmalltalkVM.display.context, theDisplay, bounds);
        yield "refreshBrowser";
    }
    return this;
}
