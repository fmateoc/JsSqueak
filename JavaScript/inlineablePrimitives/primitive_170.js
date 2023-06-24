    const val = this.valueOf();
    if ((val >>> 0) === val && val < 0x40000000 && (val & 0x3FFFFF) < 0x110000) {
        return val < 0x110000 ? String.fromCodePoint(val) : SmalltalkGlobals._Character.from([val]);
    }
