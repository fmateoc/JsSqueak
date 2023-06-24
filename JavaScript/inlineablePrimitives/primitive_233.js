
const flag = arg.valueOf();
if (typeof flag === "boolean")
{
    if (SmalltalkVM.display.fullscreen != flag) {
        SmalltalkVM.display.fullscreen = flag;
        yield "refreshBrowser";
    }
    return this;
}
