const arg1Val = arg1.valueOf(), literals = this.literals;
if (Number.isSafeInteger(arg1Val) && arg1Val > 0 && arg1Val <= literals.length)
	return literals[arg1Val - 1] = arg2
