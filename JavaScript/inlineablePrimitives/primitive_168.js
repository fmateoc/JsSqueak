const storageType = arg.storageType;
if (storageType === this.storageType) {
    const argStorage = arg[storageType],
        thisStorage = this[storageType];
    if (argStorage && thisStorage) {
        const argLength = argStorage.length,
            thisLength = thisStorage.length;
        if (argLength && thisLength) {
            const argClass = arg._class(),
                thisClass = this._class();
            if(argClass === thisClass) {
                let len = argLength;
                if (thisLength < len)
                    len = thisLength;
                for(let i = 0; i < len; i++)
                    thisStorage[i] = argStorage[i];
                return this;
            }
            const argInstSize = arg.instSize,
                thisInstSize = this.instSize;
            if (argInstSize && thisInstSize) {
                let argInstvars = [],
                    thisInstvars = [],
                    pointers = argClass.pointers;
                while(pointers !== undefined) {
                    argInstvars = [...pointers[3].pointers, ...argInstvars];
                    pointers = pointers[0].pointers;
                }
                pointers = thisClass.pointers;
                while(pointers !== undefined) {
                    thisInstvars = [...pointers[3].pointers, ...thisInstvars];
                    pointers = pointers[0].pointers;
                }
                let len = argInstSize;
                if (thisInstSize < len)
                    len = thisInstSize;
                for(let i = 0; i < len; i++)
                    if (thisInstvars[i].valueOf() === argInstvars[i].valueOf())
                        thisStorage[i] = argStorage[i];
            }
            const argBasicSize = argLength - argInstSize,
                thisBasicSize = thisLength - thisInstSize;
            if (argBasicSize && thisBasicSize) {
                let len = argBasicSize;
                if (thisBasicSize < len)
                    len = thisBasicSize;
                if (arg.isWeak === this.isWeak) {
                    for (let i = 0; i < len; i++)
                        thisStorage[thisInstSize + i] = argStorage[argInstSize + i];
                } else if (arg.isWeak) {
                    for (let i = 0; i < len; i++)
                        thisStorage[thisInstSize + i] = argStorage[argInstSize + i].deref() || nil;
                } else {
                    for (let i = 0; i < len; i++)
                        thisStorage[thisInstSize + i] = new WeakRef(Object(argStorage[argInstSize + i]));
                }
            }
        }
    }
    return this;
}