    const val = this.valueOf();
    if (typeof val === "number") {
        return Math.imul(val, 1664525) >>> 0;
    } else if(typeof val === "bigint") {
        return Number(((val & 0xFFFFFFFFn) * 1664525n) & 0xFFFFFFFFn);
    }

