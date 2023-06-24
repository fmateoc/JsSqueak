# JsSqueak - JavaScript transpiled Squeak

This is a project that brings together several themes that have preoccupied me for a long time.
I have been thinking about (AOT) compiling Smalltalk since I was young, as I was both obsessed with performance and a big Smalltalk fan.
Now, of course, this is not quite it, but I thought the original spark was worth mentioning.
It is also, of course, inspired by Dan Ingalls' Squeak variations Potato, JSqueak and LivelyKernel, by Vanessa Freudenberg's SqueakJS and by HPI's GraalSqueak/TruffleSqueak.
More indirectly, I have also been inspired by Alon Zakai's Emscripten.
Last, but not least, the project draws from some of my professional experiences with code transformations/transpilation: I have worked on Synchrony Systems' SMTJ IDE for Smalltalk code transformations/type inferencing/translation to Java, so I knew firsthand that compiling Smalltalk to another language was possible. And JavaScript being a dynamic language as well made it allowed me to skip the troublesome type inferencing part of the process.

Please see the docs folder for some implementation notes.

For running JsSqueak, one must first translate their Squeak image into JavaScript.
The image should be reasonably clean, i.e. it should not have "dirty" editors with unsaved changes to methods, and it should not have open inspectors or debuggers
There are a few Squeak changesets in the Squeak folder that need to be loaded in the target image:
1. from Squeak/common load first the Common-pre changeset.
2. for closure-based images (since 4.5, but before FullBlockClosure was introduced), load the two changesets from Squeak/closures, for fullClosures-based images, load the two changes from Squeak/fullClosures
3. from Squeak/common load the JSGeneration changeset. This one hits an out of range error at compile time for one test method, just let it proceed
4. in a workspace, evaluate "JavaScriptTranspiler newInstance exportJavaScriptTo: 'PathToJsSqueakFolder\' for: imageName"
   This will generate the translated classes and code in a 'JavaScript\generated\' imageName-specific folder within your JsSqueak folder
5. still in a workspace, evaluate "JavaScriptTranspiler newInstance exportStateTo: 'PathToJsSqueakFolder\' for: imageName"
   This will generate a few files with the image state in the same imageName-specific folder
6. immediately minimize the image to avoid generating any objects while the image state is exported. To know when it is done, for now you can check the folder for when the file serialized_Smalltalk_globals.js stops growing
7. to start the image in the browser, I use a Webstorm IDE run configuration. Configure your favorite Chrome (I am using Chrome Beta to have a separate install), point it to something like https://localhost:63342/JavaScript/index.html#imageName
   and use the flags --js-flags="--expose-gc --stack-size 8000 --ignore-certificate-errors"
	 
	 
Note that, although the plugins are also generated (with some overrides), they require more effort and they do not change with the image, so they are very slowly moving targets.
So, instead of requiring that all the users build a VMMaker image to generate the plugins, I have published the already generated plugins.

Also note that the generated images will include some extra, JavaScript-specific tooling: 
1. although the filesystem is mainly part of the browser storage, I have also implemented external fileIn/fileOut for changesets, to compensate for the fact that the image is not saveable itself
2. there is also a JS inspector that allows you to go beyond the image view of the objects and look at the internal (JavaScript) representation. 
3. There is also JavaScript evaluation, but keep in mind that the snippet will be the body of a JavaScript function, therefore, unlike Smalltalk blocks, it requires explicit return keywords in order to return anything