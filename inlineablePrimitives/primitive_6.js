	const val = this.valueOf();
	const argVal = typeof arg === "object" ? arg.valueOf() : arg;
	switch (typeof argVal) {
		case "bigint":
		case "number":
			return val >= argVal;
	}