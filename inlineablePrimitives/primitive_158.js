if (this.storageType === "bytes" && arg1.storageType === "bytes" && arg2.storageType === "bytes") {
    const string1 = this.bytes;
    const string2 = arg1.bytes;
    const order = arg2.bytes;
    const len1 = string1.length, len2 = string2.length, len = Math.min(len1, len2);
    for (let i = 0; i < len; i++) {
        const c1 = order[string1[i]];
        const c2 = order[string2[i]];
        if (c1 !== c2) {
            return c1 < c2 ? -1 : 1;
        }
    }
    return len1 === len2 ? 0 : (len1 < len2 ? -1 : 1);
}
