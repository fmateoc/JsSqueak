	try{
		const [test, result] = this.primitive_71_impl(arg);
		if(test) return result;
	} catch(e){
		const argVal = arg.valueOf();
		if ((argVal >>> 0) !== argVal) // if it's a positive 31 bits integer, it's a normal allocation (and thus primitive) failure
			yield* SmalltalkVM.debug();
	}
