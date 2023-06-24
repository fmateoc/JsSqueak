try {
    if (arguments.length === 0) {
        let str, success= null;
        navigator.clipboard.readText().then(function(clip) {
//            console.log("successfully read from clipboard " + clip);
            str = clip.valueOf();
            success = true;
        }, function(reason) {
            console.log("failed to read from clipboard: " + reason);
            success = false;
        });
        while (success === null)
            yield "waiting for clipboard read";
        if (success && typeof str === 'string')
            return /^[\p{ASCII}]+$/u.test(str) ? SmalltalkGlobals._ByteString.from(str) : SmalltalkGlobals._WideString.from(str);
    } else {
        const argVal = arg.valueOf();
        if (argVal) {
            let success = null;
            navigator.clipboard.writeText(argVal).then(function() {
//                console.log("successfully written to clipboard " + argVal);
                success = true;
            }, function(reason) {
                console.log("failed to write to clipboard: " + reason);
                success = false;
            });
            while (success === null)
                yield "waiting for clipboard write";
            if (success)
                return this;
        }
    }
} catch (aJavaScriptError) {
    yield* SmalltalkVM.debug();
}
