
const depth = arg.valueOf();
if (typeof depth === "number" && Number.isSafeInteger(depth)) {
    const supportedDepths = [1, 2, 4, 8, 16, 32]; // match showForm
    return supportedDepths.indexOf(depth) >= 0;
}
