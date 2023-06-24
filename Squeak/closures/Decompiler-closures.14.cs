'From Squeak4.5 of 10 April 2015 [latest update: #13712] on 19 June 2023 at 11:54:55 pm'!Object subclass: #TestResult	instanceVariableNames: 'timeStamp failures errors passed failureCauses '	classVariableNames: ''	poolDictionaries: ''	category: 'SUnit-Kernel'!!CompiledMethod methodsFor: 'comparing' stamp: 'fm 6/18/2023 18:07'!hasSameLiteralsExceptPropertiesAs: aMethod	"Answer whether the receiver has the same sequence of literals as the argument.	 Compare the last literal, which is the class association, specially so as not to	 differentiate between otherwise identical methods installed in different classes.	 Compare the first literal carefully if it is the binding informaiton for an FFI or	 external primitive call.  Don't compare all of the state so that linked and unlinked	 methods are still considered equal."	| numLits fakeLiterals aMethodLits selfLits aMethodActualLits aMethodLast aMethodProps selfActualLits selfLast selfProps |	fakeLiterals := MessageNode classPool at: #MacroSelectors.	selfLits := self literals.	selfActualLits := selfLits reject: [:lit | fakeLiterals includes: lit].	aMethodLits := aMethod literals.	aMethodActualLits := aMethodLits reject: [:lit | fakeLiterals includes: lit].	numLits := selfActualLits size.	numLits = aMethodActualLits size ifFalse: [^false].	selfProps := selfLits at: selfLits size - 1.	selfLast := selfLits last.	aMethodProps := aMethodLits at: aMethodLits size - 1.	aMethodLast := aMethodLits last.	1 to: numLits do:		[:i| | lit1 lit2 |		lit1 := selfActualLits at: i.		lit2 := aMethodActualLits at: i.		(lit1 == lit2 or: [lit1 literalEqual: lit2]) ifFalse:			[(i = 1 and: [#(117 120) includes: self primitive])				ifTrue:					[lit1 isArray						ifTrue:							[(lit2 isArray and: [(lit1 first: 2) = (lit2 first: 2)]) ifFalse:								[^false]]						ifFalse: "ExternalLibraryFunction"							[(lit1 analogousCodeTo: lit2) ifFalse:								[^false]]]				ifFalse:					[((lit1== selfProps and: [lit2 == aMethodProps])	"ignore properties"						or: "last literal (methodClassAssociation) of class-side methods is not unique"							[lit1== selfLast and: [lit2 == aMethodLast							 and: [lit1 isVariableBinding and: [lit1 value isBehavior							 and: [lit2 isVariableBinding and: [lit2 value isBehavior]]]]]]) ifFalse:								[^false]]]].	^true! !!CompiledMethod methodsFor: 'comparing' stamp: 'fm 2/22/2023 00:18'!sameWithoutTrailerAs: aMethod	| offset |	self == aMethod ifTrue:		[^true].	(aMethod isCompiledMethod	 and: [(self header bitOr: (16rFF bitShift: 9)) = (aMethod header bitOr: (16rFF bitShift: 9))]) ifFalse:"excludes numLiterals comparison."		[^false].	offset := aMethod initialPC - self initialPC.	self initialPC to: self endPC do:		[:i | (self at: i) = (aMethod at: i + offset) ifFalse: [^false]].	^self hasSameLiteralsExceptPropertiesAs: aMethod! !!CompiledMethod methodsFor: 'decompiling' stamp: 'fm 1/21/2023 12:50'!encoderClass	^self isBlueBookCompiled		ifTrue: [EncoderForV3]		ifFalse: [EncoderForV3PlusClosures]! !!Decompiler methodsFor: 'instruction decoding' stamp: 'fm 6/19/2023 23:37'!jump: dist if: condition	| savePc sign elsePc elseStart end cond ifExpr thenBlock elseBlock	  thenJump elseJump condHasValue isIfNil saveStack blockBody blockArgs selector arguments |	lastJumpIfPcStack addLast: lastPc.	stack last == CascadeFlag ifTrue: [^ [self case: dist] ensure: [lastJumpIfPcStack removeLast]].	elsePc := lastPc.	elseStart := pc + dist.	end := limit.	"Check for bfp-jmp to invert condition.	Don't be fooled by a loop with a null body."	sign := condition.	savePc := pc.	self interpretJump ifNotNil:		[:elseDist|		 (elseDist >= 0 and: [elseStart = pc]) ifTrue:			 [sign := sign not.  elseStart := pc + elseDist]].	pc := savePc.	ifExpr := stack removeLast.	(isIfNil := stack size > 0 and: [stack last == IfNilFlag]) ifTrue:		[stack removeLast].	saveStack := stack.	stack := OrderedCollection new.	thenBlock := self blockTo: elseStart.	condHasValue := hasValue or: [isIfNil].	"ensure jump is within block (in case thenExpr returns)"	thenJump := exit <= end ifTrue: [exit] ifFalse: [elseStart].	"if jump goes back, then it's a loop"	thenJump < elseStart		ifTrue:			["Must be a while loop...			  thenJump will jump to the beginning of the while expr.  In the case of while's			  with a block in the condition, the while expr should include more than just			  the last expression: find all the statements needed by re-decompiling."			stack := saveStack.			pc := thenJump.			blockBody := self statementsTo: elsePc.			"discard unwanted statements from block"			blockBody size - 1 timesRepeat: [statements removeLast].			blockArgs := thenBlock statements = constructor codeEmptyBlock statements							ifTrue: [#()]							ifFalse: [{ thenBlock }].			selector := blockArgs isEmpty							ifTrue: [sign ifTrue: [#whileFalse] ifFalse: [#whileTrue]]							ifFalse: [sign ifTrue: [#whileFalse:] ifFalse: [#whileTrue:]].			statements addLast:				(constructor					codeMessage: (constructor codeBlock: blockBody returns: false)					selector: (constructor codeSelector: selector code: #macro)					arguments: blockArgs).			pc := elseStart.			selector == #whileTrue: ifTrue:				[self convertToDoLoopFrom: thenJump to: elseStart]]		ifFalse:			["Must be a conditional..."			elseBlock := self blockTo: thenJump.			elseJump := exit.			"if elseJump is backwards, it is not part of the elseExpr"			elseJump < elsePc ifTrue:				[pc := lastPc].			cond := isIfNil						ifTrue:							[constructor								codeMessage: ifExpr ifNilReceiver								selector: (constructor											codeSelector: (sign ifTrue: [#ifNotNil:] ifFalse: [#ifNil:])											code: #macro)								arguments: (Array with: thenBlock)]						ifFalse:							[arguments := sign								ifTrue: [{elseBlock. thenBlock}]								ifFalse: [{thenBlock. elseBlock}].							(constructor								decodeIfNilWithReceiver: ifExpr								selector: #ifTrue:ifFalse:								arguments: arguments								from: savePc								to: pc								for: self) 									ifNil: [constructor											codeMessage: ifExpr											selector: (constructor codeSelector: #ifTrue:ifFalse: code: #macro)											arguments:	 arguments]].			stack := saveStack.			condHasValue				ifTrue: [stack addLast: cond]				ifFalse: [statements addLast: cond]].	lastJumpIfPcStack removeLast.! !!Decompiler methodsFor: 'instruction decoding' stamp: 'fm 4/23/2023 14:28'!send: selector super: superFlag numArgs: numArgs	| args rcvr selNode msgNode messages |	stack isEmpty ifTrue: ["unreachable code"		^self].	args := Array new: numArgs.	(numArgs to: 1 by: -1) do:		[:i | args at: i put: stack removeLast].	rcvr := stack removeLast.	superFlag ifTrue: [rcvr := constructor codeSuper].	((#(blockCopy: closureCopy:copiedValues:) includes: selector)	  and: [self checkForBlock: rcvr selector: selector arguments: args]) ifFalse:		[selNode := constructor codeAnySelector: selector.		rcvr == CascadeFlag			ifTrue:				["May actually be a cascade or an ifNil: for value."				self willJumpIfFalse					ifTrue: "= generated by a case macro"						[selector == #= ifTrue:							[" = signals a case statement..."							statements addLast: args first.							stack addLast: rcvr. "restore CascadeFlag"							^ self].						selector == #== ifTrue:							[" == signals an ifNil: for value..."							stack removeLast; removeLast.							rcvr := stack removeLast.							stack addLast: IfNilFlag;								addLast: (constructor									codeMessage: rcvr									selector: selNode									arguments: args).							^ self]]					ifFalse:						[(self willJumpIfTrue and: [selector == #==]) ifTrue:							[" == signals an ifNotNil: for value..."							stack removeLast; removeLast.							rcvr := stack removeLast.							stack addLast: IfNilFlag;								addLast: (constructor									codeMessage: rcvr									selector: selNode									arguments: args).							^ self]].				msgNode := constructor								codeCascadedMessage: selNode								arguments: args.				stack last == CascadeFlag ifFalse:					["Last message of a cascade"					statements addLast: msgNode.					messages := self popTo: stack removeLast.  "Depth saved by first dup"					msgNode := constructor									codeCascade: stack removeLast									messages: messages]]			ifFalse:				[msgNode := constructor							codeMessage: rcvr							selector: selNode							arguments: args].		stack addLast: msgNode]! !!Decompiler methodsFor: 'public access' stamp: 'fm 2/9/2023 15:36'!decompileNoPreen: aSelector in: aClass method: aMethod using: aConstructor	| block node |	constructor := aConstructor.	method := aMethod.	self initSymbols: aClass.  "create symbol tables"	method isQuick		ifTrue: [block := self quickMethod]		ifFalse: 			[stack := OrderedCollection new: method frameSize.			lastJumpIfPcStack := OrderedCollection new.			caseExits := OrderedCollection new.			statements := OrderedCollection new: 20.			numLocalTemps := 0.			super method: method pc: method initialPC.			"skip primitive error code store if necessary"			(method primitive ~= 0 and: [self willStore]) ifTrue:				[pc := pc + 2.				 tempVars := tempVars asOrderedCollection].			block := self blockTo: method endPC + 1.			stack isEmpty ifFalse: [self error: 'stack not empty']].	node := constructor				codeMethod: aSelector				block: block				tempVars: tempVars				primitive: method primitive				class: aClass.	method primitive > 0 ifTrue:		[node removeAndRenameLastTempIfErrorCode].	^node ! !!Decompiler methodsFor: 'private' stamp: 'fm 3/10/2023 00:43'!blockScopeOf: refPc refersToTemp: offset from: start to: end	| byteCode extension scanner scan maybeMatches |	scanner := InstructionStream on: method. 	scan := offset <= 15				ifTrue:					[byteCode := 16 + offset.					 [:instr |					  instr = byteCode]]				ifFalse:					[extension := 64 + offset.					 [:instr |					  instr = 128 and: [scanner followingByte = extension]]].	maybeMatches := self scanBlockScopeFor: refPc from: method initialPC to: end with: scan scanner: scanner.	^maybeMatches ~~ self and: [maybeMatches anySatisfy: [:a | a between: start and: end - 1]]! !!Decompiler methodsFor: 'private' stamp: 'fm 3/10/2023 00:44'!convertToDoLoopFrom: thenJump to: elseStart	"If statements contains the pattern		var := startExpr.		[var <= limit] whileTrue: [...statements... var := var + incConst]	then replace this by		startExpr to: limit by: incConst do: [:var | ...statements...]"	| leaveOnStack initStmt toDoStmt limitStmt |	leaveOnStack := false. 	(stack notEmpty	 and: [(stack last) isKindOf: AssignmentNode])		ifTrue:			[(initStmt := stack last) variable isTemp ifFalse:				[^self].			((self blockScopeOf: thenJump refersToTemp: initStmt variable fieldOffset from: method initialPC to: thenJump) or:			[self blockScopeOf: thenJump refersToTemp: initStmt variable fieldOffset from: elseStart to: method endPC]) ifTrue:				[^self].			 (toDoStmt := statements last toDoFromWhileWithInit: initStmt) ifNil:				[^self].			 stack removeLast.			 statements removeLast; addLast: toDoStmt.			 leaveOnStack := true]		ifFalse:			[statements size < 2 ifTrue:				[^self].			initStmt := statements at: statements size-1.			((initStmt isKindOf: AssignmentNode)			 and: [initStmt variable isTemp]) ifFalse:				[^self].			((self blockScopeOf: thenJump refersToTemp: initStmt variable fieldOffset from: method initialPC to: thenJump) or:			[self blockScopeOf: thenJump refersToTemp: initStmt variable fieldOffset from: elseStart to: method endPC]) ifTrue:				[^self].			(toDoStmt := statements last toDoFromWhileWithInit: initStmt) ifNil:				[^self].			statements removeLast; removeLast; addLast: toDoStmt].	initStmt variable scope: -1.  "Flag arg as block temp"	"Attempt further conversion of the pattern		limitVar := limitExpr.		startExpr to: limitVar by: incConst do: [:var | ...statements...]	to		startExpr to: limitExpr by: incConst do: [:var | ...statements...].	The complication here is that limitVar := limitExpr's value may be used, in which case it'll	be statements last, or may not be used, in which case it'll be statements nextToLast."	statements size < 2 ifTrue:		[leaveOnStack ifTrue:			[stack addLast: statements removeLast].			 ^self].	limitStmt := statements last.	((limitStmt isKindOf: AssignmentNode)		and: [limitStmt variable isTemp		and: [limitStmt variable == toDoStmt arguments first]]) ifFalse:			[limitStmt := statements at: statements size-1.			((limitStmt isKindOf: AssignmentNode)				and: [limitStmt variable isTemp				and: [limitStmt variable == toDoStmt arguments first]]) ifFalse:					[leaveOnStack ifTrue:						[stack addLast: statements removeLast].					^self]].	(self blockScopeRefersOnlyOnceToTemp: limitStmt variable fieldOffset) ifFalse:		[^self].	toDoStmt arguments at: 1 put: limitStmt value.	limitStmt variable scope: -2.  "Flag limit var so it won't print"	statements last == limitStmt		ifTrue: [statements removeLast]		ifFalse: [statements removeLast; removeLast; addLast: toDoStmt]! !!Decompiler methodsFor: 'private' stamp: 'fm 2/21/2023 23:32'!scanBlockScopeFor: refpc from: startpc to: endpc with: scan scanner: scanner	| bsl maybeBlockSize matches |	bsl := BlockStartLocator new.	scanner pc: startpc.	[scanner pc <= endpc] whileTrue:		[refpc = scanner pc ifTrue:			[scanner pc: startpc.			matches := OrderedCollection new.			 [scanner pc <= endpc] whileTrue:				[(scan value: scanner firstByte) ifTrue:					[matches add: scanner pc].				 (maybeBlockSize := scanner interpretNextInstructionFor: bsl) isInteger ifTrue:					[scanner pc: scanner pc + maybeBlockSize]].			   ^matches].		 (maybeBlockSize := scanner interpretNextInstructionFor: bsl) isInteger ifTrue:			[refpc <= (scanner pc + maybeBlockSize)				ifTrue: [^self scanBlockScopeFor: refpc from: scanner pc to: scanner pc + maybeBlockSize with: scan scanner: scanner]				ifFalse: [scanner pc: scanner pc + maybeBlockSize]]]! !!DecompilerConstructor methodsFor: 'constructor' stamp: 'fm 1/28/2023 00:44'!codeMessage: receiver selector: selector arguments: arguments	| symbol |	symbol := selector key.	(BraceNode new			matchBraceWithReceiver: receiver			selector: symbol			arguments: arguments) ifNotNil: [:node| ^node].	(self		decodeLiteralVariableValueDereferenceWithReceiver: receiver		selector: symbol		arguments: arguments) ifNotNil: [:node| ^node].	^MessageNode new			receiver: receiver selector: selector			arguments: arguments			precedence: symbol precedence! !!DecompilerConstructor methodsFor: 'constructor' stamp: 'fm 6/19/2023 23:38'!decodeIfNilWithReceiver: receiver selector: selector arguments: arguments from: startpc to: endpc for: decompiler	| initStmt node temp |	receiver ifNil: [ ^nil ].		"For instance, when cascading"	selector == #ifTrue:ifFalse:		ifFalse: [^ nil].	(receiver isMessage: #==				receiver: nil				arguments: [:argNode | argNode == NodeNil])		ifFalse: [^ nil].	(initStmt := receiver receiver) isAssignmentNode ifTrue: [		temp := initStmt variable.		(temp isTemp and: [temp isRemote not])			ifFalse: [^ nil].		(initStmt value isParentOf: temp) 			ifTrue: [^ nil].		(arguments first isParentOf: temp) 			ifTrue: [^ nil].		arguments second nodesDo: [:e | 			(e isAssignmentNode and: [e variable key = temp key]) ifTrue: 				[^nil]].		((decompiler blockScopeOf: startpc refersToTemp: temp fieldOffset from: method initialPC to: startpc) or:		[decompiler blockScopeOf: startpc refersToTemp: temp fieldOffset from: endpc to: method endPC]) ifTrue:			[^nil].	].	arguments do: [:arg| arg noteOptimizedIn: self].	((temp notNil or: [initStmt isVariableNode]) and: [arguments second isJust: (temp ifNil: [initStmt])]) ifTrue: [		^MessageNode new			receiver: initStmt value			selector: (self codeSelector: #ifNil: code: #macro)			arguments: (Array with: arguments first)			precedence: 3	].	node := (MessageNode new			receiver: receiver			selector: (self codeSelector: #ifNil:ifNotNil: code: #macro)			arguments: arguments			precedence: 3).	temp ifNil: [^ node].	temp scope: -1.	temp beBlockArg.	node arguments: {		arguments first.		arguments second copy arguments: { temp }; yourself }.					^ node! !!DecompilerConstructor methodsFor: 'constructor' stamp: 'fm 2/9/2023 23:57'!test: aTest	(comment := aTest) ifNotNil: [comment := comment , aTest]! !!MessageNode methodsFor: 'macro transformations' stamp: 'fm 1/21/2023 09:47'!toDoFromWhileWithInit: initStmt	"Return nil, or a to:do: expression equivalent to this whileTrue:"	| variable incrStmt increment limit toDoBlock body test toDoMsg |	(selector key == #whileTrue:	 and: [initStmt isAssignmentNode	 and: [initStmt variable isTemp]]) ifFalse:		[^nil].	body := arguments last.	variable := initStmt variable.	incrStmt := body statements last.	(increment := incrStmt toDoIncrement: variable) ifNil:		[^nil].	receiver statements size ~= 1 ifTrue:		[^nil].	(test := receiver statements first) isMessageNode ifFalse: 		[^nil].	limit := (test receiver = variable and: 			[(test selector key = #<= and: [increment key > 0]) or: [test selector key = #>= and: [increment key < 0]]])				ifTrue: [ test arguments first ]				ifFalse: [					(((test selector key = #>= and: [increment key > 0]) or: [test selector key = #<= and: [increment key < 0]]) and: 					[test arguments first = variable])						ifTrue: [ test receiver ]						ifFalse: [^nil]].		"The block must not overwrite the limit"	(limit isVariableNode and: [limit isArg not])		ifTrue: 			[body nodesDo: [:e | 				(e isAssignmentNode and: [e variable key = limit key]) ifTrue: 					[^nil]]]		ifFalse:			[(limit isArg not and: [limit isConstantNumber not]) ifTrue:				[^nil]].	"The block must not overwrite the variable (outside the last statement)"	body nodesDo: [:e | 		(e isAssignmentNode and: [e ~~ incrStmt and: [e variable key = variable key]]) ifTrue: 			[^nil]].	toDoBlock := BlockNode statements: body statements allButLast returns: false.	toDoBlock arguments: (Array with: variable).	toDoBlock temporaries: body temporaries.	variable scope: -1.	variable beBlockArg.	toDoMsg := MessageNode new		receiver: initStmt value		selector: (SelectorNode new key: #to:by:do: code: #macro)		arguments: (Array with: limit with: increment with: toDoBlock)		precedence: precedence.	toDoBlock noteOptimizedIn: toDoMsg.	^toDoMsg! !!TestResult methodsFor: 'running' stamp: 'fm 3/6/2023 23:45'!runCase: aTestCase	| testCasePassed |	testCasePassed := true.	[[[aTestCase runCase]		on: self class failure		do: [:signal | 			| o |			o := failureCauses at: aTestCase printString ifAbsentPut: [failures add: aTestCase. OrderedCollection new].			o add: signal printString.			testCasePassed := false.			signal return: false]]		on: BreakPoint		do: [:signal | "skip when running, active when debugging"			signal resume]]		on: self class exError		do: [:signal | 			| o |			o := failureCauses at: aTestCase printString ifAbsentPut: [errors add: aTestCase. OrderedCollection new].			o add: signal printString.			testCasePassed := false.			signal return: false].	testCasePassed		ifTrue: [passed add: aTestCase].! !!TestResult methodsFor: 'initialization' stamp: 'fm 6/18/2023 18:05'!initialize	super initialize.	passed := OrderedCollection new.	failures := Set new.	errors := OrderedCollection new.	timeStamp := TimeStamp now.	failureCauses := Dictionary new! !Object subclass: #TestResult	instanceVariableNames: 'timeStamp failures errors passed failureCauses'	classVariableNames: ''	poolDictionaries: ''	category: 'SUnit-Kernel'!