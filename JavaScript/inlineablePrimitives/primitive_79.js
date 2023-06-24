	const arg1Val = arg1.valueOf(), arg2Val = arg2.valueOf();
	if (arg1Val > 0 && (arg1Val | 0) === arg1Val && Number.isSafeInteger(arg2Val)) {
		const instance = new this(arg1Val);
		instance.literals = new Array(((SmalltalkGlobals.ImageFormat & 16) === 0 ? (arg2Val >> 9) & 255 : arg2Val & 32767) + 1);
		instance.literals[0] = arg2Val;
		Object.defineProperty(instance, 'func', {
			get() {
				delete this.func;
				const savedCounter = GlobalActivationCounter;
				GlobalActivationCounter = Number.MAX_SAFE_INTEGER;
				const recompiled = function*(_aCompiledMethod){
					let _decompiledMethodNode = yield* (function* zzzBlock1() {
						return yield* _aCompiledMethod._decompileWithTemps();
					})._on_do_(
						SmalltalkGlobals._Error,
						function* zzzBlock2(_e) {
							return yield* _aCompiledMethod._decompile();
						});
					const encoder = yield* _decompiledMethodNode._encoder();
					let bogusRange; 	/*transform blows up without it*/
					yield* (yield* _decompiledMethodNode._block())._accept_(
						yield* SmalltalkGlobals._ParseNodePostOrderEnumerator._ofBlock_(
							function* zzzBlock3(_node) {
								if (_node instanceof SmalltalkGlobals._MessageNode && (yield* _node._isOptimized())) {
									yield* encoder._noteSourceRange_forNode_( bogusRange = bogusRange || (bogusRange = SmalltalkGlobals._Interval.from( [1, 0, 1])),  _node);
									if ((yield* _node._macroPrinter()).valueOf() === 'printCaseOn:indent:') {
										const _caseNode = yield* (yield* _node._arguments())._first();
										let elements, size;
										if (_caseNode._class() === SmalltalkGlobals._BraceNode && (size = (elements = yield* _caseNode._elements()).length) > 0) {
											const jsArray = new Array(size).fill(nil);
											yield* _caseNode._elements_sourceLocations_( elements,  SmalltalkGlobals._Array.from( jsArray));
										}
									}
									yield* _node._transform_( encoder);
								}
							}));
					return yield* _decompiledMethodNode._generateWithTempNames();
				}(this).next().value;
				GlobalActivationCounter = savedCounter;
				if (recompiled === "DEBUGGER")
					return undefined;
				return this.func = recompiled.func; },
			set(val) {
				delete this.func;
				this.func = val;
			},
			enumerable: true,
			configurable: true
		});
		return instance;
	}
