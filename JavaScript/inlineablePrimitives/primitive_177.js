    const all = AllInstances.get(this);
    if (all) {
        const jsArray = [];
        for (const ref of all) {
            const e = ref.deref();
            if (e !== undefined && e._class()._eqEq(this))
                //we never remove elements (e.g. when an instance changes class),
                //so some instances of a different class could sneak in as a result of become or changeClass
                jsArray.push(e);
        }
        return SmalltalkGlobals._Array.from(jsArray);
    }
