    //not a real implementation, JavaScript does not have an FFI
    const argVal = arg.valueOf();
    if(typeof argVal === 'boolean' && typeof this.valueOf() === 'object') {
        const previous = !!this.pinned;
        this.pinned = argVal;
        return previous
    }
