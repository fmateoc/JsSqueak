/*
 * Copyright (c) 2013-2020 Vanessa Freudenberg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * Copyright (c) 2022  Florin Mateoc
 */

"use strict";

//////////////////////////////////////////////////////////////////////////////
// display & event setup
//////////////////////////////////////////////////////////////////////////////

function setupFullscreen(display, canvas, options) {
    // Fullscreen can only be enabled in an event handler. So we check the
    // fullscreen flag on every mouse down/up and keyboard event.
    const box = canvas.parentElement;
    let fullscreenEvent = "fullscreenchange",
        fullscreenElement = "fullscreenElement",
        fullscreenEnabled = "fullscreenEnabled";

    if (!box.requestFullscreen) {
        [    // Fullscreen support is still very browser-dependent
            {req: box.webkitRequestFullscreen, exit: document.webkitExitFullscreen,
                evt: "webkitfullscreenchange", elem: "webkitFullscreenElement", enable: "webkitFullscreenEnabled"},
            {req: box.mozRequestFullScreen, exit: document.mozCancelFullScreen,
                evt: "mozfullscreenchange", elem: "mozFullScreenElement", enable: "mozFullScreenEnabled"},
            {req: box.msRequestFullscreen, exit: document.msExitFullscreen,
                evt: "MSFullscreenChange", elem: "msFullscreenElement", enable: "msFullscreenEnabled"},
        ].forEach(function(browser) {
            if (browser.req) {
                box.requestFullscreen = browser.req;
                document.exitFullscreen = browser.exit;
                fullscreenEvent = browser.evt;
                fullscreenElement = browser.elem;
                fullscreenEnabled = browser.enable;
            }
        });
    }

    // If the user canceled fullscreen, turn off the fullscreen flag so
    // we don't try to enable it again in the next event
    function fullscreenChange(fullscreen) {
        display.fullscreen = fullscreen;
        box.style.background = fullscreen ? 'black' : '';
        if (options.header) options.header.style.display = fullscreen ? 'none' : '';
        if (options.footer) options.footer.style.display = fullscreen ? 'none' : '';
        if (options.fullscreenCheckbox) options.fullscreenCheckbox.checked = fullscreen;
        setTimeout(window.onresize, 0);
    }

    let checkFullscreen;

    if (box.requestFullscreen) {
        document.addEventListener(fullscreenEvent, function(){fullscreenChange(box == document[fullscreenElement]);});
        checkFullscreen = function() {
            if (document[fullscreenEnabled] && (box == document[fullscreenElement]) != display.fullscreen) {
                if (display.fullscreen) box.requestFullscreen();
                else document.exitFullscreen();
            }
        };
    } else {
        let isFullscreen = false;
        checkFullscreen = function() {
            if ((options.header || options.footer) && isFullscreen != display.fullscreen) {
                isFullscreen = display.fullscreen;
                fullscreenChange(isFullscreen);
            }
        };
    }

    if (options.fullscreenCheckbox) options.fullscreenCheckbox.onclick = function() {
        display.fullscreen = options.fullscreenCheckbox.checked;
        checkFullscreen();
    };

    return checkFullscreen;
}

function setupSwapButtons(options) {
    if (options.swapCheckbox) {
        options.swapCheckbox.checked = options.swapButtons;
        options.swapCheckbox.onclick = function() {
            options.swapButtons = options.swapCheckbox.checked;
        };
    }
}

function recordModifiers(evt, display) {
    const shiftPressed = evt.shiftKey,
        ctrlPressed = evt.ctrlKey && !evt.altKey,
        cmdPressed = evt.metaKey || (evt.altKey && !evt.ctrlKey),
        modifiers =
            (shiftPressed ? Squeak.Keyboard_Shift : 0) +
            (ctrlPressed ? Squeak.Keyboard_Ctrl : 0) +
            (cmdPressed ? Squeak.Keyboard_Cmd : 0);
    display.buttons = (display.buttons & ~Squeak.Keyboard_All) | modifiers;
    return modifiers;
}

var canUseMouseOffset = navigator.userAgent.match("AppleWebKit/");

