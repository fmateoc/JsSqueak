	if (Number.isSafeInteger(arg.valueOf())) {
        this.pointers[2] = arg.valueOf();
        return this;
    } else
        this.pointers[2] = 0;
