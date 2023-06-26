# JsSqueak - JavaScript transpiled Squeak

This is a project that brings together several themes that have preoccupied me for a long time.
I have been thinking about (AOT) compiling Smalltalk since I was young, as I was both obsessed with performance and a big Smalltalk fan.
Now, of course, this is not quite it, but I thought the original spark was worth mentioning.
It is also, of course, inspired by Dan Ingalls' Squeak variations Potato, JSqueak and LivelyKernel, by Vanessa Freudenberg's SqueakJS and by HPI's GraalSqueak/TruffleSqueak.
More indirectly, I have also been inspired by Alon Zakai's Emscripten.
Last, but not least, the project draws from some of my professional experiences with code transformations/transpilation: I have worked on Synchrony Systems' SMTJ IDE for Smalltalk code transformations/type inferencing/translation to Java, so I knew firsthand that compiling Smalltalk to another language was possible. And JavaScript being a dynamic language as well made it possible to skip the troublesome type inferencing part of the process.

Please see the docs folder for some implementation notes.

For running JsSqueak, one must first translate their Squeak image into JavaScript.
Image versions between 4.5 and 6.0 should work - I have tested with 4.5, 5.3 and 6.0.
The image should be reasonably clean, i.e. it should not have "dirty" editors with unsaved changes to methods, and it should not have open inspectors or debuggers.
There are a few Squeak changesets in the Squeak folder that need to be loaded in the target image:
1. from Squeak/common load first the Common-pre changeset.
2. for closure-based images (since 4.5, but before FullBlockClosure was introduced), load the two changesets from Squeak/closures, for fullClosures-based images, load the two changesets from Squeak/fullClosures
3. from Squeak/common load the JSGeneration changeset. This one hits an out of range error at compile time for one test method, just let it proceed
4. in a workspace, evaluate "JavaScriptTranspiler newInstance exportJavaScriptTo: 'PathToJsSqueakFolder\' for: imageName"
   This will generate the translated classes and code in a 'JavaScript\generated\' imageName-specific folder within your JsSqueak folder
5. still in a workspace, evaluate "JavaScriptTranspiler instance exportStateTo: 'PathToJsSqueakFolder\' for: imageName"
   This will generate a few files with the image state in the same imageName-specific folder
6. immediately minimize the image to avoid generating any objects while the image state is exported. To know when it is done, for now you can check the folder for when the file serialized_Smalltalk_globals.js stops growing
7. to start the image in the browser, I use a Webstorm IDE run configuration. Configure your favorite Chrome (I am using Chrome Beta to have a separate install), point it to something like https://localhost:63342/JavaScript/index.html#imageName
   and use the flags --js-flags="--expose-gc --stack-size 8000 --ignore-certificate-errors"
	 
	 
Note that, although the plugins are also generated (with some overrides), they require more effort and they do not change with the image, so they are very slowly moving targets.
So, instead of requiring that all the users build a VMMaker image to generate the plugins, I have published the already generated plugins. 
Well, to be honest, I also have not regenerated them for quite a while now, and a few things have clarified in my mind since then, e.g. there is/should be no 32-bit vs 64-bit distinction.
I intend to clean up the plugin-generating code, and then I will publish the VMMaker changeset as well, together with plugin generating instructions, but if anybody is impatient, let me know and I can share what I have as-is.

Also note that the generated images will include some extra, JavaScript-specific tooling: 
1. although the filesystem is mainly part of the browser storage, I have implemented external fileIn/fileOut for changesets, to compensate for the fact that the image is not saveable itself
2. there is a JS inspector that allows you to go beyond the image view of the objects and look at the internal (JavaScript) representation. 
3. There is JavaScript evaluation, but keep in mind that the snippet will be the body of a JavaScript function, therefore, unlike Smalltalk blocks, it requires explicit return keywords in order to return anything.
4. There is a new option for viewing the code pane, "JavaScript". This works in the Squeak image itself as well (after loading the changesets), showing the transalted JavaScript sources.
5. There is a handy shortcut for debugging the translation process for a specific method, using the binary selector #>>| , the expression "SomeClass >>| #someSelector" returns the translated source for the compiled method "SomeClass >> #someSelector"
6. There is a way of embedding/interacting with JavaScript code, as a specially formatted comment, like "<JS>...your JavaScript code here...</JS>" within the Squeak source code

Finally, a word about debugging: you do not need to run the project with Dev Tools open, which slows things down significantly. 
If a halt or breakpoint in Squeak code is hit, an alert will pop up with instructions to open the browser's debugger. You can do your debugging session, after which you can resume and then close the Dev Tools.
Alternatively, you can also chose to just hit OK in the alert, which is the equivalent of Squeak's debugger popup, to continue.
There are also VM-level asserts that raise a similar alert. These allow you to debug/inspect, determine the cause of the failure, but other than that these are essentially VM crashes, and in general non-recoverable.

Also, see testing-notes.txt in the docs folder for some testing suggestions.

And here is a link to a presentation I gave a year ago about the project at the UK Smalltalk users group: https://vimeo.com/663693415

For questions or discussions about the project, please use the Squeak-dev mailing list, tagging the subject line with [JsSqueak]