function updateMousePos(evt, canvas, display) {
    const evtX = canUseMouseOffset ? evt.offsetX : evt.layerX,
        evtY = canUseMouseOffset ? evt.offsetY : evt.layerY;
    if (display.cursorCanvas) {
        display.cursorCanvas.style.left = (evtX + canvas.offsetLeft + display.cursorOffsetX) + "px";
        display.cursorCanvas.style.top = (evtY + canvas.offsetTop + display.cursorOffsetY) + "px";
    }
    const x = (evtX * canvas.width / canvas.offsetWidth) | 0,
        y = (evtY * canvas.height / canvas.offsetHeight) | 0;
    // clamp to display size
    display.mouseX = Math.max(0, Math.min(display.width, x));
    display.mouseY = Math.max(0, Math.min(display.height, y));
}

function recordMouseEvent(what, evt, canvas, display, eventQueue, options) {
    updateMousePos(evt, canvas, display);
    if (!display.vm) return;
    let buttons = display.buttons & Squeak.Mouse_All;
    switch (what) {
        case 'mousedown':
            switch (evt.button || 0) {
                case 0: buttons = Squeak.Mouse_Red; break;      // left
                case 1: buttons = Squeak.Mouse_Yellow; break;   // middle
                case 2: buttons = Squeak.Mouse_Blue; break;     // right
            }
            if (options.swapButtons)
                if (buttons == Squeak.Mouse_Yellow) buttons = Squeak.Mouse_Blue;
                else if (buttons == Squeak.Mouse_Blue) buttons = Squeak.Mouse_Yellow;
            break;
        case 'mousemove':
            break; // nothing more to do
        case 'mouseup':
            buttons = 0;
            break;
    }
    display.buttons = buttons | recordModifiers(evt, display);
    if (eventQueue) {
        eventQueue.push([
            Squeak.EventTypeMouse,
            evt.timeStamp,  // converted to Squeak time in makeSqueakEvent()
            display.mouseX,
            display.mouseY,
            display.buttons & Squeak.Mouse_All,
            display.buttons >> 3,
        ]);
        display.signalInputEvent();
    }
    display.idle = 0;
}

function recordKeyboardEvent(key, timestamp, display, eventQueue) {
    if (!display.vm) return;
    const code = (display.buttons >> 3) << 8 | key;
    if (code === display.vm.interruptKeycode) {
        display.vm.interruptPending = true;
    } else if (eventQueue) {
        eventQueue.push([
            Squeak.EventTypeKeyboard,
            timestamp,  // converted to Squeak time in makeSqueakEvent()
            key, // MacRoman
            Squeak.EventKeyChar,
            display.buttons >> 3,
            key,  // Unicode
        ]);
        display.signalInputEvent();
    } else {
        // no event queue, queue keys the old-fashioned way
        display.keys.push(code);
    }
    display.idle = 0;
}

function fakeCmdOrCtrlKey(key, timestamp, display, eventQueue) {
    // set both Cmd and Ctrl bit, because we don't know what the image wants
    display.buttons &= ~Squeak.Keyboard_All;  // remove all modifiers
    display.buttons |= Squeak.Keyboard_Cmd | Squeak.Keyboard_Ctrl;
    display.keys = []; //  flush other keys
    recordKeyboardEvent(key, timestamp, display, eventQueue);
}

function makeSqueakEvent(evt, sqEvtBuf, sqTimeOffset) {
    sqEvtBuf[0] = evt[0];
    sqEvtBuf[1] = (evt[1] - sqTimeOffset);
    for (var i = 2; i < evt.length; i++)
        sqEvtBuf[i] = evt[i];
}

