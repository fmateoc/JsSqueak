if (arguments.length === 0)
    return SmalltalkVM.imageName;
else if (arg instanceof SmalltalkGlobals._String)
    return SmalltalkVM.imageName = arg;