SmalltalkGlobals.TestExclusions = `
AllocationTest                      //this one crashes Chrome's JavaScript engine
ArbitraryObjectSocketTestCase       //plugin SocketPlugin is missing
BlockContextTest                    //no contexts support
SocketStreamTest                    //plugin SocketPlugin is missing
ContextCompilationTest              //no contexts support
DebuggerUnwindBug                   //no contexts support
FlapTabTests                        //errors out because, completely unrelated to the test subject, it modifies the bytes of a float
ImageSegmentTest                    //no image segment primitives
JPEGReadWriter2Test                 //plugin JPEGReadWriter2Plugin is missing
CompiledMethodComparisonTest        //this one actually succeeds, but it doesn't test anything useful AND takes very long
MethodContextTest                   //no contexts support
SocketTest                          //plugin SocketPlugin is missing
StringSocketTestCase                //plugin SocketPlugin is missing
TestIndenting                       //fails in Squeak too
`