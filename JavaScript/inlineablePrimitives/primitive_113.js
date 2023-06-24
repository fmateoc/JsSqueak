SmalltalkVM.display.showBanner(imageName + " stopped.");
SmalltalkVM.display.vm = null;
SmalltalkVM.display = null;
SmalltalkVM.activeProcess = null;
window.onbeforeunload = null;
yield "Quitting";