const argVal = arg.valueOf();
if(typeof argVal === "number" && (argVal | 0) === argVal && argVal > 0 && this.words && argVal <= this.words.length * 2) {
    return this.wordsAsInt16Array()[argVal - 1];
}
		