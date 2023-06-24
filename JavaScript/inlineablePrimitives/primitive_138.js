    if(true) {
        for (const [clazz, instances] of AllInstances) {
            for (const holder of instances) {
                const val = holder.deref();
                if (val !== undefined && val._class()._eqEq(clazz))	//we never remove elements, and some elements of a different class could sneak in as a result of become or changeClass (those would be duplicated in this enumeration)
                    return val;
            }
        }
    }
