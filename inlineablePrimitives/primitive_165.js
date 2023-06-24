const argVal = arg.valueOf();
if(typeof argVal === "number" && (argVal | 0) === argVal && argVal > 0 && this.words && argVal <= this.words.length) {
    return this.wordsAsInt32Array()[argVal - 1];
}
		