function createSqueakDisplay(canvas, options) {
    options = options || {};
    if (options.fullscreen) {
        document.body.style.margin = 0;
        document.body.style.backgroundColor = 'black';
        document.ontouchmove = function(evt) { evt.preventDefault(); };
        if (options.header) options.header.style.display = 'none';
        if (options.footer) options.footer.style.display = 'none';
    }
    const display = {
        context: canvas.getContext("2d"),
        fullscreen: false,
        width: 0,   // if 0, VM uses canvas.width
        height: 0,  // if 0, VM uses canvas.height
        mouseX: 0,
        mouseY: 0,
        buttons: 0,
        keys: [],
        cursorCanvas: options.cursor !== false && document.createElement("canvas"),
        cursorOffsetX: 0,
        cursorOffsetY: 0,
        signalInputEvent: null, // function set by VM
        // additional functions added below
    };
    setupSwapButtons(options);
    if (options.pixelated) {
        canvas.classList.add("pixelated");
        display.cursorCanvas && display.cursorCanvas.classList.add("pixelated");
    }

    let eventQueue = null;
    display.reset = function() {
        eventQueue = null;
        display.signalInputEvent = null;
        display.getNextEvent = function(firstEvtBuf, firstOffset) {
            // might be called from VM to get queued event
            eventQueue = []; // create queue on first call
            eventQueue.push = function(evt) {
                eventQueue.offset = Date.now() - evt[1]; // get epoch from first event
                delete eventQueue.push;                  // use original push from now on
                eventQueue.push(evt);
            };
            display.getNextEvent = function(evtBuf, timeOffset) {
                var evt = eventQueue.shift();
                if (evt) makeSqueakEvent(evt, evtBuf, timeOffset - eventQueue.offset);
                else evtBuf[0] = Squeak.EventTypeNone;
            };
            display.getNextEvent(firstEvtBuf, firstOffset);
        };
    };
    display.reset();

    const checkFullscreen = setupFullscreen(display, canvas, options);
    display.fullscreenRequest = function(fullscreen, thenDo) {
        // called from primitive to change fullscreen mode
        if (display.fullscreen != fullscreen) {
            display.fullscreen = fullscreen;
            display.resizeTodo = thenDo;    // called after resizing
            display.resizeTodoTimeout = setTimeout(display.resizeDone, 1000);
            checkFullscreen();
        } else thenDo();
    };
    display.resizeDone = function() {
        clearTimeout(display.resizeTodoTimeout);
        const todo = display.resizeTodo;
        if (todo) {
            display.resizeTodo = null;
            todo();
        }
    };
    display.clear = function() {
        canvas.width = canvas.width;
    };
    display.showBanner = function(msg, style) {
        style = style || {};
        const ctx = display.context;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = style.color || "#F90";
        ctx.font = style.font || "bold 48px sans-serif";
        if (!style.font && ctx.measureText(msg).width > canvas.width)
            ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
    };
    display.showProgress = function(value, style) {
        style = style || {};
        const ctx = display.context,
            w = (canvas.width / 3) | 0,
            h = 24,
            x = canvas.width * 0.5 - w / 2,
            y = canvas.height * 0.5 + 2 * h;
        ctx.fillStyle = style.background || "#000";
        ctx.fillRect(x, y, w, h);
        ctx.lineWidth = 2;
        ctx.strokeStyle = style.color || "#F90";
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = style.color || "#F90";
        ctx.fillRect(x, y, w * value, h);
    };
    canvas.onmousedown = function(evt) {
        checkFullscreen();
        recordMouseEvent('mousedown', evt, canvas, display, eventQueue, options);
        evt.preventDefault();
        return false;
    };
    canvas.onmouseup = function(evt) {
        recordMouseEvent('mouseup', evt, canvas, display, eventQueue, options);
        checkFullscreen();
        evt.preventDefault();
    };
    canvas.onmousemove = function(evt) {
        recordMouseEvent('mousemove', evt, canvas, display, eventQueue, options);
        evt.preventDefault();
    };
    canvas.oncontextmenu = function() {
        return false;
    };
    // touch event handling
    const touch = {
        state: 'idle',
        button: 0,
        x: 0,
        y: 0,
        dist: 0,
        down: {},
    };
    function touchToMouse(evt) {
        if (evt.touches.length) {
            // average all touch positions
            touch.x = touch.y = 0;
            for (let i = 0; i < evt.touches.length; i++) {
                touch.x += evt.touches[i].pageX / evt.touches.length;
                touch.y += evt.touches[i].pageY / evt.touches.length;
            }
        }
        return {
            timeStamp: evt.timeStamp,
            button: touch.button,
            offsetX: touch.x - canvas.offsetLeft,
            offsetY: touch.y - canvas.offsetTop,
        };
    }
    function dd(ax, ay, bx, by) {var x = ax - bx, y = ay - by; return Math.sqrt(x*x + y*y);}
    function dist(a, b) {return dd(a.pageX, a.pageY, b.pageX, b.pageY);}
    function adjustDisplay(l, t, w, h) {
        const cursorCanvas = display.cursorCanvas,
            scale = w / canvas.width;
        canvas.style.left = (l|0) + "px";
        canvas.style.top = (t|0) + "px";
        canvas.style.width = (w|0) + "px";
        canvas.style.height = (h|0) + "px";
        if (cursorCanvas) {
            cursorCanvas.style.left = (l + display.cursorOffsetX + display.mouseX * scale|0) + "px";
            cursorCanvas.style.top = (t + display.cursorOffsetY + display.mouseY * scale|0) + "px";
            cursorCanvas.style.width = (cursorCanvas.width * scale|0) + "px";
            cursorCanvas.style.height = (cursorCanvas.height * scale|0) + "px";
        }
        if (!options.pixelated) {
            const pixelScale = window.devicePixelRatio * scale;
            if (pixelScale % 1 === 0 || pixelScale > 5) {
                canvas.classList.add("pixelated");
                cursorCanvas && cursorCanvas.classList.add("pixelated");
            } else {
                canvas.classList.remove("pixelated");
                cursorCanvas && display.cursorCanvas.classList.remove("pixelated");
            }
        }
        return scale;
    }
    // zooming/panning with two fingers
    const maxZoom = 5;
    function zoomStart(evt) {
        touch.dist = dist(evt.touches[0], evt.touches[1]);
        touch.down.x = touch.x;
        touch.down.y = touch.y;
        touch.down.dist = touch.dist;
        touch.down.left = canvas.offsetLeft;
        touch.down.top = canvas.offsetTop;
        touch.down.width = canvas.offsetWidth;
        touch.down.height = canvas.offsetHeight;
        // store original canvas bounds
        if (!touch.orig) touch.orig = {
            left: touch.down.left,
            top: touch.down.top,
            right: touch.down.left + touch.down.width,
            bottom: touch.down.top + touch.down.height,
            width: touch.down.width,
            height: touch.down.height,
        };
    }
    function zoomMove(evt) {
        if (evt.touches.length < 2) return;
        touch.dist = dist(evt.touches[0], evt.touches[1]);
        var minScale = touch.orig.width / touch.down.width,
            //nowScale = dent(touch.dist / touch.down.dist, 0.8, 1, 1.5),
            nowScale = touch.dist / touch.down.dist,
            scale = Math.min(Math.max(nowScale, minScale * 0.95), minScale * maxZoom),
            w = touch.down.width * scale,
            h = touch.orig.height * w / touch.orig.width,
            l = touch.down.left - (touch.down.x - touch.down.left) * (scale - 1) + (touch.x - touch.down.x),
            t = touch.down.top - (touch.down.y - touch.down.top) * (scale - 1) + (touch.y - touch.down.y);
        // allow to rubber-band by 20px for feedback
        l = Math.max(Math.min(l, touch.orig.left + 20), touch.orig.right - w - 20);
        t = Math.max(Math.min(t, touch.orig.top + 20), touch.orig.bottom - h - 20);
        adjustDisplay(l, t, w, h);
    }
    function zoomEnd(evt) {
        let l = canvas.offsetLeft,
            t = canvas.offsetTop,
            w = canvas.offsetWidth;
        w = Math.min(Math.max(w, touch.orig.width), touch.orig.width * maxZoom);
        const h = touch.orig.height * w / touch.orig.width;
        l = Math.max(Math.min(l, touch.orig.left), touch.orig.right - w);
        t = Math.max(Math.min(t, touch.orig.top), touch.orig.bottom - h);
        const scale = adjustDisplay(l, t, w, h);
        if ((scale - display.initialScale) < 0.0001) {
            touch.orig = null;
            window.onresize();
        }
    }
    // State machine to distinguish between 1st/2nd mouse button and zoom/pan:
    // * if moved, or no 2nd finger within 100ms of 1st down, start mousing
    // * if fingers moved significantly within 200ms of 2nd down, start zooming
    // * if touch ended within this time, generate click (down+up)
    // * otherwise, start mousing with 2nd button
    // When mousing, always generate a move event before down event so that
    // mouseover eventhandlers in image work better
    canvas.ontouchstart = function(evt) {
        evt.preventDefault();
        const e = touchToMouse(evt);
        for (let i = 0; i < evt.changedTouches.length; i++) {
            switch (touch.state) {
                case 'idle':
                    touch.state = 'got1stFinger';
                    touch.first = e;
                    setTimeout(function(){
                        if (touch.state !== 'got1stFinger') return;
                        touch.state = 'mousing';
                        touch.button = e.button = 0;
                        recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                        recordMouseEvent('mousedown', e, canvas, display, eventQueue, options);
                    }, 100);
                    break;
                case 'got1stFinger':
                    touch.state = 'got2ndFinger';
                    zoomStart(evt);
                    setTimeout(function(){
                        if (touch.state !== 'got2ndFinger') return;
                        var didMove = Math.abs(touch.down.dist - touch.dist) > 10 ||
                            dd(touch.down.x, touch.down.y, touch.x, touch.y) > 10;
                        if (didMove) {
                            touch.state = 'zooming';
                        } else {
                            touch.state = 'mousing';
                            touch.button = e.button = 2;
                            recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                            recordMouseEvent('mousedown', e, canvas, display, eventQueue, options);
                        }
                    }, 200);
                    break;
            }
        }
    };
    canvas.ontouchmove = function(evt) {
        evt.preventDefault();
        const e = touchToMouse(evt);
        switch (touch.state) {
            case 'got1stFinger':
                touch.state = 'mousing';
                touch.button = e.button = 0;
                recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                recordMouseEvent('mousedown', e, canvas, display, eventQueue, options);
                break;
            case 'mousing':
                recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                return;
            case 'got2ndFinger':
                if (evt.touches.length > 1)
                    touch.dist = dist(evt.touches[0], evt.touches[1]);
                return;
            case 'zooming':
                zoomMove(evt);
                return;
        }
    };
    canvas.ontouchend = function(evt) {
        evt.preventDefault();
        checkFullscreen();
        const e = touchToMouse(evt);
        for (let i = 0; i < evt.changedTouches.length; i++) {
            switch (touch.state) {
                case 'mousing':
                    if (evt.touches.length > 0) break;
                    touch.state = 'idle';
                    recordMouseEvent('mouseup', e, canvas, display, eventQueue, options);
                    return;
                case 'got1stFinger':
                    touch.state = 'idle';
                    touch.button = e.button = 0;
                    recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                    recordMouseEvent('mousedown', e, canvas, display, eventQueue, options);
                    recordMouseEvent('mouseup', e, canvas, display, eventQueue, options);
                    return;
                case 'got2ndFinger':
                    touch.state = 'mousing';
                    touch.button = e.button = 2;
                    recordMouseEvent('mousemove', e, canvas, display, eventQueue, options);
                    recordMouseEvent('mousedown', e, canvas, display, eventQueue, options);
                    break;
                case 'zooming':
                    if (evt.touches.length > 0) break;
                    touch.state = 'idle';
                    zoomEnd(evt);
                    return;
            }
        }
    };
    canvas.ontouchcancel = function(evt) {
        canvas.ontouchend(evt);
    };
    // cursorCanvas shows Squeak cursor
    if (display.cursorCanvas) {
        const absolute = window.getComputedStyle(canvas).position === "absolute";
        display.cursorCanvas.style.display = "block";
        display.cursorCanvas.style.position = absolute ? "absolute": "fixed";
        display.cursorCanvas.style.cursor = "none";
        display.cursorCanvas.style.background = "transparent";
        display.cursorCanvas.style.pointerEvents = "none";
        canvas.parentElement.appendChild(display.cursorCanvas);
        canvas.style.cursor = "none";
    }
    window.onwheel = function(evt){
        display.buttons = (display.buttons & ~Squeak.Keyboard_All) | Squeak.Keyboard_Ctrl;
        if (evt.deltaY > 0) {
            recordKeyboardEvent(31, evt.timeStamp, display, eventQueue);
        } else if (evt.deltaY < 0) {
            recordKeyboardEvent(30, evt.timeStamp, display, eventQueue);
        }
        display.buttons = (display.buttons & ~Squeak.Keyboard_All);
    };
    // keyboard stuff
    document.onkeypress = function(evt) {
        if (!display.vm) return true;
        // check for ctrl-x/c/v/r
        if (/[CXVR]/.test(String.fromCharCode(evt.charCode + 64)))
            return true;  // let browser handle cut/copy/paste/reload
        recordModifiers(evt, display);
        recordKeyboardEvent(evt.charCode, evt.timeStamp, display, eventQueue);
        evt.preventDefault();
    };
    document.onkeydown = function(evt) {
        checkFullscreen();
        if (!display.vm) return true;
        recordModifiers(evt, display);
        const squeakCode = ({
            8: 8,   // Backspace
            9: 9,   // Tab
            13: 13, // Return
            27: 27, // Escape
            32: 32, // Space
            33: 11, // PageUp
            34: 12, // PageDown
            35: 4,  // End
            36: 1,  // Home
            37: 28, // Left
            38: 30, // Up
            39: 29, // Right
            40: 31, // Down
            45: 5,  // Insert
            46: 127, // Delete
        })[evt.keyCode];
        if (squeakCode) { // special key pressed
            recordKeyboardEvent(squeakCode, evt.timeStamp, display, eventQueue);
            return evt.preventDefault();
        }
        if ((evt.metaKey || (evt.altKey && !evt.ctrlKey))) {
            let key = evt.key; // only supported in FireFox, others have keyIdentifier
            if (!key && evt.keyIdentifier && evt.keyIdentifier.slice(0,2) == 'U+')
                key = String.fromCharCode(parseInt(evt.keyIdentifier.slice(2), 16));
            if (key && key.length == 1) {
                if (/[CXVR]/i.test(key))
                    return true;  // let browser handle cut/copy/paste/reload
                let code = key.charCodeAt(0);
                if (/[A-Z]/.test(key) && !evt.shiftKey) code += 32;  // make lower-case
                recordKeyboardEvent(code, evt.timeStamp, display, eventQueue);
                return evt.preventDefault();
            }
        }
    };
    document.onkeyup = function(evt) {
        if (!display.vm) return true;
        recordModifiers(evt, display);
    };
    document.oncopy = function(evt, key) {
        fakeCmdOrCtrlKey('c'.charCodeAt(0), evt.timestamp, display, eventQueue);
        evt.preventDefault();
    };
    document.oncut = function(evt) {
        fakeCmdOrCtrlKey('x'.charCodeAt(0), evt.timestamp, display, eventQueue);
        evt.preventDefault();
    };
    document.onpaste = function(evt) {
        fakeCmdOrCtrlKey('v'.charCodeAt(0), evt.timestamp, display, eventQueue);
        evt.preventDefault();
    };
    // touch keyboard button
    if ('ontouchstart' in document) {
        var keyboardButton = document.createElement('div');
        keyboardButton.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="50px" height="50px" viewBox="0 0 150 150" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Page-1" stroke="none" fill="#000000"><rect x="33" y="105" width="10" height="10" rx="1"></rect><rect x="26" y="60" width="10" height="10" rx="1"></rect><rect x="41" y="60" width="10" height="10" rx="1"></rect><rect x="56" y="60" width="10" height="10" rx="1"></rect><rect x="71" y="60" width="10" height="10" rx="1"></rect><rect x="86" y="60" width="10" height="10" rx="1"></rect><rect x="101" y="60" width="10" height="10" rx="1"></rect><rect x="116" y="60" width="10" height="10" rx="1"></rect><rect x="108" y="105" width="10" height="10" rx="1"></rect><rect x="33" y="75" width="10" height="10" rx="1"></rect><rect x="48" y="75" width="10" height="10" rx="1"></rect><rect x="63" y="75" width="10" height="10" rx="1"></rect><rect x="78" y="75" width="10" height="10" rx="1"></rect><rect x="93" y="75" width="10" height="10" rx="1"></rect><rect x="108" y="75" width="10" height="10" rx="1"></rect><rect x="41" y="90" width="10" height="10" rx="1"></rect><rect x="26" y="90" width="10" height="10" rx="1"></rect><rect x="56" y="90" width="10" height="10" rx="1"></rect><rect x="71" y="90" width="10" height="10" rx="1"></rect><rect x="86" y="90" width="10" height="10" rx="1"></rect><rect x="101" y="90" width="10" height="10" rx="1"></rect><rect x="116" y="90" width="10" height="10" rx="1"></rect><rect x="48" y="105" width="55" height="10" rx="1"></rect><path d="M20.0056004,51 C18.3456532,51 17.0000001,52.3496496 17.0000001,54.0038284 L17.0000001,85.6824519 L17,120.003453 C17.0000001,121.6584 18.3455253,123 20.0056004,123 L131.9944,123 C133.654347,123 135,121.657592 135,119.997916 L135,54.0020839 C135,52.3440787 133.654475,51 131.9944,51 L20.0056004,51 Z" fill="none" stroke="#000000" stroke-width="2"></path><path d="M52.0410156,36.6054687 L75.5449219,21.6503905 L102.666016,36.6054687" id="Line" stroke="#000000" stroke-width="3" stroke-linecap="round" fill="none"></path></g></svg>';
        keyboardButton.setAttribute('style', 'position:fixed;right:0;bottom:0;background-color:rgba(128,128,128,0.5);border-radius:5px');
        canvas.parentElement.appendChild(keyboardButton);
        keyboardButton.onmousedown = function(evt) {
            canvas.contentEditable = true;
            canvas.setAttribute('autocomplete', 'off');
            canvas.setAttribute('autocorrect', 'off');
            canvas.setAttribute('autocapitalize', 'off');
            canvas.setAttribute('spellcheck', 'off');
            canvas.focus();
            evt.preventDefault();
        }
        keyboardButton.ontouchstart = keyboardButton.onmousedown
    }
    window.onresize = function() {
        if (touch.orig) return; // manually resized
        // call resizeDone only if window size didn't change for 300ms
        const debounceWidth = window.innerWidth,
            debounceHeight = window.innerHeight;
        setTimeout(function() {
            if (debounceWidth == window.innerWidth && debounceHeight == window.innerHeight)
                display.resizeDone();
        }, 300);
        // if no fancy layout, don't bother
        if ((!options.header || !options.footer) && !options.fullscreen) {
            display.width = canvas.width;
            display.height = canvas.height;
            return;
        }
        // CSS won't let us do what we want so we will layout the canvas ourselves.
        const fullscreen = options.fullscreen || display.fullscreen,
            x = 0,
            y = fullscreen ? 0 : options.header.offsetTop + options.header.offsetHeight,
            w = window.innerWidth,
            h = fullscreen ? window.innerHeight : Math.max(100, options.footer.offsetTop - y);
        let paddingX = 0, // padding outside canvas
            paddingY = 0;
        // above are the default values for laying out the canvas
        if (!options.fixedWidth) { // set canvas resolution
            if (!options.minWidth) options.minWidth = 700;
            if (!options.minHeight) options.minHeight = 700;
            const scaleW = w < options.minWidth ? options.minWidth / w : 1,
                scaleH = h < options.minHeight ? options.minHeight / h : 1,
                scale = Math.max(scaleW, scaleH);
            display.width = Math.floor(w * scale);
            display.height = Math.floor(h * scale);
            display.initialScale = w / display.width;
        } else { // fixed resolution and aspect ratio
            display.width = options.fixedWidth;
            display.height = options.fixedHeight;
            const wantRatio = display.width / display.height,
                haveRatio = w / h;
            if (haveRatio > wantRatio) {
                paddingX = w - Math.floor(h * wantRatio);
            } else {
                paddingY = h - Math.floor(w / wantRatio);
            }
            display.initialScale = (w - paddingX) / display.width;
        }
        // set size and position
        canvas.style.left = (x + Math.floor(paddingX / 2)) + "px";
        canvas.style.top = (y + Math.floor(paddingY / 2)) + "px";
        canvas.style.width = (w - paddingX) + "px";
        canvas.style.height = (h - paddingY) + "px";
        // set resolution
        if (canvas.width != display.width || canvas.height != display.height) {
            var preserveScreen = options.fixedWidth || !display.resizeTodo, // preserve unless changing fullscreen
                imgData = preserveScreen && display.context.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = display.width;
            canvas.height = display.height;
            if (imgData) display.context.putImageData(imgData, 0, 0);
        }
        // set cursor scale
        const cursorCanvas = display.cursorCanvas,
            scale = canvas.offsetWidth / canvas.width;
        if (cursorCanvas && options.fixedWidth) {
            cursorCanvas.style.width = (cursorCanvas.width * scale) + "px";
            cursorCanvas.style.height = (cursorCanvas.height * scale) + "px";
        }
        // set pixelation
        if (!options.pixelated) {
            const pixelScale = window.devicePixelRatio * scale;
            if (pixelScale % 1 === 0 || pixelScale > 5) {
                canvas.classList.add("pixelated");
                cursorCanvas && cursorCanvas.classList.add("pixelated");
            } else {
                canvas.classList.remove("pixelated");
                cursorCanvas && display.cursorCanvas.classList.remove("pixelated");
            }
        }
    };
    window.onresize();
    return display;
}

