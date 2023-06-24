    const all = AllInstances.get(this);
    if (all) {
        for (const ref of all) {
            const e = ref.deref();
            if (e !== undefined && e._class()._eqEq(this))	//we never remove elements, and some elements of a different class could sneak in as a result of become or changeClass
                return e;
        }
        //we have reached the end
        return nil;
    }
