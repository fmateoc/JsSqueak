# JsSqueak - JavaScript transpiled Squeak

This is a project that brings together several themes that have preoccupied me for a long time.
I have been thinking about (AOT) compiling Smalltalk since I was young, as I was both obsessed with performance and a big Smalltalk fan.
Now, of course, this is not quite it, but I thought the original spark was worth mentioning.
It is also, of course, inspired by Dan Ingalls' Squeak variations Potato, JSqueak and LivelyKernel, by Vanessa Freudenberg's SqueakJS and by HPI's GraalSqueak/TruffleSqueak.
More indirectly, I have also been inspired by Alon Zakai's Emscripten.
Last, but not least, the project draws from some of my professional experiences with code transformations/transpilation: I have worked on Synchrony Systems' SMTJ IDE for Smalltalk code transformations/type inferencing/translation to Java, so I knew firsthand that compiling Smalltalk to another language was possible. And JavaScript being a dynamic language as well made it possible to skip the troublesome type inferencing part of the process.

Please see the docs folder for some implementation notes. Speaking of implementation, I should mention here Peter Deutsch' observation: “ implementing a language like Smalltalk efficiently requires the
implementor to cheat... but that’s okay as long as you don’t get caught”. So, where am I cheating? There are no reified contexts in the implementation, but I would argue that reified contexts are not essential to the meaning of Smalltalk in general, or Squeak in particular.
One other small difference that I contend is still within Smalltalk semantics is having immediates for LargeInteger (they are mapped to BigInt).
Other than the above, the one problematic area is the lack of control over the garbage collector (we rely on the native JavaScript one), and, related to that, a forwardBecome: native operation in JavaScript. Given that the semantics of forwardBecome: are linked to object pointers, over which we do not have control, the implementation is only an approximation. It works well enough that the image and most tests (other than the ones forward becoming locals) is behaving similarly.
For two-way become, it is conceptually easier, as, instead of swapping the pointers to the objects, we are swapping the contents of the objects, but this is not an externally observable operation.

For running JsSqueak, one must first translate their Squeak image into JavaScript.
Image versions between 4.5 and 6.0, or trunk (up to, as of this writing, 6.1alpha-22667) should work - I have tested with 4.5, 5.3, 6.0, and partially with trunk.
The image should be reasonably clean, i.e. it should not have "dirty" editors with unsaved changes to methods, and it should not have open inspectors or debuggers.
There are a few Squeak changesets in the Squeak folder that need to be loaded in the target image:
1. from Squeak/common load first the Common-pre changeset.
2. for closure-based images (since 4.5, but before FullBlockClosure was introduced), load the two changesets from Squeak/closures; for fullClosures-based images, load the two changesets from Squeak/fullClosures
3. load the JSGeneration changeset from Squeak/common. This one hits an out of range error at compile time for one test method, just let it proceed
4. in a workspace, evaluate "JavaScriptTranspiler newInstance exportJavaScriptTo: 'PathToJsSqueakFolder\' for: imageName"
   This will generate the translated classes and code in a 'JavaScript\generated\' imageName-specific folder within your JsSqueak folder
5. still in a workspace, evaluate "JavaScriptTranspiler instance exportStateTo: 'PathToJsSqueakFolder\' for: imageName", then immediately minimize the image to avoid generating any new objects while the image state is being exported.
   This will generate a few files with the image state in the same imageName-specific folder. To know when it is done, for now, check the folder until the file serialized_Smalltalk_globals.js stops growing - a clean 4.5 image should result in a 30MB file, a clean 6.0 image should result in a slightly over 100MB file.
6. to start the image in the browser, I use a Webstorm IDE run configuration. Configure your favorite Chrome (I am using Chrome Beta to have a separate install), point it to something like https://localhost:63342/JavaScript/index.html#imageName
   and use the flags --js-flags="--expose-gc --stack-size 8000 --ignore-certificate-errors"


Note that the generated images will include some extra, JavaScript-specific tooling: 
1. although the filesystem is mainly part of the browser storage, I have implemented external fileIn/fileOut for changesets, to compensate for the fact that the image is not saveable itself
2. there is a JS inspector that allows you to go beyond the image view of the objects and look at the internal (JavaScript) representation. 
3. There is JavaScript evaluation, but keep in mind that the snippet will be the body of a JavaScript function, therefore, unlike Smalltalk blocks, it requires explicit return keywords in order to return anything.
4. There is a new option for viewing the code pane, "JavaScript". This works in the Squeak image itself as well (after loading the changesets), showing the transalted JavaScript sources.
5. There is a handy shortcut for debugging the translation process for a specific method, using the binary selector #>>| , the expression "SomeClass >>| #someSelector" returns the translated source for the compiled method "SomeClass >> #someSelector"
6. There is a way of embedding/interacting with JavaScript code, as a specially formatted comment, see e.g. the method Browser>>annotation
	 
	 
As far as the plugins are concerned, although they are also generated (with some overrides), they require more effort and they do not change with the image - they are very slowly moving targets.
So, instead of requiring that all the users build a VMMaker image to generate the plugins, I have published the already generated plugins, alongside the changesets required for generating them. Some basic instructions:
1. open a clean 4.5 image (this is what was used for the original VMMakerJS for SqueakJS) 
2. load update-dtl.21 from the VMMaker repo in Monticello - this contains the latest VMMakerJS for SqueakJS (VMMakerJS-dtl.18), which I have used as a starting point
3. load the changeset Common-pre from Squeak/common
4. load the latest version of VMMaker (VMMaker-dtl.439 as of this writing) from the VMMaker repo, to get the latest plugin fixes - proceed through the several syntax errors, they do not affect the plugins that we generate
5. load the changeset VMMakerJS-fm from Squeak/plugins
6. load the changeset JSGeneration from Squeak/common
7. execute "JSCodeGenerator exportAll" - the method is just a convenience/example, it also contains a hardcoded local path that should be changed that before running; while running it, proceed through one Halt


Finally, a word about debugging: you do not need to run the JavaScript project with Dev Tools open, which slows things down significantly. 
If a halt or breakpoint in Squeak code is hit, an alert will pop up with instructions to open the browser's debugger. You can do your debugging session, after which you can resume and then close the Dev Tools again.
Alternatively, you can also choose to just hit OK in the alert (which is the equivalent of Squeak's debugger popup), to continue.
There are also VM-level asserts that raise a similar alert - these allow you to debug/inspect, try to determine the cause of the failure, but other than that these are essentially VM crashes, so in general they are non-recoverable.
Speaking of debugging, a pleasant surprise (not totally unexpected, but more rewarding that I had anticipated) was the removal of the barrier between the VM and the image that happens after translation. It truly is a pleasure to be able to just enter the primitives' (formerly VM) code naturally from the "Smalltalk" or "image" side, with just a debugger step into. This makes it, of course, much easier to develop/debug the primitives' code, or even the VM's process scheduler code, and allows for a more holistic view of your program. 
This should compensate somewhat for the suffering inflicted by the JavaScript syntax replacing the Smalltalk one ;).

Also, see testing-notes.txt in the docs folder for some testing suggestions.

And here is a link to a presentation I gave a year ago about the project at the UK Smalltalk users group: https://vimeo.com/663693415

For questions or discussions about the project, please use the Squeak-dev mailing list, tagging the subject line with [JsSqueak]