//////////////////////////////////////////////////////////////////////////////
// main loop
//////////////////////////////////////////////////////////////////////////////

window.runImage = function runImage(sqCanvas, options) {
    window.onbeforeunload = function(evt) {
        const msg = imageName + " is still running";
        evt.returnValue = msg;
        return msg;
    };
    let display = createSqueakDisplay(sqCanvas, options);
    display.reset();
    display.clear();
    display.showBanner("Loading " + imageName);
    window.setTimeout(function startRunning() {
        setupSwapButtons(options);
        display.clear();
        display.showBanner("Starting " + imageName);
     }, 0);
    import("./startupBrowser.mjs").then(value => import("./display_browser.js").then(value => {
        window.SmalltalkVM.initDisplay(display);

        (function* () {
            yield* SmalltalkGlobals._Smalltalk[1]._processStartUpList_(true);

            const keyboardBuffer = yield* SmalltalkGlobals._Sensor[1]._instVarNamed_(SmalltalkGlobals._ByteString.from("keyboardBuffer"));
            keyboardBuffer.pointers[3].name = "Sensor.keyboardBuffer.accessProtect";
            keyboardBuffer.pointers[3].stack = "";
            keyboardBuffer.pointers[4].name = "Sensor.keyboardBuffer.readSynch";
            keyboardBuffer.pointers[4].stack = "";
            const interruptSemaphore = yield* SmalltalkGlobals._Sensor[1]._instVarNamed_(SmalltalkGlobals._ByteString.from("interruptSemaphore"));
            interruptSemaphore.name = "Sensor.userInterruptSemaphore";
            interruptSemaphore.stack = "";
            const eventQueue = yield* SmalltalkGlobals._Sensor[1]._instVarNamed_(SmalltalkGlobals._ByteString.from("eventQueue"));
            eventQueue.pointers[3].name = "Sensor.eventQueue.accessProtect";
            eventQueue.pointers[3].stack = "";
            eventQueue.pointers[4].name = "Sensor.eventQueue.readSynch";
            eventQueue.pointers[4].stack = "";
            const inputSemaphore = yield* SmalltalkGlobals._Sensor[1]._instVarNamed_(SmalltalkGlobals._ByteString.from("inputSemaphore"));
            inputSemaphore.name = "Sensor.inputSemaphore";
            inputSemaphore.stack = "";

            const eventSensorClassPool = SmalltalkGlobals._EventSensor.pointers[7];
            (yield* eventSensorClassPool._at_(SmalltalkGlobals._ByteSymbol.from("EventTicklerProcess"))).name = 'EventTicklerProcess';
            (yield* eventSensorClassPool._at_(SmalltalkGlobals._ByteSymbol.from("EventTicklerProcess"))).stack = '';

            const weakArrayClassPool = SmalltalkGlobals._WeakArray.pointers[7];
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationSemaphore"))).name = 'FinalizationSemaphore';
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationSemaphore"))).stack = '';
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationLock"))).name = 'FinalizationLock';
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationLock"))).stack = '';
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationProcess"))).name = 'FinalizationProcess';
            (yield* weakArrayClassPool._at_(SmalltalkGlobals._ByteSymbol.from("FinalizationProcess"))).stack = '';

            console.log("Project current wakeUpTopWindow");
            yield* (yield* SmalltalkGlobals._Project._current())._wakeUpTopWindow();

            console.log("spawning UI process");
            yield* (yield* SmalltalkGlobals._Project._current())._spawnNewProcess();

        })._forkAt_(50).next();
    }));
};

//////////////////////////////////////////////////////////////////
// browser stuff
//////////////////////////////////////////////////////////////////////////////

if (window.applicationCache) {
    applicationCache.addEventListener('updateready', function() {
        // use original appName from options
        if (confirm(imageName + ' has been updated. Restart now?')) {
            window.onbeforeunload = null;
            window.location.reload();
        }
    });
}