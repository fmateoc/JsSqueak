	if (this._class().pointers[2] === arg._class().pointers[2]) {
		if(Object.getPrototypeOf(this) !== arg._class().prototype) {
			Object.setPrototypeOf(this, arg._class().prototype);
			const aInstances = AllInstances.get(this._class());
			if (aInstances)
				aInstances.addWeakly(this);
			}
		return this;
	}
