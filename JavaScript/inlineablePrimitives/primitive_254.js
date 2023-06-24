	if (arguments.length < 3) {
		function vmParameterAt(index) {
			switch (index) {
				case 1:
					return SmalltalkVM.totalJSHeapSize();     // end of old-space (0-based, read-only)	totalJSHeapSize
				case 2:
					return 0;     // end of young-space (read-only)
				case 3:
					return SmalltalkVM.totalJSHeapSize();       // end of memory (read-only)				jsHeapSizeLimit
				case 4: // allocationCount (read-only; nil in Cog VMs)
				case 5: // allocations between GCs (read-write; nil in Cog VMs)
					return 0;
				// 6    survivor count tenuring threshold (read-write)
				case 7:
					return 0;           // full GCs since startup (read-only)
				case 8:
					return 0;    // total milliseconds in full GCs since startup (read-only)
				case 9:
					return 0;          // incremental GCs since startup (read-only)
				case 10:
					return 0;  // total milliseconds in incremental GCs since startup (read-only)
				case 11:
					return 0;        // tenures of surving objects since startup (read-only)
				// 12-20 specific to the translating VM
				case 15:
				case 16:
				case 17:
					return 0;                              // method cache stats
				// 21   root table size (read-only)
				case 22:
					return 0;                              // root table overflows since startup (read-only)
				case 23:
					return 0;    // bytes of extra memory to reserve for VM buffers, plugins, etc.
				// 24   memory threshold above which to shrink object memory (read-write)
				// 25   memory headroom when growing object memory (read-write)
				// 26   interruptChecksEveryNms - force an ioProcessEvents every N milliseconds (read-write)
				// 27   number of times mark loop iterated for current IGC/FGC (read-only) includes ALL marking
				// 28   number of times sweep loop iterated for current IGC/FGC (read-only)
				// 29   number of times make forward loop iterated for current IGC/FGC (read-only)
				// 30   number of times compact move loop iterated for current IGC/FGC (read-only)
				// 31   number of grow memory requests (read-only)
				// 32   number of shrink memory requests (read-only)
				// 33   number of root table entries used for current IGC/FGC (read-only)
				// 34   number of allocations done before current IGC/FGC (read-only)
				// 35   number of survivor objects after current IGC/FGC (read-only)
				// 36   millisecond clock when current IGC/FGC completed (read-only)
				// 37   number of marked objects for Roots of the world, not including Root Table entries for current IGC/FGC (read-only)
				// 38   milliseconds taken by current IGC (read-only)
				// 39   Number of finalization signals for Weak Objects pending when current IGC/FGC completed (read-only)
				case 40:
					return SmalltalkGlobals.BytesPerWord; // BytesPerWord for this image
				case 41:
					return SmalltalkGlobals.ImageFormat;
				//42    number of stack pages in use (Cog Stack VM only, otherwise nil)
				case 42:
					return 1;	//identify as a Cog VM
				case 43: // desired number of stack pages (stored in image file header, max 65535; Cog VMs only, otherwise nil)
				case 44: // size of eden, in bytes
				case 45: // desired size of eden, in bytes (stored in image file header; Cog VMs only, otherwise nil)
					return 0;
				// 46   size of machine code zone, in bytes (stored in image file header; Cog JIT VM only, otherwise nil)
				// 47   desired size of machine code zone, in bytes (applies at startup only, stored in image file header; Cog JIT VM only)
				// 48   various properties of the Cog VM as an integer encoding an array of bit flags.
				//      Bit 0: tells the VM that the image's Process class has threadId as its 5th inst var (after nextLink, suspendedContext, priority & myList)
				//      Bit 1: on Cog JIT VMs asks the VM to set the flag bit in interpreted methods
				//      Bit 2: if set, preempting a process puts it to the head of its run queue, not the back,
				//             i.e. preempting a process by a higher priority one will not cause the preempted process to yield
				//             to others at the same priority.
				//      Bit 3: in a muilt-threaded VM, if set, the Window system will only be accessed from the first VM thread
				//      Bit 4: in a Spur vm, if set, causes weaklings and ephemerons to be queued individually for finalization
				case 48:
					return SmalltalkVM.processPreemptionYields ? 0 : 4;
				// 49   the size of the external semaphore table (read-write; Cog VMs only)
				case 49:
					return 256;
				// 50-51 reserved for VM parameters that persist in the image (such as eden above)
				// 52   root (remembered) table maximum size (read-only)
				// 53   the number of oldSpace segments (Spur only, otherwise nil)
				case 54:
					return SmalltalkVM.bytesLeft();  // total size of free old space (Spur only, otherwise nil)
				// 55   ratio of growth and image size at or above which a GC will be performed post scavenge (Spur only, otherwise nil)
				// 56   number of process switches since startup (read-only)
				// 57   number of ioProcessEvents calls since startup (read-only)
				// 58   number of forceInterruptCheck (Cog VMs) or quickCheckInterruptCalls (non-Cog VMs) calls since startup (read-only)
				// 59   number of check event calls since startup (read-only)
				// 60   number of stack page overflows since startup (read-only; Cog VMs only)
				// 61   number of stack page divorces since startup (read-only; Cog VMs only)
				// 62   number of machine code zone compactions since startup (read-only; Cog VMs only)
				// 63   milliseconds taken by machine code zone compactions since startup (read-only; Cog VMs only)
				// 64   current number of machine code methods (read-only; Cog VMs only)
				// 65   In newer Cog VMs a set of flags describing VM features,
				//      if non-zero bit 0 implies multiple bytecode set support;
				//      if non-zero bit 0 implies read-only object support
				//      (read-only; Cog VMs only; nil in older Cog VMs, a boolean answering multiple bytecode support in not so old Cog VMs)
				case 65:
				// 66   the byte size of a stack page in the stack zone  (read-only; Cog VMs only)
				// 67   the maximum allowed size of old space in bytes, 0 implies no internal limit (Spur VMs only).
				case 67:
					return 0;
				// 68 - 69 reserved for more Cog-related info
				// 70   the value of VM_PROXY_MAJOR (the interpreterProxy major version number)
				case 70:
					return 1;
				// 71   the value of VM_PROXY_MINOR (the interpreterProxy minor version number)"
				case 71:
					return 17;	//not sure what this means, but this is what my 6.0 image returns
				// 72	total milliseconds in full GCs Mark phase since startup (read-only)
				// 73	total milliseconds in full GCs Sweep phase since startup (read-only, can be 0 depending on compactors)
				// 74	maximum pause time due to segment allocation
				// 75	whether arithmetic primitives will do mixed type arithmetic; if false they fail for different receiver and argument types
				// 76	the minimum unused headroom in all stack pages; Cog VMs only"
				default:
					return nil
			}
		}
		const paramsArraySize = 76;	// this keeps changing
		switch (arguments.length) {
			case 0:
				const array = new Array(paramsArraySize);
				for (var i = 0; i < paramsArraySize; i++)
					array[i] = vmParameterAt(i+1);
				return SmalltalkGlobals._Array.from(array);
			case 1:
			case 2:
				const parm = arguments[0];
				if (parm >= 1 && parm <= paramsArraySize) {
					const oldValue = vmParameterAt(parm);
					if (parm === 48 && arguments.length === 2) {
						SmalltalkVM.processPreemptionYields = (arguments[1] & 4) !== 4;
					}
					return oldValue;
				}
		};
	}