    const val = this.valueOf();
    if (Number.isFinite(val)) {
        if (val === 0)
            return -1;     // zero is special
        const data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, val, false);      // for accessing IEEE-754 exponent bits
        let bits = (data.getUint32(0, false) >>> 20) & 0x7FF;
        if (bits === 0) { // we have a subnormal float (actual zero was handled above)
            // make it normal by multiplying a large number
            data.setFloat64(0, val * 0x10000000000000000, false);
            // access its exponent bits, and subtract the large number's exponent
            bits = ((data.getUint32(0, false) >>> 20) & 0x7FF) - 64;
        }
        return bits - 1023;                 // apply bias
    } else {
        return -2;
    }
