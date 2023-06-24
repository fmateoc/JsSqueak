    const clazz = this._class();
    const all = AllInstances.get(clazz);
    if (all) {
        const length = all.length;
        let r = 0;
        for (const ref of all) {
            if (ref.deref() === this) {
                for (r++; r < length; r++) {
                    const element = all[r].deref();
                    if (element !== undefined && element._class()._eqEq(clazz))	//we never remove elements, and some elements of a different class could sneak in as a result of become or changeClass
                        return element;
                }
                //we have reached the end
                break;
            }
            r++;
        }
        let notReached = true;
        for (const [cls, instances] of AllInstances) {
            if (cls !== clazz && notReached)
                continue;
            if (cls === clazz)
                notReached = false;
            else {
                for (const holder of instances) {
                    const val = holder.deref();
                    if (val !== undefined && val._class()._eqEq(cls))
                        return val;
                }
            }
        }
        for (const [cls, instances] of AllInstances) {
            for (const holder of instances) {
                const val = holder.deref();
                if (val !== undefined && val._class()._eqEq(cls))
                    return val;
            }
        }
    }
