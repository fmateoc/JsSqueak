"use strict";
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

Object.assign(SmalltalkVM,
    {
        addMessage: function(message) {
            return this.messages[message] ? ++this.messages[message] : this.messages[message] = 1;
        },
        initDisplay: function(display) {
            this.display = display;
            display.vm = this;
            this.indexedColors = [
                0xFFFFFFFF, 0xFF000001, 0xFFFFFFFF, 0xFF808080, 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF00FFFF,
                0xFFFFFF00, 0xFFFF00FF, 0xFF202020, 0xFF404040, 0xFF606060, 0xFF9F9F9F, 0xFFBFBFBF, 0xFFDFDFDF,
                0xFF080808, 0xFF101010, 0xFF181818, 0xFF282828, 0xFF303030, 0xFF383838, 0xFF484848, 0xFF505050,
                0xFF585858, 0xFF686868, 0xFF707070, 0xFF787878, 0xFF878787, 0xFF8F8F8F, 0xFF979797, 0xFFA7A7A7,
                0xFFAFAFAF, 0xFFB7B7B7, 0xFFC7C7C7, 0xFFCFCFCF, 0xFFD7D7D7, 0xFFE7E7E7, 0xFFEFEFEF, 0xFFF7F7F7,
                0xFF000001, 0xFF003300, 0xFF006600, 0xFF009900, 0xFF00CC00, 0xFF00FF00, 0xFF000033, 0xFF003333,
                0xFF006633, 0xFF009933, 0xFF00CC33, 0xFF00FF33, 0xFF000066, 0xFF003366, 0xFF006666, 0xFF009966,
                0xFF00CC66, 0xFF00FF66, 0xFF000099, 0xFF003399, 0xFF006699, 0xFF009999, 0xFF00CC99, 0xFF00FF99,
                0xFF0000CC, 0xFF0033CC, 0xFF0066CC, 0xFF0099CC, 0xFF00CCCC, 0xFF00FFCC, 0xFF0000FF, 0xFF0033FF,
                0xFF0066FF, 0xFF0099FF, 0xFF00CCFF, 0xFF00FFFF, 0xFF330000, 0xFF333300, 0xFF336600, 0xFF339900,
                0xFF33CC00, 0xFF33FF00, 0xFF330033, 0xFF333333, 0xFF336633, 0xFF339933, 0xFF33CC33, 0xFF33FF33,
                0xFF330066, 0xFF333366, 0xFF336666, 0xFF339966, 0xFF33CC66, 0xFF33FF66, 0xFF330099, 0xFF333399,
                0xFF336699, 0xFF339999, 0xFF33CC99, 0xFF33FF99, 0xFF3300CC, 0xFF3333CC, 0xFF3366CC, 0xFF3399CC,
                0xFF33CCCC, 0xFF33FFCC, 0xFF3300FF, 0xFF3333FF, 0xFF3366FF, 0xFF3399FF, 0xFF33CCFF, 0xFF33FFFF,
                0xFF660000, 0xFF663300, 0xFF666600, 0xFF669900, 0xFF66CC00, 0xFF66FF00, 0xFF660033, 0xFF663333,
                0xFF666633, 0xFF669933, 0xFF66CC33, 0xFF66FF33, 0xFF660066, 0xFF663366, 0xFF666666, 0xFF669966,
                0xFF66CC66, 0xFF66FF66, 0xFF660099, 0xFF663399, 0xFF666699, 0xFF669999, 0xFF66CC99, 0xFF66FF99,
                0xFF6600CC, 0xFF6633CC, 0xFF6666CC, 0xFF6699CC, 0xFF66CCCC, 0xFF66FFCC, 0xFF6600FF, 0xFF6633FF,
                0xFF6666FF, 0xFF6699FF, 0xFF66CCFF, 0xFF66FFFF, 0xFF990000, 0xFF993300, 0xFF996600, 0xFF999900,
                0xFF99CC00, 0xFF99FF00, 0xFF990033, 0xFF993333, 0xFF996633, 0xFF999933, 0xFF99CC33, 0xFF99FF33,
                0xFF990066, 0xFF993366, 0xFF996666, 0xFF999966, 0xFF99CC66, 0xFF99FF66, 0xFF990099, 0xFF993399,
                0xFF996699, 0xFF999999, 0xFF99CC99, 0xFF99FF99, 0xFF9900CC, 0xFF9933CC, 0xFF9966CC, 0xFF9999CC,
                0xFF99CCCC, 0xFF99FFCC, 0xFF9900FF, 0xFF9933FF, 0xFF9966FF, 0xFF9999FF, 0xFF99CCFF, 0xFF99FFFF,
                0xFFCC0000, 0xFFCC3300, 0xFFCC6600, 0xFFCC9900, 0xFFCCCC00, 0xFFCCFF00, 0xFFCC0033, 0xFFCC3333,
                0xFFCC6633, 0xFFCC9933, 0xFFCCCC33, 0xFFCCFF33, 0xFFCC0066, 0xFFCC3366, 0xFFCC6666, 0xFFCC9966,
                0xFFCCCC66, 0xFFCCFF66, 0xFFCC0099, 0xFFCC3399, 0xFFCC6699, 0xFFCC9999, 0xFFCCCC99, 0xFFCCFF99,
                0xFFCC00CC, 0xFFCC33CC, 0xFFCC66CC, 0xFFCC99CC, 0xFFCCCCCC, 0xFFCCFFCC, 0xFFCC00FF, 0xFFCC33FF,
                0xFFCC66FF, 0xFFCC99FF, 0xFFCCCCFF, 0xFFCCFFFF, 0xFFFF0000, 0xFFFF3300, 0xFFFF6600, 0xFFFF9900,
                0xFFFFCC00, 0xFFFFFF00, 0xFFFF0033, 0xFFFF3333, 0xFFFF6633, 0xFFFF9933, 0xFFFFCC33, 0xFFFFFF33,
                0xFFFF0066, 0xFFFF3366, 0xFFFF6666, 0xFFFF9966, 0xFFFFCC66, 0xFFFFFF66, 0xFFFF0099, 0xFFFF3399,
                0xFFFF6699, 0xFFFF9999, 0xFFFFCC99, 0xFFFFFF99, 0xFFFF00CC, 0xFFFF33CC, 0xFFFF66CC, 0xFFFF99CC,
                0xFFFFCCCC, 0xFFFFFFCC, 0xFFFF00FF, 0xFFFF33FF, 0xFFFF66FF, 0xFFFF99FF, 0xFFFFCCFF, 0xFFFFFFFF];
            this.messages = {};
        },
        loadForm: function(formPointers) {
            if (formPointers === undefined) return null;
            const width = formPointers[1],
                height = formPointers[2];
            let depth = formPointers[3];
            const form = {
                bits: formPointers[0].wordsOrBytes(),
                depth: depth,
                width: width,
                height: height,
            }
            if (width === 0 || height === 0) return form;
            if (!(width > 0 && height > 0)) return null;
            if (!(depth > 0)) depth = -depth;
            if (!(depth > 0)) return null; // happens if not int
            const pixPerWord = 32 / depth;
            if (form.bits.length !== ((width + pixPerWord - 1) / pixPerWord | 0) * height) return null;
            form.depth = depth;
            return form;
        },
        startAudioOut: function() {
            if (!this.audioOutContext) {
                const ctxProto = window.AudioContext || window.webkitAudioContext
                    || window.mozAudioContext;
                this.audioOutContext = ctxProto && new ctxProto();
            }
            return this.audioOutContext;
        },
        showDisplayBitsLeftTopRightBottom: function(form, left, top, right, bottom) {
            if (left < right && top < bottom && !this.deferDisplayUpdates && form === this.specialObjectsArray[14]) {
                this.showForm(this.display.context, this.loadForm(form.pointers), {left: left, top: top, right: right, bottom: bottom});
            }
        },
        showForm: function(ctx, form, rect, cursorColors) {
            if (!rect) return;
            let srcY = rect.top;
            const srcX = rect.left,
                srcW = rect.right - srcX,
                srcH = rect.bottom - srcY,
                pixels = ctx.createImageData(srcW, srcH),
                pixelswidth = pixels.width,
                dest = new Uint32Array(pixels.data.buffer),
                bits = form.bits,
                depth = form.depth,
                width = form.width;
            switch (depth) {
                case 1:
                case 2:
                case 4:
                case 8:
                    let colors = cursorColors || this.swappedColors;
                    if (!colors) {
                        colors = [];
                        for (let i = 0; i < 256; i++) {
                            const argb = SmalltalkVM.indexedColors[i];
                            colors[i] = (argb & 0xFF00FF00)     // green and alpha
                                + ((argb & 0x00FF0000) >> 16)  // shift red down
                                + ((argb & 0x000000FF) << 16); // shift blue up
                        }
                        this.swappedColors = colors;
                    }
                    const mask = (1 << depth) - 1;
                    const pixPerWord = 32 / depth;
                    const leftSrcShift = 32 - (srcX % pixPerWord + 1) * depth;
                    const srcOffset = srcX / pixPerWord | 0;
                    const pitch = (width + pixPerWord - 1) / pixPerWord | 0;
                    for (let y = 0; y < srcH; y++) {
                        let srcIndex = pitch * srcY + srcOffset,
                            srcShift = leftSrcShift,
                            src = bits[srcIndex],
                            dstIndex = pixelswidth * y;
                        for (let x = 0; x < srcW; x++) {
                            dest[dstIndex++] = colors[(src >>> srcShift) & mask];
                            if ((srcShift -= depth) < 0) {
                                srcShift = 32 - depth;
                                src = bits[++srcIndex];
                            }
                        }
                        srcY++;
                    };
                    break;
                case 16:
                    const leftSrcShift16 = srcX % 2 ? 0 : 16,
                        srcOffset16 = srcX / 2 | 0,
                        pitch16 = (width + 1) / 2 | 0;
                    for (let y = 0; y < srcH; y++) {
                        let srcIndex = pitch16 * srcY + srcOffset16,
                            srcShift = leftSrcShift16,
                            src = bits[srcIndex],
                            dstIndex = pixelswidth * y;
                        for (let x = 0; x < srcW; x++) {
                            const rgb = src >>> srcShift;
                            dest[dstIndex++] =
                                ((rgb & 0x7C00) >> 7)     // shift red   down 2*5, up 0*8 + 3
                                + ((rgb & 0x03E0) << 6)   // shift green down 1*5, up 1*8 + 3
                                + ((rgb & 0x001F) << 19)  // shift blue  down 0*5, up 2*8 + 3
                                + 0xFF000000;             // set alpha to opaque
                            if ((srcShift -= 16) < 0) {
                                srcShift = 16;
                                src = bits[++srcIndex];
                            }
                        }
                        srcY++;
                    };
                    break;
                case 32:
                    const opaque = cursorColors ? 0 : 0xFF000000;    // keep alpha for cursors
                    for (let y = 0; y < srcH; y++) {
                        let srcIndex = width * srcY + srcX,
                            dstIndex = pixelswidth * y;
                        for (let x = 0; x < srcW; x++) {
                            const argb = bits[srcIndex++];  // convert ARGB -> ABGR
                            dest[dstIndex++] = (argb & 0xFF00FF00)     // green and alpha is okay
                                | ((argb & 0x00FF0000) >> 16)  // shift red down
                                | ((argb & 0x000000FF) << 16)  // shift blue up
                                | opaque;                      // set alpha to opaque
                        }
                        srcY++;
                    };
                    break;
                default: throw Error("depth not implemented");
            };
            ctx.putImageData(pixels, rect.left, rect.top);
        },
        warnOnce: function(message) {
            if (this.addMessage(message) == 1)
                console.warn(message);
        },
        primitiveBeCursor: function(arg) {
            const cursorCanvas = SmalltalkVM.display.cursorCanvas;
            if (cursorCanvas) {
                const argVal = arg === undefined ? nil : arg.valueOf();
                if (typeof argVal === 'object') {
                    const thisPointers = this.pointers;
                    const cursorForm = SmalltalkVM.loadForm(thisPointers);
                    if (cursorForm) {
                        const context = cursorCanvas.getContext("2d"),
                            bounds = {left: 0, top: 0, right: cursorForm.width, bottom: cursorForm.height};
                        cursorCanvas.width = cursorForm.width;
                        cursorCanvas.height = cursorForm.height;
                        if (cursorForm.depth === 1) {
                            const maskForm = SmalltalkVM.loadForm(argVal.pointers);
                            if (maskForm) {
                                // make 2-bit form from cursor and mask 1-bit forms
                                const bits = new Uint32Array(16);
                                for (let y = 0; y < 16; y++) {
                                    const c = cursorForm.bits[y],
                                        m = maskForm.bits[y];
                                    let bit = 0x80000000,
                                        merged = 0;
                                    for (let x = 0; x < 16; x++) {
                                        merged = merged | ((m & bit) >> x) | ((c & bit) >> (x + 1));
                                        bit = bit >>> 1;
                                    }
                                    bits[y] = merged;
                                }
                                SmalltalkVM.showForm(context, {bits: bits, depth: 2, width: 16, height: 16},
                                    bounds, [0x00000000, 0xFF0000FF, 0xFFFFFFFF, 0xFF000000]);
                            } else {
                                SmalltalkVM.showForm(context, cursorForm, bounds, [0x00000000, 0xFF000000]);
                            }
                        } else {
                            SmalltalkVM.showForm(context, cursorForm, bounds, true);
                        }
                        const canvas = SmalltalkVM.display.context.canvas,
                            scale = canvas.offsetWidth / canvas.width;
                        cursorCanvas.style.width = (cursorCanvas.width * scale|0) + "px";
                        cursorCanvas.style.height = (cursorCanvas.height * scale|0) + "px";
                        const offsetPointers = thisPointers[4].pointers;
                        if (offsetPointers) {
                            SmalltalkVM.display.cursorOffsetX = offsetPointers[0] * scale|0;
                            SmalltalkVM.display.cursorOffsetY = offsetPointers[1] * scale|0;

                        } else {
                            SmalltalkVM.display.cursorOffsetX = 0;
                            SmalltalkVM.display.cursorOffsetY = 0;
                        }
                        return this;
                    }
                }
            } else
                return this;
        },
        primitiveBeDisplay: function() {
            if (true)
                return SmalltalkVM.specialObjectsArray[14] = this;
        },
        primitiveShowDisplayRect: function(arg1, arg2, arg3, arg4) {
            // Force the given rectangular section of the Display to be copied to the screen.
            const left = arg1.valueOf(),
                right = arg2.valueOf(),
                top = arg3.valueOf(),
                bottom = arg4.valueOf();

            if (typeof left === "number" &&
                typeof right === "number" &&
                typeof top === "number" &&
                typeof bottom === "number")
            {
                const theDisplay = SmalltalkVM.loadForm(SmalltalkVM.specialObjectsArray[14].pointers),
                    bounds = {left: 0, top: 0, right: theDisplay.width, bottom: theDisplay.height};
                if (left > 0) bounds.left = left;
                if (right < bounds.right) bounds.right = right;
                if (top > 0) bounds.top = top;
                if (bottom < bounds.bottom) bounds.bottom = bottom;
                if (bounds.left < bounds.right && bounds.top < bounds.bottom) {
                    SmalltalkVM.showForm(SmalltalkVM.display.context, theDisplay, bounds);
                    SmalltalkVM.display.idle = 0;
                }
                return this;
            }
        },
        primitiveDeferDisplayUpdates: function(arg) {
            const flag = arg.valueOf();
            if (typeof flag === "boolean") {
                SmalltalkVM.deferDisplayUpdates = flag;
                return this;
            }
        },
        primitiveForceDisplayUpdate: function() {
            if (true) {
//                yield "refreshBrowser";
                return this;
            }
        },
        primitiveScreenSize: function() {
            const result = new SmalltalkGlobals._Point();
            if(result) {
                const display = SmalltalkVM.display;
                result.pointers[0] = display.width || display.context.canvas.width;
                result.pointers[1] = display.height || display.context.canvas.height;
                return result;
            }
        },
        primitiveSetFullScreen: function(arg) {
            const flag = arg.valueOf();
            if (typeof flag === "boolean")
            {
                if (SmalltalkVM.display.fullscreen != flag) {
                    SmalltalkVM.display.fullscreen = flag;
//                    yield "refreshBrowser";
                }
                return this;
            }
        },
        primitiveTestDisplayDepth: function(arg) {
            const depth = arg.valueOf();
            if (typeof depth === "number" && Number.isSafeInteger(depth)) {
                const supportedDepths = [1, 2, 4, 8, 16, 32]; // match showForm
                return supportedDepths.indexOf(depth) >= 0;
            }
        },
        primitiveBeep: function() {
            const ctx = SmalltalkVM.startAudioOut();
            if (ctx) {
                const beep = ctx.createOscillator();
                beep.connect(ctx.destination);
                beep.type = 'square';
                beep.frequency.value = 880;
                beep.start();
                beep.stop(ctx.currentTime + 0.05);
                return this;
            } else {
                SmalltalkVM.warnOnce("could not initialize audio");
            }
        },
    });


