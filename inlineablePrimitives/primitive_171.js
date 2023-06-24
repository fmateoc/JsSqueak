    if (this instanceof SmalltalkGlobals._Float) {
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, this.valueOf(), false);      // for accessing IEEE-754 exponent bits
        return (data.getUint32(0, false) & 1048575) * 0x0100000000 + data.getUint32(4, false);
    } else if (this instanceof SmalltalkGlobals._Character)
        return this.pointers[0];
    else if (typeof this.valueOf() === "string")
        return this.codePointAt(0);