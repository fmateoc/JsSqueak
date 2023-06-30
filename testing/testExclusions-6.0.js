SmalltalkGlobals.TestExclusions = `
AllocationTest                      //this one crashes Chrome's JavaScript engine
ArbitraryObjectSocketTestCase       //plugin SocketPlugin is missing
ContextInspectorTest                //no contexts support
ContextVariablesInspectorTest       //no contexts support
SocketStreamTest                    //plugin SocketPlugin is missing
CogVMBaseImageTests
ContextCompilationTest              //no contexts support
ContextTest                         //no contexts support
DebuggerTests                       //no contexts support
DebuggerUnwindBug                   //no contexts support
FlapTabTests                        //errors out because, completely unrelated to the test subject, it modifies the bytes of a float
ImageSegmentTest                    //no image segment primitives
JPEGReadWriter2Test                 //plugin JPEGReadWriter2Plugin is missing
CompiledMethodComparisonTest        //this one actually succeeds, but it doesn't test anything useful AND takes very long
SocketTest                          //plugin SocketPlugin is missing
SqueakSSLTest                       //plugin SqueakSSL is missing
StringSocketTestCase                //plugin SocketPlugin is missing
UnicodeTest                         //tries to connect to the internet
WebClientServerTest                 //plugin SocketPlugin is missing
WebMessageTest
WriteBarrierTest                    //no read-only support
`