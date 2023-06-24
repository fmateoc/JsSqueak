/*
 * Copyright (c) 2022  Florin Mateoc
 *
 * This file is part of JsSqueak.
 *
 * JsSqueak is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JsSqueak is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JsSqueak.  If not, see <https://www.gnu.org/licenses/>.
 */

//SmalltalkGlobals is a JavaScript global serving as a namespace (and providing global path shortcuts) for Smalltalk global variables
//The SmalltalkGlobals object also knows how to read and install the serialized "Smalltalk globals" Environment instance graph
//
//Classes are directly stored in SmalltalkGlobals at their own name (a JavaScript string) as key, their binding object found as a property directly on the class
//Non-class globals have their bindings stored at their own keys (also a JavaScript string) in SmalltalkGlobals

globalThis.SmalltalkGlobals = {
    toRehash: [],
    classComments: new Map(),

    rehashAll() {
        //add top-level hashed collections created in global_bindings.js, not de-serialized
        const pointers = this._Smalltalk[1].pointers[0].pointers;
        this.toRehash.push(pointers[0].pointers[2].pointers[0]);   //Smalltalk.globals.info.packages.packages
        this.toRehash.push(pointers[1]);                           //Smalltalk.globals.declarations
        this.toRehash.push(pointers[2]);                           //Smalltalk.globals.bindings
        this.toRehash.push(pointers[3]);                           //Smalltalk.globals.undeclared

        let i = 0;
        console.log("Rehashing all");
        for(const hashedCollection of this.toRehash) {
            try {
                hashedCollection._rehash().next();
            } catch (e) {
                console.log("error at index " + i + ": " + e);
            }
            i++
        }
        this.toRehash = [];

        //method dictionaries were also not de-serialized, they were created in the class definition files
        console.log("Rehashing method dictionaries");
        for (const [key, b] of Object.entries(this)) {
            if (b instanceof this._Class && b[2] instanceof this._ClassBinding && b.name === key) {
                b.pointers[9] = this._Smalltalk[1].pointers[0];     //also taking advantage of the iteration through the classes to set their environment
                try {
                    b.pointers[1]._rehash().next();
                    b.constructor.pointers[1]._rehash().next();
                } catch (e) {
                    console.log("error at " + key)
                }
            }
        }
        console.log("Done rehashing all");
    },

    readFrom(encoded) {
        const self = this;
        const found = {};
        const delayed = {};
        function decodeKeyed(encoded, resultStorage) {
            for (const key in encoded)
                if (!key.startsWith('@')) {
                    const encodedValue = encoded[key];
                    const ref = encodedValue['@ref'];
                    if (ref !== undefined) {
                        if (found[ref] === undefined) {
                            if (key in resultStorage) {
                                const delayedArray = delayed[ref] || (delayed[ref] = []);
                                if (delayedArray.length === 0) {
                                    Object.defineProperty(found, ref, {
                                        get() {
                                            return undefined;
                                        },
                                        set(value) {
                                            if (value === undefined)
                                                throw "Should not happen";
                                            delete found[ref];
                                            found[ref] = value;
                                            for (const pair of delayedArray)
                                                pair[0][pair[1]] = value;
                                            delete delayed[ref];
                                        }
                                    });
                                }
                                delayedArray.push([resultStorage, key]);
                            } else
                                throw "Should not happen: ref " + ref + " not found";
                        } else if (found[ref] instanceof self._Process)
                            resultStorage[key] = found[ref] = nil;
                        else
                            resultStorage[key] = found[ref];
                    } else
                        resultStorage[key] = doDecode(encodedValue);
                }
        }
        function doDecode(encoded) {
            function decodeObject(encoded) {
                const ref = encoded['@ref'];
                if (ref !== undefined) {
                    if (found[ref] === undefined)
                        throw "Should not happen: ref " + ref + " not found";
                    return found[ref];
                }
                let result = {};
                const id = encoded['@id'];
                if (id !== undefined) {
                    const cls = encoded['@cls'];
                    if (cls !== undefined) {
                        const size = encoded['@size'];
                        if (size !== undefined) {
                            result = cls.primitive_71_impl(size);
                            if (result[0] !== true)
                                throw "Failed primitive 71 call in " + cls;
                            if (result[1] === undefined)
                                throw "Failed allocation in " + cls;
                            result = result[1];
                        } else {
                            const string = encoded['@str'];
                            if (string !== undefined) {
                                result = cls.name.startsWith("_Wide") ? cls.fromWords(string) : cls.from(string);
                                if (result === undefined)
                                    throw "Should not happen! cls is " + cls.name + ", @str is " + string;
                            } else {
                                result = cls.primitive_70_impl();
                                if (result[0] !== true)
                                    throw "Failed primitive 70 call in " + cls;
                                if (result[1] === undefined)
                                    throw "Failed allocation in " + cls;
                                result = result[1];
                            }
                        }
                        found[id] = result;   //we have to save at id before recursive invocations
                        const storageType = result.storageType;
                        if (storageType !== null) {
                            const encodedStorage = encoded['@' + storageType];
                            if (result.isWeak) {
                                const instSize = result.instSize;
                                if (encodedStorage !== undefined) {
                                    const resultStorage = (result[storageType] = doDecode(encodedStorage));
                                    for (let key = instSize; key < encodedStorage.length; key ++)
                                        resultStorage[key] = new WeakRef(Object(resultStorage[key]));
                                }
                                else {
                                    const resultStorage = result[storageType];
                                    for (const key in encoded) {
                                        const value = encoded[key];
                                        if (!key.startsWith('@')) {
                                            if (key >= instSize)
                                                resultStorage[key] = new WeakRef(Object(doDecode(value)));
                                            else
                                                resultStorage[key] = doDecode(value);
                                        }
                                    }
                                }
                            } else {
                                if (encodedStorage !== undefined)
                                    result[storageType] = doDecode(encodedStorage);
                                else {
                                    decodeKeyed(encoded, result[storageType]);
                                }
                            }
                            if (result instanceof self._HashedCollection) {
                                self.toRehash.push(result);
                            }
                            else if (cls === self._CompiledMethod || cls === self._CompiledBlock) {
                                const literals =  encoded['@lits'];
                                if(literals === undefined)
                                    throw "Should not happen";
                                result.setLiterals(doDecode(literals));
                            }
                        }
                    } else {
                        const cls = encoded['@name'];
                        if (cls !== undefined) {
//                            console.log("decoding class [" + (!(cls instanceof self._Metaclass) ? cls.name : cls.pointers[5].name + " class") + "] with id[" + id + "]")
                            found[id] = result = cls;   //we have to save at id before recursive invocations
                            doDecodeClassDescriptionForSideEffects(cls, encoded);
                        } else {
//                            console.log("decoding environment instance Smalltalk globals")
                            const globalPath = encoded['@path'];
                            if (globalPath !== undefined) {
                                found[id] = result = globalPath;    //_Smalltalk[1].pointers[0], already bound in global_bindings.js
                                const globals = encoded['@globals'];
                                if (globals !== undefined) {
                                    const storageType = result.storageType;
                                    let storage = encoded['@' + storageType];
                                    if (storage !== undefined)
                                        result[storageType] = doDecode(storage);
                                    else {
                                        decodeKeyed(encoded, result[storageType]);
                                    }
                                    const pools = encoded['@pools'];
                                    if (pools !== undefined) {
//                                        console.log("decoding list of non-classes sharedPools " + pools + " with keys " + Object.keys(pools))
                                        for (const key in pools)
                                            if (!(key in self))
                                                console.log("missing pool dictionary " + key + " in SmalltalkGlobals");
                                            else {
                                                const encodedpool = pools[key];
                                                if (encodedpool === undefined)
                                                    throw "Should not happen, pool dictionary piece for environment has key " + key + ", but value is undefined";
 //                                               console.log("decoding " + encodedpool + " with keys " + Object.keys(encodedpool) + " as pool dictionary value for " + key);
                                                const poolDict = self[key][1] = doDecode(encodedpool);
                                                const assocs = poolDict.pointers[1].pointers;
                                                for(const assoc of assocs)
                                                    if (assoc !== nil) {
                                                        poolDict['_' + assoc.pointers[0].valueOf()] = assoc.pointers;
                                                    }

                                            }
                                    }
//                                    console.log("decoding list of non-classes and non-sharedPools globals " + globals + " with keys " + Object.keys(globals))
                                    for (const key in globals)
                                        if (!(key in self))
                                            console.log("missing global variable " + key + " in SmalltalkGlobals");
                                        else {
                                            const encodedglobalvalue = globals[key];
                                            if (encodedglobalvalue !== undefined) {
//                                            console.log("decoding " + encodedglobalvalue + " with keys " + Object.keys(encodedglobalvalue) + " as global variable value for " + key);
                                                self[key][1] = doDecode(encodedglobalvalue);
                                            } else if (key === '_SystemOrganization') {
                                                //close the loop between "Smalltalk organization" and "SystemOrganization", which both point to the same thing, from two different globals
                                                //we have already set the global, here we just don't let it be overwritten with undefined
                                            } else
                                                throw "Should not happen, globals storeString for environment has key " + key + ", but value is undefined";
                                        }
                                    const classes = encoded['@classes'];
                                    if (classes !== undefined) {
//                                        console.log("decoding list of classes " + classes + " with keys " + Object.keys(classes))
                                        for (const key in classes)
                                            if (!(key in self))
                                                console.log("missing class " + key + " in SmalltalkGlobals");
                                            else {
                                                const encodedclass = classes[key];
                                                if (encodedclass === undefined)
                                                    throw "Should not happen, class piece for environment has key " + key + ", but value is undefined";
//                                                console.log("decoding " + encodedclass + " with keys " + Object.keys(encodedclass) + " as class value for " + key);
                                                doDecode(encodedclass);
                                            }
                                    } else
                                        throw "Should not happen! encoded is " + encoded + " with keys " + Object.keys(encoded);
                                } else
                                    throw "Should not happen! encoded is " + encoded + " with keys " + Object.keys(encoded);
                            } else
                                throw "Should not happen! encoded is " + encoded + " with keys " + Object.keys(encoded);

                        }
                    }
                    if (result === undefined)
                        throw "Should not happen! encoded is " + encoded + " with keys " + Object.keys(encoded);
                    found[id] = result;
                } else {
                    //closures
                    const clos = encoded['@clos'];
                    if (clos !== undefined) {
                        const args = encoded['@args'];
                        if (args !== undefined)
                            result = clos.apply(null, doDecode(args));
                        else
                            throw "Should not happen! encoded is " + encoded + " with keys " + Object.keys(encoded);
                    } else
                        result = encoded;
                }
                return result;
            };
            if (Array.isArray(encoded)) {
                const storage = new Array(encoded.length).fill(undefined);
                decodeKeyed(encoded, storage);
                return storage;
            } else if (typeof encoded === 'object' && encoded.constructor === Object) {
                return decodeObject(encoded);
            } else {
                if (encoded === undefined)
                    throw "Should not happen";
                return encoded;
            }
        };
        function doDecodeClassDescriptionForSideEffects(cls, encoded) {
            decodeKeyed(encoded, cls.pointers)
            const meta = encoded['@meta'];
            if (meta !== undefined) {
                doDecode(meta);
            }
            const literals = encoded['@lit'];
            if (literals !== undefined) {
                const methodsHolder = cls.prototype;
                for (const key in literals)
                    if (!(key in methodsHolder))
                        throw "missing selector " + key + " in " + (cls instanceof self._Metaclass ? storage[5].name + ".constructor" : cls.name) + ".prototype";
                    else {
                        if (methodsHolder[key].compiledMethod) {
//                            console.log("decoding literals for reified compiledMethod " + key + " of class " + (cls instanceof self._Metaclass ? storage[5].name : cls.name))
                            if (methodsHolder[key].compiledMethod.literals) {
                                throw "literals for reified compiledMethod " + key + " of class " + (cls instanceof self._Metaclass ? storage[5].name + ".constructor" : cls.name) + "have already been set";
                            } else {
                                methodsHolder[key].literals = methodsHolder[key].compiledMethod.literals = new Array(literals[key].length).fill(undefined);
                                decodeKeyed(literals[key], methodsHolder[key].literals);
                            }
                        } else {
                            throw "reified compiledMethod for method " + key + " of class " + (cls instanceof self._Metaclass ? storage[5].name + ".constructor" : cls.name) + " has not been set up, the method might be a manual JavaScript override";
                        }
                    }
            }
        }
        dnuProxy["@ref"] = undefined;
        doDecode(encoded);
        delete dnuProxy["@ref"];
        if (Object.keys(delayed).length > 0)
            debugger;
    }
};
