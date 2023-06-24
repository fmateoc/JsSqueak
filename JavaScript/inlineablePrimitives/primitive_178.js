    if(true) {
        const jsArray = [];
        for (const [clazz, instances] of AllInstances) {
            for (const holder of instances) {
                const val = holder.deref();
                if (val !== undefined && val._class() === clazz)	//we never remove elements, and some elements of a different class could sneak in as a result of become or changeClass (those would be duplicated in this enumeration)
                    jsArray.push(val);
            }
        }
        const result = SmalltalkGlobals._Array.primitive_70_impl()[1];
        result.pointers = jsArray;
        return result;
    }
