	if (this.pointers[2] === arg._class().pointers[2]) {
		if(Object.getPrototypeOf(arg) !== this.prototype) {
			Object.setPrototypeOf(arg, this.prototype);
			const aInstances = AllInstances.get(arg._class());
			if (aInstances)
				aInstances.addWeakly(arg);
		}
	    return this;
	}
