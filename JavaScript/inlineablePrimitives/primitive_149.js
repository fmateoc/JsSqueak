const attr = arg.valueOf();
if (Number.isSafeInteger(attr)) {
	const argv = SmalltalkVM.display.argv,
		vmOptions = SmalltalkVM.display.vmOptions,
		unknown = {};
	let value = unknown;
	switch (attr) {
		case 1: value = (argv && argv[1]) || SmalltalkVM.display.documentName; break; // 1.x images want document here
		case 2: value = (argv && argv[2]) || SmalltalkVM.display.documentName; break; // later images want document here
		case 1001: value = SmalltalkVM.platformName; break;
		case 1002: value = SmalltalkVM.osVersion; break;
		case 1003: value = SmalltalkVM.platformSubtype; break;
		case 1004: value = SmalltalkVM.vmVersion; break;
		case 1005: value = SmalltalkVM.windowSystem; break;
		case 1007: value = SmalltalkVM.vmVersion; break; // Interpreter class
		// case 1008: Cogit class
		case 1009: value = SmalltalkVM.vmVersion; break; // Platform source version
		default:
			if (attr >= 0 && argv && argv.length > attr) {
				value = argv[attr];
			} else if (attr < 0 && vmOptions && vmOptions.length > -attr - 1) {
				value = vmOptions[-attr - 1];
			}
	}
	if (value !== unknown) {
		if (value === undefined || value === null) return nil;
		if (typeof value === "number" || typeof value === "boolean")
			return value;
		if (typeof value === "string") return SmalltalkGlobals._ByteString.from(value);
		if (value._class().name === "Uint8Array") return SmalltalkGlobals._ByteString.from(String.fromCharCode(...value));
		if (value._class().name === "Array") return SmalltalkGlobals._Array.from(value);
		throw Error("cannot make smalltalk object");
	}
}
