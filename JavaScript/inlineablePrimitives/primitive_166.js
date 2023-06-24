const arg1Val = arg1.valueOf();
const arg2Val = arg2.valueOf();
if(typeof arg1Val === "number" && (arg1Val | 0) === arg1Val && arg1Val > 0 && this.words && arg1Val <= this.words.length && typeof arg2Val === "number" && (arg2Val | 0) === arg2Val) {
    return this.wordsAsInt32Array()[arg1Val - 1] = arg2Val;
}
		