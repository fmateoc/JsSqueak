const argVal = arg.valueOf();
const result = Number.isSafeInteger(argVal) ? this.literals[argVal - 1] : undefined;
if(result !== undefined)
	return result;
