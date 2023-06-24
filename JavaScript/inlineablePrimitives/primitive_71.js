	try{
		const [test, result] = this.primitive_71_impl(arg);
		if(test) return result;
	} catch(e){
		yield* SmalltalkVM.debug();
	}
