	if (arg1._class() && arg1._class().name === '_ByteSymbol' && arg1.valueOf().length > 0 && arg2._class() && arg2._class().name === '_Array' &&
		typeof arg3 === 'function' && this instanceof arg3) {
		const args = arg2.pointers;
		const mappedSelector = SmalltalkUtils.mappingForSelector(arg1.string);
		const func = arg3.prototype[mappedSelector];
		if (typeof func === "function") {
			switch (mappedSelector) {
				case '_class':
				case '_eqEq':
				case '_notEqEq':
					return func.apply(this, args);
				default:
					if (func.name === 'bound DNU' || !(func.compiledMethod instanceof SmalltalkGlobals._CompiledMethod) || func.length === args.length) {
						return yield * func.apply(this, args);
					}
			}
		}
	}