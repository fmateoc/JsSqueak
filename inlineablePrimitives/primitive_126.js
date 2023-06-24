
const flag = arg.valueOf();
if (typeof flag === "boolean") {
    SmalltalkVM.deferDisplayUpdates = flag;
    return this;
}
