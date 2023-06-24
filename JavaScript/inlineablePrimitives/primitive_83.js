	const args = Array.prototype.slice.call(arguments);
	const selector = args.shift();
	if (selector._class() && selector._class().name === '_ByteSymbol' && selector.valueOf().length > 0) {
		const mappedSelector = SmalltalkUtils.mappingForSelector(selector.string);
		const func = this[mappedSelector];
		if (typeof func === "function") {
			switch (mappedSelector) {
				case '_class':
					if (args.length === 0)
						return this._class();
					break;
				case '_eqEq':
				case '_notEqEq':
					if (args.length === 1)
						return func.apply(this, args);
					break;
				default:
					if (func.name === 'bound DNU' || !(func.compiledMethod instanceof SmalltalkGlobals._CompiledMethod) || func.length === args.length) {
						return yield * func.apply(this, args);
					}
			}
		}
	}
