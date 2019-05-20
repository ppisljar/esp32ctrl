/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/asap/browser-asap.js":
/*!*******************************************!*\
  !*** ./node_modules/asap/browser-asap.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(/*! ./raw */ "./node_modules/asap/browser-raw.js");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


/***/ }),

/***/ "./node_modules/asap/browser-raw.js":
/*!******************************************!*\
  !*** ./node_modules/asap/browser-raw.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/disposables/modules/CompositeDisposable.js":
/*!*****************************************************************!*\
  !*** ./node_modules/disposables/modules/CompositeDisposable.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _isDisposable = __webpack_require__(/*! ./isDisposable */ "./node_modules/disposables/modules/isDisposable.js");

var _isDisposable2 = _interopRequireDefault(_isDisposable);

/**
 * Represents a group of disposable resources that are disposed together.
 */

var CompositeDisposable = (function () {
  function CompositeDisposable() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
      disposables[_key] = arguments[_key];
    }

    _classCallCheck(this, CompositeDisposable);

    if (Array.isArray(disposables[0]) && disposables.length === 1) {
      disposables = disposables[0];
    }

    for (var i = 0; i < disposables.length; i++) {
      if (!_isDisposable2['default'](disposables[i])) {
        throw new Error('Expected a disposable');
      }
    }

    this.disposables = disposables;
    this.isDisposed = false;
  }

  /**
   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
   * @param {Disposable} item Disposable to add.
   */

  CompositeDisposable.prototype.add = function add(item) {
    if (this.isDisposed) {
      item.dispose();
    } else {
      this.disposables.push(item);
    }
  };

  /**
   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
   * @param {Disposable} item Disposable to remove.
   * @returns {Boolean} true if found; false otherwise.
   */

  CompositeDisposable.prototype.remove = function remove(item) {
    if (this.isDisposed) {
      return false;
    }

    var index = this.disposables.indexOf(item);
    if (index === -1) {
      return false;
    }

    this.disposables.splice(index, 1);
    item.dispose();
    return true;
  };

  /**
   * Disposes all disposables in the group and removes them from the group.
   */

  CompositeDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    var len = this.disposables.length;
    var currentDisposables = new Array(len);
    for (var i = 0; i < len; i++) {
      currentDisposables[i] = this.disposables[i];
    }

    this.isDisposed = true;
    this.disposables = [];
    this.length = 0;

    for (var i = 0; i < len; i++) {
      currentDisposables[i].dispose();
    }
  };

  return CompositeDisposable;
})();

exports['default'] = CompositeDisposable;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/disposables/modules/Disposable.js":
/*!********************************************************!*\
  !*** ./node_modules/disposables/modules/Disposable.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

/**
 * The basic disposable.
 */

var Disposable = (function () {
  _createClass(Disposable, null, [{
    key: "empty",
    value: { dispose: noop },
    enumerable: true
  }]);

  function Disposable(action) {
    _classCallCheck(this, Disposable);

    this.isDisposed = false;
    this.action = action || noop;
  }

  Disposable.prototype.dispose = function dispose() {
    if (!this.isDisposed) {
      this.action.call(null);
      this.isDisposed = true;
    }
  };

  return Disposable;
})();

exports["default"] = Disposable;
module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/disposables/modules/SerialDisposable.js":
/*!**************************************************************!*\
  !*** ./node_modules/disposables/modules/SerialDisposable.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _isDisposable = __webpack_require__(/*! ./isDisposable */ "./node_modules/disposables/modules/isDisposable.js");

var _isDisposable2 = _interopRequireDefault(_isDisposable);

var SerialDisposable = (function () {
  function SerialDisposable() {
    _classCallCheck(this, SerialDisposable);

    this.isDisposed = false;
    this.current = null;
  }

  /**
   * Gets the underlying disposable.
   * @return The underlying disposable.
   */

  SerialDisposable.prototype.getDisposable = function getDisposable() {
    return this.current;
  };

  /**
   * Sets the underlying disposable.
   * @param {Disposable} value The new underlying disposable.
   */

  SerialDisposable.prototype.setDisposable = function setDisposable() {
    var value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    if (value != null && !_isDisposable2['default'](value)) {
      throw new Error('Expected either an empty value or a valid disposable');
    }

    var isDisposed = this.isDisposed;
    var previous = undefined;

    if (!isDisposed) {
      previous = this.current;
      this.current = value;
    }

    if (previous) {
      previous.dispose();
    }

    if (isDisposed && value) {
      value.dispose();
    }
  };

  /**
   * Disposes the underlying disposable as well as all future replacements.
   */

  SerialDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    var previous = this.current;
    this.current = null;

    if (previous) {
      previous.dispose();
    }
  };

  return SerialDisposable;
})();

exports['default'] = SerialDisposable;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/disposables/modules/index.js":
/*!***************************************************!*\
  !*** ./node_modules/disposables/modules/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isDisposable2 = __webpack_require__(/*! ./isDisposable */ "./node_modules/disposables/modules/isDisposable.js");

var _isDisposable3 = _interopRequireDefault(_isDisposable2);

exports.isDisposable = _isDisposable3['default'];

var _Disposable2 = __webpack_require__(/*! ./Disposable */ "./node_modules/disposables/modules/Disposable.js");

var _Disposable3 = _interopRequireDefault(_Disposable2);

exports.Disposable = _Disposable3['default'];

var _CompositeDisposable2 = __webpack_require__(/*! ./CompositeDisposable */ "./node_modules/disposables/modules/CompositeDisposable.js");

var _CompositeDisposable3 = _interopRequireDefault(_CompositeDisposable2);

exports.CompositeDisposable = _CompositeDisposable3['default'];

var _SerialDisposable2 = __webpack_require__(/*! ./SerialDisposable */ "./node_modules/disposables/modules/SerialDisposable.js");

var _SerialDisposable3 = _interopRequireDefault(_SerialDisposable2);

exports.SerialDisposable = _SerialDisposable3['default'];

/***/ }),

/***/ "./node_modules/disposables/modules/isDisposable.js":
/*!**********************************************************!*\
  !*** ./node_modules/disposables/modules/isDisposable.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports['default'] = isDisposable;

function isDisposable(obj) {
  return Boolean(obj && typeof obj.dispose === 'function');
}

module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/dnd-core/lib/DragDropManager.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/lib/DragDropManager.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createStore = __webpack_require__(/*! redux/lib/createStore */ "./node_modules/redux/lib/createStore.js");

var _createStore2 = _interopRequireDefault(_createStore);

var _reducers = __webpack_require__(/*! ./reducers */ "./node_modules/dnd-core/lib/reducers/index.js");

var _reducers2 = _interopRequireDefault(_reducers);

var _dragDrop = __webpack_require__(/*! ./actions/dragDrop */ "./node_modules/dnd-core/lib/actions/dragDrop.js");

var dragDropActions = _interopRequireWildcard(_dragDrop);

var _DragDropMonitor = __webpack_require__(/*! ./DragDropMonitor */ "./node_modules/dnd-core/lib/DragDropMonitor.js");

var _DragDropMonitor2 = _interopRequireDefault(_DragDropMonitor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragDropManager = function () {
	function DragDropManager(createBackend) {
		var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, DragDropManager);

		var store = (0, _createStore2.default)(_reducers2.default);
		this.context = context;
		this.store = store;
		this.monitor = new _DragDropMonitor2.default(store);
		this.registry = this.monitor.registry;
		this.backend = createBackend(this);

		store.subscribe(this.handleRefCountChange.bind(this));
	}

	_createClass(DragDropManager, [{
		key: 'handleRefCountChange',
		value: function handleRefCountChange() {
			var shouldSetUp = this.store.getState().refCount > 0;
			if (shouldSetUp && !this.isSetUp) {
				this.backend.setup();
				this.isSetUp = true;
			} else if (!shouldSetUp && this.isSetUp) {
				this.backend.teardown();
				this.isSetUp = false;
			}
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}
	}, {
		key: 'getMonitor',
		value: function getMonitor() {
			return this.monitor;
		}
	}, {
		key: 'getBackend',
		value: function getBackend() {
			return this.backend;
		}
	}, {
		key: 'getRegistry',
		value: function getRegistry() {
			return this.registry;
		}
	}, {
		key: 'getActions',
		value: function getActions() {
			var manager = this;
			var dispatch = this.store.dispatch;


			function bindActionCreator(actionCreator) {
				return function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					var action = actionCreator.apply(manager, args);
					if (typeof action !== 'undefined') {
						dispatch(action);
					}
				};
			}

			return Object.keys(dragDropActions).filter(function (key) {
				return typeof dragDropActions[key] === 'function';
			}).reduce(function (boundActions, key) {
				var action = dragDropActions[key];
				boundActions[key] = bindActionCreator(action); // eslint-disable-line no-param-reassign
				return boundActions;
			}, {});
		}
	}]);

	return DragDropManager;
}();

exports.default = DragDropManager;

/***/ }),

/***/ "./node_modules/dnd-core/lib/DragDropMonitor.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/lib/DragDropMonitor.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isArray = __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js");

var _isArray2 = _interopRequireDefault(_isArray);

var _matchesType = __webpack_require__(/*! ./utils/matchesType */ "./node_modules/dnd-core/lib/utils/matchesType.js");

var _matchesType2 = _interopRequireDefault(_matchesType);

var _HandlerRegistry = __webpack_require__(/*! ./HandlerRegistry */ "./node_modules/dnd-core/lib/HandlerRegistry.js");

var _HandlerRegistry2 = _interopRequireDefault(_HandlerRegistry);

var _dragOffset = __webpack_require__(/*! ./reducers/dragOffset */ "./node_modules/dnd-core/lib/reducers/dragOffset.js");

var _dirtyHandlerIds = __webpack_require__(/*! ./reducers/dirtyHandlerIds */ "./node_modules/dnd-core/lib/reducers/dirtyHandlerIds.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragDropMonitor = function () {
	function DragDropMonitor(store) {
		_classCallCheck(this, DragDropMonitor);

		this.store = store;
		this.registry = new _HandlerRegistry2.default(store);
	}

	_createClass(DragDropMonitor, [{
		key: 'subscribeToStateChange',
		value: function subscribeToStateChange(listener) {
			var _this = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var handlerIds = options.handlerIds;

			(0, _invariant2.default)(typeof listener === 'function', 'listener must be a function.');
			(0, _invariant2.default)(typeof handlerIds === 'undefined' || (0, _isArray2.default)(handlerIds), 'handlerIds, when specified, must be an array of strings.');

			var prevStateId = this.store.getState().stateId;
			var handleChange = function handleChange() {
				var state = _this.store.getState();
				var currentStateId = state.stateId;
				try {
					var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !(0, _dirtyHandlerIds.areDirty)(state.dirtyHandlerIds, handlerIds);

					if (!canSkipListener) {
						listener();
					}
				} finally {
					prevStateId = currentStateId;
				}
			};

			return this.store.subscribe(handleChange);
		}
	}, {
		key: 'subscribeToOffsetChange',
		value: function subscribeToOffsetChange(listener) {
			var _this2 = this;

			(0, _invariant2.default)(typeof listener === 'function', 'listener must be a function.');

			var previousState = this.store.getState().dragOffset;
			var handleChange = function handleChange() {
				var nextState = _this2.store.getState().dragOffset;
				if (nextState === previousState) {
					return;
				}

				previousState = nextState;
				listener();
			};

			return this.store.subscribe(handleChange);
		}
	}, {
		key: 'canDragSource',
		value: function canDragSource(sourceId) {
			var source = this.registry.getSource(sourceId);
			(0, _invariant2.default)(source, 'Expected to find a valid source.');

			if (this.isDragging()) {
				return false;
			}

			return source.canDrag(this, sourceId);
		}
	}, {
		key: 'canDropOnTarget',
		value: function canDropOnTarget(targetId) {
			var target = this.registry.getTarget(targetId);
			(0, _invariant2.default)(target, 'Expected to find a valid target.');

			if (!this.isDragging() || this.didDrop()) {
				return false;
			}

			var targetType = this.registry.getTargetType(targetId);
			var draggedItemType = this.getItemType();
			return (0, _matchesType2.default)(targetType, draggedItemType) && target.canDrop(this, targetId);
		}
	}, {
		key: 'isDragging',
		value: function isDragging() {
			return Boolean(this.getItemType());
		}
	}, {
		key: 'isDraggingSource',
		value: function isDraggingSource(sourceId) {
			var source = this.registry.getSource(sourceId, true);
			(0, _invariant2.default)(source, 'Expected to find a valid source.');

			if (!this.isDragging() || !this.isSourcePublic()) {
				return false;
			}

			var sourceType = this.registry.getSourceType(sourceId);
			var draggedItemType = this.getItemType();
			if (sourceType !== draggedItemType) {
				return false;
			}

			return source.isDragging(this, sourceId);
		}
	}, {
		key: 'isOverTarget',
		value: function isOverTarget(targetId) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { shallow: false };
			var shallow = options.shallow;

			if (!this.isDragging()) {
				return false;
			}

			var targetType = this.registry.getTargetType(targetId);
			var draggedItemType = this.getItemType();
			if (!(0, _matchesType2.default)(targetType, draggedItemType)) {
				return false;
			}

			var targetIds = this.getTargetIds();
			if (!targetIds.length) {
				return false;
			}

			var index = targetIds.indexOf(targetId);
			if (shallow) {
				return index === targetIds.length - 1;
			} else {
				return index > -1;
			}
		}
	}, {
		key: 'getItemType',
		value: function getItemType() {
			return this.store.getState().dragOperation.itemType;
		}
	}, {
		key: 'getItem',
		value: function getItem() {
			return this.store.getState().dragOperation.item;
		}
	}, {
		key: 'getSourceId',
		value: function getSourceId() {
			return this.store.getState().dragOperation.sourceId;
		}
	}, {
		key: 'getTargetIds',
		value: function getTargetIds() {
			return this.store.getState().dragOperation.targetIds;
		}
	}, {
		key: 'getDropResult',
		value: function getDropResult() {
			return this.store.getState().dragOperation.dropResult;
		}
	}, {
		key: 'didDrop',
		value: function didDrop() {
			return this.store.getState().dragOperation.didDrop;
		}
	}, {
		key: 'isSourcePublic',
		value: function isSourcePublic() {
			return this.store.getState().dragOperation.isSourcePublic;
		}
	}, {
		key: 'getInitialClientOffset',
		value: function getInitialClientOffset() {
			return this.store.getState().dragOffset.initialClientOffset;
		}
	}, {
		key: 'getInitialSourceClientOffset',
		value: function getInitialSourceClientOffset() {
			return this.store.getState().dragOffset.initialSourceClientOffset;
		}
	}, {
		key: 'getClientOffset',
		value: function getClientOffset() {
			return this.store.getState().dragOffset.clientOffset;
		}
	}, {
		key: 'getSourceClientOffset',
		value: function getSourceClientOffset() {
			return (0, _dragOffset.getSourceClientOffset)(this.store.getState().dragOffset);
		}
	}, {
		key: 'getDifferenceFromInitialOffset',
		value: function getDifferenceFromInitialOffset() {
			return (0, _dragOffset.getDifferenceFromInitialOffset)(this.store.getState().dragOffset);
		}
	}]);

	return DragDropMonitor;
}();

exports.default = DragDropMonitor;

/***/ }),

/***/ "./node_modules/dnd-core/lib/DragSource.js":
/*!*************************************************!*\
  !*** ./node_modules/dnd-core/lib/DragSource.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragSource = function () {
	function DragSource() {
		_classCallCheck(this, DragSource);
	}

	_createClass(DragSource, [{
		key: "canDrag",
		value: function canDrag() {
			return true;
		}
	}, {
		key: "isDragging",
		value: function isDragging(monitor, handle) {
			return handle === monitor.getSourceId();
		}
	}, {
		key: "endDrag",
		value: function endDrag() {}
	}]);

	return DragSource;
}();

exports.default = DragSource;

/***/ }),

/***/ "./node_modules/dnd-core/lib/DropTarget.js":
/*!*************************************************!*\
  !*** ./node_modules/dnd-core/lib/DropTarget.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DropTarget = function () {
	function DropTarget() {
		_classCallCheck(this, DropTarget);
	}

	_createClass(DropTarget, [{
		key: "canDrop",
		value: function canDrop() {
			return true;
		}
	}, {
		key: "hover",
		value: function hover() {}
	}, {
		key: "drop",
		value: function drop() {}
	}]);

	return DropTarget;
}();

exports.default = DropTarget;

/***/ }),

/***/ "./node_modules/dnd-core/lib/HandlerRegistry.js":
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/lib/HandlerRegistry.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isArray = __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js");

var _isArray2 = _interopRequireDefault(_isArray);

var _asap = __webpack_require__(/*! asap */ "./node_modules/asap/browser-asap.js");

var _asap2 = _interopRequireDefault(_asap);

var _registry = __webpack_require__(/*! ./actions/registry */ "./node_modules/dnd-core/lib/actions/registry.js");

var _getNextUniqueId = __webpack_require__(/*! ./utils/getNextUniqueId */ "./node_modules/dnd-core/lib/utils/getNextUniqueId.js");

var _getNextUniqueId2 = _interopRequireDefault(_getNextUniqueId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HandlerRoles = {
	SOURCE: 'SOURCE',
	TARGET: 'TARGET'
};

function validateSourceContract(source) {
	(0, _invariant2.default)(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
	(0, _invariant2.default)(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
	(0, _invariant2.default)(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}

function validateTargetContract(target) {
	(0, _invariant2.default)(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
	(0, _invariant2.default)(typeof target.hover === 'function', 'Expected hover to be a function.');
	(0, _invariant2.default)(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}

function validateType(type, allowArray) {
	if (allowArray && (0, _isArray2.default)(type)) {
		type.forEach(function (t) {
			return validateType(t, false);
		});
		return;
	}

	(0, _invariant2.default)(typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
}

function getNextHandlerId(role) {
	var id = (0, _getNextUniqueId2.default)().toString();
	switch (role) {
		case HandlerRoles.SOURCE:
			return 'S' + id;
		case HandlerRoles.TARGET:
			return 'T' + id;
		default:
			(0, _invariant2.default)(false, 'Unknown role: ' + role);
	}
}

function parseRoleFromHandlerId(handlerId) {
	switch (handlerId[0]) {
		case 'S':
			return HandlerRoles.SOURCE;
		case 'T':
			return HandlerRoles.TARGET;
		default:
			(0, _invariant2.default)(false, 'Cannot parse handler ID: ' + handlerId);
	}
}

var HandlerRegistry = function () {
	function HandlerRegistry(store) {
		_classCallCheck(this, HandlerRegistry);

		this.store = store;

		this.types = {};
		this.handlers = {};

		this.pinnedSourceId = null;
		this.pinnedSource = null;
	}

	_createClass(HandlerRegistry, [{
		key: 'addSource',
		value: function addSource(type, source) {
			validateType(type);
			validateSourceContract(source);

			var sourceId = this.addHandler(HandlerRoles.SOURCE, type, source);
			this.store.dispatch((0, _registry.addSource)(sourceId));
			return sourceId;
		}
	}, {
		key: 'addTarget',
		value: function addTarget(type, target) {
			validateType(type, true);
			validateTargetContract(target);

			var targetId = this.addHandler(HandlerRoles.TARGET, type, target);
			this.store.dispatch((0, _registry.addTarget)(targetId));
			return targetId;
		}
	}, {
		key: 'addHandler',
		value: function addHandler(role, type, handler) {
			var id = getNextHandlerId(role);
			this.types[id] = type;
			this.handlers[id] = handler;

			return id;
		}
	}, {
		key: 'containsHandler',
		value: function containsHandler(handler) {
			var _this = this;

			return Object.keys(this.handlers).some(function (key) {
				return _this.handlers[key] === handler;
			});
		}
	}, {
		key: 'getSource',
		value: function getSource(sourceId, includePinned) {
			(0, _invariant2.default)(this.isSourceId(sourceId), 'Expected a valid source ID.');

			var isPinned = includePinned && sourceId === this.pinnedSourceId;
			var source = isPinned ? this.pinnedSource : this.handlers[sourceId];

			return source;
		}
	}, {
		key: 'getTarget',
		value: function getTarget(targetId) {
			(0, _invariant2.default)(this.isTargetId(targetId), 'Expected a valid target ID.');
			return this.handlers[targetId];
		}
	}, {
		key: 'getSourceType',
		value: function getSourceType(sourceId) {
			(0, _invariant2.default)(this.isSourceId(sourceId), 'Expected a valid source ID.');
			return this.types[sourceId];
		}
	}, {
		key: 'getTargetType',
		value: function getTargetType(targetId) {
			(0, _invariant2.default)(this.isTargetId(targetId), 'Expected a valid target ID.');
			return this.types[targetId];
		}
	}, {
		key: 'isSourceId',
		value: function isSourceId(handlerId) {
			var role = parseRoleFromHandlerId(handlerId);
			return role === HandlerRoles.SOURCE;
		}
	}, {
		key: 'isTargetId',
		value: function isTargetId(handlerId) {
			var role = parseRoleFromHandlerId(handlerId);
			return role === HandlerRoles.TARGET;
		}
	}, {
		key: 'removeSource',
		value: function removeSource(sourceId) {
			var _this2 = this;

			(0, _invariant2.default)(this.getSource(sourceId), 'Expected an existing source.');
			this.store.dispatch((0, _registry.removeSource)(sourceId));

			(0, _asap2.default)(function () {
				delete _this2.handlers[sourceId];
				delete _this2.types[sourceId];
			});
		}
	}, {
		key: 'removeTarget',
		value: function removeTarget(targetId) {
			var _this3 = this;

			(0, _invariant2.default)(this.getTarget(targetId), 'Expected an existing target.');
			this.store.dispatch((0, _registry.removeTarget)(targetId));

			(0, _asap2.default)(function () {
				delete _this3.handlers[targetId];
				delete _this3.types[targetId];
			});
		}
	}, {
		key: 'pinSource',
		value: function pinSource(sourceId) {
			var source = this.getSource(sourceId);
			(0, _invariant2.default)(source, 'Expected an existing source.');

			this.pinnedSourceId = sourceId;
			this.pinnedSource = source;
		}
	}, {
		key: 'unpinSource',
		value: function unpinSource() {
			(0, _invariant2.default)(this.pinnedSource, 'No source is pinned at the time.');

			this.pinnedSourceId = null;
			this.pinnedSource = null;
		}
	}]);

	return HandlerRegistry;
}();

exports.default = HandlerRegistry;

/***/ }),

/***/ "./node_modules/dnd-core/lib/actions/dragDrop.js":
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/actions/dragDrop.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.END_DRAG = exports.DROP = exports.HOVER = exports.PUBLISH_DRAG_SOURCE = exports.BEGIN_DRAG = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.beginDrag = beginDrag;
exports.publishDragSource = publishDragSource;
exports.hover = hover;
exports.drop = drop;
exports.endDrag = endDrag;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isArray = __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js");

var _isArray2 = _interopRequireDefault(_isArray);

var _isObject = __webpack_require__(/*! lodash/isObject */ "./node_modules/lodash/isObject.js");

var _isObject2 = _interopRequireDefault(_isObject);

var _matchesType = __webpack_require__(/*! ../utils/matchesType */ "./node_modules/dnd-core/lib/utils/matchesType.js");

var _matchesType2 = _interopRequireDefault(_matchesType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BEGIN_DRAG = exports.BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
var PUBLISH_DRAG_SOURCE = exports.PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
var HOVER = exports.HOVER = 'dnd-core/HOVER';
var DROP = exports.DROP = 'dnd-core/DROP';
var END_DRAG = exports.END_DRAG = 'dnd-core/END_DRAG';

function beginDrag(sourceIds) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { publishSource: true, clientOffset: null };
	var publishSource = options.publishSource,
	    clientOffset = options.clientOffset,
	    getSourceClientOffset = options.getSourceClientOffset;

	(0, _invariant2.default)((0, _isArray2.default)(sourceIds), 'Expected sourceIds to be an array.');

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2.default)(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');

	for (var i = 0; i < sourceIds.length; i++) {
		(0, _invariant2.default)(registry.getSource(sourceIds[i]), 'Expected sourceIds to be registered.');
	}

	var sourceId = null;
	for (var _i = sourceIds.length - 1; _i >= 0; _i--) {
		if (monitor.canDragSource(sourceIds[_i])) {
			sourceId = sourceIds[_i];
			break;
		}
	}
	if (sourceId === null) {
		return;
	}

	var sourceClientOffset = null;
	if (clientOffset) {
		(0, _invariant2.default)(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
		sourceClientOffset = getSourceClientOffset(sourceId);
	}

	var source = registry.getSource(sourceId);
	var item = source.beginDrag(monitor, sourceId);
	(0, _invariant2.default)((0, _isObject2.default)(item), 'Item must be an object.');

	registry.pinSource(sourceId);

	var itemType = registry.getSourceType(sourceId);
	return {
		type: BEGIN_DRAG,
		itemType: itemType,
		item: item,
		sourceId: sourceId,
		clientOffset: clientOffset,
		sourceClientOffset: sourceClientOffset,
		isSourcePublic: publishSource
	};
}

function publishDragSource() {
	var monitor = this.getMonitor();
	if (!monitor.isDragging()) {
		return;
	}

	return { type: PUBLISH_DRAG_SOURCE };
}

function hover(targetIdsArg) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$clientOffset = _ref.clientOffset,
	    clientOffset = _ref$clientOffset === undefined ? null : _ref$clientOffset;

	(0, _invariant2.default)((0, _isArray2.default)(targetIdsArg), 'Expected targetIds to be an array.');
	var targetIds = targetIdsArg.slice(0);

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2.default)(monitor.isDragging(), 'Cannot call hover while not dragging.');
	(0, _invariant2.default)(!monitor.didDrop(), 'Cannot call hover after drop.');

	// First check invariants.
	for (var i = 0; i < targetIds.length; i++) {
		var targetId = targetIds[i];
		(0, _invariant2.default)(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');

		var target = registry.getTarget(targetId);
		(0, _invariant2.default)(target, 'Expected targetIds to be registered.');
	}

	var draggedItemType = monitor.getItemType();

	// Remove those targetIds that don't match the targetType.  This
	// fixes shallow isOver which would only be non-shallow because of
	// non-matching targets.
	for (var _i2 = targetIds.length - 1; _i2 >= 0; _i2--) {
		var _targetId = targetIds[_i2];
		var targetType = registry.getTargetType(_targetId);
		if (!(0, _matchesType2.default)(targetType, draggedItemType)) {
			targetIds.splice(_i2, 1);
		}
	}

	// Finally call hover on all matching targets.
	for (var _i3 = 0; _i3 < targetIds.length; _i3++) {
		var _targetId2 = targetIds[_i3];
		var _target = registry.getTarget(_targetId2);
		_target.hover(monitor, _targetId2);
	}

	return {
		type: HOVER,
		targetIds: targetIds,
		clientOffset: clientOffset
	};
}

function drop() {
	var _this = this;

	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2.default)(monitor.isDragging(), 'Cannot call drop while not dragging.');
	(0, _invariant2.default)(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');

	var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);

	targetIds.reverse();
	targetIds.forEach(function (targetId, index) {
		var target = registry.getTarget(targetId);

		var dropResult = target.drop(monitor, targetId);
		(0, _invariant2.default)(typeof dropResult === 'undefined' || (0, _isObject2.default)(dropResult), 'Drop result must either be an object or undefined.');
		if (typeof dropResult === 'undefined') {
			dropResult = index === 0 ? {} : monitor.getDropResult();
		}

		_this.store.dispatch({
			type: DROP,
			dropResult: _extends({}, options, dropResult)
		});
	});
}

function endDrag() {
	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2.default)(monitor.isDragging(), 'Cannot call endDrag while not dragging.');

	var sourceId = monitor.getSourceId();
	var source = registry.getSource(sourceId, true);
	source.endDrag(monitor, sourceId);

	registry.unpinSource();

	return { type: END_DRAG };
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/actions/registry.js":
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/actions/registry.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addSource = addSource;
exports.addTarget = addTarget;
exports.removeSource = removeSource;
exports.removeTarget = removeTarget;
var ADD_SOURCE = exports.ADD_SOURCE = 'dnd-core/ADD_SOURCE';
var ADD_TARGET = exports.ADD_TARGET = 'dnd-core/ADD_TARGET';
var REMOVE_SOURCE = exports.REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
var REMOVE_TARGET = exports.REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';

function addSource(sourceId) {
	return {
		type: ADD_SOURCE,
		sourceId: sourceId
	};
}

function addTarget(targetId) {
	return {
		type: ADD_TARGET,
		targetId: targetId
	};
}

function removeSource(sourceId) {
	return {
		type: REMOVE_SOURCE,
		sourceId: sourceId
	};
}

function removeTarget(targetId) {
	return {
		type: REMOVE_TARGET,
		targetId: targetId
	};
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/backends/createTestBackend.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dnd-core/lib/backends/createTestBackend.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createBackend;

var _noop = __webpack_require__(/*! lodash/noop */ "./node_modules/lodash/noop.js");

var _noop2 = _interopRequireDefault(_noop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestBackend = function () {
	function TestBackend(manager) {
		_classCallCheck(this, TestBackend);

		this.actions = manager.getActions();
	}

	_createClass(TestBackend, [{
		key: 'setup',
		value: function setup() {
			this.didCallSetup = true;
		}
	}, {
		key: 'teardown',
		value: function teardown() {
			this.didCallTeardown = true;
		}
	}, {
		key: 'connectDragSource',
		value: function connectDragSource() {
			return _noop2.default;
		}
	}, {
		key: 'connectDragPreview',
		value: function connectDragPreview() {
			return _noop2.default;
		}
	}, {
		key: 'connectDropTarget',
		value: function connectDropTarget() {
			return _noop2.default;
		}
	}, {
		key: 'simulateBeginDrag',
		value: function simulateBeginDrag(sourceIds, options) {
			this.actions.beginDrag(sourceIds, options);
		}
	}, {
		key: 'simulatePublishDragSource',
		value: function simulatePublishDragSource() {
			this.actions.publishDragSource();
		}
	}, {
		key: 'simulateHover',
		value: function simulateHover(targetIds, options) {
			this.actions.hover(targetIds, options);
		}
	}, {
		key: 'simulateDrop',
		value: function simulateDrop() {
			this.actions.drop();
		}
	}, {
		key: 'simulateEndDrag',
		value: function simulateEndDrag() {
			this.actions.endDrag();
		}
	}]);

	return TestBackend;
}();

function createBackend(manager) {
	return new TestBackend(manager);
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/dnd-core/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragDropManager = __webpack_require__(/*! ./DragDropManager */ "./node_modules/dnd-core/lib/DragDropManager.js");

Object.defineProperty(exports, 'DragDropManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragDropManager).default;
  }
});

var _DragSource = __webpack_require__(/*! ./DragSource */ "./node_modules/dnd-core/lib/DragSource.js");

Object.defineProperty(exports, 'DragSource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragSource).default;
  }
});

var _DropTarget = __webpack_require__(/*! ./DropTarget */ "./node_modules/dnd-core/lib/DropTarget.js");

Object.defineProperty(exports, 'DropTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DropTarget).default;
  }
});

var _createTestBackend = __webpack_require__(/*! ./backends/createTestBackend */ "./node_modules/dnd-core/lib/backends/createTestBackend.js");

Object.defineProperty(exports, 'createTestBackend', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createTestBackend).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/dirtyHandlerIds.js":
/*!***************************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dirtyHandlerIds.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = dirtyHandlerIds;
exports.areDirty = areDirty;

var _xor = __webpack_require__(/*! lodash/xor */ "./node_modules/lodash/xor.js");

var _xor2 = _interopRequireDefault(_xor);

var _intersection = __webpack_require__(/*! lodash/intersection */ "./node_modules/lodash/intersection.js");

var _intersection2 = _interopRequireDefault(_intersection);

var _dragDrop = __webpack_require__(/*! ../actions/dragDrop */ "./node_modules/dnd-core/lib/actions/dragDrop.js");

var _registry = __webpack_require__(/*! ../actions/registry */ "./node_modules/dnd-core/lib/actions/registry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NONE = [];
var ALL = [];

function dirtyHandlerIds() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NONE;
	var action = arguments[1];
	var dragOperation = arguments[2];

	switch (action.type) {
		case _dragDrop.HOVER:
			break;
		case _registry.ADD_SOURCE:
		case _registry.ADD_TARGET:
		case _registry.REMOVE_TARGET:
		case _registry.REMOVE_SOURCE:
			return NONE;
		case _dragDrop.BEGIN_DRAG:
		case _dragDrop.PUBLISH_DRAG_SOURCE:
		case _dragDrop.END_DRAG:
		case _dragDrop.DROP:
		default:
			return ALL;
	}

	var targetIds = action.targetIds;
	var prevTargetIds = dragOperation.targetIds;

	var result = (0, _xor2.default)(targetIds, prevTargetIds);

	var didChange = false;
	if (result.length === 0) {
		for (var i = 0; i < targetIds.length; i++) {
			if (targetIds[i] !== prevTargetIds[i]) {
				didChange = true;
				break;
			}
		}
	} else {
		didChange = true;
	}

	if (!didChange) {
		return NONE;
	}

	var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
	var innermostTargetId = targetIds[targetIds.length - 1];

	if (prevInnermostTargetId !== innermostTargetId) {
		if (prevInnermostTargetId) {
			result.push(prevInnermostTargetId);
		}
		if (innermostTargetId) {
			result.push(innermostTargetId);
		}
	}

	return result;
}

function areDirty(state, handlerIds) {
	if (state === NONE) {
		return false;
	}

	if (state === ALL || typeof handlerIds === 'undefined') {
		return true;
	}

	return (0, _intersection2.default)(handlerIds, state).length > 0;
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/dragOffset.js":
/*!**********************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dragOffset.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = dragOffset;
exports.getSourceClientOffset = getSourceClientOffset;
exports.getDifferenceFromInitialOffset = getDifferenceFromInitialOffset;

var _dragDrop = __webpack_require__(/*! ../actions/dragDrop */ "./node_modules/dnd-core/lib/actions/dragDrop.js");

var initialState = {
	initialSourceClientOffset: null,
	initialClientOffset: null,
	clientOffset: null
};

function areOffsetsEqual(offsetA, offsetB) {
	if (offsetA === offsetB) {
		return true;
	}
	return offsetA && offsetB && offsetA.x === offsetB.x && offsetA.y === offsetB.y;
}

function dragOffset() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case _dragDrop.BEGIN_DRAG:
			return {
				initialSourceClientOffset: action.sourceClientOffset,
				initialClientOffset: action.clientOffset,
				clientOffset: action.clientOffset
			};
		case _dragDrop.HOVER:
			if (areOffsetsEqual(state.clientOffset, action.clientOffset)) {
				return state;
			}
			return _extends({}, state, {
				clientOffset: action.clientOffset
			});
		case _dragDrop.END_DRAG:
		case _dragDrop.DROP:
			return initialState;
		default:
			return state;
	}
}

function getSourceClientOffset(state) {
	var clientOffset = state.clientOffset,
	    initialClientOffset = state.initialClientOffset,
	    initialSourceClientOffset = state.initialSourceClientOffset;

	if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
		return null;
	}
	return {
		x: clientOffset.x + initialSourceClientOffset.x - initialClientOffset.x,
		y: clientOffset.y + initialSourceClientOffset.y - initialClientOffset.y
	};
}

function getDifferenceFromInitialOffset(state) {
	var clientOffset = state.clientOffset,
	    initialClientOffset = state.initialClientOffset;

	if (!clientOffset || !initialClientOffset) {
		return null;
	}
	return {
		x: clientOffset.x - initialClientOffset.x,
		y: clientOffset.y - initialClientOffset.y
	};
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/dragOperation.js":
/*!*************************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dragOperation.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = dragOperation;

var _without = __webpack_require__(/*! lodash/without */ "./node_modules/lodash/without.js");

var _without2 = _interopRequireDefault(_without);

var _dragDrop = __webpack_require__(/*! ../actions/dragDrop */ "./node_modules/dnd-core/lib/actions/dragDrop.js");

var _registry = __webpack_require__(/*! ../actions/registry */ "./node_modules/dnd-core/lib/actions/registry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	itemType: null,
	item: null,
	sourceId: null,
	targetIds: [],
	dropResult: null,
	didDrop: false,
	isSourcePublic: null
};

function dragOperation() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case _dragDrop.BEGIN_DRAG:
			return _extends({}, state, {
				itemType: action.itemType,
				item: action.item,
				sourceId: action.sourceId,
				isSourcePublic: action.isSourcePublic,
				dropResult: null,
				didDrop: false
			});
		case _dragDrop.PUBLISH_DRAG_SOURCE:
			return _extends({}, state, {
				isSourcePublic: true
			});
		case _dragDrop.HOVER:
			return _extends({}, state, {
				targetIds: action.targetIds
			});
		case _registry.REMOVE_TARGET:
			if (state.targetIds.indexOf(action.targetId) === -1) {
				return state;
			}
			return _extends({}, state, {
				targetIds: (0, _without2.default)(state.targetIds, action.targetId)
			});
		case _dragDrop.DROP:
			return _extends({}, state, {
				dropResult: action.dropResult,
				didDrop: true,
				targetIds: []
			});
		case _dragDrop.END_DRAG:
			return _extends({}, state, {
				itemType: null,
				item: null,
				sourceId: null,
				dropResult: null,
				didDrop: false,
				isSourcePublic: null,
				targetIds: []
			});
		default:
			return state;
	}
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = reduce;

var _dragOffset = __webpack_require__(/*! ./dragOffset */ "./node_modules/dnd-core/lib/reducers/dragOffset.js");

var _dragOffset2 = _interopRequireDefault(_dragOffset);

var _dragOperation = __webpack_require__(/*! ./dragOperation */ "./node_modules/dnd-core/lib/reducers/dragOperation.js");

var _dragOperation2 = _interopRequireDefault(_dragOperation);

var _refCount = __webpack_require__(/*! ./refCount */ "./node_modules/dnd-core/lib/reducers/refCount.js");

var _refCount2 = _interopRequireDefault(_refCount);

var _dirtyHandlerIds = __webpack_require__(/*! ./dirtyHandlerIds */ "./node_modules/dnd-core/lib/reducers/dirtyHandlerIds.js");

var _dirtyHandlerIds2 = _interopRequireDefault(_dirtyHandlerIds);

var _stateId = __webpack_require__(/*! ./stateId */ "./node_modules/dnd-core/lib/reducers/stateId.js");

var _stateId2 = _interopRequireDefault(_stateId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reduce() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	return {
		dirtyHandlerIds: (0, _dirtyHandlerIds2.default)(state.dirtyHandlerIds, action, state.dragOperation),
		dragOffset: (0, _dragOffset2.default)(state.dragOffset, action),
		refCount: (0, _refCount2.default)(state.refCount, action),
		dragOperation: (0, _dragOperation2.default)(state.dragOperation, action),
		stateId: (0, _stateId2.default)(state.stateId)
	};
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/refCount.js":
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/refCount.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = refCount;

var _registry = __webpack_require__(/*! ../actions/registry */ "./node_modules/dnd-core/lib/actions/registry.js");

function refCount() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var action = arguments[1];

	switch (action.type) {
		case _registry.ADD_SOURCE:
		case _registry.ADD_TARGET:
			return state + 1;
		case _registry.REMOVE_SOURCE:
		case _registry.REMOVE_TARGET:
			return state - 1;
		default:
			return state;
	}
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/reducers/stateId.js":
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/stateId.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = stateId;
function stateId() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	return state + 1;
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/utils/getNextUniqueId.js":
/*!************************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/getNextUniqueId.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getNextUniqueId;
var nextUniqueId = 0;

function getNextUniqueId() {
	return nextUniqueId++;
}

/***/ }),

/***/ "./node_modules/dnd-core/lib/utils/matchesType.js":
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/matchesType.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = matchesType;

var _isArray = __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js");

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchesType(targetType, draggedItemType) {
	if ((0, _isArray2.default)(targetType)) {
		return targetType.some(function (t) {
			return t === draggedItemType;
		});
	} else {
		return targetType === draggedItemType;
	}
}

/***/ }),

/***/ "./node_modules/hoist-non-react-statics/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};


/***/ }),

/***/ "./node_modules/invariant/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/invariant/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (true) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_SetCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js"),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "./node_modules/lodash/_setCacheAdd.js"),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "./node_modules/lodash/_setCacheHas.js");

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_apply.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_apply.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludes.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayIncludes.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "./node_modules/lodash/_baseIndexOf.js");

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludesWith.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash/_arrayIncludesWith.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),

/***/ "./node_modules/lodash/_arrayMap.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_arrayMap.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_assignValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseDifference.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseDifference.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "./node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "./node_modules/lodash/_arrayIncludesWith.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),

/***/ "./node_modules/lodash/_baseFindIndex.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseFindIndex.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),

/***/ "./node_modules/lodash/_baseFlatten.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseFlatten.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isFlattenable = __webpack_require__(/*! ./_isFlattenable */ "./node_modules/lodash/_isFlattenable.js");

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ "./node_modules/lodash/_baseGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseGet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIndexOf.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIndexOf.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "./node_modules/lodash/_baseFindIndex.js"),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "./node_modules/lodash/_baseIsNaN.js"),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ "./node_modules/lodash/_strictIndexOf.js");

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseIntersection.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIntersection.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "./node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "./node_modules/lodash/_arrayIncludesWith.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNaN.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsNaN.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseRest.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "./node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "./node_modules/lodash/_setToString.js");

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),

/***/ "./node_modules/lodash/_baseSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseSet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),

/***/ "./node_modules/lodash/_baseSetToString.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseSetToString.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(/*! ./constant */ "./node_modules/lodash/constant.js"),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ "./node_modules/lodash/_baseToString.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseToString.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_baseUniq.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseUniq.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "./node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "./node_modules/lodash/_arrayIncludesWith.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js"),
    createSet = __webpack_require__(/*! ./_createSet */ "./node_modules/lodash/_createSet.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ }),

/***/ "./node_modules/lodash/_baseXor.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseXor.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "./node_modules/lodash/_baseDifference.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "./node_modules/lodash/_baseFlatten.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "./node_modules/lodash/_baseUniq.js");

/**
 * The base implementation of methods like `_.xor`, without support for
 * iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

module.exports = baseXor;


/***/ }),

/***/ "./node_modules/lodash/_cacheHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ "./node_modules/lodash/_castArrayLikeObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash/_castArrayLikeObject.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "./node_modules/lodash/isArrayLikeObject.js");

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;


/***/ }),

/***/ "./node_modules/lodash/_castPath.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_castPath.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    stringToPath = __webpack_require__(/*! ./_stringToPath */ "./node_modules/lodash/_stringToPath.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_createSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_createSet.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    noop = __webpack_require__(/*! ./noop */ "./node_modules/lodash/noop.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getPrototype.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_isFlattenable.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_isFlattenable.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_isKey.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_memoizeCapped.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_memoizeCapped.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(/*! ./memoize */ "./node_modules/lodash/memoize.js");

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_overRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_overRest.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(/*! ./_apply */ "./node_modules/lodash/_apply.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_setCacheAdd.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ "./node_modules/lodash/_setCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_setToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ "./node_modules/lodash/_setToString.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setToString.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ "./node_modules/lodash/_baseSetToString.js"),
    shortOut = __webpack_require__(/*! ./_shortOut */ "./node_modules/lodash/_shortOut.js");

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ "./node_modules/lodash/_shortOut.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_shortOut.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ "./node_modules/lodash/_strictIndexOf.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_strictIndexOf.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_stringToPath.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_stringToPath.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ "./node_modules/lodash/_memoizeCapped.js");

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ "./node_modules/lodash/_toKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_toKey.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/constant.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/constant.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/get.js":
/*!************************************!*\
  !*** ./node_modules/lodash/get.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js");

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ "./node_modules/lodash/identity.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ "./node_modules/lodash/intersection.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/intersection.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    baseIntersection = __webpack_require__(/*! ./_baseIntersection */ "./node_modules/lodash/_baseIntersection.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    castArrayLikeObject = __webpack_require__(/*! ./_castArrayLikeObject */ "./node_modules/lodash/_castArrayLikeObject.js");

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isArrayLikeObject.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/isArrayLikeObject.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isPlainObject.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/isPlainObject.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/memoize.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/memoize.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ "./node_modules/lodash/noop.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),

/***/ "./node_modules/lodash/set.js":
/*!************************************!*\
  !*** ./node_modules/lodash/set.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSet = __webpack_require__(/*! ./_baseSet */ "./node_modules/lodash/_baseSet.js");

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ "./node_modules/lodash/toString.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toString.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(/*! ./_baseToString */ "./node_modules/lodash/_baseToString.js");

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ "./node_modules/lodash/without.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/without.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "./node_modules/lodash/_baseDifference.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "./node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ }),

/***/ "./node_modules/lodash/xor.js":
/*!************************************!*\
  !*** ./node_modules/lodash/xor.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    baseXor = __webpack_require__(/*! ./_baseXor */ "./node_modules/lodash/_baseXor.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "./node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */
var xor = baseRest(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});

module.exports = xor;


/***/ }),

/***/ "./node_modules/mini-toastr/mini-toastr.js":
/*!*************************************************!*\
  !*** ./node_modules/mini-toastr/mini-toastr.js ***!
  \*************************************************/
/*! exports provided: fadeOut, LIB_NAME, ERROR, WARN, SUCCESS, INFO, CONTAINER_CLASS, NOTIFICATION_CLASS, TITLE_CLASS, ICON_CLASS, MESSAGE_CLASS, ERROR_CLASS, WARN_CLASS, SUCCESS_CLASS, INFO_CLASS, DEFAULT_TIMEOUT, flatten, makeCss, appendStyles, config, makeNode, createIcon, addElem, getTypeClass, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fadeOut", function() { return fadeOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LIB_NAME", function() { return LIB_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR", function() { return ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WARN", function() { return WARN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUCCESS", function() { return SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INFO", function() { return INFO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONTAINER_CLASS", function() { return CONTAINER_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOTIFICATION_CLASS", function() { return NOTIFICATION_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TITLE_CLASS", function() { return TITLE_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ICON_CLASS", function() { return ICON_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MESSAGE_CLASS", function() { return MESSAGE_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR_CLASS", function() { return ERROR_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WARN_CLASS", function() { return WARN_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUCCESS_CLASS", function() { return SUCCESS_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INFO_CLASS", function() { return INFO_CLASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_TIMEOUT", function() { return DEFAULT_TIMEOUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeCss", function() { return makeCss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendStyles", function() { return appendStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeNode", function() { return makeNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIcon", function() { return createIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addElem", function() { return addElem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTypeClass", function() { return getTypeClass; });
function fadeOut (element, cb) {
  if (element.style.opacity && element.style.opacity > 0.05) {
    element.style.opacity = element.style.opacity - 0.05
  } else if (element.style.opacity && element.style.opacity <= 0.1) {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
      if (cb) cb()
    }
  } else {
    element.style.opacity = 0.9
  }
  setTimeout(() => fadeOut.apply(this, [element, cb]), 1000 / 30
  )
}

const LIB_NAME = 'mini-toastr'

const ERROR = 'error'
const WARN = 'warn'
const SUCCESS = 'success'
const INFO = 'info'
const CONTAINER_CLASS = LIB_NAME
const NOTIFICATION_CLASS = `${LIB_NAME}__notification`
const TITLE_CLASS = `${LIB_NAME}-notification__title`
const ICON_CLASS = `${LIB_NAME}-notification__icon`
const MESSAGE_CLASS = `${LIB_NAME}-notification__message`
const ERROR_CLASS = `-${ERROR}`
const WARN_CLASS = `-${WARN}`
const SUCCESS_CLASS = `-${SUCCESS}`
const INFO_CLASS = `-${INFO}`
const DEFAULT_TIMEOUT = 3000

const EMPTY_STRING = ''

function flatten (obj, into, prefix) {
  into = into || {}
  prefix = prefix || EMPTY_STRING

  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      const prop = obj[k]
      if (prop && typeof prop === 'object' && !(prop instanceof Date || prop instanceof RegExp)) {
        flatten(prop, into, prefix + k + ' ')
      } else {
        if (into[prefix] && typeof into[prefix] === 'object') {
          into[prefix][k] = prop
        } else {
          into[prefix] = {}
          into[prefix][k] = prop
        }
      }
    }
  }

  return into
}

function makeCss (obj) {
  const flat = flatten(obj)
  let str = JSON.stringify(flat, null, 2)
  str = str.replace(/"([^"]*)": {/g, '$1 {')
    .replace(/"([^"]*)"/g, '$1')
    .replace(/(\w*-?\w*): ([\w\d .#]*),?/g, '$1: $2;')
    .replace(/},/g, '}\n')
    .replace(/ &([.:])/g, '$1')

  str = str.substr(1, str.lastIndexOf('}') - 1)

  return str
}

function appendStyles (css) {
  let head = document.head || document.getElementsByTagName('head')[0]
  let styleElem = makeNode('style')
  styleElem.id = `${LIB_NAME}-styles`
  styleElem.type = 'text/css'

  if (styleElem.styleSheet) {
    styleElem.styleSheet.cssText = css
  } else {
    styleElem.appendChild(document.createTextNode(css))
  }

  head.appendChild(styleElem)
}

const config = {
  types: {ERROR, WARN, SUCCESS, INFO},
  animation: fadeOut,
  timeout: DEFAULT_TIMEOUT,
  icons: {},
  appendTarget: document.body,
  node: makeNode(),
  allowHtml: false,
  style: {
    [`.${CONTAINER_CLASS}`]: {
      position: 'fixed',
      'z-index': 99999,
      right: '12px',
      top: '12px'
    },
    [`.${NOTIFICATION_CLASS}`]: {
      cursor: 'pointer',
      padding: '12px 18px',
      margin: '0 0 6px 0',
      'background-color': '#000',
      opacity: 0.8,
      color: '#fff',
      'border-radius': '3px',
      'box-shadow': '#3c3b3b 0 0 12px',
      width: '300px',
      [`&.${ERROR_CLASS}`]: {
        'background-color': '#D5122B'
      },
      [`&.${WARN_CLASS}`]: {
        'background-color': '#F5AA1E'
      },
      [`&.${SUCCESS_CLASS}`]: {
        'background-color': '#7AC13E'
      },
      [`&.${INFO_CLASS}`]: {
        'background-color': '#4196E1'
      },
      '&:hover': {
        opacity: 1,
        'box-shadow': '#000 0 0 12px'
      }
    },
    [`.${TITLE_CLASS}`]: {
      'font-weight': '500'
    },
    [`.${MESSAGE_CLASS}`]: {
      display: 'inline-block',
      'vertical-align': 'middle',
      width: '240px',
      padding: '0 12px'
    }
  }
}

function makeNode (type = 'div') {
  return document.createElement(type)
}

function createIcon (node, type, config) {
  const iconNode = makeNode(config.icons[type].nodeType)
  const attrs = config.icons[type].attrs

  for (const k in attrs) {
    if (attrs.hasOwnProperty(k)) {
      iconNode.setAttribute(k, attrs[k])
    }
  }

  node.appendChild(iconNode)
}

function addElem (node, text, className, config) {
  const elem = makeNode()
  elem.className = className
  if (config.allowHtml) {
    elem.innerHTML = text
  } else {
    elem.appendChild(document.createTextNode(text))
  }
  node.appendChild(elem)
}

function getTypeClass (type) {
  if (type === SUCCESS) return SUCCESS_CLASS
  if (type === WARN) return WARN_CLASS
  if (type === ERROR) return ERROR_CLASS
  if (type === INFO) return INFO_CLASS

  return EMPTY_STRING
}

const miniToastr = {
  config,
  isInitialised: false,
  showMessage (message, title, type, timeout, cb, overrideConf) {
    const config = {}
    Object.assign(config, this.config)
    Object.assign(config, overrideConf)

    const notificationElem = makeNode()
    notificationElem.className = `${NOTIFICATION_CLASS} ${getTypeClass(type)}`

    notificationElem.onclick = function () {
      config.animation(notificationElem, null)
    }

    if (title) addElem(notificationElem, title, TITLE_CLASS, config)
    if (config.icons[type]) createIcon(notificationElem, type, config)
    if (message) addElem(notificationElem, message, MESSAGE_CLASS, config)

    config.node.insertBefore(notificationElem, config.node.firstChild)
    setTimeout(() => config.animation(notificationElem, cb), timeout || config.timeout
    )

    if (cb) cb()
    return this
  },
  init (aConfig) {
    const newConfig = {}
    Object.assign(newConfig, config)
    Object.assign(newConfig, aConfig)
    this.config = newConfig

    const cssStr = makeCss(newConfig.style)
    appendStyles(cssStr)

    newConfig.node.id = CONTAINER_CLASS
    newConfig.node.className = CONTAINER_CLASS
    newConfig.appendTarget.appendChild(newConfig.node)

    Object.keys(newConfig.types).forEach(v => {
      this[newConfig.types[v]] = function (message, title, timeout, cb, config) {
        this.showMessage(message, title, newConfig.types[v], timeout, cb, config)
        return this
      }.bind(this)
    }
    )

    this.isInitialised = true

    return this
  },
  setIcon (type, nodeType = 'i', attrs = []) {
    attrs.class = attrs.class ? attrs.class + ' ' + ICON_CLASS : ICON_CLASS

    this.config.icons[type] = {nodeType, attrs}
  }
}

/* harmony default export */ __webpack_exports__["default"] = (miniToastr);

/***/ }),

/***/ "./node_modules/preact-dnd/lib/DragDropContext.js":
/*!********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/DragDropContext.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = DragDropContext;

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

var _preact2 = _interopRequireDefault(_preact);

var _dndCore = __webpack_require__(/*! dnd-core */ "./node_modules/dnd-core/lib/index.js");

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _checkDecoratorArguments = __webpack_require__(/*! ./utils/checkDecoratorArguments */ "./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js");

var _checkDecoratorArguments2 = _interopRequireDefault(_checkDecoratorArguments);

var _hoistNonReactStatics = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/index.js");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DragDropContext(backendOrModule) {
  _checkDecoratorArguments2.default.apply(undefined, ['DragDropContext', 'backend'].concat(Array.prototype.slice.call(arguments)));

  // Auto-detect ES6 default export for people still using ES5
  var backend = void 0;
  if ((typeof backendOrModule === 'undefined' ? 'undefined' : _typeof(backendOrModule)) === 'object' && typeof backendOrModule.default === 'function') {
    backend = backendOrModule.default;
  } else {
    backend = backendOrModule;
  }

  (0, _invariant2.default)(typeof backend === 'function', 'Expected the backend to be a function or an ES6 module exporting a default function. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-drop-context.html');

  var childContext = {
    dragDropManager: new _dndCore.DragDropManager(backend)
  };

  return function decorateContext(DecoratedComponent) {
    var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    var DragDropContextContainer = function (_Component) {
      _inherits(DragDropContextContainer, _Component);

      function DragDropContextContainer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, DragDropContextContainer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DragDropContextContainer.__proto__ || Object.getPrototypeOf(DragDropContextContainer)).call.apply(_ref, [this].concat(args))), _this), _this.setChildRef = function (child) {
          _this.child = child;
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(DragDropContextContainer, [{
        key: 'getDecoratedComponentInstance',
        value: function getDecoratedComponentInstance() {
          return this.child;
        }
      }, {
        key: 'getManager',
        value: function getManager() {
          return childContext.dragDropManager;
        }
      }, {
        key: 'getChildContext',
        value: function getChildContext() {
          return childContext;
        }
      }, {
        key: 'render',
        value: function render() {
          return _preact2.default.h(DecoratedComponent, _extends({}, this.props, { ref: this.setChildRef }));
        }
      }]);

      return DragDropContextContainer;
    }(_preact.Component);

    DragDropContextContainer.DecoratedComponent = DecoratedComponent;
    DragDropContextContainer.displayName = 'DragDropContext(' + displayName + ')';


    return (0, _hoistNonReactStatics2.default)(DragDropContextContainer, DecoratedComponent);
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/DragLayer.js":
/*!**************************************************!*\
  !*** ./node_modules/preact-dnd/lib/DragLayer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = DragLayer;

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

var _preact2 = _interopRequireDefault(_preact);

var _shallowEqual = __webpack_require__(/*! ./utils/shallowEqual */ "./node_modules/preact-dnd/lib/utils/shallowEqual.js");

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _shallowEqualScalar = __webpack_require__(/*! ./utils/shallowEqualScalar */ "./node_modules/preact-dnd/lib/utils/shallowEqualScalar.js");

var _shallowEqualScalar2 = _interopRequireDefault(_shallowEqualScalar);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _checkDecoratorArguments = __webpack_require__(/*! ./utils/checkDecoratorArguments */ "./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js");

var _checkDecoratorArguments2 = _interopRequireDefault(_checkDecoratorArguments);

var _hoistNonReactStatics = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/index.js");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DragLayer(collect) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _checkDecoratorArguments2.default.apply(undefined, ['DragLayer', 'collect[, options]'].concat(Array.prototype.slice.call(arguments)));
  (0, _invariant2.default)(typeof collect === 'function', 'Expected "collect" provided as the first argument to DragLayer ' + 'to be a function that collects props to inject into the component. ', 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-layer.html', collect);
  (0, _invariant2.default)((0, _isPlainObject2.default)(options), 'Expected "options" provided as the second argument to DragLayer to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-layer.html', options);

  return function decorateLayer(DecoratedComponent) {
    var _options$arePropsEqua = options.arePropsEqual,
        arePropsEqual = _options$arePropsEqua === undefined ? _shallowEqualScalar2.default : _options$arePropsEqua;

    var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    var DragLayerContainer = function (_Component) {
      _inherits(DragLayerContainer, _Component);

      _createClass(DragLayerContainer, [{
        key: 'getDecoratedComponentInstance',
        value: function getDecoratedComponentInstance() {
          return this.child;
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !arePropsEqual(nextProps, this.props) || !(0, _shallowEqual2.default)(nextState, this.state);
        }
      }]);

      function DragLayerContainer(props, context) {
        _classCallCheck(this, DragLayerContainer);

        var _this = _possibleConstructorReturn(this, (DragLayerContainer.__proto__ || Object.getPrototypeOf(DragLayerContainer)).call(this, props));

        _this.setChildRef = function (child) {
          _this.child = child;
        };

        _this.handleChange = _this.handleChange.bind(_this);

        _this.manager = context.dragDropManager;
        (0, _invariant2.default)(_typeof(_this.manager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

        _this.state = _this.getCurrentState();
        return _this;
      }

      _createClass(DragLayerContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.isCurrentlyMounted = true;

          var monitor = this.manager.getMonitor();
          this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleChange);
          this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleChange);

          this.handleChange();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.isCurrentlyMounted = false;

          this.unsubscribeFromOffsetChange();
          this.unsubscribeFromStateChange();
        }
      }, {
        key: 'handleChange',
        value: function handleChange() {
          if (!this.isCurrentlyMounted) {
            return;
          }

          var nextState = this.getCurrentState();
          if (!(0, _shallowEqual2.default)(nextState, this.state)) {
            this.setState(nextState);
          }
        }
      }, {
        key: 'getCurrentState',
        value: function getCurrentState() {
          var monitor = this.manager.getMonitor();
          return collect(monitor);
        }
      }, {
        key: 'render',
        value: function render() {
          return _preact2.default.h(DecoratedComponent, _extends({}, this.props, this.state, {
            ref: this.setChildRef }));
        }
      }]);

      return DragLayerContainer;
    }(_preact.Component);

    DragLayerContainer.DecoratedComponent = DecoratedComponent;
    DragLayerContainer.displayName = 'DragLayer(' + displayName + ')';


    return (0, _hoistNonReactStatics2.default)(DragLayerContainer, DecoratedComponent);
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/DragSource.js":
/*!***************************************************!*\
  !*** ./node_modules/preact-dnd/lib/DragSource.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DragSource;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _checkDecoratorArguments = __webpack_require__(/*! ./utils/checkDecoratorArguments */ "./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js");

var _checkDecoratorArguments2 = _interopRequireDefault(_checkDecoratorArguments);

var _decorateHandler = __webpack_require__(/*! ./decorateHandler */ "./node_modules/preact-dnd/lib/decorateHandler.js");

var _decorateHandler2 = _interopRequireDefault(_decorateHandler);

var _registerSource = __webpack_require__(/*! ./registerSource */ "./node_modules/preact-dnd/lib/registerSource.js");

var _registerSource2 = _interopRequireDefault(_registerSource);

var _createSourceFactory = __webpack_require__(/*! ./createSourceFactory */ "./node_modules/preact-dnd/lib/createSourceFactory.js");

var _createSourceFactory2 = _interopRequireDefault(_createSourceFactory);

var _createSourceMonitor = __webpack_require__(/*! ./createSourceMonitor */ "./node_modules/preact-dnd/lib/createSourceMonitor.js");

var _createSourceMonitor2 = _interopRequireDefault(_createSourceMonitor);

var _createSourceConnector = __webpack_require__(/*! ./createSourceConnector */ "./node_modules/preact-dnd/lib/createSourceConnector.js");

var _createSourceConnector2 = _interopRequireDefault(_createSourceConnector);

var _isValidType = __webpack_require__(/*! ./utils/isValidType */ "./node_modules/preact-dnd/lib/utils/isValidType.js");

var _isValidType2 = _interopRequireDefault(_isValidType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DragSource(type, spec, collect) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _checkDecoratorArguments2.default.apply(undefined, ['DragSource', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments)));
  var getType = type;
  if (typeof type !== 'function') {
    (0, _invariant2.default)((0, _isValidType2.default)(type), 'Expected "type" provided as the first argument to DragSource to be ' + 'a string, or a function that returns a string given the current props. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', type);
    getType = function getType() {
      return type;
    };
  }
  (0, _invariant2.default)((0, _isPlainObject2.default)(spec), 'Expected "spec" provided as the second argument to DragSource to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', spec);
  var createSource = (0, _createSourceFactory2.default)(spec);
  (0, _invariant2.default)(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', collect);
  (0, _invariant2.default)((0, _isPlainObject2.default)(options), 'Expected "options" provided as the fourth argument to DragSource to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', collect);

  return function decorateSource(DecoratedComponent) {
    return (0, _decorateHandler2.default)({
      connectBackend: function connectBackend(backend, sourceId) {
        return backend.connectDragSource(sourceId);
      },
      containerDisplayName: 'DragSource',
      createHandler: createSource,
      registerHandler: _registerSource2.default,
      createMonitor: _createSourceMonitor2.default,
      createConnector: _createSourceConnector2.default,
      DecoratedComponent: DecoratedComponent,
      getType: getType,
      collect: collect,
      options: options
    });
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/DropTarget.js":
/*!***************************************************!*\
  !*** ./node_modules/preact-dnd/lib/DropTarget.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DropTarget;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _checkDecoratorArguments = __webpack_require__(/*! ./utils/checkDecoratorArguments */ "./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js");

var _checkDecoratorArguments2 = _interopRequireDefault(_checkDecoratorArguments);

var _decorateHandler = __webpack_require__(/*! ./decorateHandler */ "./node_modules/preact-dnd/lib/decorateHandler.js");

var _decorateHandler2 = _interopRequireDefault(_decorateHandler);

var _registerTarget = __webpack_require__(/*! ./registerTarget */ "./node_modules/preact-dnd/lib/registerTarget.js");

var _registerTarget2 = _interopRequireDefault(_registerTarget);

var _createTargetFactory = __webpack_require__(/*! ./createTargetFactory */ "./node_modules/preact-dnd/lib/createTargetFactory.js");

var _createTargetFactory2 = _interopRequireDefault(_createTargetFactory);

var _createTargetMonitor = __webpack_require__(/*! ./createTargetMonitor */ "./node_modules/preact-dnd/lib/createTargetMonitor.js");

var _createTargetMonitor2 = _interopRequireDefault(_createTargetMonitor);

var _createTargetConnector = __webpack_require__(/*! ./createTargetConnector */ "./node_modules/preact-dnd/lib/createTargetConnector.js");

var _createTargetConnector2 = _interopRequireDefault(_createTargetConnector);

var _isValidType = __webpack_require__(/*! ./utils/isValidType */ "./node_modules/preact-dnd/lib/utils/isValidType.js");

var _isValidType2 = _interopRequireDefault(_isValidType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropTarget(type, spec, collect) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _checkDecoratorArguments2.default.apply(undefined, ['DropTarget', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments)));
  var getType = type;
  if (typeof type !== 'function') {
    (0, _invariant2.default)((0, _isValidType2.default)(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' + 'a string, an array of strings, or a function that returns either given ' + 'the current props. Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', type);
    getType = function getType() {
      return type;
    };
  }
  (0, _invariant2.default)((0, _isPlainObject2.default)(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', spec);
  var createTarget = (0, _createTargetFactory2.default)(spec);
  (0, _invariant2.default)(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', collect);
  (0, _invariant2.default)((0, _isPlainObject2.default)(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', collect);

  return function decorateTarget(DecoratedComponent) {
    return (0, _decorateHandler2.default)({
      connectBackend: function connectBackend(backend, targetId) {
        return backend.connectDropTarget(targetId);
      },
      containerDisplayName: 'DropTarget',
      createHandler: createTarget,
      registerHandler: _registerTarget2.default,
      createMonitor: _createTargetMonitor2.default,
      createConnector: _createTargetConnector2.default,
      DecoratedComponent: DecoratedComponent,
      getType: getType,
      collect: collect,
      options: options
    });
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/areOptionsEqual.js":
/*!********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/areOptionsEqual.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = areOptionsEqual;

var _shallowEqual = __webpack_require__(/*! ./utils/shallowEqual */ "./node_modules/preact-dnd/lib/utils/shallowEqual.js");

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function areOptionsEqual(nextOptions, currentOptions) {
  if (currentOptions === nextOptions) {
    return true;
  }

  return currentOptions !== null && nextOptions !== null && (0, _shallowEqual2.default)(currentOptions, nextOptions);
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createSourceConnector.js":
/*!**************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createSourceConnector.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSourceConnector;

var _wrapConnectorHooks = __webpack_require__(/*! ./wrapConnectorHooks */ "./node_modules/preact-dnd/lib/wrapConnectorHooks.js");

var _wrapConnectorHooks2 = _interopRequireDefault(_wrapConnectorHooks);

var _areOptionsEqual = __webpack_require__(/*! ./areOptionsEqual */ "./node_modules/preact-dnd/lib/areOptionsEqual.js");

var _areOptionsEqual2 = _interopRequireDefault(_areOptionsEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSourceConnector(backend) {
  var currentHandlerId = void 0;

  var currentDragSourceNode = void 0;
  var currentDragSourceOptions = void 0;
  var disconnectCurrentDragSource = void 0;

  var currentDragPreviewNode = void 0;
  var currentDragPreviewOptions = void 0;
  var disconnectCurrentDragPreview = void 0;

  function reconnectDragSource() {
    if (disconnectCurrentDragSource) {
      disconnectCurrentDragSource();
      disconnectCurrentDragSource = null;
    }

    if (currentHandlerId && currentDragSourceNode) {
      disconnectCurrentDragSource = backend.connectDragSource(currentHandlerId, currentDragSourceNode, currentDragSourceOptions);
    }
  }

  function reconnectDragPreview() {
    if (disconnectCurrentDragPreview) {
      disconnectCurrentDragPreview();
      disconnectCurrentDragPreview = null;
    }

    if (currentHandlerId && currentDragPreviewNode) {
      disconnectCurrentDragPreview = backend.connectDragPreview(currentHandlerId, currentDragPreviewNode, currentDragPreviewOptions);
    }
  }

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDragSource();
    reconnectDragPreview();
  }

  var hooks = (0, _wrapConnectorHooks2.default)({
    dragSource: function connectDragSource(node, options) {
      if (node === currentDragSourceNode && (0, _areOptionsEqual2.default)(options, currentDragSourceOptions)) {
        return;
      }

      currentDragSourceNode = node;
      currentDragSourceOptions = options;

      reconnectDragSource();
    },

    dragPreview: function connectDragPreview(node, options) {
      if (node === currentDragPreviewNode && (0, _areOptionsEqual2.default)(options, currentDragPreviewOptions)) {
        return;
      }

      currentDragPreviewNode = node;
      currentDragPreviewOptions = options;

      reconnectDragPreview();
    }
  });

  return {
    receiveHandlerId: receiveHandlerId,
    hooks: hooks
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createSourceFactory.js":
/*!************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createSourceFactory.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createSourceFactory;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ALLOWED_SPEC_METHODS = ['canDrag', 'beginDrag', 'isDragging', 'endDrag'];
var REQUIRED_SPEC_METHODS = ['beginDrag'];

function createSourceFactory(spec) {
  Object.keys(spec).forEach(function (key) {
    (0, _invariant2.default)(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drag source specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', ALLOWED_SPEC_METHODS.join(', '), key);
    (0, _invariant2.default)(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
  });
  REQUIRED_SPEC_METHODS.forEach(function (key) {
    (0, _invariant2.default)(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
  });

  var Source = function () {
    function Source(monitor) {
      _classCallCheck(this, Source);

      this.monitor = monitor;
      this.props = null;
      this.component = null;
    }

    _createClass(Source, [{
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.props = props;
      }
    }, {
      key: 'receiveComponent',
      value: function receiveComponent(component) {
        this.component = component;
      }
    }, {
      key: 'canDrag',
      value: function canDrag() {
        if (!spec.canDrag) {
          return true;
        }

        return spec.canDrag(this.props, this.monitor);
      }
    }, {
      key: 'isDragging',
      value: function isDragging(globalMonitor, sourceId) {
        if (!spec.isDragging) {
          return sourceId === globalMonitor.getSourceId();
        }

        return spec.isDragging(this.props, this.monitor);
      }
    }, {
      key: 'beginDrag',
      value: function beginDrag() {
        var item = spec.beginDrag(this.props, this.monitor, this.component);
        if (true) {
          (0, _invariant2.default)((0, _isPlainObject2.default)(item), 'beginDrag() must return a plain object that represents the dragged item. ' + 'Instead received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source.html', item);
        }
        return item;
      }
    }, {
      key: 'endDrag',
      value: function endDrag() {
        if (!spec.endDrag) {
          return;
        }

        spec.endDrag(this.props, this.monitor, this.component);
      }
    }]);

    return Source;
  }();

  return function createSource(monitor) {
    return new Source(monitor);
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createSourceMonitor.js":
/*!************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createSourceMonitor.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createSourceMonitor;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isCallingCanDrag = false;
var isCallingIsDragging = false;

var SourceMonitor = function () {
  function SourceMonitor(manager) {
    _classCallCheck(this, SourceMonitor);

    this.internalMonitor = manager.getMonitor();
  }

  _createClass(SourceMonitor, [{
    key: 'receiveHandlerId',
    value: function receiveHandlerId(sourceId) {
      this.sourceId = sourceId;
    }
  }, {
    key: 'canDrag',
    value: function canDrag() {
      (0, _invariant2.default)(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source-monitor.html');

      try {
        isCallingCanDrag = true;
        return this.internalMonitor.canDragSource(this.sourceId);
      } finally {
        isCallingCanDrag = false;
      }
    }
  }, {
    key: 'isDragging',
    value: function isDragging() {
      (0, _invariant2.default)(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drag-source-monitor.html');

      try {
        isCallingIsDragging = true;
        return this.internalMonitor.isDraggingSource(this.sourceId);
      } finally {
        isCallingIsDragging = false;
      }
    }
  }, {
    key: 'getItemType',
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: 'getDropResult',
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: 'didDrop',
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: 'getInitialClientOffset',
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: 'getInitialSourceClientOffset',
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: 'getSourceClientOffset',
    value: function getSourceClientOffset() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: 'getClientOffset',
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: 'getDifferenceFromInitialOffset',
    value: function getDifferenceFromInitialOffset() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);

  return SourceMonitor;
}();

function createSourceMonitor(manager) {
  return new SourceMonitor(manager);
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createTargetConnector.js":
/*!**************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createTargetConnector.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTargetConnector;

var _wrapConnectorHooks = __webpack_require__(/*! ./wrapConnectorHooks */ "./node_modules/preact-dnd/lib/wrapConnectorHooks.js");

var _wrapConnectorHooks2 = _interopRequireDefault(_wrapConnectorHooks);

var _areOptionsEqual = __webpack_require__(/*! ./areOptionsEqual */ "./node_modules/preact-dnd/lib/areOptionsEqual.js");

var _areOptionsEqual2 = _interopRequireDefault(_areOptionsEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTargetConnector(backend) {
  var currentHandlerId = void 0;

  var currentDropTargetNode = void 0;
  var currentDropTargetOptions = void 0;
  var disconnectCurrentDropTarget = void 0;

  function reconnectDropTarget() {
    if (disconnectCurrentDropTarget) {
      disconnectCurrentDropTarget();
      disconnectCurrentDropTarget = null;
    }

    if (currentHandlerId && currentDropTargetNode) {
      disconnectCurrentDropTarget = backend.connectDropTarget(currentHandlerId, currentDropTargetNode, currentDropTargetOptions);
    }
  }

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDropTarget();
  }

  var hooks = (0, _wrapConnectorHooks2.default)({
    dropTarget: function connectDropTarget(node, options) {
      if (node === currentDropTargetNode && (0, _areOptionsEqual2.default)(options, currentDropTargetOptions)) {
        return;
      }

      currentDropTargetNode = node;
      currentDropTargetOptions = options;

      reconnectDropTarget();
    }
  });

  return {
    receiveHandlerId: receiveHandlerId,
    hooks: hooks
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createTargetFactory.js":
/*!************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createTargetFactory.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createTargetFactory;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop'];

function createTargetFactory(spec) {
  Object.keys(spec).forEach(function (key) {
    (0, _invariant2.default)(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drop target specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', ALLOWED_SPEC_METHODS.join(', '), key);
    (0, _invariant2.default)(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', key, key, spec[key]);
  });

  var Target = function () {
    function Target(monitor) {
      _classCallCheck(this, Target);

      this.monitor = monitor;
      this.props = null;
      this.component = null;
    }

    _createClass(Target, [{
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.props = props;
      }
    }, {
      key: 'receiveMonitor',
      value: function receiveMonitor(monitor) {
        this.monitor = monitor;
      }
    }, {
      key: 'receiveComponent',
      value: function receiveComponent(component) {
        this.component = component;
      }
    }, {
      key: 'canDrop',
      value: function canDrop() {
        if (!spec.canDrop) {
          return true;
        }

        return spec.canDrop(this.props, this.monitor);
      }
    }, {
      key: 'hover',
      value: function hover() {
        if (!spec.hover) {
          return;
        }

        spec.hover(this.props, this.monitor, this.component);
      }
    }, {
      key: 'drop',
      value: function drop() {
        if (!spec.drop) {
          return;
        }

        var dropResult = spec.drop(this.props, this.monitor, this.component);
        if (true) {
          (0, _invariant2.default)(typeof dropResult === 'undefined' || (0, _isPlainObject2.default)(dropResult), 'drop() must either return undefined, or an object that represents the drop result. ' + 'Instead received %s. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target.html', dropResult);
        }
        return dropResult;
      }
    }]);

    return Target;
  }();

  return function createTarget(monitor) {
    return new Target(monitor);
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/createTargetMonitor.js":
/*!************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/createTargetMonitor.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createTargetMonitor;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isCallingCanDrop = false;

var TargetMonitor = function () {
  function TargetMonitor(manager) {
    _classCallCheck(this, TargetMonitor);

    this.internalMonitor = manager.getMonitor();
  }

  _createClass(TargetMonitor, [{
    key: 'receiveHandlerId',
    value: function receiveHandlerId(targetId) {
      this.targetId = targetId;
    }
  }, {
    key: 'canDrop',
    value: function canDrop() {
      (0, _invariant2.default)(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-drop-target-monitor.html');

      try {
        isCallingCanDrop = true;
        return this.internalMonitor.canDropOnTarget(this.targetId);
      } finally {
        isCallingCanDrop = false;
      }
    }
  }, {
    key: 'isOver',
    value: function isOver(options) {
      return this.internalMonitor.isOverTarget(this.targetId, options);
    }
  }, {
    key: 'getItemType',
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: 'getDropResult',
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: 'didDrop',
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: 'getInitialClientOffset',
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: 'getInitialSourceClientOffset',
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: 'getSourceClientOffset',
    value: function getSourceClientOffset() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: 'getClientOffset',
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: 'getDifferenceFromInitialOffset',
    value: function getDifferenceFromInitialOffset() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);

  return TargetMonitor;
}();

function createTargetMonitor(manager) {
  return new TargetMonitor(manager);
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/decorateHandler.js":
/*!********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/decorateHandler.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = decorateHandler;

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

var _preact2 = _interopRequireDefault(_preact);

var _disposables = __webpack_require__(/*! disposables */ "./node_modules/disposables/modules/index.js");

var _shallowEqual = __webpack_require__(/*! ./utils/shallowEqual */ "./node_modules/preact-dnd/lib/utils/shallowEqual.js");

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _shallowEqualScalar = __webpack_require__(/*! ./utils/shallowEqualScalar */ "./node_modules/preact-dnd/lib/utils/shallowEqualScalar.js");

var _shallowEqualScalar2 = _interopRequireDefault(_shallowEqualScalar);

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _hoistNonReactStatics = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/index.js");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function decorateHandler(_ref) {
  var DecoratedComponent = _ref.DecoratedComponent,
      createHandler = _ref.createHandler,
      createMonitor = _ref.createMonitor,
      createConnector = _ref.createConnector,
      registerHandler = _ref.registerHandler,
      containerDisplayName = _ref.containerDisplayName,
      getType = _ref.getType,
      collect = _ref.collect,
      options = _ref.options;
  var _options$arePropsEqua = options.arePropsEqual,
      arePropsEqual = _options$arePropsEqua === undefined ? _shallowEqualScalar2.default : _options$arePropsEqua;

  var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

  var DragDropContainer = function (_Component) {
    _inherits(DragDropContainer, _Component);

    _createClass(DragDropContainer, [{
      key: 'getHandlerId',
      value: function getHandlerId() {
        return this.handlerId;
      }
    }, {
      key: 'getDecoratedComponentInstance',
      value: function getDecoratedComponentInstance() {
        return this.decoratedComponentInstance;
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !arePropsEqual(nextProps, this.props) || !(0, _shallowEqual2.default)(nextState, this.state);
      }
    }]);

    function DragDropContainer(props, context) {
      _classCallCheck(this, DragDropContainer);

      var _this = _possibleConstructorReturn(this, (DragDropContainer.__proto__ || Object.getPrototypeOf(DragDropContainer)).call(this, props, context));

      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleChildRef = _this.handleChildRef.bind(_this);

      (0, _invariant2.default)(_typeof(_this.context.dragDropManager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://gaearon.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

      _this.manager = _this.context.dragDropManager;
      _this.handlerMonitor = createMonitor(_this.manager);
      _this.handlerConnector = createConnector(_this.manager.getBackend());
      _this.handler = createHandler(_this.handlerMonitor);

      _this.disposable = new _disposables.SerialDisposable();
      _this.receiveProps(props);
      _this.state = _this.getCurrentState();
      _this.dispose();
      return _this;
    }

    _createClass(DragDropContainer, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.isCurrentlyMounted = true;
        this.disposable = new _disposables.SerialDisposable();
        this.currentType = null;
        this.receiveProps(this.props);
        this.handleChange();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!arePropsEqual(nextProps, this.props)) {
          this.receiveProps(nextProps);
          this.handleChange();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.dispose();
        this.isCurrentlyMounted = false;
      }
    }, {
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.handler.receiveProps(props);
        this.receiveType(getType(props));
      }
    }, {
      key: 'receiveType',
      value: function receiveType(type) {
        if (type === this.currentType) {
          return;
        }

        this.currentType = type;

        var _registerHandler = registerHandler(type, this.handler, this.manager),
            handlerId = _registerHandler.handlerId,
            unregister = _registerHandler.unregister;

        this.handlerId = handlerId;
        this.handlerMonitor.receiveHandlerId(handlerId);
        this.handlerConnector.receiveHandlerId(handlerId);

        var globalMonitor = this.manager.getMonitor();
        var unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, { handlerIds: [handlerId] });

        this.disposable.setDisposable(new _disposables.CompositeDisposable(new _disposables.Disposable(unsubscribe), new _disposables.Disposable(unregister)));
      }
    }, {
      key: 'handleChange',
      value: function handleChange() {
        if (!this.isCurrentlyMounted) {
          return;
        }

        var nextState = this.getCurrentState();
        if (!(0, _shallowEqual2.default)(nextState, this.state)) {
          this.setState(nextState);
        }
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.disposable.dispose();
        this.handlerConnector.receiveHandlerId(null);
      }
    }, {
      key: 'handleChildRef',
      value: function handleChildRef(component) {
        this.decoratedComponentInstance = component;
        this.handler.receiveComponent(component);
      }
    }, {
      key: 'getCurrentState',
      value: function getCurrentState() {
        var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor);

        if (true) {
          (0, _invariant2.default)((0, _isPlainObject2.default)(nextState), 'Expected `collect` specified as the second argument to ' + '%s for %s to return a plain object of props to inject. ' + 'Instead, received %s.', containerDisplayName, displayName, nextState);
        }

        return nextState;
      }
    }, {
      key: 'render',
      value: function render() {
        return _preact2.default.h(DecoratedComponent, _extends({}, this.props, this.state, {
          ref: this.handleChildRef }));
      }
    }]);

    return DragDropContainer;
  }(_preact.Component);

  DragDropContainer.DecoratedComponent = DecoratedComponent;
  DragDropContainer.displayName = containerDisplayName + '(' + displayName + ')';


  return (0, _hoistNonReactStatics2.default)(DragDropContainer, DecoratedComponent);
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/preact-dnd/lib/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragDropContext = __webpack_require__(/*! ./DragDropContext */ "./node_modules/preact-dnd/lib/DragDropContext.js");

Object.defineProperty(exports, 'DragDropContext', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragDropContext).default;
  }
});

var _DragLayer = __webpack_require__(/*! ./DragLayer */ "./node_modules/preact-dnd/lib/DragLayer.js");

Object.defineProperty(exports, 'DragLayer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragLayer).default;
  }
});

var _DragSource = __webpack_require__(/*! ./DragSource */ "./node_modules/preact-dnd/lib/DragSource.js");

Object.defineProperty(exports, 'DragSource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragSource).default;
  }
});

var _DropTarget = __webpack_require__(/*! ./DropTarget */ "./node_modules/preact-dnd/lib/DropTarget.js");

Object.defineProperty(exports, 'DropTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DropTarget).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./node_modules/preact-dnd/lib/registerSource.js":
/*!*******************************************************!*\
  !*** ./node_modules/preact-dnd/lib/registerSource.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerSource;
function registerSource(type, source, manager) {
  var registry = manager.getRegistry();
  var sourceId = registry.addSource(type, source);

  function unregisterSource() {
    registry.removeSource(sourceId);
  }

  return {
    handlerId: sourceId,
    unregister: unregisterSource
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/registerTarget.js":
/*!*******************************************************!*\
  !*** ./node_modules/preact-dnd/lib/registerTarget.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerTarget;
function registerTarget(type, target, manager) {
  var registry = manager.getRegistry();
  var targetId = registry.addTarget(type, target);

  function unregisterTarget() {
    registry.removeTarget(targetId);
  }

  return {
    handlerId: targetId,
    unregister: unregisterTarget
  };
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js":
/*!**********************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/utils/checkDecoratorArguments.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkDecoratorArguments;
function checkDecoratorArguments(functionName, signature) {
  if (true) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg && arg.prototype && arg.prototype.render) {
        console.error( // eslint-disable-line no-console
        'You seem to be applying the arguments in the wrong order. ' + ('It should be ' + functionName + '(' + signature + ')(Component), not the other way around. ') + 'Read more: http://gaearon.github.io/react-dnd/docs-troubleshooting.html#you-seem-to-be-applying-the-arguments-in-the-wrong-order');
        return;
      }
    }
  }
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/utils/cloneWithRef.js":
/*!***********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/utils/cloneWithRef.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneWithRef;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cloneWithRef(element, newRef) {
  var previousRef = element.attributes.ref;
  (0, _invariant2.default)(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');

  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return (0, _preact.cloneElement)(element, {
      ref: newRef
    });
  }

  return (0, _preact.cloneElement)(element, {
    ref: function ref(node) {
      newRef(node);

      if (previousRef) {
        previousRef(node);
      }
    }
  });
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/utils/isValidType.js":
/*!**********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/utils/isValidType.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
       value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isValidType;

var _isArray = __webpack_require__(/*! lodash/isArray */ "./node_modules/lodash/isArray.js");

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidType(type, allowArray) {
       return typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'symbol' || allowArray && (0, _isArray2.default)(type) && type.every(function (t) {
              return isValidType(t, false);
       });
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/utils/shallowEqual.js":
/*!***********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/utils/shallowEqual.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowEqual;
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }

    var valA = objA[keysA[i]];
    var valB = objB[keysA[i]];

    if (valA !== valB) {
      return false;
    }
  }

  return true;
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/utils/shallowEqualScalar.js":
/*!*****************************************************************!*\
  !*** ./node_modules/preact-dnd/lib/utils/shallowEqualScalar.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = shallowEqualScalar;
function shallowEqualScalar(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i])) {
      return false;
    }

    var valA = objA[keysA[i]];
    var valB = objB[keysA[i]];

    if (valA !== valB || (typeof valA === 'undefined' ? 'undefined' : _typeof(valA)) === 'object' || (typeof valB === 'undefined' ? 'undefined' : _typeof(valB)) === 'object') {
      return false;
    }
  }

  return true;
}

/***/ }),

/***/ "./node_modules/preact-dnd/lib/wrapConnectorHooks.js":
/*!***********************************************************!*\
  !*** ./node_modules/preact-dnd/lib/wrapConnectorHooks.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapConnectorHooks;

var _cloneWithRef = __webpack_require__(/*! ./utils/cloneWithRef */ "./node_modules/preact-dnd/lib/utils/cloneWithRef.js");

var _cloneWithRef2 = _interopRequireDefault(_cloneWithRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { isValidElement } from 'react';

function isValidElement(object) {
  if (!object) return false;

  return 'nodeName' in object && 'attributes' in object && 'children' in object && 'key' in object;
}

function throwIfCompositeComponentElement(element) {
  // Custom components can no longer be wrapped directly in React DnD 2.0
  // so that we don't need to depend on findDOMNode() from react-dom.
  if (typeof element.nodeName === 'string') {
    return;
  }

  var displayName = element.nodeName.displayName || element.nodeName.name || 'the component';

  throw new Error('Only native element nodes can now be passed to React DnD connectors. ' + ('You can either wrap ' + displayName + ' into a <div>, or turn it into a ') + 'drag source or a drop target itself.');
}

function wrapHookToRecognizeElement(hook) {
  return function () {
    var elementOrNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // When passed a node, call the hook straight away.
    if (!isValidElement(elementOrNode)) {
      var node = elementOrNode;
      hook(node, options);
      return;
    }

    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    var element = elementOrNode;
    throwIfCompositeComponentElement(element);

    // When no options are passed, use the hook directly
    var ref = options ? function (node) {
      return hook(node, options);
    } : hook;

    return (0, _cloneWithRef2.default)(element, ref);
  };
}

function wrapConnectorHooks(hooks) {
  var wrappedHooks = {};

  Object.keys(hooks).forEach(function (key) {
    var hook = hooks[key];
    var wrappedHook = wrapHookToRecognizeElement(hook);
    wrappedHooks[key] = function () {
      return wrappedHook;
    };
  });

  return wrappedHooks;
}

/***/ }),

/***/ "./node_modules/preact/dist/preact.mjs":
/*!*********************************************!*\
  !*** ./node_modules/preact/dist/preact.mjs ***!
  \*********************************************/
/*! exports provided: default, h, createElement, cloneElement, createRef, Component, render, rerender, options */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return cloneElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return createRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return rerender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
var VNode = function VNode() {};

var options = {};

var stack = [];

var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

function applyRef(ref, value) {
  if (ref != null) {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  }
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p;
	while (p = items.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {} else if (name === 'ref') {
		applyRef(old, null);
		applyRef(value, node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		try {
			node[name] = value == null ? '' : value;
		} catch (e) {}
		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];

var diffLevel = 0;

var isSvgMode = false;

var hydrating = false;

function flushMounts() {
	var c;
	while (c = mounts.shift()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	if (!diffLevel++) {
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	if (! --diffLevel) {
		hydrating = false;

		if (!componentRoot) flushMounts();
	}

	return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	if (typeof vnode === 'string' || typeof vnode === 'number') {
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			}
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	} else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	diffAttributes(out, vnode.attributes, props);

	isSvgMode = prevSvgMode;

	return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			} else if (min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		unmountComponent(component);
	} else {
		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

function diffAttributes(dom, attrs, old) {
	var name;

	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
	var inst,
	    i = recyclerComponents.length;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	while (i--) {
		if (recyclerComponents[i].constructor === Ctor) {
			inst.nextBase = recyclerComponents[i].nextBase;
			recyclerComponents.splice(i, 1);
			return inst;
		}
	}

	return inst;
}

function doRender(props, state, context) {
	return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	component.__ref = props.ref;
	component.__key = props.key;
	delete props.ref;
	delete props.key;

	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
		if (!component.base || mountAll) {
			if (component.componentWillMount) component.componentWillMount();
		} else if (component.componentWillReceiveProps) {
			component.componentWillReceiveProps(props, context);
		}
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (renderMode !== 0) {
		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	applyRef(component.__ref, component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    snapshot = previousContext,
	    rendered,
	    inst,
	    cbase;

	if (component.constructor.getDerivedStateFromProps) {
		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
		component.state = state;
	}

	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		if (isUpdate && component.getSnapshotBeforeUpdate) {
			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || renderMode === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.push(component);
	} else if (!skip) {

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, snapshot);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	while (component._renderCallbacks.length) {
		component._renderCallbacks.pop().call(component);
	}if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;

			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

		component.nextBase = base;

		removeNode(base);
		recyclerComponents.push(component);

		removeChildren(base);
	}

	applyRef(component.__ref, null);
}

function Component(props, context) {
	this._dirty = true;

	this.context = context;

	this.props = props;

	this.state = this.state || {};

	this._renderCallbacks = [];
}

extend(Component.prototype, {
	setState: function setState(state, callback) {
		if (!this.prevState) this.prevState = this.state;
		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
		if (callback) this._renderCallbacks.push(callback);
		enqueueRender(this);
	},
	forceUpdate: function forceUpdate(callback) {
		if (callback) this._renderCallbacks.push(callback);
		renderComponent(this, 2);
	},
	render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

function createRef() {
	return {};
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	createRef: createRef,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

/* harmony default export */ __webpack_exports__["default"] = (preact);

//# sourceMappingURL=preact.mjs.map


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/BrowserDetector.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/BrowserDetector.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var discount_lodash_1 = __webpack_require__(/*! ./utils/discount_lodash */ "./node_modules/react-dnd-html5-backend/lib/cjs/utils/discount_lodash.js");
exports.isFirefox = discount_lodash_1.memoize(function () {
    return /firefox/i.test(navigator.userAgent);
});
exports.isSafari = discount_lodash_1.memoize(function () { return Boolean(window.safari); });


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/EnterLeaveCounter.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/EnterLeaveCounter.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var discount_lodash_1 = __webpack_require__(/*! ./utils/discount_lodash */ "./node_modules/react-dnd-html5-backend/lib/cjs/utils/discount_lodash.js");
var EnterLeaveCounter = /** @class */ (function () {
    function EnterLeaveCounter(isNodeInDocument) {
        this.entered = [];
        this.isNodeInDocument = isNodeInDocument;
    }
    EnterLeaveCounter.prototype.enter = function (enteringNode) {
        var _this = this;
        var previousLength = this.entered.length;
        var isNodeEntered = function (node) {
            return _this.isNodeInDocument(node) &&
                (!node.contains || node.contains(enteringNode));
        };
        this.entered = discount_lodash_1.union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
    };
    EnterLeaveCounter.prototype.leave = function (leavingNode) {
        var previousLength = this.entered.length;
        this.entered = discount_lodash_1.without(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
    };
    EnterLeaveCounter.prototype.reset = function () {
        this.entered = [];
    };
    return EnterLeaveCounter;
}());
exports.default = EnterLeaveCounter;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/HTML5Backend.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/HTML5Backend.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var EnterLeaveCounter_1 = __webpack_require__(/*! ./EnterLeaveCounter */ "./node_modules/react-dnd-html5-backend/lib/cjs/EnterLeaveCounter.js");
var BrowserDetector_1 = __webpack_require__(/*! ./BrowserDetector */ "./node_modules/react-dnd-html5-backend/lib/cjs/BrowserDetector.js");
var OffsetUtils_1 = __webpack_require__(/*! ./OffsetUtils */ "./node_modules/react-dnd-html5-backend/lib/cjs/OffsetUtils.js");
var NativeDragSources_1 = __webpack_require__(/*! ./NativeDragSources */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/index.js");
var NativeTypes = __webpack_require__(/*! ./NativeTypes */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeTypes.js");
var HTML5Backend = /** @class */ (function () {
    function HTML5Backend(manager) {
        var _this = this;
        this.sourcePreviewNodes = new Map();
        this.sourcePreviewNodeOptions = new Map();
        this.sourceNodes = new Map();
        this.sourceNodeOptions = new Map();
        this.dragStartSourceIds = null;
        this.dropTargetIds = [];
        this.dragEnterTargetIds = [];
        this.currentNativeSource = null;
        this.currentNativeHandle = null;
        this.currentDragSourceNode = null;
        this.altKeyPressed = false;
        this.mouseMoveTimeoutTimer = null;
        this.asyncEndDragFrameId = null;
        this.dragOverTargetIds = null;
        this.getSourceClientOffset = function (sourceId) {
            return OffsetUtils_1.getNodeClientOffset(_this.sourceNodes.get(sourceId));
        };
        this.endDragNativeItem = function () {
            if (!_this.isDraggingNativeItem()) {
                return;
            }
            _this.actions.endDrag();
            _this.registry.removeSource(_this.currentNativeHandle);
            _this.currentNativeHandle = null;
            _this.currentNativeSource = null;
        };
        this.isNodeInDocument = function (node) {
            // Check the node either in the main document or in the current context
            return ((!!document && document.body.contains(node)) ||
                (!!_this.window && _this.window.document.body.contains(node)));
        };
        this.endDragIfSourceWasRemovedFromDOM = function () {
            var node = _this.currentDragSourceNode;
            if (_this.isNodeInDocument(node)) {
                return;
            }
            if (_this.clearCurrentDragSourceNode()) {
                _this.actions.endDrag();
            }
        };
        this.handleTopDragStartCapture = function () {
            _this.clearCurrentDragSourceNode();
            _this.dragStartSourceIds = [];
        };
        this.handleTopDragStart = function (e) {
            var dragStartSourceIds = _this.dragStartSourceIds;
            _this.dragStartSourceIds = null;
            var clientOffset = OffsetUtils_1.getEventClientOffset(e);
            // Avoid crashing if we missed a drop event or our previous drag died
            if (_this.monitor.isDragging()) {
                _this.actions.endDrag();
            }
            // Don't publish the source just yet (see why below)
            _this.actions.beginDrag(dragStartSourceIds || [], {
                publishSource: false,
                getSourceClientOffset: _this.getSourceClientOffset,
                clientOffset: clientOffset,
            });
            var dataTransfer = e.dataTransfer;
            var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
            if (_this.monitor.isDragging()) {
                if (dataTransfer && typeof dataTransfer.setDragImage === 'function') {
                    // Use custom drag image if user specifies it.
                    // If child drag source refuses drag but parent agrees,
                    // use parent's node as drag image. Neither works in IE though.
                    var sourceId = _this.monitor.getSourceId();
                    var sourceNode = _this.sourceNodes.get(sourceId);
                    var dragPreview = _this.sourcePreviewNodes.get(sourceId) || sourceNode;
                    if (dragPreview) {
                        var _a = _this.getCurrentSourcePreviewNodeOptions(), anchorX = _a.anchorX, anchorY = _a.anchorY, offsetX = _a.offsetX, offsetY = _a.offsetY;
                        var anchorPoint = { anchorX: anchorX, anchorY: anchorY };
                        var offsetPoint = { offsetX: offsetX, offsetY: offsetY };
                        var dragPreviewOffset = OffsetUtils_1.getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
                        dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
                    }
                }
                try {
                    // Firefox won't drag without setting data
                    dataTransfer.setData('application/json', {});
                }
                catch (err) {
                    // IE doesn't support MIME types in setData
                }
                // Store drag source node so we can check whether
                // it is removed from DOM and trigger endDrag manually.
                _this.setCurrentDragSourceNode(e.target);
                // Now we are ready to publish the drag source.. or are we not?
                var captureDraggingState = _this.getCurrentSourcePreviewNodeOptions().captureDraggingState;
                if (!captureDraggingState) {
                    // Usually we want to publish it in the next tick so that browser
                    // is able to screenshot the current (not yet dragging) state.
                    //
                    // It also neatly avoids a situation where render() returns null
                    // in the same tick for the source element, and browser freaks out.
                    setTimeout(function () { return _this.actions.publishDragSource(); }, 0);
                }
                else {
                    // In some cases the user may want to override this behavior, e.g.
                    // to work around IE not supporting custom drag previews.
                    //
                    // When using a custom drag layer, the only way to prevent
                    // the default drag preview from drawing in IE is to screenshot
                    // the dragging state in which the node itself has zero opacity
                    // and height. In this case, though, returning null from render()
                    // will abruptly end the dragging, which is not obvious.
                    //
                    // This is the reason such behavior is strictly opt-in.
                    _this.actions.publishDragSource();
                }
            }
            else if (nativeType) {
                // A native item (such as URL) dragged from inside the document
                _this.beginDragNativeItem(nativeType);
            }
            else if (dataTransfer &&
                !dataTransfer.types &&
                ((e.target && !e.target.hasAttribute) ||
                    !e.target.hasAttribute('draggable'))) {
                // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
                // Just let it drag. It's a native type (URL or text) and will be picked up in
                // dragenter handler.
                return;
            }
            else {
                // If by this time no drag source reacted, tell browser not to drag.
                e.preventDefault();
            }
        };
        this.handleTopDragEndCapture = function () {
            if (_this.clearCurrentDragSourceNode()) {
                // Firefox can dispatch this event in an infinite loop
                // if dragend handler does something like showing an alert.
                // Only proceed if we have not handled it already.
                _this.actions.endDrag();
            }
        };
        this.handleTopDragEnterCapture = function (e) {
            _this.dragEnterTargetIds = [];
            var isFirstEnter = _this.enterLeaveCounter.enter(e.target);
            if (!isFirstEnter || _this.monitor.isDragging()) {
                return;
            }
            var dataTransfer = e.dataTransfer;
            var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
            if (nativeType) {
                // A native item (such as file or URL) dragged from outside the document
                _this.beginDragNativeItem(nativeType);
            }
        };
        this.handleTopDragEnter = function (e) {
            var dragEnterTargetIds = _this.dragEnterTargetIds;
            _this.dragEnterTargetIds = [];
            if (!_this.monitor.isDragging()) {
                // This is probably a native item type we don't understand.
                return;
            }
            _this.altKeyPressed = e.altKey;
            if (!BrowserDetector_1.isFirefox()) {
                // Don't emit hover in `dragenter` on Firefox due to an edge case.
                // If the target changes position as the result of `dragenter`, Firefox
                // will still happily dispatch `dragover` despite target being no longer
                // there. The easy solution is to only fire `hover` in `dragover` on FF.
                _this.actions.hover(dragEnterTargetIds, {
                    clientOffset: OffsetUtils_1.getEventClientOffset(e),
                });
            }
            var canDrop = dragEnterTargetIds.some(function (targetId) {
                return _this.monitor.canDropOnTarget(targetId);
            });
            if (canDrop) {
                // IE requires this to fire dragover events
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
                }
            }
        };
        this.handleTopDragOverCapture = function () {
            _this.dragOverTargetIds = [];
        };
        this.handleTopDragOver = function (e) {
            var dragOverTargetIds = _this.dragOverTargetIds;
            _this.dragOverTargetIds = [];
            if (!_this.monitor.isDragging()) {
                // This is probably a native item type we don't understand.
                // Prevent default "drop and blow away the whole document" action.
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'none';
                }
                return;
            }
            _this.altKeyPressed = e.altKey;
            _this.actions.hover(dragOverTargetIds || [], {
                clientOffset: OffsetUtils_1.getEventClientOffset(e),
            });
            var canDrop = (dragOverTargetIds || []).some(function (targetId) {
                return _this.monitor.canDropOnTarget(targetId);
            });
            if (canDrop) {
                // Show user-specified drop effect.
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
                }
            }
            else if (_this.isDraggingNativeItem()) {
                // Don't show a nice cursor but still prevent default
                // "drop and blow away the whole document" action.
                e.preventDefault();
            }
            else {
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'none';
                }
            }
        };
        this.handleTopDragLeaveCapture = function (e) {
            if (_this.isDraggingNativeItem()) {
                e.preventDefault();
            }
            var isLastLeave = _this.enterLeaveCounter.leave(e.target);
            if (!isLastLeave) {
                return;
            }
            if (_this.isDraggingNativeItem()) {
                _this.endDragNativeItem();
            }
        };
        this.handleTopDropCapture = function (e) {
            _this.dropTargetIds = [];
            e.preventDefault();
            if (_this.isDraggingNativeItem()) {
                _this.currentNativeSource.mutateItemByReadingDataTransfer(e.dataTransfer);
            }
            _this.enterLeaveCounter.reset();
        };
        this.handleTopDrop = function (e) {
            var dropTargetIds = _this.dropTargetIds;
            _this.dropTargetIds = [];
            _this.actions.hover(dropTargetIds, {
                clientOffset: OffsetUtils_1.getEventClientOffset(e),
            });
            _this.actions.drop({ dropEffect: _this.getCurrentDropEffect() });
            if (_this.isDraggingNativeItem()) {
                _this.endDragNativeItem();
            }
            else {
                _this.endDragIfSourceWasRemovedFromDOM();
            }
        };
        this.handleSelectStart = function (e) {
            var target = e.target;
            // Only IE requires us to explicitly say
            // we want drag drop operation to start
            if (typeof target.dragDrop !== 'function') {
                return;
            }
            // Inputs and textareas should be selectable
            if (target.tagName === 'INPUT' ||
                target.tagName === 'SELECT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                return;
            }
            // For other targets, ask IE
            // to enable drag and drop
            e.preventDefault();
            target.dragDrop();
        };
        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();
        this.context = manager.getContext();
        this.enterLeaveCounter = new EnterLeaveCounter_1.default(this.isNodeInDocument);
    }
    Object.defineProperty(HTML5Backend.prototype, "window", {
        // public for test
        get: function () {
            if (this.context && this.context.window) {
                return this.context.window;
            }
            else if (typeof window !== 'undefined') {
                return window;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    HTML5Backend.prototype.setup = function () {
        if (this.window === undefined) {
            return;
        }
        if (this.window.__isReactDndBackendSetUp) {
            throw new Error('Cannot have two HTML5 backends at the same time.');
        }
        this.window.__isReactDndBackendSetUp = true;
        this.addEventListeners(this.window);
    };
    HTML5Backend.prototype.teardown = function () {
        if (this.window === undefined) {
            return;
        }
        this.window.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.window);
        this.clearCurrentDragSourceNode();
        if (this.asyncEndDragFrameId) {
            this.window.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
    };
    HTML5Backend.prototype.connectDragPreview = function (sourceId, node, options) {
        var _this = this;
        this.sourcePreviewNodeOptions.set(sourceId, options);
        this.sourcePreviewNodes.set(sourceId, node);
        return function () {
            _this.sourcePreviewNodes.delete(sourceId);
            _this.sourcePreviewNodeOptions.delete(sourceId);
        };
    };
    HTML5Backend.prototype.connectDragSource = function (sourceId, node, options) {
        var _this = this;
        this.sourceNodes.set(sourceId, node);
        this.sourceNodeOptions.set(sourceId, options);
        var handleDragStart = function (e) { return _this.handleDragStart(e, sourceId); };
        var handleSelectStart = function (e) { return _this.handleSelectStart(e); };
        node.setAttribute('draggable', 'true');
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return function () {
            _this.sourceNodes.delete(sourceId);
            _this.sourceNodeOptions.delete(sourceId);
            node.removeEventListener('dragstart', handleDragStart);
            node.removeEventListener('selectstart', handleSelectStart);
            node.setAttribute('draggable', 'false');
        };
    };
    HTML5Backend.prototype.connectDropTarget = function (targetId, node) {
        var _this = this;
        var handleDragEnter = function (e) { return _this.handleDragEnter(e, targetId); };
        var handleDragOver = function (e) { return _this.handleDragOver(e, targetId); };
        var handleDrop = function (e) { return _this.handleDrop(e, targetId); };
        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return function () {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        };
    };
    HTML5Backend.prototype.addEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.addEventListener) {
            return;
        }
        target.addEventListener('dragstart', this
            .handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this
            .handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.removeEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.removeEventListener) {
            return;
        }
        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this
            .handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this
            .handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.getCurrentSourceNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
        return __assign({ dropEffect: this.altKeyPressed ? 'copy' : 'move' }, (sourceNodeOptions || {}));
    };
    HTML5Backend.prototype.getCurrentDropEffect = function () {
        if (this.isDraggingNativeItem()) {
            // It makes more sense to default to 'copy' for native resources
            return 'copy';
        }
        return this.getCurrentSourceNodeOptions().dropEffect;
    };
    HTML5Backend.prototype.getCurrentSourcePreviewNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
        return __assign({ anchorX: 0.5, anchorY: 0.5, captureDraggingState: false }, (sourcePreviewNodeOptions || {}));
    };
    HTML5Backend.prototype.isDraggingNativeItem = function () {
        var itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some(function (key) { return NativeTypes[key] === itemType; });
    };
    HTML5Backend.prototype.beginDragNativeItem = function (type) {
        this.clearCurrentDragSourceNode();
        this.currentNativeSource = NativeDragSources_1.createNativeDragSource(type);
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
    };
    HTML5Backend.prototype.setCurrentDragSourceNode = function (node) {
        var _this = this;
        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node;
        // A timeout of > 0 is necessary to resolve Firefox issue referenced
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        var MOUSE_MOVE_TIMEOUT = 1000;
        // Receiving a mouse event in the middle of a dragging operation
        // means it has ended and the drag source node disappeared from DOM,
        // so the browser didn't dispatch the dragend event.
        //
        // We need to wait before we start listening for mousemove events.
        // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
        // immediately in some browsers.
        //
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        //
        this.mouseMoveTimeoutTimer = setTimeout(function () {
            return (_this.window &&
                _this.window.addEventListener('mousemove', _this.endDragIfSourceWasRemovedFromDOM, true));
        }, MOUSE_MOVE_TIMEOUT);
    };
    HTML5Backend.prototype.clearCurrentDragSourceNode = function () {
        if (this.currentDragSourceNode) {
            this.currentDragSourceNode = null;
            if (this.window) {
                this.window.clearTimeout(this.mouseMoveTimeoutTimer || undefined);
                this.window.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
            }
            this.mouseMoveTimeoutTimer = null;
            return true;
        }
        return false;
    };
    HTML5Backend.prototype.handleDragStart = function (e, sourceId) {
        if (!this.dragStartSourceIds) {
            this.dragStartSourceIds = [];
        }
        this.dragStartSourceIds.unshift(sourceId);
    };
    HTML5Backend.prototype.handleDragEnter = function (e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleDragOver = function (e, targetId) {
        if (this.dragOverTargetIds === null) {
            this.dragOverTargetIds = [];
        }
        this.dragOverTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleDrop = function (e, targetId) {
        this.dropTargetIds.unshift(targetId);
    };
    return HTML5Backend;
}());
exports.default = HTML5Backend;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/MonotonicInterpolant.js":
/*!******************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/MonotonicInterpolant.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonotonicInterpolant = /** @class */ (function () {
    function MonotonicInterpolant(xs, ys) {
        var length = xs.length;
        // Rearrange xs and ys so that xs is sorted
        var indexes = [];
        for (var i = 0; i < length; i++) {
            indexes.push(i);
        }
        indexes.sort(function (a, b) { return (xs[a] < xs[b] ? -1 : 1); });
        // Get consecutive differences and slopes
        var dys = [];
        var dxs = [];
        var ms = [];
        var dx;
        var dy;
        for (var i = 0; i < length - 1; i++) {
            dx = xs[i + 1] - xs[i];
            dy = ys[i + 1] - ys[i];
            dxs.push(dx);
            dys.push(dy);
            ms.push(dy / dx);
        }
        // Get degree-1 coefficients
        var c1s = [ms[0]];
        for (var i = 0; i < dxs.length - 1; i++) {
            var m2 = ms[i];
            var mNext = ms[i + 1];
            if (m2 * mNext <= 0) {
                c1s.push(0);
            }
            else {
                dx = dxs[i];
                var dxNext = dxs[i + 1];
                var common = dx + dxNext;
                c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
            }
        }
        c1s.push(ms[ms.length - 1]);
        // Get degree-2 and degree-3 coefficients
        var c2s = [];
        var c3s = [];
        var m;
        for (var i = 0; i < c1s.length - 1; i++) {
            m = ms[i];
            var c1 = c1s[i];
            var invDx = 1 / dxs[i];
            var common = c1 + c1s[i + 1] - m - m;
            c2s.push((m - c1 - common) * invDx);
            c3s.push(common * invDx * invDx);
        }
        this.xs = xs;
        this.ys = ys;
        this.c1s = c1s;
        this.c2s = c2s;
        this.c3s = c3s;
    }
    MonotonicInterpolant.prototype.interpolate = function (x) {
        var _a = this, xs = _a.xs, ys = _a.ys, c1s = _a.c1s, c2s = _a.c2s, c3s = _a.c3s;
        // The rightmost point in the dataset should give an exact result
        var i = xs.length - 1;
        if (x === xs[i]) {
            return ys[i];
        }
        // Search for the interval x is in, returning the corresponding y if x is one of the original xs
        var low = 0;
        var high = c3s.length - 1;
        var mid;
        while (low <= high) {
            mid = Math.floor(0.5 * (low + high));
            var xHere = xs[mid];
            if (xHere < x) {
                low = mid + 1;
            }
            else if (xHere > x) {
                high = mid - 1;
            }
            else {
                return ys[mid];
            }
        }
        i = Math.max(0, high);
        // Interpolate
        var diff = x - xs[i];
        var diffSq = diff * diff;
        return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
    };
    return MonotonicInterpolant;
}());
exports.default = MonotonicInterpolant;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/NativeDragSource.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/NativeDragSource.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NativeDragSource = /** @class */ (function () {
    function NativeDragSource(config) {
        var _this = this;
        this.config = config;
        this.item = {};
        Object.keys(this.config.exposeProperties).forEach(function (property) {
            Object.defineProperty(_this.item, property, {
                configurable: true,
                enumerable: true,
                get: function () {
                    // tslint:disable-next-line no-console
                    console.warn("Browser doesn't allow reading \"" + property + "\" until the drop event.");
                    return null;
                },
            });
        });
    }
    NativeDragSource.prototype.mutateItemByReadingDataTransfer = function (dataTransfer) {
        var _this = this;
        var newProperties = {};
        if (dataTransfer) {
            Object.keys(this.config.exposeProperties).forEach(function (property) {
                newProperties[property] = {
                    value: _this.config.exposeProperties[property](dataTransfer, _this.config.matchesTypes),
                };
            });
        }
        Object.defineProperties(this.item, newProperties);
    };
    NativeDragSource.prototype.canDrag = function () {
        return true;
    };
    NativeDragSource.prototype.beginDrag = function () {
        return this.item;
    };
    NativeDragSource.prototype.isDragging = function (monitor, handle) {
        return handle === monitor.getSourceId();
    };
    NativeDragSource.prototype.endDrag = function () {
        // empty
    };
    return NativeDragSource;
}());
exports.NativeDragSource = NativeDragSource;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/getDataFromDataTransfer.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/getDataFromDataTransfer.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
    var result = typesToTry.reduce(function (resultSoFar, typeToTry) { return resultSoFar || dataTransfer.getData(typeToTry); }, '');
    return result != null ? result : defaultValue;
}
exports.getDataFromDataTransfer = getDataFromDataTransfer;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/index.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var nativeTypesConfig_1 = __webpack_require__(/*! ./nativeTypesConfig */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/nativeTypesConfig.js");
var NativeDragSource_1 = __webpack_require__(/*! ./NativeDragSource */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/NativeDragSource.js");
function createNativeDragSource(type) {
    return new NativeDragSource_1.NativeDragSource(nativeTypesConfig_1.nativeTypesConfig[type]);
}
exports.createNativeDragSource = createNativeDragSource;
function matchNativeItemType(dataTransfer) {
    if (!dataTransfer) {
        return null;
    }
    var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return (Object.keys(nativeTypesConfig_1.nativeTypesConfig).filter(function (nativeItemType) {
        var matchesTypes = nativeTypesConfig_1.nativeTypesConfig[nativeItemType].matchesTypes;
        return matchesTypes.some(function (t) { return dataTransferTypes.indexOf(t) > -1; });
    })[0] || null);
}
exports.matchNativeItemType = matchNativeItemType;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/nativeTypesConfig.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/nativeTypesConfig.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var NativeTypes = __webpack_require__(/*! ../NativeTypes */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeTypes.js");
var getDataFromDataTransfer_1 = __webpack_require__(/*! ./getDataFromDataTransfer */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeDragSources/getDataFromDataTransfer.js");
exports.nativeTypesConfig = (_a = {},
    _a[NativeTypes.FILE] = {
        exposeProperties: {
            files: function (dataTransfer) {
                return Array.prototype.slice.call(dataTransfer.files);
            },
            items: function (dataTransfer) { return dataTransfer.items; },
        },
        matchesTypes: ['Files'],
    },
    _a[NativeTypes.URL] = {
        exposeProperties: {
            urls: function (dataTransfer, matchesTypes) {
                return getDataFromDataTransfer_1.getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
            },
        },
        matchesTypes: ['Url', 'text/uri-list'],
    },
    _a[NativeTypes.TEXT] = {
        exposeProperties: {
            text: function (dataTransfer, matchesTypes) {
                return getDataFromDataTransfer_1.getDataFromDataTransfer(dataTransfer, matchesTypes, '');
            },
        },
        matchesTypes: ['Text', 'text/plain'],
    },
    _a);


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeTypes.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/NativeTypes.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE = '__NATIVE_FILE__';
exports.URL = '__NATIVE_URL__';
exports.TEXT = '__NATIVE_TEXT__';


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/OffsetUtils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/OffsetUtils.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BrowserDetector_1 = __webpack_require__(/*! ./BrowserDetector */ "./node_modules/react-dnd-html5-backend/lib/cjs/BrowserDetector.js");
var MonotonicInterpolant_1 = __webpack_require__(/*! ./MonotonicInterpolant */ "./node_modules/react-dnd-html5-backend/lib/cjs/MonotonicInterpolant.js");
var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;
    if (!el) {
        return null;
    }
    var _a = el.getBoundingClientRect(), top = _a.top, left = _a.left;
    return { x: left, y: top };
}
exports.getNodeClientOffset = getNodeClientOffset;
function getEventClientOffset(e) {
    return {
        x: e.clientX,
        y: e.clientY,
    };
}
exports.getEventClientOffset = getEventClientOffset;
function isImageNode(node) {
    return (node.nodeName === 'IMG' &&
        (BrowserDetector_1.isFirefox() || !document.documentElement.contains(node)));
}
function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
    var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
    var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight;
    // Work around @2x coordinate discrepancies in browsers
    if (BrowserDetector_1.isSafari() && isImage) {
        dragPreviewHeight /= window.devicePixelRatio;
        dragPreviewWidth /= window.devicePixelRatio;
    }
    return { dragPreviewWidth: dragPreviewWidth, dragPreviewHeight: dragPreviewHeight };
}
function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
    // The browsers will use the image intrinsic size under different conditions.
    // Firefox only cares if it's an image, but WebKit also wants it to be detached.
    var isImage = isImageNode(dragPreview);
    var dragPreviewNode = isImage ? sourceNode : dragPreview;
    var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
    var offsetFromDragPreview = {
        x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
        y: clientOffset.y - dragPreviewNodeOffsetFromClient.y,
    };
    var sourceWidth = sourceNode.offsetWidth, sourceHeight = sourceNode.offsetHeight;
    var anchorX = anchorPoint.anchorX, anchorY = anchorPoint.anchorY;
    var _a = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight), dragPreviewWidth = _a.dragPreviewWidth, dragPreviewHeight = _a.dragPreviewHeight;
    var calculateYOffset = function () {
        var interpolantY = new MonotonicInterpolant_1.default([0, 0.5, 1], [
            // Dock to the top
            offsetFromDragPreview.y,
            // Align at the center
            (offsetFromDragPreview.y / sourceHeight) * dragPreviewHeight,
            // Dock to the bottom
            offsetFromDragPreview.y + dragPreviewHeight - sourceHeight,
        ]);
        var y = interpolantY.interpolate(anchorY);
        // Work around Safari 8 positioning bug
        if (BrowserDetector_1.isSafari() && isImage) {
            // We'll have to wait for @3x to see if this is entirely correct
            y += (window.devicePixelRatio - 1) * dragPreviewHeight;
        }
        return y;
    };
    var calculateXOffset = function () {
        // Interpolate coordinates depending on anchor point
        // If you know a simpler way to do this, let me know
        var interpolantX = new MonotonicInterpolant_1.default([0, 0.5, 1], [
            // Dock to the left
            offsetFromDragPreview.x,
            // Align at the center
            (offsetFromDragPreview.x / sourceWidth) * dragPreviewWidth,
            // Dock to the right
            offsetFromDragPreview.x + dragPreviewWidth - sourceWidth,
        ]);
        return interpolantX.interpolate(anchorX);
    };
    // Force offsets if specified in the options.
    var offsetX = offsetPoint.offsetX, offsetY = offsetPoint.offsetY;
    var isManualOffsetX = offsetX === 0 || offsetX;
    var isManualOffsetY = offsetY === 0 || offsetY;
    return {
        x: isManualOffsetX ? offsetX : calculateXOffset(),
        y: isManualOffsetY ? offsetY : calculateYOffset(),
    };
}
exports.getDragPreviewOffset = getDragPreviewOffset;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/getEmptyImage.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/getEmptyImage.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var emptyImage;
function getEmptyImage() {
    if (!emptyImage) {
        emptyImage = new Image();
        emptyImage.src =
            'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    return emptyImage;
}
exports.default = getEmptyImage;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HTML5Backend_1 = __webpack_require__(/*! ./HTML5Backend */ "./node_modules/react-dnd-html5-backend/lib/cjs/HTML5Backend.js");
var getEmptyImage_1 = __webpack_require__(/*! ./getEmptyImage */ "./node_modules/react-dnd-html5-backend/lib/cjs/getEmptyImage.js");
exports.getEmptyImage = getEmptyImage_1.default;
var NativeTypes = __webpack_require__(/*! ./NativeTypes */ "./node_modules/react-dnd-html5-backend/lib/cjs/NativeTypes.js");
exports.NativeTypes = NativeTypes;
function createHTML5Backend(manager) {
    return new HTML5Backend_1.default(manager);
}
exports.default = createHTML5Backend;


/***/ }),

/***/ "./node_modules/react-dnd-html5-backend/lib/cjs/utils/discount_lodash.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/cjs/utils/discount_lodash.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function memoize(fn) {
    var result = null;
    var memoized = function () {
        if (result == null) {
            result = fn();
        }
        return result;
    };
    return memoized;
}
exports.memoize = memoize;
/**
 * drop-in replacement for _.without
 */
function without(items, item) {
    return items.filter(function (i) { return i !== item; });
}
exports.without = without;
function union(itemsA, itemsB) {
    var set = new Set();
    var insertItem = function (item) { return set.add(item); };
    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    var result = [];
    set.forEach(function (key) { return result.push(key); });
    return result;
}
exports.union = union;


/***/ }),

/***/ "./node_modules/redux/lib/createStore.js":
/*!***********************************************!*\
  !*** ./node_modules/redux/lib/createStore.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ "./node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = __webpack_require__(/*! symbol-observable */ "./node_modules/symbol-observable/es/index.js");

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}

/***/ }),

/***/ "./node_modules/symbol-observable/es/index.js":
/*!****************************************************!*\
  !*** ./node_modules/symbol-observable/es/index.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var _ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ponyfill.js */ "./node_modules/symbol-observable/es/ponyfill.js");
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {}

var result = Object(_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__["default"])(root);
/* harmony default export */ __webpack_exports__["default"] = (result);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./node_modules/symbol-observable/es/ponyfill.js":
/*!*******************************************************!*\
  !*** ./node_modules/symbol-observable/es/ponyfill.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return symbolObservablePonyfill; });
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var mini_toastr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mini-toastr */ "./node_modules/mini-toastr/mini-toastr.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/pins */ "./src/lib/pins.js");
/* harmony import */ var _components_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/menu */ "./src/components/menu/index.js");
/* harmony import */ var _components_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/page */ "./src/components/page/index.js");
/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/config */ "./src/lib/config.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/loader */ "./src/lib/loader.js");
/* harmony import */ var _lib_plugins__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/plugins */ "./src/lib/plugins.js");
/* harmony import */ var _lib_menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lib/menu */ "./src/lib/menu.js");










mini_toastr__WEBPACK_IMPORTED_MODULE_1__["default"].init({});

const clearSlashes = path => {
  return path.toString().replace(/\/$/, '').replace(/^\//, '');
};

const getFragment = () => {
  const match = window.location.href.match(/#(.*)$/);
  const fragment = match ? match[1] : '';
  return clearSlashes(fragment);
};

class App extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor() {
    super();
    this.state = {
      menuActive: false,
      menu: _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].menus[0],
      page: _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].menus[0],
      changed: false
    };

    this.menuToggle = () => {
      this.setState({
        menuActive: !this.state.menuActive
      });
    };
  }

  getBreadcrumbs(page) {
    if (!page) return null;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      href: `#${page.href}`
    }, page.pagetitle == null ? page.title : page.pagetitle));
  }

  render(props, state) {
    const params = getFragment().split('/').slice(2);
    const active = this.state.menuActive ? 'active' : '';
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "layout1",
      class: active
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("nav", {
      class: "navbar is-link is-fixed-top",
      role: "navigation",
      "aria-label": "main navigation"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "navbar-brand",
      style: "width: 250px;"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      class: "navbar-item",
      href: "https://bulma.io"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "SH"), "TECH-", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "R")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "navbar-burger burger",
      "data-target": "navbarExampleTransparentExample"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "navbarBasicExample",
      class: "navbar-menu"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "navbar-start"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("nav", {
      class: "breadcrumb has-succeeds-separator navbar-item",
      "aria-label": "breadcrumbs"
    }, ">\xA0 ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("ul", null, this.getBreadcrumbs(state.page.parent), this.getBreadcrumbs(state.page)))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "navbar-end"
    }, state.changed ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      class: "navbar-item",
      href: "#tools/diff"
    }, "CHANGED! Click here to SAVE") : null))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("section", {
      style: "display: flex; margin-top: 52px;"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: "flex: 0 0 250px"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_menu__WEBPACK_IMPORTED_MODULE_3__["Menu"], {
      menus: _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].menus,
      selected: state.menu
    })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: "flex: 1"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_page__WEBPACK_IMPORTED_MODULE_4__["Page"], {
      page: state.page,
      params: params,
      changed: this.state.changed
    }))));
  }

  componentDidUpdate() {
    this.onPageLoad();
  }

  componentDidMount() {
    _lib_loader__WEBPACK_IMPORTED_MODULE_7__["loader"].hide();
    let current = '';

    const fn = () => {
      const newFragment = getFragment();
      const diff = _lib_settings__WEBPACK_IMPORTED_MODULE_6__["settings"].diff();
      const editorDiff = _lib_settings__WEBPACK_IMPORTED_MODULE_6__["settings"].editor.diff();

      if (this.state.changed !== (!!diff.length || !!editorDiff.length)) {
        this.setState({
          changed: !this.state.changed
        });
      }

      if (current !== newFragment) {
        current = newFragment;
        const parts = current.split('/');
        const m = _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].menus.find(menu => menu.href === parts[0]);
        const page = parts.length > 1 ? _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].routes.find(route => route.href === `${parts[0]}/${parts[1]}`) : m;

        if (page) {
          this.setState({
            page,
            menu: m,
            menuActive: false
          });
        }
      }
    };

    this.interval = setInterval(fn, 100);
    this.onPageLoad();
  }

  onPageLoad() {
    window.requestAnimationFrame(() => {
      Object(_lib_plugins__WEBPACK_IMPORTED_MODULE_8__["firePageLoad"])();
    });
  }

  componentWillUnmount() {}

}

const load = async () => {
  await Object(_lib_config__WEBPACK_IMPORTED_MODULE_5__["loadConfig"])();
  await Object(_lib_plugins__WEBPACK_IMPORTED_MODULE_8__["loadPlugins"])();
  Object(preact__WEBPACK_IMPORTED_MODULE_0__["render"])(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(App, null), document.body);
};

load();
console.log(document.location);

/***/ }),

/***/ "./src/components/form/index.js":
/*!**************************************!*\
  !*** ./src/components/form/index.js ***!
  \**************************************/
/*! exports provided: Form */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Form", function() { return Form; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/settings */ "./src/lib/settings.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





const longToByteArray = function (
/*long*/
long) {
  // we want to represent the input as a 8-bytes array
  var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

  for (var index = 0; index < byteArray.length; index++) {
    var byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return byteArray;
};

const byteArrayToLong = function (
/*byte[]*/
byteArray) {
  var value = 0;

  for (var i = byteArray.length - 1; i >= 0; i--) {
    value = value * 256 + byteArray[i];
  }

  return value;
};

class Form extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    this.setProp = (prop, val) => {
      if (prop.startsWith('ROOT')) {
        _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set(prop.replace('ROOT.', ''), val);
      } else {
        Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["set"])(this.props.selected, prop, val);
      }
    };

    this.getProp = prop => {
      let currentValue;

      if (prop.startsWith('ROOT')) {
        currentValue = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(prop.replace('ROOT.', ''));
      } else {
        currentValue = Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(this.props.selected, prop);
      }

      return currentValue;
    };

    this.onChange = (id, prop, config = {}) => {
      return e => {
        let val = this.form.elements[id].value;

        if (config.type === 'checkbox') {
          val = this.form.elements[id].checked ? 1 : 0;
        } else if (config.type === 'number') {
          val = parseFloat(val);
        } else if (config.type === 'select' || config.type === 'gpio') {
          val = isNaN(val) ? val : parseInt(val);
        } else if (config.type === 'ip') {
          const part = parseInt(id.split('.').pop());
          const arr = longToByteArray(this.getProp(prop));
          arr[part] = val;
          val = byteArrayToLong(arr);
        }

        this.setProp(prop, val);

        if (config.onChange) {
          config.onChange(e, this, id, prop, val, config);
        }

        this.forceUpdate();
      };
    };
  }

  renderConfig(id, config, value, varName) {
    let options;

    switch (config.type) {
      case 'string':
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", _extends({
          class: "input",
          id: id,
          type: "text",
          value: value,
          onChange: this.onChange(id, varName, config)
        }, config.extra));

      case 'number':
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: id,
          type: "number",
          value: value,
          step: config.step,
          min: config.min,
          max: config.max,
          onChange: this.onChange(id, varName, config)
        });

      case 'ip':
        const ip = value ? longToByteArray(value) : [0, 0, 0, 0];
        return [Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: `${id}.0`,
          type: "number",
          min: "0",
          max: "255",
          onChange: this.onChange(`${id}.0`, varName, config),
          style: "width: 80px",
          value: ip ? ip[0] : 0
        }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: `${id}.1`,
          type: "number",
          min: "0",
          max: "255",
          onChange: this.onChange(`${id}.1`, varName, config),
          style: "width: 80px",
          value: ip ? ip[1] : 0
        }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: `${id}.2`,
          type: "number",
          min: "0",
          max: "255",
          onChange: this.onChange(`${id}.2`, varName, config),
          style: "width: 80px",
          value: ip ? ip[2] : 0
        }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: `${id}.3`,
          type: "number",
          min: "0",
          max: "255",
          onChange: this.onChange(`${id}.3`, varName, config),
          style: "width: 80px",
          value: ip ? ip[3] : 0
        })];

      case 'password':
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: id,
          type: "password",
          onChange: this.onChange(id, varName, config)
        });

      case 'checkbox':
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: id,
          type: "checkbox",
          defaultChecked: value,
          onChange: this.onChange(id, varName, config)
        });

      case 'select':
        options = typeof config.options === 'function' ? config.options(this.props.selected) : config.options;
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
          class: "select"
        }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
          id: id,
          value: value,
          onChange: this.onChange(id, varName, config)
        }, options.map(option => {
          const name = option instanceof Object ? option.name : option;
          const val = option instanceof Object ? option.value : option;
          return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
            value: val,
            disabled: option.disabled ? true : null
          }, name, option.disabled ? ` [${option.disabled}]` : '');
        })));

      case 'gpio':
        options = config.pins || window.pins();

        const selectPin = (val, name, form) => {
          const pins = window.pins();
          const selectedPin = pins.find(pin => pin.value == val);
          form.props.config.groups[name].configs = { ...selectedPin.configs
          };
          form.forceUpdate();
        };

        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
          class: "select"
        }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
          id: id,
          onChange: this.onChange(id, varName, { ...config,
            onChange: (e, form, id, prop, val, config) => {
              selectPin(val, config.name.toLowerCase(), form);
            }
          })
        }, options.map(option => {
          const name = option instanceof Object ? option.name : option;
          const val = option instanceof Object ? option.value : option;

          if (val === value) {
            return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
              value: val,
              selected: true
            }, name);
          } else {
            return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
              value: val,
              disabled: option.disabled ? true : null
            }, name, option.disabled ? ` [${option.disabled}]` : '');
          }
        })));

      case 'file':
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          id: id,
          type: "file"
        });

      case 'button':
        const clickEvent = () => {
          if (!config.click) return;
          config.click(this.props.selected, this, config);
        };

        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
          type: "button",
          onClick: clickEvent
        }, config.value);
    }
  }

  renderConfigGroup(id, configs, values) {
    const configArray = Array.isArray(configs) ? configs : [configs];
    const classes = `field is-grouped is-horizontal ${configArray.length === 3 ? 'group-3' : ''}`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      className: classes
    }, configArray.map((conf, i) => {
      const varId = configArray.length > 1 ? `${id}.${i}` : id;
      const varName = conf.var ? conf.var : varId;
      const val = varName.startsWith('ROOT') ? _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(varName.replace('ROOT.', '')) : Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(values, varName, null);

      if (conf.if) {
        let val;

        if (typeof conf.if === 'function') {
          if (!conf.if(values)) return null;
        } else {
          if (conf.if.startsWith('ROOT')) {
            val = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(conf.if.replace('ROOT.', ''));
          } else {
            val = Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(this.props.selected, conf.if, false);
          }

          if (conf.ifval === undefined && !val) {
            return null;
          }

          if (conf.ifval != val) return null;
        }
      }

      if (conf.type === 'custom') {
        const CustomComponent = conf.component;
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(CustomComponent, {
          conf: conf,
          values: values
        });
      }

      const name = typeof conf.name === 'function' ? conf.name(values) : conf.name;
      return [Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "field-label"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", {
        for: varId,
        class: "label"
      }, name, " ", conf.help ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: "fa fa-info-circle"
      }) : '')), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "field-body"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "control is-expanded"
      }, this.renderConfig(varId, conf, val, varName)))];
    }));
  }

  renderGroup(id, group, values) {
    if (!group.configs || !Object.keys(group.configs).length) return null;
    const keys = Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["getKeys"])(group.configs);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("fieldset", {
      name: id
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", null, group.name, " ", group.help ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
      class: "tooltip fa fa-info-circle"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("tooltip", null, group.help)) : ''), keys.map(key => {
      const conf = group.configs[key];
      if (conf.adminOnly && _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].userName !== 'admin') return null;
      return this.renderConfigGroup(`${id}.${key}`, conf, values);
    }));
  }

  render(props) {
    const keys = Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["getKeys"])(props.config.groups);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      class: "pure-form pure-form-aligned",
      ref: ref => this.form = ref
    }, keys.map(key => this.renderGroup(key, props.config.groups[key], props.selected)));
  }

}

/***/ }),

/***/ "./src/components/menu/index.js":
/*!**************************************!*\
  !*** ./src/components/menu/index.js ***!
  \**************************************/
/*! exports provided: Menu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/settings */ "./src/lib/settings.js");


class Menu extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  renderMenuChildren(menu) {
    if (!menu.children.length) return null;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("ul", null, [...menu.children.map(child => {
      if (child.action) {
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
          href: `#${child.href}`,
          onClick: child.action
        }, child.title));
      }

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: `#${child.href}`
      }, child.title));
    })]);
  }

  renderMenuItem(menu) {
    if (menu.adminOnly && _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].userName !== 'admin') return null;

    if (menu.action) {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: `#${menu.href}`,
        onClick: menu.action
      }, menu.title));
    }

    if (menu.href === this.props.selected.href) {
      return [Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: `#${menu.href}`,
        class: "is-active"
      }, menu.title), this.renderMenuChildren(menu))];
    }

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", {
      class: "pure-menu-item"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      href: `#${menu.href}`,
      class: "pure-menu-link"
    }, menu.title));
  }

  render(props) {
    if (props.open === false) return;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("aside", {
      class: "menu"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("ul", {
      class: "menu-list"
    }, props.menus.map(menu => this.renderMenuItem(menu))));
  }

}

/***/ }),

/***/ "./src/components/page/index.js":
/*!**************************************!*\
  !*** ./src/components/page/index.js ***!
  \**************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return Page; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

class Page extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    const PageComponent = props.page.component;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "main"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: `content ${props.page.class}`
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(PageComponent, {
      params: props.params
    })));
  }

}

/***/ }),

/***/ "./src/devices/10_pca9685.js":
/*!***********************************!*\
  !*** ./src/devices/10_pca9685.js ***!
  \***********************************/
/*! exports provided: pca9685 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pca9685", function() { return pca9685; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const i2cAddr = [...new Array(64)].map((x, i) => {
  return {
    name: `0x${(i + 64).toString(16)}`,
    value: i + 64
  };
});

class PCA9685 extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => ({
      'params.addr': 56,
      'params.freq': 500
    }));

    _defineProperty(this, "getDevicePins", conf => {
      return [...new Array(16)].map((x, i) => ({
        name: `${conf.name} GPIO${i}`,
        value: i,
        capabilities: ['analog_out']
      }));
    });

    this.params = {
      name: 'Sensor',
      configs: {
        addr: {
          name: 'Address',
          type: 'select',
          options: i2cAddr
        },
        freq: {
          name: 'Frequency',
          type: 'number',
          min: 24,
          max: 1526
        }
      }
    };
  }

}

const pca9685 = new PCA9685();

/***/ }),

/***/ "./src/devices/11_mqtt.js":
/*!********************************!*\
  !*** ./src/devices/11_mqtt.js ***!
  \********************************/
/*! exports provided: mqtt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mqtt", function() { return mqtt; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const mqttTypes = [{
  name: 'OpenHAB',
  value: 0
}, {
  name: 'Domoticz',
  value: 1
}, {
  name: '',
  value: 2
}, {
  name: '',
  value: 3
}];

class MQTT extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => ({
      'params.uri': 'mqtt://iot.eclipse.org',
      'params.type': 0
    }));

    this.params = {
      name: 'Config',
      configs: {
        uri: {
          name: 'URI',
          type: 'string'
        },
        type: {
          name: 'Type',
          type: 'select',
          options: mqttTypes,
          onChange: (e, form, id, prop, val, config) => {
            switch (val) {
              case 0:
                // Open HAB
                form.setProp('params.subscribe_topic', '/%sysname%/#');
                form.setProp('params.subscribe_data', '{ "val": %d }');
                form.setProp('params.publish_topic', '/%sysname%/%tskname%/%valname%');
                form.setProp('params.pubish_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                break;

              case 1:
                // Domoticz
                form.setProp('params.subscribe_topic', 'domoticz/out');
                form.setProp('params.subscribe_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                form.setProp('params.publish_topic', 'domoticz/in');
                form.setProp('params.pubish_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                break;

              case 2:
                // PiDome
                break;

              case 3:
                // Home Assistant
                break;
            }
          }
        },
        user: {
          name: 'Username',
          type: 'string'
        },
        pass: {
          name: 'Password',
          type: 'string'
        },
        lwt_topic: {
          name: 'LWT Topic',
          type: 'string'
        },
        lwt_msg: {
          name: 'LWT Message',
          type: 'string'
        },
        subscribe_topic: {
          name: 'Subscribe Topic',
          type: 'string',
          onChange: (e, form, id, prop, val, config) => {
            if (val.includes('%device_id%')) {
              form.props.config.groups.params.configs.subscribe_data_device_id.if = true;
              form.setProp('params.device_as_id', 0);
              form.forceUpdate();
            }

            if (val.includes('%device_name%')) {
              form.setProp('params.device_as_id', 1);
              form.props.config.groups.params.configs.subscribe_data_device_id.if = true;
              form.forceUpdate();
            }

            if (val.includes('%value_id%')) {
              form.setProp('params.value_as_id', 0);
              form.props.config.groups.params.configs.subscribe_data_value_id.if = true;
              form.forceUpdate();
            }

            if (val.includes('%value_name%')) {
              form.setProp('params.value_as_id', 1);
              form.props.config.groups.params.configs.subscribe_data_value_id.if = true;
              form.forceUpdate();
            }

            if (val.includes('%value%')) {
              form.props.config.groups.params.configs.subscribe_data_value.if = true;
              form.forceUpdate();
            }
          }
        },
        device_as_id: {
          name: 'Device Identifier',
          type: 'select',
          options: [{
            name: 'id',
            value: 0
          }, {
            name: 'name',
            value: 1
          }]
        },
        subscribe_data_device_id: {
          name: 'Device Identifier Field',
          type: 'string'
        },
        value_as_id: {
          name: 'Value Identifier',
          type: 'select',
          options: [{
            name: 'id',
            value: 0
          }, {
            name: 'name',
            value: 1
          }]
        },
        subscribe_data_value_id: {
          name: 'Value Identifier Field',
          type: 'string'
        },
        subscribe_data_value: {
          name: 'Value Field',
          type: 'string'
        },
        publish_topic: {
          name: 'Publish Topic',
          type: 'string'
        },
        publish_data: {
          name: 'Publish Data',
          type: 'string'
        }
      }
    };
  }

}

const mqtt = new MQTT();

/***/ }),

/***/ "./src/devices/12_rotary_encoder.js":
/*!******************************************!*\
  !*** ./src/devices/12_rotary_encoder.js ***!
  \******************************************/
/*! exports provided: rotaryEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rotaryEncoder", function() { return rotaryEncoder; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class RotaryEncoder extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => {
      return {
        'params.gpio1': 255,
        'params.gpio2': 255,
        'params.invert': false,
        interval: 60,
        'state.values[0].name': 'State',
        'state.values[0].type': '2'
      };
    });

    this.params = {
      name: 'Configuration',
      configs: {
        gpio1: {
          name: 'GPIO1',
          type: 'gpio'
        },
        gpio2: {
          name: 'GPIO2',
          type: 'gpio'
        },
        invert: {
          name: 'Invert',
          type: 'checkbox'
        },
        interval: {
          name: 'Interval',
          type: 'number'
        }
      }
    };
    this.gpio1 = {
      name: 'GPIO1 Settings (global)',
      configs: {}
    };
    this.gpio2 = {
      name: 'GPIO2 Settings (global)',
      configs: {}
    };
    this.vals = 1;
  }

}

const rotaryEncoder = new RotaryEncoder();

/***/ }),

/***/ "./src/devices/13_http.js":
/*!********************************!*\
  !*** ./src/devices/13_http.js ***!
  \********************************/
/*! exports provided: http */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "http", function() { return http; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class HTTP extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => ({
      'params.uri': 'http://iot.eclipse.org/%device_name%/%value_name%/%value%',
      'params.type': 0,
      'params.data': ''
    }));

    this.params = {
      name: 'Config',
      configs: {
        uri: {
          name: 'URI',
          type: 'string'
        },
        method: {
          name: 'Method',
          type: 'select',
          options: [{
            name: 'GET',
            value: 0
          }, {
            name: 'POST',
            value: 1
          }]
        },
        data: {
          name: 'Data',
          type: 'string'
        }
      }
    };
  }

}

const http = new HTTP();

/***/ }),

/***/ "./src/devices/14_dummy.js":
/*!*********************************!*\
  !*** ./src/devices/14_dummy.js ***!
  \*********************************/
/*! exports provided: dummy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dummy", function() { return dummy; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const valueTypes = [{
  name: 'Bit',
  value: 0
}, {
  name: 'Byte',
  value: 0
}, {
  name: 'Integer',
  value: 1
}, {
  name: 'Decimal',
  value: 2
}, {
  name: 'String',
  value: 3
}];

class Dummy extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "getConfigProps", vals => {
      const result = {};
      vals.forEach((val, i) => {
        if (!val) return;
        result['config_' + i] = [{
          name: `Var ${i} name`,
          type: 'string',
          var: `params.values[${i}].name`
        }, {
          name: 'Type',
          type: 'select',
          options: valueTypes,
          var: `params.values[${i}].type`
        }, {
          name: 'String',
          if: `params.values[${i}].type`,
          ifval: 3,
          type: 'string',
          var: `params.values[${i}].val`
        }, {
          name: 'Decimal',
          if: `params.values[${i}].type`,
          ifval: 2,
          type: 'number',
          step: .01,
          var: `params.values[${i}].val`
        }, {
          name: 'Byte',
          if: `params.values[${i}].type`,
          ifval: 0,
          type: 'number',
          min: 0,
          max: 255,
          var: `params.values[${i}].val`
        }, {
          name: 'Int',
          if: `params.values[${i}].type`,
          ifval: 1,
          type: 'number',
          min: 0,
          max: 65535,
          var: `params.values[${i}].val`
        }, {
          type: 'button',
          value: 'X',
          click: (event, form) => {
            const conf = form.props.selected;
            conf.params.values[i] = null;
            form.props.config.groups.params = this.getFields(conf).params;
            form.forceUpdate();
          }
        }];
      });
      return result;
    });

    _defineProperty(this, "getValueProps", vals => {
      const result = {};
      vals.forEach((val, i) => {
        if (!val) return;
        result['value_' + i] = [{
          name: `Var ${i} name`,
          type: 'string',
          var: `state.values[${i}].name`
        }, {
          name: 'Type',
          type: 'select',
          options: valueTypes,
          var: `state.values[${i}].type`
        }, {
          type: 'button',
          value: 'X',
          click: (event, form) => {
            const conf = form.props.selected;
            conf.state.values[i] = null;
            form.props.config.groups.params = this.getFields(conf).params;
            form.forceUpdate();
          }
        }];
      });
      return result;
    });

    _defineProperty(this, "getFields", conf => {
      const values = conf.state ? conf.state.values || [] : [];
      const configs = conf.params ? conf.params.values || [] : [];
      return {
        params: {
          name: 'Config',
          configs: { ...this.getConfigProps(configs),
            add_config: {
              value: 'Add Config',
              type: 'button',
              click: (event, form) => {
                const empty = conf.params.values.findIndex(e => e === null);
                const defaultVarConf = {
                  name: 'Dummy',
                  type: 0,
                  value: 0
                };
                if (empty !== -1) conf.params.values[empty] = defaultVarConf;else conf.params.values.push(defaultVarConf);
                form.props.config.groups.params = this.getFields(conf).params;
                form.forceUpdate();
              }
            },
            ...this.getValueProps(values),
            add_state: {
              value: 'Add State',
              type: 'button',
              click: (event, form) => {
                const empty = conf.state.values.findIndex(e => e === null);
                const defaultVarConf = {
                  name: 'Dummy',
                  type: 0,
                  value: 0
                };
                if (empty !== -1) conf.state.values[empty] = defaultVarConf;else conf.state.values.push(defaultVarConf);
                form.props.config.groups.params = this.getFields(conf).params;
                form.forceUpdate();
              }
            }
          }
        }
      };
    });

    _defineProperty(this, "defaults", () => ({
      'params.values[0].name': 'Dummy',
      'params.values[0].type': 0,
      'params.values[0].value': 0,
      'state.values[0].name': 'Dummy',
      'state.values[0].type': 0,
      'state.values[0].value': 0
    }));

    this.vals = 0;
  }

}

const dummy = new Dummy();

/***/ }),

/***/ "./src/devices/15_dimmer.js":
/*!**********************************!*\
  !*** ./src/devices/15_dimmer.js ***!
  \**********************************/
/*! exports provided: dimmer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dimmer", function() { return dimmer; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Dimmer extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "getValueProps", vals => {
      const result = {};
      vals.forEach((val, i) => {
        if (!val) return;
        result['output_' + i] = [{
          name: `Output ${i}`,
          type: 'gpio',
          var: `params.outputs[${i}]`
        }, {
          type: 'button',
          value: 'X',
          click: (event, form) => {
            const conf = form.props.selected;
            conf.params.outputs.splice(i, 1);
            conf.state.values.splice(i, 1);
            this.vals--;
            form.props.config.groups.params = this.getFields(conf).params;
            form.forceUpdate();
          }
        }];
      });
      return result;
    });

    _defineProperty(this, "getFields", conf => {
      const outputs = conf.params ? conf.params.outputs || [] : [];
      return {
        params: {
          name: 'Config',
          configs: {
            gpio_zc: {
              name: 'GPIO ZC',
              type: 'gpio'
            },
            ...this.getValueProps(outputs),
            add: {
              value: 'Add Output',
              type: 'button',
              click: (event, form) => {
                conf.params.outputs.push(255);
                conf.state.values.push({
                  name: `SW${conf.state.values.length + 1}`
                });
                form.props.config.groups.params = this.getFields(conf).params;
                this.vals++;
                form.forceUpdate();
              }
            }
          }
        }
      };
    });

    _defineProperty(this, "defaults", () => ({
      'params.outputs[0]': 255,
      'params.gpio_zc': 255,
      'state.values[0].name': 'SW1',
      'state.values[1].name': 'SW2'
    }));

    this.vals = 0;
  }

}

const dimmer = new Dimmer();

/***/ }),

/***/ "./src/devices/16_udp_server.js":
/*!**************************************!*\
  !*** ./src/devices/16_udp_server.js ***!
  \**************************************/
/*! exports provided: udp_server */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "udp_server", function() { return udp_server; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class UdpServer extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "getValueProps", vals => {
      const result = {};
      vals.forEach((val, i) => {
        if (!val) return;
        result['output_' + i] = [{
          name: `Var ${i}`,
          type: 'select',
          options: [{
            name: 'Byte',
            value: 1
          }, {
            name: 'Int16',
            value: 2
          }],
          var: `params.packet[${i}]`
        }, {
          name: 'Name',
          type: 'string',
          var: `state.values[${i}].name`
        }, {
          type: 'button',
          value: 'X',
          click: (event, form) => {
            const conf = form.props.selected;
            conf.params.packet.splice(i, 1);
            conf.state.values.splice(i, 1);
            this.vals--;
            const {
              params,
              packet
            } = this.getFields(conf);
            form.props.config.groups.params = params;
            form.props.config.groups.packet = packet;
            form.forceUpdate();
          }
        }];
      });
      return result;
    });

    _defineProperty(this, "getFields", conf => {
      const packet = conf.params ? conf.params.packet || [] : [];
      return {
        params: {
          name: 'Config',
          configs: {
            port: {
              name: 'Port',
              type: 'number'
            }
          }
        },
        packet: {
          name: 'Packet',
          configs: { ...this.getValueProps(packet),
            add: {
              value: 'Add Variable',
              type: 'button',
              click: (event, form) => {
                conf.params.packet.push(1);
                conf.state.values.push({
                  name: `Var${conf.state.values.length + 1}`
                });
                const {
                  params,
                  packet
                } = this.getFields(conf);
                form.props.config.groups.params = params;
                form.props.config.groups.packet = packet;
                this.vals++;
                form.forceUpdate();
              }
            }
          }
        }
      };
    });

    _defineProperty(this, "defaults", () => ({
      'params.packet[0]': 1,
      'params.port': 5000,
      'state.values[0].name': 'Var1'
    }));

    this.vals = 0;
  }

}

const udp_server = new UdpServer();

/***/ }),

/***/ "./src/devices/18_digital_input.js":
/*!*****************************************!*\
  !*** ./src/devices/18_digital_input.js ***!
  \*****************************************/
/*! exports provided: digital_input */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "digital_input", function() { return digital_input; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class DigitalInput extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => {
      return {
        'params.gpio': 255,
        'params.invert': false,
        interval: 60,
        'state.values[0].name': 'Switch',
        'state.values[0].type': '0'
      };
    });

    this.params = {
      name: 'Configuration',
      configs: {
        gpio: {
          name: 'GPIO',
          type: 'gpio'
        },
        invert: {
          name: 'Invert',
          type: 'checkbox'
        },
        interval: {
          name: 'Interval',
          type: 'number'
        }
      }
    };
    this.gpio = {
      name: 'GPIO Settings (global)',
      configs: {}
    };
    this.vals = 1;
  }

}

const digital_input = new DigitalInput();

/***/ }),

/***/ "./src/devices/1_switch.js":
/*!*********************************!*\
  !*** ./src/devices/1_switch.js ***!
  \*********************************/
/*! exports provided: inputSwitch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inputSwitch", function() { return inputSwitch; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class InputSwitch extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => {
      return {
        'params.gpio': 255,
        'params.invert': false,
        interval: 60,
        'state.values[0].name': 'Switch',
        'state.values[0].type': '0'
      };
    });

    this.params = {
      name: 'Configuration',
      configs: {
        gpio: {
          name: 'GPIO',
          type: 'gpio'
        },
        invert: {
          name: 'Invert',
          type: 'checkbox'
        }
      }
    };
    this.gpio = {
      name: 'GPIO Settings (global)',
      configs: {}
    };
    this.vals = 1;
  }

}

const inputSwitch = new InputSwitch();

/***/ }),

/***/ "./src/devices/2_dht.js":
/*!******************************!*\
  !*** ./src/devices/2_dht.js ***!
  \******************************/
/*! exports provided: dht */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dht", function() { return dht; });
const sensorModel = [{
  value: 0,
  name: 'DHT11'
}, {
  value: 1,
  name: 'DHT22'
}, {
  value: 12,
  name: 'DHT12'
}, {
  value: 23,
  name: 'Sonoff am2301'
}, {
  value: 70,
  name: 'Sonoff si7021'
}];
const dht = {
  defaults: () => ({
    'params.gpio': 255,
    'params.type': 0,
    'state.values[0].name': 'Temperature',
    'state.values[0].type': '2',
    'state.values[1].name': 'Humidity',
    'state.values[1].type': '2'
  }),
  params: {
    name: 'Configuration',
    configs: {
      gpio: {
        name: 'GPIO Data',
        type: 'gpio'
      },
      type: {
        name: 'Sensor model',
        type: 'select',
        options: sensorModel
      },
      interval: {
        name: 'Interval',
        type: 'number'
      }
    }
  },
  data: false,
  vals: 2
};

/***/ }),

/***/ "./src/devices/3_bmx280.js":
/*!*********************************!*\
  !*** ./src/devices/3_bmx280.js ***!
  \*********************************/
/*! exports provided: bmx280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bmx280", function() { return bmx280; });
const i2c_address = [{
  value: 118,
  name: '0x76 (118) - (default)'
}, {
  value: 119,
  name: '0x77 (119)'
}];
const bmx280 = {
  defaults: () => ({
    'state.values[0].name': 'Temperature',
    'state.values[0].type': '2',
    'state.values[1].name': 'Humidity',
    'state.values[1].type': '2',
    'state.values[2].name': 'Pressure',
    'state.values[2].type': '2'
  }),
  sensor: {
    name: 'Sensor',
    configs: {
      i2c_address: {
        name: 'I2C Address',
        type: 'select',
        options: i2c_address
      },
      altitude: {
        name: 'Altitude',
        type: 'number'
      },
      offset: {
        name: 'Temperature Offset',
        type: 'number'
      }
    }
  },
  vals: 3
};

/***/ }),

/***/ "./src/devices/4_ds18b20.js":
/*!**********************************!*\
  !*** ./src/devices/4_ds18b20.js ***!
  \**********************************/
/*! exports provided: ds18b20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ds18b20", function() { return ds18b20; });
const ds18b20 = {
  defaults: () => ({
    gpio: 255,
    'state.values[0].name': 'Temperature',
    'state.values[0].type': '2'
  }),
  params: {
    name: 'Sensor',
    configs: {
      gpio: {
        name: 'GPIO',
        type: 'gpio'
      },
      interval: {
        name: 'Interval',
        type: 'number'
      }
    }
  },
  vals: 1
};

/***/ }),

/***/ "./src/devices/5_level_control.js":
/*!****************************************!*\
  !*** ./src/devices/5_level_control.js ***!
  \****************************************/
/*! exports provided: levelControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "levelControl", function() { return levelControl; });
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/utils */ "./src/lib/utils.js");

const levelControl = {
  defaults: () => ({
    'state.values[0].name': 'Output',
    'state.values[0].type': '1'
  }),
  params: {
    name: 'Configuration',
    configs: {
      device: {
        name: 'Check Device',
        type: 'select',
        options: _lib_utils__WEBPACK_IMPORTED_MODULE_0__["getTasks"]
      },
      value: {
        name: 'Check Value',
        type: 'select',
        options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__["getTaskValues"])('params.device')
      },
      level: {
        name: 'Set Level',
        type: 'number'
      },
      hysteresis: {
        name: 'Hysteresis',
        type: 'number'
      },
      interval: {
        name: 'Interval',
        type: 'number'
      }
    }
  },
  vals: 1
};

/***/ }),

/***/ "./src/devices/6_analog.js":
/*!*********************************!*\
  !*** ./src/devices/6_analog.js ***!
  \*********************************/
/*! exports provided: analog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "analog", function() { return analog; });
const analog = {
  defaults: () => ({
    'params.gpio': 255,
    'params.interval': 60,
    'state.values[0].name': 'Analog',
    'state.values[0].type': '2'
  }),
  params: {
    name: 'Settings',
    configs: {
      gpio: {
        name: 'GPIO',
        type: 'select',
        options: () => window.io_pins.getPins('analog_in')
      },
      interval: {
        name: 'Interval',
        type: 'number',
        min: 0,
        max: 3600 * 24
      }
    }
  },
  data: false,
  vals: 1
};

/***/ }),

/***/ "./src/devices/7_ads1115.js":
/*!**********************************!*\
  !*** ./src/devices/7_ads1115.js ***!
  \**********************************/
/*! exports provided: ads1115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ads1115", function() { return ads1115; });
const i2cAddr = [{
  value: 72,
  name: '0x48'
}, {
  value: 73,
  name: '0x49'
}, {
  value: 74,
  name: '0x4A'
}, {
  value: 75,
  name: '0x4B'
}];
const adsMode = [{
  value: 0,
  name: 'continious'
}, {
  value: 1,
  name: 'single'
}];
const adsRate = [{
  value: 0,
  name: '8'
}, {
  value: 1,
  name: '16'
}, {
  value: 2,
  name: '32'
}, {
  value: 3,
  name: '64'
}, {
  value: 4,
  name: '128'
}, {
  value: 5,
  name: '250'
}, {
  value: 6,
  name: '475'
}, {
  value: 7,
  name: '860'
}];
const adsGain = [{
  value: 0,
  name: '+- 6.144V'
}, {
  value: 1,
  name: '+- 4.096V'
}, {
  value: 2,
  name: '+- 2.048V'
}, {
  value: 3,
  name: '+- 1.024V'
}, {
  value: 4,
  name: '+- 0.512V'
}, {
  value: 5,
  name: '+- 0.256V'
}];
const ads1115 = {
  defaults: () => ({
    'params.addr': 72,
    'params.mode': 1,
    'params.rate': 4,
    'params.gain': 2
  }),
  getDevicePins: conf => {
    return [...new Array(4)].map((x, i) => ({
      name: `${conf.name} GPIO${i}`,
      value: i,
      capabilities: ['analog_in']
    }));
  },
  params: {
    name: 'Sensor',
    configs: {
      addr: {
        name: 'Address',
        type: 'select',
        options: i2cAddr
      },
      mode: {
        name: 'Mode',
        type: 'select',
        options: adsMode
      },
      rate: {
        name: 'Rate',
        type: 'select',
        options: adsRate
      },
      gain: {
        name: 'Gain',
        type: 'select',
        options: adsGain
      }
    }
  }
};

/***/ }),

/***/ "./src/devices/8_mcp23017.js":
/*!***********************************!*\
  !*** ./src/devices/8_mcp23017.js ***!
  \***********************************/
/*! exports provided: mcp23017 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mcp23017", function() { return mcp23017; });
const i2cAddr = [{
  value: 0,
  name: 'Disabled'
}, {
  value: 1,
  name: 'Active on LOW'
}];
const mcp23017 = {
  defaults: () => ({
    gpio1: 255,
    gpio2: 255,
    'settings.values[0].name': 'Tag'
  }),
  params: {
    name: 'Sensor',
    configs: {
      addr: {
        name: 'Address',
        type: 'select',
        options: i2cAddr
      }
    }
  },
  data: true
};

/***/ }),

/***/ "./src/devices/9_pcf8574.js":
/*!**********************************!*\
  !*** ./src/devices/9_pcf8574.js ***!
  \**********************************/
/*! exports provided: pcf8574 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pcf8574", function() { return pcf8574; });
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defs */ "./src/devices/_defs.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const i2cAddr = [{
  value: 32,
  name: '0x20'
}, {
  value: 33,
  name: '0x21'
}, {
  value: 34,
  name: '0x22'
}, {
  value: 35,
  name: '0x23'
}];
const typeOptions = [{
  value: 0,
  name: 'pcf8574'
}, {
  value: 1,
  name: 'pcf8575'
}];
const pinBootStates = [{
  value: 0,
  name: 'LOW'
}, {
  value: 1,
  name: 'HIGH'
}];

class PCF8574 extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => ({
      'params.addr': 56
    }));

    _defineProperty(this, "getDevicePins", (conf, plugin) => {
      const n = conf.params.type ? 16 : 8;
      return [...new Array(n)].map((x, i) => ({
        name: `${conf.name} GPIO${i}`,
        value: i,
        capabilities: ['digital_in', 'digital_out'],
        configs: {
          boot_state: {
            name: `Pin ${i} boot state`,
            type: 'select',
            options: pinBootStates,
            var: `ROOT.plugins[${plugin}].pins.${i}`
          }
        }
      }));
    });

    this.params = {
      name: 'Sensor',
      configs: {
        addr: {
          name: 'Address',
          type: 'select',
          options: i2cAddr
        },
        type: {
          name: 'Type',
          type: 'select',
          options: typeOptions
        }
      }
    };
    this.pins = {
      name: 'Pin Configuration',
      configs: {}
    };

    for (let i = 0; i < 16; i++) {
      if (i < 8) this.pins.configs[i] = {
        name: `Pin ${i} boot state`,
        type: 'select',
        options: pinBootStates
      };else this.pins.configs[i] = {
        name: `Pin ${i} boot state`,
        type: 'select',
        if: 'params.type',
        ifval: 1,
        options: pinBootStates
      };
    }
  }

}

const pcf8574 = new PCF8574();

/***/ }),

/***/ "./src/devices/_defs.js":
/*!******************************!*\
  !*** ./src/devices/_defs.js ***!
  \******************************/
/*! exports provided: Device */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Device", function() { return Device; });
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");

class Device {
  constructor() {
    this.vals = 0;
    this.data = false;
    this.params = {};
  }

  defaults() {
    return [];
  }

  getDevicePins() {
    return [];
  }

  getDeviceUsedPins(plugin) {
    const pins = [];
    if (plugin.params.gpio) pins.push(plugin.params.gpio);
    if (plugin.params.gpio1) pins.push(plugin.params.gpio1);
    if (plugin.params.gpio2) pins.push(plugin.params.gpio2);
    if (plugin.params.gpio3) pins.push(plugin.params.gpio3);
    if (plugin.params.gpio4) pins.push(plugin.params.gpio4);
    return pins;
  }

}

/***/ }),

/***/ "./src/devices/index.js":
/*!******************************!*\
  !*** ./src/devices/index.js ***!
  \******************************/
/*! exports provided: devices */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "devices", function() { return devices; });
/* harmony import */ var _1_switch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./1_switch */ "./src/devices/1_switch.js");
/* harmony import */ var _2_dht__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./2_dht */ "./src/devices/2_dht.js");
/* harmony import */ var _3_bmx280__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./3_bmx280 */ "./src/devices/3_bmx280.js");
/* harmony import */ var _4_ds18b20__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./4_ds18b20 */ "./src/devices/4_ds18b20.js");
/* harmony import */ var _5_level_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./5_level_control */ "./src/devices/5_level_control.js");
/* harmony import */ var _9_pcf8574__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./9_pcf8574 */ "./src/devices/9_pcf8574.js");
/* harmony import */ var _8_mcp23017__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./8_mcp23017 */ "./src/devices/8_mcp23017.js");
/* harmony import */ var _7_ads1115__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./7_ads1115 */ "./src/devices/7_ads1115.js");
/* harmony import */ var _6_analog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./6_analog */ "./src/devices/6_analog.js");
/* harmony import */ var _10_pca9685__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./10_pca9685 */ "./src/devices/10_pca9685.js");
/* harmony import */ var _11_mqtt__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./11_mqtt */ "./src/devices/11_mqtt.js");
/* harmony import */ var _12_rotary_encoder__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./12_rotary_encoder */ "./src/devices/12_rotary_encoder.js");
/* harmony import */ var _13_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./13_http */ "./src/devices/13_http.js");
/* harmony import */ var _14_dummy__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./14_dummy */ "./src/devices/14_dummy.js");
/* harmony import */ var _15_dimmer__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./15_dimmer */ "./src/devices/15_dimmer.js");
/* harmony import */ var _16_udp_server__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./16_udp_server */ "./src/devices/16_udp_server.js");
/* harmony import */ var _18_digital_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./18_digital_input */ "./src/devices/18_digital_input.js");
















 // import { bmp085 } from './6_bmp085';
// import { pcf8591 } from './7_pcf8591';
// import { rfidWeigand } from './8_rfid';
// import { inputMcp } from './9_io_mcp';
// import { bh1750 } from './10_light_lux';
// import { pme } from './11_pme';
// import { lcd2004 } from './12_lcd';
// import { hcsr04 } from './13_hcsr04';
// import { si7021 } from './14_si7021';
// import { tls2561 } from './15_tls2561';
// import { pn532 } from './17_pn532';
// import { dust } from './18_dust';
// import { pcf8574 } from './19_pcf8574';
// import { ser2net } from './20_ser2net';
// import { levelControl } from './21_level_control';
// import { pca9685 } from './22_pca9685';
// import { oled1306 } from './23_oled1306';
// import { mlx90614 } from './24_mlx90614';
// import { ads1115 } from './25_ads1115';
// import { systemInfo } from './26_system_info';
// import { ina219 } from './27_ina219';
// import { bmx280 } from './28_bmx280';
// import { mqttDomoticz } from './29_mqtt_domoticz';
// import { bmp280 } from './30_bmp280';
// import { sht1x } from './31_sht1x';
// import { ms5611 } from './32_ms5611';
// import { dummyDevice } from './33_dummy_device';
// import { dht12 } from './34_dht12';
// import { sh1106 } from './36_sh1106';
// import { mqttImport } from './37_mqtt_import';
// import { neopixelBasic } from './38_neopixel_basic';
// import { thermocouple } from './39_thermocouple';
// import { neopixelClock } from './41_neopixel_clock';
// import { neopixelCandle } from './42_neopixel_candle';
// import { clock } from './43_output_clock';
// import { wifiGateway } from './44_wifi_gateway';
// import { mhz19 } from './49_mhz19';
// import { senseAir } from './52_senseair';
// import { sds011 } from './56_sds011';
// import { rotaryEncoder } from './59_rotary_encoder';
// import { ttp229 } from './63_ttp229';

const devices = [{
  name: '- None -',
  value: 0,
  fields: []
}, {
  name: 'Generic - Digital Output',
  value: 1,
  fields: _1_switch__WEBPACK_IMPORTED_MODULE_0__["inputSwitch"]
}, {
  name: 'Environment - DHT11/12/22  SONOFF2301/7021',
  value: 2,
  fields: _2_dht__WEBPACK_IMPORTED_MODULE_1__["dht"]
}, {
  name: 'Environment - BME280/BMP280',
  value: 3,
  fields: _3_bmx280__WEBPACK_IMPORTED_MODULE_2__["bmx280"]
}, {
  name: 'Environment - DS18b20',
  value: 4,
  fields: _4_ds18b20__WEBPACK_IMPORTED_MODULE_3__["ds18b20"]
}, {
  name: 'Generic - Level Control',
  value: 5,
  fields: _5_level_control__WEBPACK_IMPORTED_MODULE_4__["levelControl"]
}, {
  name: 'Generic - Analog Input',
  value: 6,
  fields: _6_analog__WEBPACK_IMPORTED_MODULE_8__["analog"]
}, {
  name: 'IO - ADS1115',
  value: 7,
  fields: _7_ads1115__WEBPACK_IMPORTED_MODULE_7__["ads1115"]
}, {
  name: 'IO - MCP23017',
  value: 8,
  fields: _8_mcp23017__WEBPACK_IMPORTED_MODULE_6__["mcp23017"]
}, {
  name: 'IO - PCF8574',
  value: 9,
  fields: _9_pcf8574__WEBPACK_IMPORTED_MODULE_5__["pcf8574"]
}, {
  name: 'IO - PCA9685',
  value: 10,
  fields: _10_pca9685__WEBPACK_IMPORTED_MODULE_9__["pca9685"]
}, {
  name: 'Generic - MQTT',
  value: 11,
  fields: _11_mqtt__WEBPACK_IMPORTED_MODULE_10__["mqtt"]
}, {
  name: 'Generic - Rotary Encoder',
  value: 12,
  fields: _12_rotary_encoder__WEBPACK_IMPORTED_MODULE_11__["rotaryEncoder"]
}, {
  name: 'Generic - HTTP',
  value: 13,
  fields: _13_http__WEBPACK_IMPORTED_MODULE_12__["http"]
}, {
  name: 'Generic - Dummy Device',
  value: 14,
  fields: _14_dummy__WEBPACK_IMPORTED_MODULE_13__["dummy"]
}, {
  name: 'Generic - Dimmer',
  value: 15,
  fields: _15_dimmer__WEBPACK_IMPORTED_MODULE_14__["dimmer"]
}, {
  name: 'Generic - UDP Server',
  value: 16,
  fields: _16_udp_server__WEBPACK_IMPORTED_MODULE_15__["udp_server"]
}, {
  name: 'Generic - Digital Input',
  value: 18,
  fields: _18_digital_input__WEBPACK_IMPORTED_MODULE_16__["digital_input"]
}].sort((a, b) => a.name.localeCompare(b.name));

/***/ }),

/***/ "./src/lib/config.js":
/*!***************************!*\
  !*** ./src/lib/config.js ***!
  \***************************/
/*! exports provided: loadConfig, saveConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadConfig", function() { return loadConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveConfig", function() { return saveConfig; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _esp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esp */ "./src/lib/esp.js");
/* harmony import */ var _pages_floweditor_nodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/floweditor/nodes */ "./src/pages/floweditor/nodes/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/lib/utils.js");





const prepareAlerts = () => {
  const alerting = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('alerting');
  if (!alerting || !alerting.enabled) return;
  const alerts = alerting.alerts.map(alert => {
    const trigger = `\xFF\xFE\x00\xFF\x00${String.fromCharCode(alert.triggers.length)}`;
    alert.triggers.forEach(t => {
      trigger += `${String.fromCharCode(t.device)}${String.fromCharCode(t.value_id)}${String.fromCharCode(t.compare)})}\x01`;
      trigger += String.fromCharCode(t.value);
    });
    return trigger;
  }).join('\xFF') + '\xFF';
  return Object(_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('alerts.bin', alerts);
};

const prepareRules = async () => {
  const rules = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].editor.get('rules[0]', {});
  const renderedNodes = rules.nodes || [];
  const {
    connections
  } = rules; // find initial nodes (triggers);

  const triggers = renderedNodes.filter(node => {
    console.log(node);
    return node.group === 'TRIGGERS';
  });
  const eventMap = {
    'init': 0
  };
  const events = renderedNodes.filter(node => node.name === 'event').map((event, i) => ({
    value: i,
    name: event.params.event
  }));
  events.forEach(event => {
    eventMap[event.name] = event.value;
  });
  const nodes = Object(_pages_floweditor_nodes__WEBPACK_IMPORTED_MODULE_2__["getNodes"])();
  let result = ''; // for each initial node walk the tree and produce one 'rule'

  triggers.map(trigger => {
    const walkRule = rn => {
      const r = nodes.find(n => n.name == rn.name);
      const rules = r.toDsl ? r.toDsl(rn, {
        events
      }) : [];
      if (rules === null) return null;
      let ruleset = '';
      [...new Array(r.outputs)].map((x, outI) => {
        let rule = rules[outI] || r.type;
        let subrule = '';
        let out = connections.find(c => c.from == `node-${rn.id}-o-${outI}`);

        if (out) {
          let match = out.to.match(/node-(.*)-i-.*/);
          let outNode = renderedNodes.find(n => n.id == match[1]);
          if (outNode) subrule += walkRule(outNode);
        }

        if (rule.includes('%%output%%')) {
          rule = rule.replace('%%output%%', subrule);
        } else {
          rule += subrule;
        }

        ruleset += rule;
      });
      return ruleset;
    };

    const rule = walkRule(trigger);
    if (rule === null) return;
    result += rule + "\xFF";
  });
  const bytes = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["stringToAsciiByteArray"])(result);
  await Object(_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('events.json', JSON.stringify(eventMap));
  await Object(_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('rules.dat', new Uint8Array(bytes));
};

const loadConfig = async () => {
  const cfg = await fetch('/config.json').then(r => {
    _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].user(r.headers.get('user').replace(',', '').trim());
    return r.json();
  });
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].init(cfg);
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].events = await fetch('/events.json').then(r => r.json()).catch(r => []);
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].r1pins = pins;
  const editor_cfg = await fetch('/editor_config.json').then(r => r.ok ? r.json() : {});
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].editor.init(editor_cfg);
};
const saveConfig = async (config = true, editor = true, rules = true, alerts = true) => {
  if (config) await Object(_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('config.json', JSON.stringify(_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get()));
  if (editor) await Object(_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('editor_config.json', JSON.stringify(_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].editor.get()));
  if (rules) await prepareRules();
  if (alerts) await prepareAlerts();
};

/***/ }),

/***/ "./src/lib/esp.js":
/*!************************!*\
  !*** ./src/lib/esp.js ***!
  \************************/
/*! exports provided: fetchProgress, storeFile, deleteFile, loadDevices, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgress", function() { return fetchProgress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeFile", function() { return storeFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteFile", function() { return deleteFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadDevices", function() { return loadDevices; });
/* harmony import */ var mini_toastr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mini-toastr */ "./node_modules/mini-toastr/mini-toastr.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/lib/loader.js");


const fetchProgress = (url, opts = {}) => {
  return new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);

    for (var k in opts.headers || {}) xhr.setRequestHeader(k, opts.headers[k]);

    xhr.onload = e => res(e.target.responseText);

    xhr.onerror = rej;
    if (xhr.upload && opts.onProgress) xhr.upload.onprogress = opts.onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable

    xhr.send(opts.body);
  });
};
const storeFile = async (filename, data, onProgress) => {
  _loader__WEBPACK_IMPORTED_MODULE_1__["loader"].show();
  const file = data ? new File([new Blob([data])], filename) : filename;
  const fileName = data ? filename : file.name;
  return await fetchProgress(`/upload/${fileName}`, {
    method: 'post',
    body: file
  }, onProgress).then(() => {
    _loader__WEBPACK_IMPORTED_MODULE_1__["loader"].hide();
    mini_toastr__WEBPACK_IMPORTED_MODULE_0__["default"].success('Successfully saved to flash!', '', 5000);
  }, e => {
    _loader__WEBPACK_IMPORTED_MODULE_1__["loader"].hide();
    mini_toastr__WEBPACK_IMPORTED_MODULE_0__["default"].error(e.message, '', 5000);
  });
};
const deleteFile = async filename => {
  return await fetch('/delete/' + filename, {
    method: 'POST'
  }).then(() => {
    mini_toastr__WEBPACK_IMPORTED_MODULE_0__["default"].success('Successfully saved to flash!', '', 5000);
  }, e => {
    mini_toastr__WEBPACK_IMPORTED_MODULE_0__["default"].error(e.message, '', 5000);
  });
};
const loadDevices = async url => {
  return fetch(`${url || ''}/plugin_state/`).then(response => response.json()); //.then(response => response.Sensors);
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchProgress,
  storeFile,
  deleteFile,
  loadDevices
});

/***/ }),

/***/ "./src/lib/helpers.js":
/*!****************************!*\
  !*** ./src/lib/helpers.js ***!
  \****************************/
/*! exports provided: get, set, getKeys */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getKeys", function() { return getKeys; });
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/get */ "./node_modules/lodash/get.js");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "get", function() { return lodash_get__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/set */ "./node_modules/lodash/set.js");
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_set__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "set", function() { return lodash_set__WEBPACK_IMPORTED_MODULE_1___default.a; });

 // const get = (obj, path, defaultValue) => path.replace(/\[/g, '.').replace(/\]/g, '').split(".")
// .reduce((a, c) => (a && a[c] ? a[c] : (defaultValue || null)), obj)
// const set = (obj, path, value) => {
//     path.replace(/\[/g, '.').replace(/\]/g, '').split('.').reduce((a, c, i, src) => {
//         if (!a[c]) a[c] = {};
//         if (i === src.length - 1) a[c] = value;
//     }, obj)
// }

const getKeys = object => {
  const keys = [];

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return keys;
};



/***/ }),

/***/ "./src/lib/loader.js":
/*!***************************!*\
  !*** ./src/lib/loader.js ***!
  \***************************/
/*! exports provided: loader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loader", function() { return loader; });
class Loader {
  constructor() {
    this.loader = document.querySelector('.loading');
  }

  show() {
    this.loader.classList.add('show');
  }

  hide() {
    this.loader.classList.add('hide');
    setTimeout(() => {
      this.loader.classList.remove('hide');
      this.loader.classList.remove('show');
    }, 1000);
  }

}

const loader = new Loader();

/***/ }),

/***/ "./src/lib/menu.js":
/*!*************************!*\
  !*** ./src/lib/menu.js ***!
  \*************************/
/*! exports provided: menu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menu", function() { return menu; });
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pages */ "./src/pages/index.js");


const saveConfig = () => {
  window.location.href = '/config.json';
};

class Menus {
  constructor() {
    this.menus = [];
    this.routes = [];

    this.addMenu = menu => {
      this.menus.push(menu);
      this.addRoute(menu);
    };

    this.addRoute = route => {
      this.routes.push(route);

      if (route.children) {
        route.children.forEach(child => {
          child.parent = route;
          this.routes.push(child);
        });
      }
    };
  }

}

const menus = [{
  title: 'Dashboard',
  href: 'dashboard',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DashboardPage"],
  children: []
}, {
  title: 'Devices',
  href: 'devices',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DevicesPage"],
  children: []
}, //{ title: 'Controllers', href: 'controllers', component: ControllersPage, children: [] },
//{ title: 'Automation', href: 'rules', component: RulesEditorPage, class: 'full', children: [] },
{
  title: 'Automation',
  href: 'rules',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["RulesEditorPage"],
  class: 'full',
  children: []
}, {
  title: 'Alexa',
  href: 'alexa',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ControllerAlexaPage"],
  children: []
}, {
  title: 'Alerts',
  href: 'alerts',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["AlertsPage"],
  children: []
}, {
  title: 'Config',
  adminOnly: true,
  href: 'config',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigPage"],
  children: [{
    title: 'Hardware',
    pagetitle: 'Hardware',
    href: 'config/hardware',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigHardwarePage"]
  }, {
    title: 'LCD',
    pagetitle: 'LCD',
    href: 'config/lcd',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigLCDPage"]
  }, {
    title: 'Bluetooth',
    pagetitle: 'Bluetooth',
    href: 'config/bluetooth',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigBluetoothPage"]
  }, {
    title: 'Advanced',
    href: 'config/advanced',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigAdvancedPage"]
  }, {
    title: 'Plugins',
    href: 'config/plugins',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigPluginsPage"]
  }, {
    title: 'Save',
    href: 'config/save',
    action: saveConfig
  }, {
    title: 'Load',
    href: 'config/load',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["LoadPage"]
  }, {
    title: 'Reboot',
    href: 'config/reboot',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["RebootPage"]
  }, {
    title: 'Factory Reset',
    href: 'config/factory',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["FactoryResetPage"]
  }]
}, {
  title: 'Tools',
  adminOnly: true,
  href: 'tools',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ToolsPage"],
  children: [{
    title: 'Discover',
    href: 'tools/discover',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["DiscoverPage"]
  }, {
    title: 'Info',
    href: 'tools/sysinfo',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["SysVarsPage"]
  }, {
    title: 'Update',
    href: 'tools/update',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["UpdatePage"]
  }, {
    title: 'Filesystem',
    href: 'tools/fs',
    component: _pages__WEBPACK_IMPORTED_MODULE_0__["FSPage"]
  }]
}];
const routes = [{
  title: 'Edit Device',
  href: 'devices/edit',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DevicesEditPage"]
}, {
  title: 'Edit Alert',
  href: 'alerts/edit',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["AlertsEditPage"]
}, {
  title: 'Edit Screen',
  href: 'config/lcdscreen',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigLCDScreenPage"]
}, {
  title: 'Edit Widget',
  href: 'config/lcdwidget',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ConfigLCDWidgetPage"]
}, {
  title: 'Save to Flash',
  href: 'tools/diff',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DiffPage"]
}, {
  title: 'Setup',
  href: 'config/setup',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["SetupPage"]
}];
const menu = new Menus();
routes.forEach(menu.addRoute);
menus.forEach(menu.addMenu);


/***/ }),

/***/ "./src/lib/pins.js":
/*!*************************!*\
  !*** ./src/lib/pins.js ***!
  \*************************/
/*! exports provided: ioPins, pins */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ioPins", function() { return ioPins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pins", function() { return pins; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../devices */ "./src/devices/index.js");



function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};

  for (key in o) {
    v = o[key];
    output[key] = typeof v === "object" ? copy(v) : v;
  }

  return output;
}

const pinState = [{
  name: 'Default',
  value: 0
}, {
  name: 'Low',
  value: 1
}, {
  name: 'High',
  value: 2
}, {
  name: 'Input',
  value: 3
}];

class IO_PINS {
  constructor() {
    this.digitalPins = [{
      name: '-- select --',
      value: 255,
      capabilities: ['digital_in', 'analog_in', 'digital_out', 'analog_out'],
      configs: {}
    }];

    for (let i = 0; i < 40; i++) {
      if ([6, 7, 8, 9, 10, 11].includes(i)) continue; // SPI flash pins

      const pin = {
        name: `ESP32 GPIO${i}`,
        value: i,
        capabilities: ['core', 'digital_in'],
        configs: {}
      };

      if (pin.value < 32) {
        pin.configs.pull_up = {
          name: `Pin ${pin.value} pull up`,
          type: 'checkbox'
        };
        pin.configs.boot_state = {
          name: `Pin ${pin.value} boot state`,
          type: 'select',
          options: pinState,
          var: `ROOT.hardware.gpio.${pin.value}`
        };
        pin.capabilities.push('digital_out');
      } else {
        pin.capabilities.push('analog_in');
      }

      this.digitalPins.push(pin);
    }
  }

  setUsedPins(allPins) {
    const resetPin = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.reset.pin');
    if (resetPin) allPins.find(ap => ap.value == resetPin).disabled = "RESET";
    const ledPin = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.led.gpio');
    if (ledPin) allPins.find(ap => ap.value == ledPin).disabled = "LED";
    const i2c = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.i2c');

    if (i2c && i2c["enabled"]) {
      if (i2c["scl"]) allPins.find(ap => ap.value == i2c["scl"]).disabled = "I2C";
      if (i2c["sda"]) allPins.find(ap => ap.value == i2c["sda"]).disabled = "I2C";
    }

    const sdcard = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.spi');

    if (sdcard && sdcard['enabled']) {
      [2, 4, 12, 13, 14, 15].forEach(x => {
        allPins.find(ap => ap.value == x).disabled = "SPI";
      });
    }

    const plugins = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins');
    plugins.filter(p => p).forEach(cur => {
      const plugin = _devices__WEBPACK_IMPORTED_MODULE_1__["devices"].find(d => d.value === cur.type).fields;

      if (plugin.getDeviceUsedPins) {
        const pins = plugin.getDeviceUsedPins(cur);
        pins.forEach(p => {
          allPins.find(ap => ap.value == p).disabled = cur.name;
        });
      }
    }, []);
  }

  getInterruptPins() {
    const hwpins = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.gpio') || [];
    return this.digitalPins.filter(p => hwpins[p.value] && hwpins[p.value].interrupt && hwpins[p.value].mode == 3);
  }

  getPins(capabilities) {
    if (capabilities === 'interrupt') return this.getInterruptPins();
    const plugins = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins');
    const startPins = copy(this.digitalPins);
    let lastNr = startPins[startPins.length - 1].value;
    const pins = plugins.reduce((acc, cur, i) => {
      if (!cur) return acc;
      const plugin = _devices__WEBPACK_IMPORTED_MODULE_1__["devices"].find(d => d.value === cur.type).fields;

      if (plugin.getDevicePins) {
        const pins = plugin.getDevicePins(cur, i);
        pins.forEach(p => {
          p.value = ++lastNr;
          acc.push(p);
        });
      }

      return acc;
    }, [...startPins]);
    this.setUsedPins(pins);
    const cs = Array.isArray(capabilities) ? capabilities : [capabilities];
    return pins.filter(pin => cs.every(c => pin.capabilities.includes(c)));
  }

}

const ioPins = window.io_pins = new IO_PINS();
const pins = window.pins = () => {
  return ioPins.getPins(['digital_in', 'digital_out']);
};

/***/ }),

/***/ "./src/lib/plugins.js":
/*!****************************!*\
  !*** ./src/lib/plugins.js ***!
  \****************************/
/*! exports provided: firePageLoad, loadPlugins */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "firePageLoad", function() { return firePageLoad; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadPlugins", function() { return loadPlugins; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _esp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esp */ "./src/lib/esp.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loader */ "./src/lib/loader.js");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu */ "./src/lib/menu.js");





const dynamicallyLoadScript = url => {
  return new Promise(resolve => {
    var script = document.createElement("script"); // create a script DOM node

    script.src = url; // set its src to the provided URL

    script.onreadystatechange = resolve;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  });
};

const onPageLoadHandlers = [];
const page = {
  appendStyles: url => {
    return new Promise(resolve => {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';

      link.onload = () => {
        resolve();
      };

      link.href = url;

      if (!document.querySelector('link[href="' + url + '"]')) {
        let headScript = document.querySelector('head');
        headScript.append(link);
      }
    });
  },
  appendScript: dynamicallyLoadScript,
  onLoad: fn => {
    onPageLoadHandlers.push(fn);
  }
};

const getPluginAPI = () => {
  return {
    settings: _settings__WEBPACK_IMPORTED_MODULE_0__["settings"],
    loader: _loader__WEBPACK_IMPORTED_MODULE_2__["loader"],
    menu: _menu__WEBPACK_IMPORTED_MODULE_3__["menu"],
    esp: _esp__WEBPACK_IMPORTED_MODULE_1__["default"],
    page
  };
};

window.getPluginAPI = getPluginAPI;
const firePageLoad = () => {
  onPageLoadHandlers.forEach(h => h());
};
const loadPlugins = async () => {
  return Promise.all(_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].editor.get('ui_plugins', []).filter(p => p.enabled).map(async plugin => {
    return dynamicallyLoadScript(plugin.url);
  }));
};

/***/ }),

/***/ "./src/lib/settings.js":
/*!*****************************!*\
  !*** ./src/lib/settings.js ***!
  \*****************************/
/*! exports provided: settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return settings; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/lib/helpers.js");


const diff = (obj1, obj2, path = '') => {
  const keys = [...new Set([...Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getKeys"])(obj1), ...Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getKeys"])(obj2)])];
  return keys.map(key => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    if (val1 instanceof Object && val2 instanceof Object) return diff(val1, val2, path ? `${path}.${key}` : key);else if (val1 !== val2) {
      return [{
        path: `${path}.${key}`,
        val1,
        val2
      }];
    } else return [];
  }).flat();
};

class Settings {
  init(settings) {
    this.settings = settings;
    this.apply();
  }

  user(userName) {
    this.userName = userName;
  }

  get(prop = -1, d = null) {
    if (prop === -1) return this.settings;
    return Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["get"])(this.settings, prop, d);
  }
  /**
   * sets changes to the current version and sets changed flag
   * @param {*} prop 
   * @param {*} value 
   */


  set(prop, value) {
    const obj = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["get"])(this.settings, prop);

    if (typeof obj === 'object') {
      console.warn('settings an object!');
      Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["set"])(this.settings, prop, value);
    } else {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["set"])(this.settings, prop, value);
    }

    if (this.diff().length) this.changed = true;
  } // getRules() {
  //     return this.rules;
  // }
  // setRules(rules) {
  //     this.storedRules = JSON.parse(JSON.stringify(rules));
  //     this.rulesChanged = false;
  // }

  /**
   * returns diff between applied and current version
   */


  diff() {
    return diff(this.stored, this.settings);
  }
  /***
   * applys changes and creates new version in localStorage
   */


  apply() {
    this.stored = JSON.parse(JSON.stringify(this.settings));
    this.changed = false;
  }

}

const settings = window.settings1 = new Settings();
settings.editor = new Settings();


/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/*! exports provided: getTasks, getTaskValues, getTaskValueType, stringToAsciiByteArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTasks", function() { return getTasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTaskValues", function() { return getTaskValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTaskValueType", function() { return getTaskValueType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringToAsciiByteArray", function() { return stringToAsciiByteArray; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/lib/helpers.js");


const getTasks = () => {
  return _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins').filter(p => p).map((p, i) => ({
    value: p.id,
    name: p.name
  }));
};
const getTaskValues = path => {
  return config => {
    const selectedTask = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(config, path);
    const task = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins').find(p => p.id === selectedTask);
    if (!task || !task.state || !task.state.values) return [];
    return task.state.values.filter(val => val).map((val, i) => ({
      value: i,
      name: val.name
    }));
  };
};
const getTaskValueType = (taskPath, valuePath, type) => {
  return config => {
    const selectedTask = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(config, taskPath);
    const task = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins').find(p => p.id === selectedTask);
    if (!task || !task.state || !task.state.values) return false;
    const selectedValue = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(config, valuePath);
    const value = task.state.values[selectedValue];
    if (!value) return false;
    return value.type == type;
  };
};
function stringToAsciiByteArray(str) {
  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    var charCode = str.charCodeAt(i);

    if (charCode > 0xFF) // char > 1 byte since charCodeAt returns the UTF-16 value
      {
        throw new Error('Character ' + String.fromCharCode(charCode) + ' can\'t be represented by a US-ASCII byte.');
      }

    bytes.push(charCode);
  }

  return bytes;
}

/***/ }),

/***/ "./src/pages/alerts.edit.js":
/*!**********************************!*\
  !*** ./src/pages/alerts.edit.js ***!
  \**********************************/
/*! exports provided: AlertsEditPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertsEditPage", function() { return AlertsEditPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils */ "./src/lib/utils.js");




const baseFields = {
  enabled: {
    name: 'Enabled',
    type: 'checkbox',
    var: 'enabled'
  },
  name: {
    name: 'Name',
    type: 'string',
    var: 'name'
  },
  description: {
    name: 'Description',
    type: 'string',
    var: 'description'
  },
  icon: {
    name: 'Icon',
    type: 'string',
    var: 'icon'
  },
  icon: {
    name: 'Severity',
    type: 'number',
    min: 1,
    max: 10,
    var: 'severity'
  }
};
const compareOptions = [{
  name: '=',
  value: 0
}, {
  name: '>',
  value: 1
}, {
  name: '<',
  value: 2
}, {
  name: '<>',
  value: 3
}];

const getFormConfig = (config, form) => {
  const triggers = {};
  config.triggers.forEach((trigger, i) => {
    triggers[`${i}_check`] = [{
      name: 'Check Device',
      type: 'select',
      value: trigger.device,
      options: _lib_utils__WEBPACK_IMPORTED_MODULE_3__["getTasks"],
      var: `triggers[${i}].device`
    }, {
      name: 'Check Value',
      type: 'select',
      value: trigger.value_id,
      options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_3__["getTaskValues"])(`triggers[${i}].device`),
      var: `alerts[${i}].value_id`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.triggers.splice(i, 1);
        form.forceUpdate();
      }
    }];
    triggers[`${i}_compare`] = [{
      name: 'Comparison',
      type: 'select',
      value: trigger.compare,
      options: compareOptions,
      var: `triggers[${i}].compare`
    }, {
      name: 'Value',
      type: 'string',
      value: trigger.value,
      var: `triggers[${i}].value`
    }, {}];
  });
  return {
    groups: {
      settings: {
        name: 'Alert Settings',
        configs: { ...baseFields
        }
      },
      triggers: {
        name: 'Conditions',
        configs: { ...triggers,
          add: {
            type: 'button',
            value: 'add condition',
            click: () => {
              form.addTrigger();
            }
          }
        }
      }
    }
  };
};

class AlertsEditPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`alerting.alerts[${props.params[0]}]`);

    this.addTrigger = () => {
      this.config.triggers.push({});
      this.forceUpdate();
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.config, this);

    if (!formConfig) {
      alert('something went wrong, cant edit device');
      window.location.href = '#alerts';
    }

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    });
  }

}

/***/ }),

/***/ "./src/pages/alerts.js":
/*!*****************************!*\
  !*** ./src/pages/alerts.js ***!
  \*****************************/
/*! exports provided: AlertsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertsPage", function() { return AlertsPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../devices */ "./src/devices/index.js");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");
/* harmony import */ var mini_toastr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mini-toastr */ "./node_modules/mini-toastr/mini-toastr.js");





const user = "admin";

const firstFreeKey = (array, key = 'id') => {
  let i = 0;

  while (array.find(e => e && e[key] == i)) i++;

  return i;
};

class AlertsPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      config: _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('alerting')
    };

    if (!this.state.config) {
      this.state.config = {
        alerts: [],
        enabled: false
      };
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set('alerting', this.state.config);
    }

    this.handleEnableToggle = e => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
    };

    this.addAlert = () => {
      const newAlert = {
        id: firstFreeKey(this.state.config.alerts),
        severity: 10,
        name: 'new alert',
        enabled: false,
        triggers: []
      };
      this.state.config.alerts.push(newAlert);
      window.location.hash = `#alerts/edit/${this.state.config.alerts.length - 1}`;
    };

    this.deleteAlert = i => {
      this.state.config.alerts.splice(i, 1);
      this.forceUpdate();
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addAlert
    }, "add alert")), this.state.config.alerts.map((alert, i) => {
      const editUrl = `#alerts/edit/${i}`;
      const enabledProp = `alerting.alerts[${i}].enabled`;
      const iconClass = `${alert.icon}`;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "icon"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: iconClass
      })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "body"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, i + 1, ": ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        type: "checkbox",
        defaultChecked: alert.enabled,
        "data-prop": enabledProp,
        onChange: this.handleEnableToggle
      }), "\xA0\xA0", alert.name, " [", alert.description, "]", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: editUrl
      }, "edit"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        onClick: () => {
          this.deleteAlert(i);
        }
      }, "delete"))));
    }));
  }

}

/***/ }),

/***/ "./src/pages/config.advanced.js":
/*!**************************************!*\
  !*** ./src/pages/config.advanced.js ***!
  \**************************************/
/*! exports provided: ConfigAdvancedPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigAdvancedPage", function() { return ConfigAdvancedPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");



const logLevelOptions = [{
  name: 'None',
  value: 0
}, {
  name: 'Error',
  value: 1
}, {
  name: 'Info',
  value: 2
}, {
  name: 'Debug',
  value: 3
}, {
  name: 'Debug More',
  value: 4
}, {
  name: 'Debug Dev',
  value: 9
}];
const formConfig = {
  onSave: vals => {
    console.log(vals);
  },
  groups: {
    ntp: {
      name: 'NTP Settings',
      configs: {
        enabled: {
          name: 'Use NTP',
          type: 'checkbox'
        },
        host: {
          name: 'NTP Hostname',
          type: 'string'
        }
      }
    },
    location: {
      name: 'Location Settings',
      configs: {
        long: {
          name: 'Longitude',
          type: 'number'
        },
        lat: {
          name: 'Latitude',
          type: 'number'
        }
      }
    },
    log: {
      name: 'Log Settings',
      configs: {
        syslog_ip: {
          name: 'Syslog IP',
          type: 'ip'
        },
        syslog_level: {
          name: 'Syslog Level',
          type: 'select',
          options: logLevelOptions
        },
        syslog_facility: {
          name: 'Syslog Level',
          type: 'select',
          options: [{
            name: 'Kernel',
            value: 0
          }, {
            name: 'User',
            value: 1
          }, {
            name: 'Daemon',
            value: 3
          }, {
            name: 'Message',
            value: 5
          }, {
            name: 'Local0',
            value: 16
          }, {
            name: 'Local1',
            value: 17
          }, {
            name: 'Local2',
            value: 18
          }, {
            name: 'Local3',
            value: 19
          }, {
            name: 'Local4',
            value: 20
          }, {
            name: 'Local5',
            value: 21
          }, {
            name: 'Local6',
            value: 22
          }, {
            name: 'Local7',
            value: 23
          }]
        },
        serial_level: {
          name: 'Serial Level',
          type: 'select',
          options: logLevelOptions
        },
        web_level: {
          name: 'Web Level',
          type: 'select',
          options: logLevelOptions
        }
      }
    }
  }
};
class ConfigAdvancedPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get()
    });
  }

}

/***/ }),

/***/ "./src/pages/config.bluetooth.js":
/*!***************************************!*\
  !*** ./src/pages/config.bluetooth.js ***!
  \***************************************/
/*! exports provided: types, ConfigBluetoothPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigBluetoothPage", function() { return ConfigBluetoothPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/utils */ "./src/lib/utils.js");






const types = [{
  name: '- None -',
  value: 0
}, {
  name: 'Email',
  value: 1
}, {
  name: 'Buzzer',
  value: 2
}];
const baseDefaults = {};
const getDefaults = {
  0: () => ({}),
  1: () => ({// Email
  }),
  2: () => ({// Buzzer
  })
};

const setDefaultConfig = (type, config) => {
  const defaults = { ...baseDefaults,
    ...getDefaults[type]()
  };
  Object.keys(defaults).forEach(key => {
    const val = defaults[key];
    Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_3__["set"])(config.settings, key, val);
  });
};

const getFormConfig = (config, form) => {
  const values = {};
  const beacon = {};
  config.beacon.values.forEach((trigger, i) => {
    beacon[`${i}_name`] = [{
      name: 'Check Device',
      type: 'select',
      options: _lib_utils__WEBPACK_IMPORTED_MODULE_5__["getTasks"],
      var: `beacon.values[${i}].device`
    }, {
      name: 'Check Value',
      type: 'select',
      options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_5__["getTaskValues"])(`beacon.values[${i}].device`),
      var: `beacon.values[${i}].value`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.beacon.values.splice(i, 1);
        form.forceUpdate();
      }
    }];
  });
  config.server.values.forEach((trigger, i) => {
    values[`${i}_name`] = [{
      name: 'Name',
      value: trigger.name,
      type: 'string',
      var: `server.values[${i}].name`
    }, {
      name: 'Type',
      value: trigger.type,
      type: 'select',
      options: [{
        name: 'byte',
        value: 0
      }],
      var: `server.values[${i}].type`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.server.values.splice(i, 1);
        form.forceUpdate();
      }
    }];
  });

  const addDevice = () => {
    config.beacon.values.push({
      device: 'New Value',
      value: 0,
      idx: firstFreeKey(config.beacon.values)
    });
    form.forceUpdate();
  };

  const bytesLeft = () => {
    let total = 0;
    config.beacon.values.forEach(v => {
      // get value length
      total += 1;
    });
    const bl = 20 - total;
    return `${bl} bytes left`;
  };

  return {
    groups: {
      params: {
        name: 'General Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox',
            var: 'enabled'
          }
        }
      },
      beacon: {
        name: 'Bluetooth Beacon',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox'
          },
          type: {
            name: 'Type',
            type: 'select',
            options: ['name', 'custom']
          },
          ...beacon,
          btn: {
            name: bytesLeft,
            value: 'add device value',
            type: 'button',
            click: addDevice
          }
        }
      },
      server: {
        name: 'Bluetooth LE Device',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox'
          },
          name: {
            name: 'Name',
            type: 'string'
          },
          ...values
        }
      }
    }
  };
};

const firstFreeKey = $array => {
  let i = 0;

  while ($array.find(e => e.idx == i)) i++;

  return i;
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class ConfigBluetoothPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`bluetooth`);

    if (!this.config) {
      this.config = {
        enabled: false,
        server: {
          enabled: false,
          values: []
        }
      };
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('bluetooth', this.config);
    }

    if (!this.config.beacon) this.config.beacon = {
      values: []
    };

    this.addTrigger = () => {
      this.config.server.values.push({
        name: 'New Value',
        type: 0,
        idx: firstFreeKey(this.config.server.values)
      });
      this.forceUpdate();
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.config, this);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addTrigger
    }, "Add Value"));
  }

}

/***/ }),

/***/ "./src/pages/config.hardware.js":
/*!**************************************!*\
  !*** ./src/pages/config.hardware.js ***!
  \**************************************/
/*! exports provided: pins, ConfigHardwarePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pins", function() { return pins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigHardwarePage", function() { return ConfigHardwarePage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");




const pins = () => {
  return _lib_pins__WEBPACK_IMPORTED_MODULE_3__["ioPins"].getPins(['core', 'digital_in', 'digital_out']);
};
const pinState = [{
  name: 'Default',
  value: 0
}, {
  name: 'Low',
  value: 1
}, {
  name: 'High',
  value: 2
}, {
  name: 'Input',
  value: 3
}];
const freq = [{
  name: '100kHz',
  value: 100000
}, {
  name: '400kHz',
  value: 400000
}];
const timerMode = [{
  name: 'count up',
  value: 0
}, {
  name: 'count down',
  value: 1
}];
const dividerHelp = 'Divider for 80MHz clock. This will affect minimum and maximum value you can set your timer to.';

const getFormConfig = () => {
  return {
    groups: {
      led: {
        name: 'WiFi Status LED',
        configs: {
          gpio: {
            name: 'GPIO --> LED',
            type: 'select',
            options: pins
          },
          inverse: {
            name: 'Inversed LED',
            type: 'checkbox'
          }
        }
      },
      reset: {
        name: 'Reset Pin',
        configs: {
          pin: {
            name: 'GPIO <-- Switch',
            type: 'select',
            options: pins
          }
        }
      },
      i2c: {
        name: 'I2C Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox'
          },
          sda: {
            name: 'GPIO - SDA',
            type: 'select',
            options: pins
          },
          scl: {
            name: 'GPIO - SCL',
            type: 'select',
            options: pins
          },
          freq: {
            name: 'Frequency',
            type: 'select',
            options: freq
          }
        }
      },
      spi: {
        name: 'SPI Settings',
        configs: {
          enabled: {
            name: 'Init SPI',
            type: 'checkbox'
          },
          sclk: {
            name: 'GPIO - SCLK',
            type: 'select',
            options: pins
          },
          mosi: {
            name: 'GPIO - MOSI',
            type: 'select',
            options: pins
          },
          miso: {
            name: 'GPIO - MISO',
            type: 'select',
            options: pins
          },
          cs: {
            name: 'GPIO - CS',
            type: 'select',
            options: pins
          }
        }
      },
      sdcard: {
        name: 'SD Card Settings',
        help: 'Requires SPI enabled',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox'
          }
        }
      },
      bluetooth: {
        name: 'Bluetooth Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox'
          }
        }
      },
      timer: {
        name: 'Hardware Timer config',
        help: dividerHelp,
        configs: {
          t1: [{
            name: 'T0',
            type: 'checkbox',
            var: 'timer[0].enabled'
          }, {
            name: 'divider',
            type: 'number',
            min: 2,
            max: 65535,
            var: 'timer[0].divider'
          }, {
            name: 'mode',
            type: 'select',
            options: timerMode,
            var: 'timer[0].mode'
          }],
          t2: [{
            name: 'T1',
            type: 'checkbox',
            var: 'timer[1].enabled'
          }, {
            name: 'divider',
            type: 'number',
            min: 2,
            max: 65535,
            var: 'timer[1].divider'
          }, {
            name: 'mode',
            type: 'select',
            options: timerMode,
            var: 'timer[1].mode'
          }],
          t3: [{
            name: 'T2',
            type: 'checkbox',
            var: 'timer[2].enabled'
          }, {
            name: 'divider',
            type: 'number',
            min: 2,
            max: 65535,
            var: 'timer[2].divider'
          }, {
            name: 'mode',
            type: 'select',
            options: timerMode,
            var: 'timer[2].mode'
          }],
          t4: [{
            name: 'T3',
            type: 'checkbox',
            var: 'timer[3].enabled'
          }, {
            name: 'divider',
            type: 'number',
            min: 2,
            max: 65535,
            var: 'timer[3].divider'
          }, {
            name: 'mode',
            type: 'select',
            options: timerMode,
            var: 'timer[3].mode'
          }]
        }
      },
      gpio: {
        name: 'GPIO boot states',
        configs: pins().map(pin => {
          if (pin.disabled || pin.value > 40) return;

          const isTouchPin = pin => [4, 0, 2, 15, 13, 12, 14, 27, 33, 32].includes(pin);

          const pinStateOptions = [...pinState];
          if (isTouchPin(pin.value)) pinStateOptions.push({
            name: 'Touch',
            value: 4
          });
          return [{
            name: `Pin Mode GPIO-${pin.value}`,
            type: 'select',
            options: pinStateOptions,
            var: `gpio.${pin.value}.mode`
          }, {
            name: 'interrupt',
            type: 'checkbox',
            if: `gpio.${pin.value}.mode`,
            ifval: 3,
            var: `gpio.${pin.value}.interrupt`
          }, {
            name: 'threshold',
            type: 'number',
            if: `gpio.${pin.value}.mode`,
            ifval: 4,
            var: `gpio.${pin.value}.threshold`
          }];
        }).filter(p => p)
      }
    }
  };
};

class ConfigHardwarePage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    let config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get('hardware');

    if (!config) {
      config = {};
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('hardware', {
        i2c: {
          enabled: false
        },
        timer: [{
          enabled: false,
          divider: 800
        }, {
          enabled: false,
          divider: 800
        }, {
          enabled: false,
          divider: 800
        }, {
          enabled: false,
          divider: 800
        }],
        spi: {
          enabled: false,
          sclk: 14,
          mosi: 15,
          miso: 2,
          cs: 13
        },
        sdcard: {
          enabled: false
        }
      });
    }

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: getFormConfig(),
      selected: config
    });
  }

}

/***/ }),

/***/ "./src/pages/config.js":
/*!*****************************!*\
  !*** ./src/pages/config.js ***!
  \*****************************/
/*! exports provided: ConfigPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigPage", function() { return ConfigPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");



const ipBlockLevel = [{
  name: 'Allow All',
  value: 0
}, {
  name: 'Allow Local Subnet',
  value: 1
}, {
  name: 'Allow IP Range',
  value: 2
}];
let ssids = ['loading...'];

const getFormConfig = (config, form) => {
  const wifiScan = () => {
    fetch('/wifi_scan').then(r => r.json()).then(r => {
      ssids = r;
      form.forceUpdate();
    });
  };

  return {
    groups: {
      unit: {
        name: 'General',
        configs: {
          name: {
            name: 'Unit Name',
            type: 'string'
          },
          // nr: { name: 'Unit Number', type: 'number' },
          // appendToHost: { name: 'Append Unit Name to Hostname', type: 'checkbox' },
          view_password: {
            name: 'View Password',
            type: 'string',
            var: 'security.viewpass'
          },
          edit_password: {
            name: 'User Password',
            type: 'string',
            var: 'security.userpass'
          },
          admin_password: {
            name: 'Admin Password',
            type: 'string',
            var: 'security.pass'
          }
        }
      },
      wifi: {
        name: 'WiFi',
        configs: {
          ssid: [{
            name: 'SSID',
            type: ssids.length ? 'select' : 'string',
            options: ssids,
            var: 'wifi.ssid'
          }, {
            name: '',
            type: 'button',
            value: 'scan',
            click: wifiScan
          }],
          pass: {
            name: 'Password',
            type: 'password'
          },
          ssid2: {
            name: 'Fallback SSID',
            type: 'string'
          },
          pass2: {
            name: 'Fallback Password',
            type: 'password'
          },
          wpaapmode: {
            name: 'WPA AP Mode Key:',
            type: 'string'
          }
        }
      },
      ip: {
        name: 'IP Settings',
        configs: {
          enabled: {
            name: 'Static IP',
            type: 'checkbox',
            var: 'wifi.static_ip.enabled'
          },
          ip: {
            name: 'IP',
            type: 'ip',
            var: 'wifi.static_ip.ip'
          },
          gw: {
            name: 'Gateway',
            type: 'ip',
            var: 'wifi.static_ip.gw'
          },
          netmask: {
            name: 'Subnet',
            type: 'ip',
            var: 'wifi.static_ip.netmask'
          },
          dns: {
            name: 'DNS',
            type: 'ip',
            var: 'wifi.static_ip.dns'
          }
        }
      },
      clientIP: {
        name: 'Client IP Filtering',
        configs: {
          blocklevel: {
            name: 'IP Block Level',
            type: 'select',
            options: ipBlockLevel,
            var: 'security.ip_block.enabled'
          },
          lowerrange: {
            name: 'Access IP lower range',
            type: 'ip',
            var: 'security.ip_block.start'
          },
          upperrange: {
            name: 'Access IP upper range',
            type: 'ip',
            var: 'security.ip_block.end'
          }
        }
      } // sleep: {
      //     name: 'Sleep Mode',
      //     configs: {
      //         awaketime: { name: 'Sleep awake time', type: 'number' },
      //         sleeptime: { name: 'Sleep time', type: 'number' },
      //         sleeponfailiure: { name: 'Sleep on connection failure', type: 'checkbox' },
      //     }
      // }

    }
  };
};

class ConfigPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    fetch('/wifi_scan').then(r => r.json()).then(r => {
      ssids = r;
      this.forceUpdate();
    });
  }

  render(props) {
    const config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get();
    const formConfig = getFormConfig(config, this);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: config
    });
  }

}

/***/ }),

/***/ "./src/pages/config.lcd.js":
/*!*********************************!*\
  !*** ./src/pages/config.lcd.js ***!
  \*********************************/
/*! exports provided: types, ConfigLCDPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDPage", function() { return ConfigLCDPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");





const types = [{
  name: '- None -',
  value: 0
}, {
  name: 'Email',
  value: 1
}, {
  name: 'Buzzer',
  value: 2
}];
const lcdDriverOptions = [{
  name: 'ILI9341',
  value: 0
}, {
  name: 'SSD1306',
  value: 1
}, {
  name: 'ST7789',
  value: 2
}, {
  name: 'NT35510',
  value: 3
}];
const touchDriverOptions = [{
  name: 'XPT2046',
  value: 0
}, {
  name: 'FT5X06',
  value: 1
}];
const baseDefaults = {};
const getDefaults = {
  0: () => ({}),
  1: () => ({// Email
  }),
  2: () => ({// Buzzer
  })
};

const setDefaultConfig = (type, config) => {
  const defaults = { ...baseDefaults,
    ...getDefaults[type]()
  };
  Object.keys(defaults).forEach(key => {
    const val = defaults[key];
    Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_3__["set"])(config.settings, key, val);
  });
};

const getFormConfig = (config, form) => {
  const values = {};
  config.pages.forEach((trigger, i) => {
    values[`${i}_name`] = [{
      name: 'Name',
      value: trigger.name,
      type: 'string',
      var: `pages[${i}].name`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.pages.splice(i, 1);
        form.forceUpdate();
      }
    }, {
      type: 'button',
      value: 'edit',
      click: () => {
        window.location.href = '#config/lcdscreen/' + i;
      }
    }];
  });
  const widgets = {};
  config.widgets.forEach((trigger, i) => {
    widgets[`${i}_name`] = [{
      name: 'Name',
      value: trigger.name,
      type: 'string',
      var: `widgets[${i}].name`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.widgets.splice(i, 1);
        form.forceUpdate();
      }
    }, {
      type: 'button',
      value: 'edit',
      click: () => {
        window.location.href = '#config/lcdwidget/' + i;
      }
    }];
  });
  return {
    groups: {
      params: {
        name: 'General Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox',
            var: 'enabled'
          },
          lcd_driver: {
            name: 'LCD Driver',
            type: 'select',
            options: lcdDriverOptions
          },
          touch_driver: {
            name: 'Touch Driver',
            type: 'select',
            options: touchDriverOptions
          },
          width: {
            name: 'Width',
            type: 'number'
          },
          height: {
            name: 'Height',
            type: 'number'
          }
        }
      },
      pages: {
        name: 'Pages',
        configs: { ...values
        }
      },
      widgets: {
        name: 'Widgets',
        configs: { ...widgets
        }
      }
    }
  };
};

const firstFreeKey = $array => {
  let i = 0;

  while ($array.find(e => e.idx == i)) i++;

  return i;
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class ConfigLCDPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd`);

    if (!this.config) {
      this.config = {
        enabled: false,
        params: {
          width: 320,
          height: 240
        },
        pages: [],
        widgets: []
      };
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('lcd', this.config);
    }

    this.addTrigger = () => {
      this.config.pages.push({
        name: 'New Value',
        type: 0,
        idx: firstFreeKey(this.config.pages)
      });
      this.forceUpdate();
    };

    this.addWidget = () => {
      this.config.widgets.push({
        name: 'New Widget',
        type: 0,
        items: [],
        idx: firstFreeKey(this.config.widgets)
      });
      this.forceUpdate();
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.config, this);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addTrigger
    }, "Add Page"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addWidget
    }, "Add Widget"));
  }

}

/***/ }),

/***/ "./src/pages/config.lcd.screen.js":
/*!****************************************!*\
  !*** ./src/pages/config.lcd.screen.js ***!
  \****************************************/
/*! exports provided: ConfigLCDScreenPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDScreenPage", function() { return ConfigLCDScreenPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");
/* harmony import */ var _lcdscreen__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lcdscreen */ "./src/pages/lcdscreen/index.js");






class ConfigLCDScreenPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    const screen = props.params[0];
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_lcdscreen__WEBPACK_IMPORTED_MODULE_5__["LcdScreen"], {
      page: props.params[0]
    });
  }

}

/***/ }),

/***/ "./src/pages/config.lcd.widget.js":
/*!****************************************!*\
  !*** ./src/pages/config.lcd.widget.js ***!
  \****************************************/
/*! exports provided: ConfigLCDWidgetPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDWidgetPage", function() { return ConfigLCDWidgetPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");
/* harmony import */ var _lcdscreen__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lcdscreen */ "./src/pages/lcdscreen/index.js");






class ConfigLCDWidgetPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    const screen = props.params[0];
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_lcdscreen__WEBPACK_IMPORTED_MODULE_5__["LcdScreen"], {
      widget: props.params[0]
    });
  }

}

/***/ }),

/***/ "./src/pages/config.plugins.js":
/*!*************************************!*\
  !*** ./src/pages/config.plugins.js ***!
  \*************************************/
/*! exports provided: ConfigPluginsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigPluginsPage", function() { return ConfigPluginsPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");


class ConfigPluginsPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.plugins = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.get('ui_plugins');

    if (!this.plugins) {
      this.plugins = [{
        name: 'IconSelector',
        enabled: false,
        url: 'http://localhost:8080/build/iconpicker.js'
      }];
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.set('ui_plugins', this.plugins);
    }

    this.handleEnableToggle = e => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
    };

    this.addDevice = () => {
      const newPlugin = {
        id: firstFreeKey(plugins),
        idx: firstFreeKey(plugins, 'idx'),
        type: 0,
        name: 'new device',
        enabled: false,
        params: {}
      };
      this.plugins.push(newPlugin);
      this.forceUpdate();
    };

    this.deleteDevice = i => {
      this.plugins.splice(i, 1);
      this.forceUpdate();
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, this.plugins.map((p, i) => {
      if (p === null) return null;
      const enabledProp = `ui_plugins[${i}].enabled`;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "body"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, i + 1, ": ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        type: "checkbox",
        defaultChecked: p.enabled,
        "data-prop": enabledProp,
        onChange: this.handleEnableToggle
      }), "\xA0\xA0", p.name, " [", p.url, "]")));
    }));
  }

}

/***/ }),

/***/ "./src/pages/controllers.alerts.js":
/*!*****************************************!*\
  !*** ./src/pages/controllers.alerts.js ***!
  \*****************************************/
/*! exports provided: types, ControllerAlertsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControllerAlertsPage", function() { return ControllerAlertsPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils */ "./src/lib/utils.js");





const types = [{
  name: '- None -',
  value: 0
}, {
  name: 'Email',
  value: 1
}, {
  name: 'Buzzer',
  value: 2
}];
const compareOptions = [{
  name: '=',
  value: 0
}, {
  name: '>',
  value: 1
}, {
  name: '<',
  value: 2
}, {
  name: '<>',
  value: 3
}];
const baseDefaults = {};
const getDefaults = {
  0: () => ({}),
  1: () => ({// Email
  }),
  2: () => ({// Buzzer
  })
};

const setDefaultConfig = (type, config) => {
  const defaults = { ...baseDefaults,
    ...getDefaults[type]()
  };
  Object.keys(defaults).forEach(key => {
    const val = defaults[key];
    Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_3__["set"])(config.settings, key, val);
  });
};

const getFormConfig = (config, form) => {
  const alerts = {};
  config.alerts.forEach((alert, i) => {
    alerts[`${i}_name`] = [{
      name: 'Name',
      value: alert.name,
      type: 'string',
      var: `alerts[${i}].name`
    }, {
      name: 'Description',
      value: alert.description,
      type: 'string',
      var: `alerts[${i}].description`
    }, {
      type: 'button',
      click: () => {
        config.alerts.splice(i, 1);
        form.forceUpdate();
      }
    }];
    alerts[`${i}_check`] = [{
      name: 'Check Device',
      type: 'select',
      options: _lib_utils__WEBPACK_IMPORTED_MODULE_4__["getTasks"],
      var: `alerts[${i}].checks[0].device_id`
    }];
    alerts[`${i}_compare`] = [{
      name: 'Comparison',
      type: 'select',
      options: compareOptions,
      var: `alerts[${i}].checks[0].compare`
    }, {
      name: 'Value',
      type: 'string',
      var: `alerts[${i}].checks[0].value`
    }];
  });
  return {
    groups: {
      params: {
        name: 'Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox',
            var: 'enabled'
          },
          ...alerts
        }
      }
    }
  };
};

const firstFreeKey = $array => {
  let i = 0;

  while ($array.find(e => e.idx == i)) i++;

  return i;
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class ControllerAlertsPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`alerts`);

    if (!this.config) {
      this.config = {
        enabled: false,
        alerts: []
      };
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('alerts', this.config);
    }

    this.addTrigger = () => {
      this.config.alerts.push({
        name: 'New Alert',
        type: 0,
        idx: firstFreeKey(this.config.alerts)
      });
      this.forceUpdate();
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.config, this);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addTrigger
    }, "Add Alert"));
  }

}

/***/ }),

/***/ "./src/pages/controllers.alexa.js":
/*!****************************************!*\
  !*** ./src/pages/controllers.alexa.js ***!
  \****************************************/
/*! exports provided: types, ControllerAlexaPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControllerAlexaPage", function() { return ControllerAlexaPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _lib_pins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/pins */ "./src/lib/pins.js");





const types = [{
  name: '- None -',
  value: 0
}, {
  name: 'Email',
  value: 1
}, {
  name: 'Buzzer',
  value: 2
}];
const baseDefaults = {};
const getDefaults = {
  0: () => ({}),
  1: () => ({// Email
  }),
  2: () => ({// Buzzer
  })
};

const setDefaultConfig = (type, config) => {
  const defaults = { ...baseDefaults,
    ...getDefaults[type]()
  };
  Object.keys(defaults).forEach(key => {
    const val = defaults[key];
    Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_3__["set"])(config.settings, key, val);
  });
};

const getFormConfig = (config, form) => {
  const triggers = {};
  config.triggers.forEach((trigger, i) => {
    triggers[`${i}_name`] = [{
      name: 'Name',
      value: trigger.name,
      type: 'string',
      var: `triggers[${i}].name`
    }, {
      name: 'Type',
      value: trigger.type,
      type: 'select',
      options: [{
        name: 'switch',
        value: 0
      }, {
        name: 'dimmer',
        value: 1
      }, {
        name: 'color',
        value: 2
      }, {
        name: 'color2',
        value: 3
      }, {
        name: 'color3',
        value: 4
      }],
      var: `triggers[${i}].type`
    }, {
      type: 'button',
      value: 'remove',
      click: () => {
        config.triggers.splice(i, 1);
        form.forceUpdate();
      }
    }];
  });
  return {
    groups: {
      params: {
        name: 'Settings',
        configs: {
          enabled: {
            name: 'Enabled',
            type: 'checkbox',
            var: 'enabled'
          },
          ...triggers
        }
      }
    }
  };
};

const firstFreeKey = $array => {
  let i = 0;

  while ($array.find(e => e.idx == i)) i++;

  return i;
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class ControllerAlexaPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`alexa`);

    if (!this.config) {
      this.config = {
        enabled: false,
        triggers: []
      };
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('alexa', this.config);
    }

    this.addTrigger = () => {
      this.config.triggers.push({
        name: 'New Trigger',
        type: 0,
        idx: firstFreeKey(this.config.triggers)
      });
      this.forceUpdate();
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.config, this);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addTrigger
    }, "Add Trigger"));
  }

}

/***/ }),

/***/ "./src/pages/controllers.js":
/*!**********************************!*\
  !*** ./src/pages/controllers.js ***!
  \**********************************/
/*! exports provided: ControllersPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControllersPage", function() { return ControllersPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");


class ControllersPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    const controllers = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('controllers');
    const notifications = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('notifications');
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, " ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("h3", null, "Controllers"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, controllers.map((c, i) => {
      const editUrl = `#controllers/edit/${i}`;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: "info"
      }, i + 1, ": ", c.enabled ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "\u2713") : Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "\u2717"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: editUrl
      }, "edit")));
    })));
  }

}

/***/ }),

/***/ "./src/pages/dashboard.js":
/*!********************************!*\
  !*** ./src/pages/dashboard.js ***!
  \********************************/
/*! exports provided: DashboardPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardPage", function() { return DashboardPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");



class DashboardPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      devices: _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('plugins').filter(p => p && p.enabled),
      deviceState: []
    };

    this.renderDimmer = (device, deviceState) => {
      const rangeChange = i => async e => {
        await fetch(`/plugin/${device.id}/state/${i}/${e.currentTarget.value}`);
      };

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "media device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-left"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("p", {
        class: "image is-64x64"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-content"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, device.name)), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-right"
      }, device.state.values.map((v, i) => {
        const state = deviceState[v.name];
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, v.name, ": ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
          min: "0",
          max: "255",
          width: "200px",
          type: "range",
          value: state,
          onChange: rangeChange(i)
        }));
      })));
    };

    this.renderSwitch = (device, deviceState) => {
      const state = deviceState[device.state.values[0].name];

      const buttonClick = async () => {
        await fetch(`/plugin/${device.id}/state/0/${state ? 0 : 1}`); // deviceState[device.state.values[0].name] = !state;
        // this.forceUpdate(); 
      };

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "media device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-left"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("p", {
        class: "image is-64x64"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-content"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, device.name)), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-right"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
        class: "button",
        onClick: buttonClick
      }, !state ? 'ON' : 'OFF')));
    }; // TODO: we should have a generic way to access device values


    this.renderSensor = (device, deviceState) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "media device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-left"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("p", {
        class: "image is-64x64"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-content"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, device.name, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, device.state && device.state.values.map((value, i) => {
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, value.name, ": ", deviceState[value.name], " ");
      })))));
    };

    this.renderRegulator = (device, deviceState) => {
      const rangeChange = async e => {
        const plugins = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('plugins');
        plugins.find(p => p.id == device.id).params.level = e.currentTarget.value;
        await fetch(`/plugin/${device.id}/config/level/${e.currentTarget.value}`);
      };

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "media device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-left"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("p", {
        class: "image is-64x64"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-content"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, device.name, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        width: "200px",
        type: "range",
        value: device.params.level,
        onChange: rangeChange
      })))));
    };

    this.renderDevice = (device, deviceState) => {
      switch (device.type) {
        case 1:
          return this.renderSwitch(device, deviceState);

        case 2:
        case 3:
        case 4:
        case 6:
        case 12:
          return this.renderSensor(device, deviceState);

        case 5:
          return this.renderRegulator(device, deviceState);

        case 15:
          return this.renderDimmer(device, deviceState);

        default:
          return null;
      }
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, this.state.devices.map((device, i) => {
      return this.renderDevice(device, this.state.deviceState[i] || {});
    }));
  }

  fetchDevices() {
    Object(_lib_esp__WEBPACK_IMPORTED_MODULE_2__["loadDevices"])().then(deviceState => {
      this.setState({
        deviceState
      });
      if (!this.shutdown) setTimeout(() => {
        this.fetchDevices();
      }, 1000);
    });
  }

  componentDidMount() {
    this.fetchDevices();
  }

  componentWillUnmount() {
    this.shutdown = true;
  }

}

/***/ }),

/***/ "./src/pages/devices.edit.js":
/*!***********************************!*\
  !*** ./src/pages/devices.edit.js ***!
  \***********************************/
/*! exports provided: DevicesEditPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DevicesEditPage", function() { return DevicesEditPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../devices */ "./src/devices/index.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");





const baseFields = {
  enabled: {
    name: 'Enabled',
    type: 'checkbox',
    var: 'enabled'
  },
  name: {
    name: 'Name',
    type: 'string',
    var: 'name'
  },
  idx: {
    name: 'Idx',
    type: 'string',
    var: 'idx'
  },
  icon: {
    name: 'Icon',
    type: 'string',
    var: 'icon',
    extra: {
      'class': 'iconpicker'
    }
  },
  lock: {
    name: 'Lock',
    type: 'checkbox',
    var: 'lock',
    adminOnly: true
  }
};

const getFormConfig = (type, config) => {
  const device = _devices__WEBPACK_IMPORTED_MODULE_3__["devices"].find(d => d.value === parseInt(type));
  if (!device) return null;
  const dataAcquisitionForm = device.fields.data ? {
    name: 'Data Acquisition',
    configs: {
      send1: {
        name: 'Send to Controller 1',
        type: 'checkbox',
        var: 'TaskDeviceSendData[0]',
        if: 'controllers[0].enabled'
      },
      send2: {
        name: 'Send to Controller 2',
        type: 'checkbox',
        var: 'TaskDeviceSendData[1]',
        if: 'controllers[1].enabled'
      },
      send3: {
        name: 'Send to Controller 3',
        type: 'checkbox',
        var: 'TaskDeviceSendData[2]',
        if: 'controllers[2].enabled'
      },
      idx1: {
        name: 'IDX1',
        type: 'number',
        var: 'TaskDeviceID[0]',
        if: 'controllers[0].enabled'
      },
      idx2: {
        name: 'IDX2',
        type: 'number',
        var: 'TaskDeviceID[1]',
        if: 'controllers[1].enabled'
      },
      idx3: {
        name: 'IDX3',
        type: 'number',
        var: 'TaskDeviceID[2]',
        if: 'controllers[2].enabled'
      },
      interval: {
        name: 'Interval',
        type: 'number',
        var: 'interval'
      }
    }
  } : {};
  return {
    groups: {
      settings: {
        name: 'Device Settings',
        configs: {
          type: {
            name: 'Type',
            type: 'select',
            var: 'type',
            options: _devices__WEBPACK_IMPORTED_MODULE_3__["devices"]
          },
          ...baseFields
        }
      },
      ...(device.fields.getFields ? device.fields.getFields(config) : device.fields),
      data: dataAcquisitionForm,
      values: {
        name: 'Values',
        configs: { ...[...new Array(device.fields.vals || 0)].reduce((acc, x, i) => {
            acc[`value${i}`] = [{
              name: `Name ${i + 1}`,
              var: `state.values[${i}].name`,
              type: 'string'
            }, {
              name: `Formula ${i + 1}`,
              var: `state.values[${i}].formula`,
              type: 'string'
            }];
            return acc;
          }, {})
        }
      }
    }
  };
};

const setDefaultConfig = (type, config) => {
  const device = _devices__WEBPACK_IMPORTED_MODULE_3__["devices"].find(d => d.value === parseInt(type));
  const fields = device.fields.getFields ? device.fields.getFields(config) : device.fields;
  Object.keys(fields).forEach(groupKey => {
    const group = fields[groupKey];
    if (!group.configs) return;
    Object.keys(group.configs).forEach(configKey => {
      const cfg = group.configs[configKey];
      const key = cfg.var || `${groupKey}.${configKey}`;
      let val = 0;
      if (cfg.type === 'string') val = '';else if (cfg.type === 'ip') val = [0, 0, 0, 0];
      Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_4__["set"])(config, key, val);
    });
  });

  if (device.fields.defaults) {
    const defaultConfig = device.fields.defaults();
    Object.keys(defaultConfig).forEach(key => {
      const val = defaultConfig[key];
      Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_4__["set"])(config, key, val);
    });
  }
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class DevicesEditPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`plugins[${props.params[0]}]`);
    this.state = {
      type: this.config.type
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.state.type, this.config);

    if (!formConfig) {
      alert('something went wrong, cant edit device');
      window.location.href = '#devices';
    }

    formConfig.groups.settings.configs.type.onChange = e => {
      this.setState({
        type: e.currentTarget.value
      });
      setDefaultConfig(e.currentTarget.value, this.config);
    };

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: this.config
    });
  }

}

/***/ }),

/***/ "./src/pages/devices.js":
/*!******************************!*\
  !*** ./src/pages/devices.js ***!
  \******************************/
/*! exports provided: DevicesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DevicesPage", function() { return DevicesPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../devices */ "./src/devices/index.js");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");
/* harmony import */ var mini_toastr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mini-toastr */ "./node_modules/mini-toastr/mini-toastr.js");





const user = "admin";

const firstFreeKey = (array, key = 'id') => {
  let i = 0;

  while (array.find(e => e && e[key] == i)) i++;

  return i;
};

const ruleUsesDevice = (rule, deviceId) => {
  return rule.t === 'if/else' && rule.v[0].split('-')[0] == deviceId || rule.t === 'set state' && rule.v[0].split('-')[0] == deviceId || rule.t === 'get state' && rule.v[0].split('-')[0] == deviceId;
};

const findRulesUsingDevice = (rules, deviceId, arr = []) => {
  rules.forEach(rule => {
    if (ruleUsesDevice(rule, deviceId)) {
      arr.push(rule);
    }

    rule.o.forEach(o => {
      //o.forEach(outRule => {
      findRulesUsingDevice(o, deviceId, arr); //});
    });
  });
  return arr;
};

const deleteRulesUsingDevice = (rules, deviceId) => {
  for (var i = rules.length - 1; i >= 0; i--) {
    if (ruleUsesDevice(rules[i], deviceId)) rules.splice(i, 1);
  }

  rules.forEach((rule, i) => {
    rule.o.forEach(o => {
      //o.forEach(outRule => {
      deleteRulesUsingDevice(o, deviceId); //});
    });
  });
};

class DevicesPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    };

    this.handleEnableToggle = e => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
    };

    this.addDevice = () => {
      const plugins = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].settings.plugins;
      const empty = plugins.findIndex(e => e === null);
      const newPlugin = {
        id: firstFreeKey(plugins),
        idx: firstFreeKey(plugins, 'idx'),
        type: 0,
        name: 'new device',
        enabled: false,
        params: {}
      };
      if (empty !== -1) plugins[empty] = newPlugin;else plugins.push(newPlugin);
      window.location.hash = `#devices/edit/${empty === -1 ? plugins.length - 1 : empty}`;
    };

    this.deleteDevice = i => {
      const elementsUsingDevice = findRulesUsingDevice(_lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].rules, i);
      let shouldDelete = false;

      if (elementsUsingDevice.length) {
        shouldDelete = confirm("The device you are trying to delete is used in Automation. Deleting it will remove all automation nodes refering to it.\nAre you sure you want to continue ?");
      } else {
        shouldDelete = confirm("Are you sure you want to delete the plugin ?");
      }

      if (shouldDelete) {
        deleteRulesUsingDevice(_lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].rules, i);
        _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].settings.plugins.splice(i, 1);
        this.forceUpdate();
      }
    };

    this.moveDevice = (i, direction = 'up') => {
      const plugins = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].settings.plugins;
      const p1 = plugins[i];

      if (direction === 'up') {
        if (i - 1 < 0) return;
        const p2 = plugins[i - 1];
        plugins[i - 1] = p1;
        plugins[i] = p2;
      } else {
        if (i + 1 > plugins.length) return;
        const p2 = plugins[i + 1];
        plugins[i + 1] = p1;
        plugins[i] = p2;
      }

      this.forceUpdate();
    };
  }

  render(props) {
    let tasks = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('plugins');
    if (!tasks) return;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "level"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "level-left"
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "level-right"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      class: "level-item button",
      onClick: this.addDevice
    }, "add device"))), tasks.map((task, i) => {
      if (task === null) return null;
      if (_lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].userName !== 'admin' && task.lock) return null;
      const editUrl = `#devices/edit/${i}`;
      const device = _devices__WEBPACK_IMPORTED_MODULE_2__["devices"].find(d => d.value === task.type);
      const deviceType = device ? device.name : '--unknown--';
      const enabledProp = `plugins[${i}].enabled`;
      const deviceLive = this.state.devices[i];
      const vals = deviceLive ? Object.keys(deviceLive).map(key => ({
        name: key,
        value: deviceLive[key]
      })) : [];
      vals.forEach(v => {
        if (v.value === true) v.value = 1;
        if (v.value === false) v.value = 0;
      });
      const iconClass = `${task.icon}`;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-left"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("p", {
        class: "image is-64x64"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: iconClass
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-content"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, i + 1, ": ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        type: "checkbox",
        defaultChecked: task.enabled,
        "data-prop": enabledProp,
        onChange: this.handleEnableToggle
      }), "\xA0\xA0", task.name, " [", deviceType, "]"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "vars"
      }, vals.map(v => {
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, v.name, ": ", v.value, " ");
      }))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "media-right"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: editUrl
      }, "edit"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        onClick: () => {
          this.deleteDevice(i);
        }
      }, "delete"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        onClick: () => {
          this.moveDevice(i, 'up');
        }
      }, "up"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        onClick: () => {
          this.moveDevice(i, 'down');
        }
      }, "down")));
    }));
  }

  fetchDevices() {
    Object(_lib_esp__WEBPACK_IMPORTED_MODULE_3__["loadDevices"])().then(devices => {
      this.setState({
        devices
      });
      if (!this.shutdown) setTimeout(() => {
        this.fetchDevices();
      }, 1000);
    });
  }

  componentDidMount() {
    this.fetchDevices();
  }

  componentWillMount() {
    this.shutdown = true;
  }

}

/***/ }),

/***/ "./src/pages/diff.js":
/*!***************************!*\
  !*** ./src/pages/diff.js ***!
  \***************************/
/*! exports provided: DiffPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiffPage", function() { return DiffPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/config */ "./src/lib/config.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");




class DiffPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.diff = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].diff();
    this.editorDiff = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.diff();

    this.applyChanges = () => {
      this.diff.map(d => {
        const input = this.form.elements[d.path];

        if (!input.checked) {
          _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set(input.name, d.val1);
        }
      });
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].apply();
      this.editorDiff.map(d => {
        const input = this.form.elements[d.path];

        if (!input.checked) {
          _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.set(input.name, d.val1);
        }
      });
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].editor.apply();
      const rulesChanged = this.editorDiff.filter(r => r.path.includes('rules')).length;
      _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].show();
      Object(_lib_config__WEBPACK_IMPORTED_MODULE_2__["saveConfig"])(this.diff.length, this.editorDiff.length, rulesChanged).then(() => {
        if (this.diff.length) window.location.href = '#config/reboot';else if (rulesChanged) window.location.href = '#rules';else {
          window.location.href = '#devices';
          window.location.reload();
        }
      });
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      ref: ref => this.form = ref
    }, this.diff.map(change => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, change.path), ": before: ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, JSON.stringify(change.val1)), " now:", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, JSON.stringify(change.val2)), " ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        name: change.path,
        type: "checkbox",
        defaultChecked: true
      }));
    }), this.editorDiff.map(change => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, change.path), ": before: ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, JSON.stringify(change.val1)), " now:", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, JSON.stringify(change.val2)), " ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
        name: change.path,
        type: "checkbox",
        defaultChecked: true
      }));
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.applyChanges
    }, "APPLY")));
  }

}

/***/ }),

/***/ "./src/pages/discover.js":
/*!*******************************!*\
  !*** ./src/pages/discover.js ***!
  \*******************************/
/*! exports provided: DiscoverPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscoverPage", function() { return DiscoverPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

const devices = [{
  nr: 1,
  name: 'Senzor',
  type: 'DH11',
  vars: [{
    name: 'Temperature',
    formula: '',
    value: 21
  }, {
    name: 'Humidity',
    formula: '',
    value: 65
  }]
}, {
  nr: 1,
  name: 'Humidity',
  type: 'Linear Regulator',
  vars: [{
    name: 'Output',
    formula: '',
    value: 1
  }]
}];
class DiscoverPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    };

    this.scani2c = () => {
      fetch('/i2cscanner').then(r => r.json()).then(r => {
        this.setState({
          devices: r
        });
      });
    };

    this.scanwifi = () => {
      fetch('/wifiscanner').then(r => r.json()).then(r => {
        this.setState({
          devices: r
        });
      });
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.scani2c
    }, "Scan I2C"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.scanwifi
    }, "Scan WiFi")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("table", null, this.state.devices.map(device => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("tr", {
        class: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("td", {
        class: "info"
      }, JSON.stringify(device)));
    })));
  }

}

/***/ }),

/***/ "./src/pages/factory_reset.js":
/*!************************************!*\
  !*** ./src/pages/factory_reset.js ***!
  \************************************/
/*! exports provided: FactoryResetPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FactoryResetPage", function() { return FactoryResetPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");


const formConfig = {
  onSave: vals => {
    console.log(vals);
  },
  groups: {
    keep: {
      name: 'Settings to keep',
      configs: {
        unit: {
          name: 'Keep Unit/Name',
          type: 'checkbox'
        },
        wifi: {
          name: 'Keep WiFi config',
          type: 'checkbox'
        },
        network: {
          name: 'Keep network config',
          type: 'checkbox'
        },
        ntp: {
          name: 'Keep NTP/DST config',
          type: 'checkbox'
        },
        log: {
          name: 'Keep log config',
          type: 'checkbox'
        }
      }
    },
    load: {
      name: 'Pre-defined configurations',
      configs: {
        config: {
          name: 'Pre-Defined config',
          type: 'select',
          options: [{
            name: 'default',
            value: 0
          }, {
            name: 'Sonoff Basic',
            value: 1
          }, {
            name: 'Sonoff TH1x',
            value: 2
          }, {
            name: 'Sonoff S2x',
            value: 3
          }, {
            name: 'Sonoff TouchT1',
            value: 4
          }, {
            name: 'Sonoff TouchT2',
            value: 5
          }, {
            name: 'Sonoff TouchT3',
            value: 6
          }, {
            name: 'Sonoff 4ch',
            value: 7
          }, {
            name: 'Sonoff POW',
            value: 8
          }, {
            name: 'Sonoff POW-r2',
            value: 9
          }, {
            name: 'Shelly1',
            value: 10
          }]
        }
      }
    }
  }
};
const config = {};
class FactoryResetPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    formConfig.onSave = config => {
      const data = new FormData();
      if (config.keep.unit) data.append('kun', 'on');
      if (config.keep.wifi) data.append('kw', 'on');
      if (config.keep.network) data.append('knet', 'on');
      if (config.keep.ntp) data.append('kntp', 'on');
      if (config.keep.log) data.append('klog', 'on');
      data.append('fdm', config.load.config);
      data.append('savepref', 'Save Preferences');
      fetch('/factoryreset', {
        method: 'POST',
        body: data
      }).then(() => {
        data.delete('savepref');
        data.append('performfactoryreset', 'Factory Reset');
        fetch('/factoryreset', {
          method: 'POST',
          body: data
        }).then(() => {
          setTimeout(() => {
            window.location.href = "#devices";
          }, 5000);
        }, e => {});
      }, e => {});
    };

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: config
    });
  }

}

/***/ }),

/***/ "./src/pages/floweditor/DropPage.js":
/*!******************************************!*\
  !*** ./src/pages/floweditor/DropPage.js ***!
  \******************************************/
/*! exports provided: DropPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropPage", function() { return DropPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nodes_widget_connection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/widget_connection */ "./src/pages/floweditor/nodes/widget_connection.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class DropPageComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onClickHandler", item => {
      this.props.onSelect(item);
    });

    _defineProperty(this, "onMoveHandler", (e, item) => {
      const x = roundToGrid(e.x - this.position.left + this.el.scrollLeft, this.props.grid);
      const y = roundToGrid(e.y - this.position.top + this.el.scrollTop, this.props.grid);
      const existingItem = this.state.items.find(i => i.id === item.id);
      existingItem.position.x = x;
      existingItem.position.y = y;
      this.forceUpdate();
    });

    _defineProperty(this, "onRightClickHandler", item => {
      for (let i = this.state.connections.length - 1; i >= 0; i--) {
        const c = this.state.connections[i];

        if (c.to.startsWith(`node-${item.id}-`) || c.from.startsWith(`node-${item.id}-`)) {
          this.state.connections.splice(i, 1);
        }
      }

      const index = this.state.items.findIndex(i => i.id == item.id);
      this.state.items.splice(index, 1);
      this.forceUpdate();
    });

    _defineProperty(this, "onArrow", (from, to) => {
      let c = this.state.connections.find(c => c.from == from.id);

      if (!c) {
        c = {
          from: from.id,
          to
        };
        this.state.connections.push(c);
      } else {
        c.to = to;

        if (to === null) {
          const index = this.state.connections.findIndex(c => c.from == from.id);
          this.state.connections.splice(index, 1);
        }
      }

      this.forceUpdate();
    });

    _defineProperty(this, "renderItem", (item, W) => {
      const itemStyle = {
        position: 'absolute',
        top: `${item.position.y}px`,
        left: `${item.position.x}px`
      };
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        style: itemStyle
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(W, {
        item: item,
        onClickHandler: this.onClickHandler,
        onRightClickHandler: this.onRightClickHandler,
        onMouseMove: this.onMoveHandler,
        onArrow: this.onArrow
      }));
    });

    _defineProperty(this, "renderConnection", c => {
      const fel = document.getElementById(c.from);
      if (!fel) return;
      const frect = fel.getBoundingClientRect();
      const x0 = frect.left + frect.width - this.position.left;
      const y0 = frect.top + frect.height / 2 - this.position.top;
      let x1, y1;

      if (c.to && c.to.x) {
        x1 = c.to.x - this.position.left;
        y1 = c.to.y - this.position.top;
      } else if (c.to) {
        const tel = document.getElementById(c.to);
        if (!tel) return;
        const trect = tel.getBoundingClientRect();
        x1 = trect.left - this.position.left;
        y1 = trect.top + trect.height / 2 - this.position.top;
      } else {
        return null;
      }

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_nodes_widget_connection__WEBPACK_IMPORTED_MODULE_2__["WidgetConnection"], {
        fill: "none",
        color: "#000000",
        from: [x0, y0],
        to: [x1, y1]
      });
    });

    this.state = {
      items: this.props.rules.nodes,
      connections: this.props.rules.connections
    };
  }

  findNextId() {
    let x = 0;
    this.state.items.forEach(i => {
      if (i.id > x) x = i.id;
    });
    return x + 1;
  }

  render() {
    const {
      isOver,
      connectDropTarget
    } = this.props;
    if (this.el) this.position = this.el.getBoundingClientRect();
    return connectDropTarget(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: this.props.id,
      style: this.props.style,
      ref: el => {
        this.el = el;
      }
    }, this.el && this.state.items.map(item => {
      return this.renderItem(item, this.props.getComponent(item));
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, this.el && this.state.connections.map(c => {
      return this.renderConnection(c);
    }))));
  }

  componentDidMount() {
    this.forceUpdate();
  }

}

const roundToGrid = (num, grid) => {
  let down = num - num % grid;
  let up = num + grid - num % grid;
  return Math.abs(num - up) < num - down ? up : down;
};

const target = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const offset = monitor.getClientOffset();
    const x = roundToGrid(offset.x - component.position.left + component.el.scrollLeft, component.props.grid);
    const y = roundToGrid(offset.y - component.position.top + component.el.scrollTop, component.props.grid);

    if (!item.id) {
      component.state.items.push({
        id: component.findNextId(),
        name: item.name,
        group: item.group,
        params: item.getDefault ? item.getDefault() : {},
        position: {
          x,
          y
        }
      });
    }
  }

};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const DropPage = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DropTarget"])('box', target, collect)(DropPageComponent);

/***/ }),

/***/ "./src/pages/floweditor/controlbox.js":
/*!********************************************!*\
  !*** ./src/pages/floweditor/controlbox.js ***!
  \********************************************/
/*! exports provided: Controlbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Controlbox", function() { return Controlbox; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/form */ "./src/components/form/index.js");


class Controlbox extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    const widget = props.item && this.props.nodes.find(w => w.name == props.item.name);

    if (widget && widget.getEditorComponent) {
      const EditorComponent = widget.getEditorComponent();
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        style: this.props.style
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(EditorComponent, {
        item: props.item
      }));
    } else if (widget && widget.getEditorConfig) {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        style: this.props.style
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
        config: widget.getEditorConfig(),
        selected: props.item
      }));
    }

    return null;
  }

}

/***/ }),

/***/ "./src/pages/floweditor/index.js":
/*!***************************************!*\
  !*** ./src/pages/floweditor/index.js ***!
  \***************************************/
/*! exports provided: FlowEditorComponent, FlowEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowEditorComponent", function() { return FlowEditorComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowEditor", function() { return FlowEditor; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dnd-html5-backend */ "./node_modules/react-dnd-html5-backend/lib/cjs/index.js");
/* harmony import */ var react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page */ "./src/pages/floweditor/page.js");




class FlowEditorComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_page__WEBPACK_IMPORTED_MODULE_3__["Page"], {
      devices: this.props.devices,
      rules: this.props.rules
    });
  }

}
const FlowEditor = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DragDropContext"])(react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2___default.a)(FlowEditorComponent);

/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/fire_event.js":
/*!**********************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/fire_event.js ***!
  \**********************************************************/
/*! exports provided: fireeventNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fireeventNode", function() { return fireeventNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");



const fireeventNode = {
  group: 'ACTION',
  name: 'fire event',
  title: 'FIRE EVENT',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const events = Object.keys(_lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].events).map((k, i) => {
      return {
        name: k,
        value: _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].events[k]
      };
    });
    const cfg = {
      groups: {
        params: {
          name: 'FIRE EVENT',
          configs: {
            event: {
              name: 'Event',
              type: 'select',
              options: events
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getText: item => {
    const {
      event
    } = item.params;
    return `event ${event}`;
  },
  toDsl: item => {
    const {
      event
    } = item.params;
    return [`\xF2${Object(_helper__WEBPACK_IMPORTED_MODULE_1__["getString"])(Object(_helper__WEBPACK_IMPORTED_MODULE_1__["toByteArray"])(event, 2))}\x00`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(fireeventNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/get_state.js":
/*!*********************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/get_state.js ***!
  \*********************************************************/
/*! exports provided: getStateNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStateNode", function() { return getStateNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/utils */ "./src/lib/utils.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");




const targetOptions = [{
  name: 'state',
  value: 0
}, {
  name: 'x',
  value: 1
}, {
  name: 'y',
  value: 2
}];
const getStateNode = {
  group: 'ACTION',
  name: 'getstate',
  title: 'GET STATE',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const cfg = {
      groups: {
        params: {
          name: 'Get State',
          configs: {
            device: {
              name: 'Check Device',
              type: 'select',
              options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"]
            },
            value: {
              name: 'Check Value',
              type: 'select',
              options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('params.device')
            },
            target: {
              name: 'Read to',
              type: 'select',
              options: targetOptions
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getText: item => {
    const {
      device,
      value,
      target
    } = item.params;
    if (device === undefined || value === undefined) return 'click to configure';
    const deviceName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].name`);
    const valueName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].state.values[${value}].name`);
    const targetName = targetOptions.find(t => t.value == target).name;
    return `${targetName} = ${deviceName}#${valueName}`;
  },
  toDsl: item => {
    const {
      device,
      value,
      target
    } = item.params;
    return [`\xF7${String.fromCharCode(device)}${String.fromCharCode(target)}${String.fromCharCode(value)}\x01$`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(getStateNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/http.js":
/*!****************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/http.js ***!
  \****************************************************/
/*! exports provided: httpNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "httpNode", function() { return httpNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");


const httpNode = {
  group: 'ACTION',
  name: 'HTTP',
  title: 'HTTP',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const cfg = {
      groups: {
        params: {
          name: 'Set State',
          configs: {
            url: {
              name: 'Url',
              type: 'string',
              var: 'params.url'
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    url: ''
  }),
  getText: item => {
    const {
      url
    } = item.params;
    return `http ${url}`;
  },
  toDsl: item => {
    const {
      url
    } = item.params;
    return [`\xEF${url}\x00`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(httpNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/mqtt.js":
/*!****************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/mqtt.js ***!
  \****************************************************/
/*! exports provided: mqttNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mqttNode", function() { return mqttNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");


const mqttNode = {
  group: 'ACTION',
  name: 'MQTT',
  title: 'MQTT',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const cfg = {
      groups: {
        params: {
          name: 'MQTT',
          configs: {
            topic: {
              name: 'Topic',
              type: 'string',
              var: 'params.topic'
            },
            command: {
              name: 'Command',
              type: 'string',
              var: 'params.command'
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    url: ''
  }),
  getText: item => {
    const {
      url
    } = item.params;
    return `mqtt ${url}`;
  },
  toDsl: item => {
    const {
      url
    } = item.params;
    return [`\xEF${url}\x00`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(mqttNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/set_hw_timer.js":
/*!************************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/set_hw_timer.js ***!
  \************************************************************/
/*! exports provided: setHwTimerNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setHwTimerNode", function() { return setHwTimerNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/utils */ "./src/lib/utils.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");




const units = [{
  name: 'milliseconds',
  value: 0
}, {
  name: 'seconds',
  value: 1
}, {
  name: 'minutes',
  value: 2
}, {
  name: 'hours',
  value: 3
}, {
  name: 'days',
  value: 4
}];
const setHwTimerNode = {
  group: 'ACTION',
  name: 'sethwtimer',
  title: 'SET HW TIMER',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const getTimers = () => {
      return _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get('hardware.timer', []).map((t, i) => ({
        name: `timer_${i}`,
        value: i,
        enabled: t.enabled
      })).filter(t => t.enabled);
    };

    const cfg = {
      groups: {
        params: {
          name: 'Set Hw Timer',
          configs: {
            timer: {
              name: 'Timer',
              type: 'select',
              options: getTimers
            },
            value: {
              name: 'Value',
              type: 'number',
              min: 0,
              max: 43243423
            },
            unit: {
              name: 'Unit',
              type: 'select',
              options: units
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getText: item => {
    const {
      timer,
      value,
      unit
    } = item.params;
    const unitName = units.find(v => v.value == unit).name;
    return `set hwtimer${timer} = ${value}${unitName}`;
  },
  toDsl: item => {
    const {
      timer,
      value,
      unit
    } = item.params;
    const timerCfg = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`hardware.timer.${timer}`);
    const freq = BigInt(80000 / timerCfg.divider);
    let time = BigInt(value);

    switch (unit) {
      //case 'u': break;
      case 1:
        time *= BigInt(1000);
        break;

      case 2:
        time *= BigInt(1000 * 60);
        break;

      case 3:
        time *= BigInt(1000 * 60 * 60);
        break;

      case 4:
        time *= BigInt(1000 * 60 * 60 * 24);
        break;
    }

    const wait = freq * time;
    return [`\xE2${String.fromCharCode(timer)}${Object(_helper__WEBPACK_IMPORTED_MODULE_1__["getString"])(Object(_helper__WEBPACK_IMPORTED_MODULE_1__["toByteArray"])(wait, 8))}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(setHwTimerNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/set_state.js":
/*!*********************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/set_state.js ***!
  \*********************************************************/
/*! exports provided: setStateNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStateNode", function() { return setStateNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/utils */ "./src/lib/utils.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");





const compareValue = type => {
  const checkValue = Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValueType"])('params.device', 'params.value', type);
  return config => {
    if (config.params.val_type != 255) return false;
    return checkValue(config);
  };
};

const setStateNode = {
  group: 'ACTION',
  name: 'setstate',
  title: 'SET STATE',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const isBit = compareValue(0);
    const isByte = compareValue(1);
    const isInt16 = compareValue(2);
    const isInt32 = compareValue(4);
    const isString = compareValue(5);
    const cfg = {
      groups: {
        params: {
          name: 'Set State',
          configs: {
            device: {
              name: 'Check Device',
              type: 'select',
              options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"]
            },
            value: {
              name: 'Check Value',
              type: 'select',
              options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('params.device')
            },
            val_type: {
              name: 'Value',
              type: 'select',
              options: [{
                name: 'state',
                value: 0
              }, {
                name: 'custom',
                value: 255
              }],
              var: 'params.val_type'
            },
            val_string: {
              name: 'String',
              if: isString,
              type: 'string',
              var: 'params.val'
            },
            val_bit: {
              name: 'Bit',
              if: isBit,
              type: 'select',
              options: [0, 1],
              var: 'params.val'
            },
            val_byte: {
              name: 'Byte',
              if: isByte,
              type: 'number',
              min: 0,
              max: 255,
              var: 'params.val'
            },
            val_int16: {
              name: 'Int16',
              if: isInt16,
              type: 'number',
              min: 0,
              max: 65535,
              var: 'params.val'
            },
            val_int32: {
              name: 'Int32',
              if: isInt32,
              type: 'number',
              min: 0,
              max: 4294967295,
              var: 'params.val'
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    val_type: 0,
    val: 0
  }),
  getText: item => {
    const {
      device,
      value,
      val
    } = item.params;
    if (device === undefined || value === undefined) return 'click to configure';
    const deviceName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].name`);
    const valueName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].state.values[${value}].name`);
    return `set ${deviceName}#${valueName} = ${val}`;
  },
  toDsl: item => {
    const {
      device,
      value,
      val
    } = item.params;
    return [`\xF0${String.fromCharCode(device)}${String.fromCharCode(value)}\x01${String.fromCharCode(val)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(setStateNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/actions/set_timer.js":
/*!*********************************************************!*\
  !*** ./src/pages/floweditor/nodes/actions/set_timer.js ***!
  \*********************************************************/
/*! exports provided: settimerNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settimerNode", function() { return settimerNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");


const settimerNode = {
  group: 'ACTION',
  name: 'settimer',
  title: 'SET TIMER',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    const cfg = {
      groups: {
        params: {
          name: 'SET TIMER',
          configs: {
            timer: {
              name: 'Timer',
              type: 'select',
              options: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            value: {
              name: 'Value',
              type: 'number',
              min: 0,
              max: 255
            }
          }
        }
      }
    };
    return cfg;
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    url: ''
  }),
  getText: item => {
    const {
      timer,
      value
    } = item.params;
    return `timer${timer} = ${value}`;
  },
  toDsl: item => {
    const {
      timer,
      value
    } = item.params;
    return [`\xF3${String.fromCharCode(timer)}${String.fromCharCode(value)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(settimerNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/device.js":
/*!**********************************************!*\
  !*** ./src/pages/floweditor/nodes/device.js ***!
  \**********************************************/
/*! exports provided: getDeviceNodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDeviceNodes", function() { return getDeviceNodes; });
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/utils */ "./src/lib/utils.js");



const eqOptions = ['', '=', '<', '>', '<=', '>=', '!='];

const compareValue = type => {
  const checkValue = Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValueType"])('params.device', 'params.value', type);
  return config => {
    if (config.params.eq == '') return false;
    return checkValue(config);
  };
};

const getDeviceNode = device => {
  const deviceNode = {
    group: 'TRIGGER',
    name: device.id,
    title: device.name,
    inputs: 0,
    outputs: 1,
    getEditorConfig: () => {
      const isBit = compareValue(0);
      const isByte = compareValue(1);
      const isInt16 = compareValue(2);
      const isInt32 = compareValue(4);
      const isString = compareValue(5);
      const cfg = {
        groups: {
          params: {
            name: device.name,
            configs: {
              value: {
                name: 'Check Value',
                type: 'select',
                options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('params.device')
              },
              eq: {
                name: 'Check',
                type: 'select',
                options: eqOptions
              },
              val_string: {
                name: 'String',
                if: isString,
                type: 'string',
                var: 'params.val'
              },
              val_bit: {
                name: 'Bit',
                if: isBit,
                type: 'select',
                options: [0, 1],
                var: 'params.val'
              },
              val_byte: {
                name: 'Byte',
                if: isByte,
                type: 'number',
                min: 0,
                max: 255,
                var: 'params.val'
              },
              val_int16: {
                name: 'Int16',
                if: isInt16,
                type: 'number',
                min: 0,
                max: 65535,
                var: 'params.val'
              },
              val_int32: {
                name: 'Int32',
                if: isInt32,
                type: 'number',
                min: 0,
                max: 4294967295,
                var: 'params.val'
              }
            }
          }
        }
      };
      return cfg;
    },
    getDefault: () => ({
      device: device.id,
      eq: ''
    }),
    getComponent: () => {
      return component;
    },
    getText: item => {
      const {
        value,
        eq,
        val
      } = item.params;
      const valueName = _lib_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get(`plugins[${device.id}].state.values[${value}].name`);
      return `on ${device.name}#${valueName} ${eq} ${val}`;
    },
    toDsl: item => {
      const {
        value,
        eq,
        val
      } = item.params;
      const comp = eqOptions.findIndex(o => o == eq);
      const comparison = eq === '' ? `\x00\x01` : `${String.fromCharCode(comp)}\x01${String.fromCharCode(val)}`;
      return [`\xFF\xFE\x00\xFF\x00${String.fromCharCode(device.id)}${String.fromCharCode(value)}${comparison}%%output%%\xFF`];
    }
  };
  const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(deviceNode);
  return deviceNode;
};

const getDeviceNodes = () => {
  return _lib_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('plugins', []).map(p => getDeviceNode(p)).flat();
};

/***/ }),

/***/ "./src/pages/floweditor/nodes/helper.js":
/*!**********************************************!*\
  !*** ./src/pages/floweditor/nodes/helper.js ***!
  \**********************************************/
/*! exports provided: generateWidgetComponent, toByteArray, getString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateWidgetComponent", function() { return generateWidgetComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toByteArray", function() { return toByteArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getString", function() { return getString; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/floweditor/nodes/widget.js");


const generateWidgetComponent = node => {
  return class WidgetComponent extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
    constructor(props) {
      super(props);
      this.node = node;
    }

    renderComponent() {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, node.getText(this.props.item));
    }

  };
};
function toByteArray(x, n) {
  var hexString = x.toString(16);
  if (hexString.length % 2 > 0) hexString = "0" + hexString;
  var byteArray = [];

  for (var i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.slice(i, i + 2), 16));
  }

  while (byteArray.length < n) byteArray = [0, ...byteArray];

  return byteArray;
}
const getString = bytes => {
  let res = '';

  for (let i = bytes.length - 1; i >= 0; i--) {
    res += String.fromCharCode(bytes[i]);
  }

  return res;
};

/***/ }),

/***/ "./src/pages/floweditor/nodes/index.js":
/*!*********************************************!*\
  !*** ./src/pages/floweditor/nodes/index.js ***!
  \*********************************************/
/*! exports provided: getNodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodes", function() { return getNodes; });
/* harmony import */ var _actions_set_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/set_state */ "./src/pages/floweditor/nodes/actions/set_state.js");
/* harmony import */ var _logic_if_else__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logic/if_else */ "./src/pages/floweditor/nodes/logic/if_else.js");
/* harmony import */ var _triggers_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./triggers/timer */ "./src/pages/floweditor/nodes/triggers/timer.js");
/* harmony import */ var _triggers_event__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./triggers/event */ "./src/pages/floweditor/nodes/triggers/event.js");
/* harmony import */ var _triggers_clock__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./triggers/clock */ "./src/pages/floweditor/nodes/triggers/clock.js");
/* harmony import */ var _triggers_boot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./triggers/boot */ "./src/pages/floweditor/nodes/triggers/boot.js");
/* harmony import */ var _triggers_hw_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./triggers/hw_timer */ "./src/pages/floweditor/nodes/triggers/hw_timer.js");
/* harmony import */ var _triggers_hw_interrupt__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./triggers/hw_interrupt */ "./src/pages/floweditor/nodes/triggers/hw_interrupt.js");
/* harmony import */ var _triggers_touch__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./triggers/touch */ "./src/pages/floweditor/nodes/triggers/touch.js");
/* harmony import */ var _triggers_bluetooth__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./triggers/bluetooth */ "./src/pages/floweditor/nodes/triggers/bluetooth.js");
/* harmony import */ var _triggers_alexa__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./triggers/alexa */ "./src/pages/floweditor/nodes/triggers/alexa.js");
/* harmony import */ var _logic_delay__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./logic/delay */ "./src/pages/floweditor/nodes/logic/delay.js");
/* harmony import */ var _actions_mqtt__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./actions/mqtt */ "./src/pages/floweditor/nodes/actions/mqtt.js");
/* harmony import */ var _actions_http__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./actions/http */ "./src/pages/floweditor/nodes/actions/http.js");
/* harmony import */ var _actions_fire_event__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./actions/fire_event */ "./src/pages/floweditor/nodes/actions/fire_event.js");
/* harmony import */ var _actions_set_timer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./actions/set_timer */ "./src/pages/floweditor/nodes/actions/set_timer.js");
/* harmony import */ var _actions_get_state__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./actions/get_state */ "./src/pages/floweditor/nodes/actions/get_state.js");
/* harmony import */ var _actions_set_hw_timer__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./actions/set_hw_timer */ "./src/pages/floweditor/nodes/actions/set_hw_timer.js");
/* harmony import */ var _logic_math__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./logic/math */ "./src/pages/floweditor/nodes/logic/math.js");
/* harmony import */ var _device__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./device */ "./src/pages/floweditor/nodes/device.js");




















const getNodes = () => [...Object(_device__WEBPACK_IMPORTED_MODULE_19__["getDeviceNodes"])(), _triggers_timer__WEBPACK_IMPORTED_MODULE_2__["timerNode"], _triggers_hw_timer__WEBPACK_IMPORTED_MODULE_6__["hwtimerNode"], _triggers_hw_interrupt__WEBPACK_IMPORTED_MODULE_7__["hwinterruptNode"], _triggers_touch__WEBPACK_IMPORTED_MODULE_8__["touchNode"], _triggers_bluetooth__WEBPACK_IMPORTED_MODULE_9__["bluetoothNode"], _triggers_alexa__WEBPACK_IMPORTED_MODULE_10__["alexaNode"], _triggers_event__WEBPACK_IMPORTED_MODULE_3__["eventNode"], _triggers_clock__WEBPACK_IMPORTED_MODULE_4__["clockNode"], _triggers_boot__WEBPACK_IMPORTED_MODULE_5__["bootNode"], _logic_if_else__WEBPACK_IMPORTED_MODULE_1__["ifElseNode"], _logic_delay__WEBPACK_IMPORTED_MODULE_11__["delayNode"], _logic_math__WEBPACK_IMPORTED_MODULE_18__["mathNode"], _actions_get_state__WEBPACK_IMPORTED_MODULE_16__["getStateNode"], _actions_set_state__WEBPACK_IMPORTED_MODULE_0__["setStateNode"], _actions_fire_event__WEBPACK_IMPORTED_MODULE_14__["fireeventNode"], _actions_set_timer__WEBPACK_IMPORTED_MODULE_15__["settimerNode"], _actions_set_hw_timer__WEBPACK_IMPORTED_MODULE_17__["setHwTimerNode"], _actions_mqtt__WEBPACK_IMPORTED_MODULE_12__["mqttNode"], _actions_http__WEBPACK_IMPORTED_MODULE_13__["httpNode"]];

/***/ }),

/***/ "./src/pages/floweditor/nodes/logic/delay.js":
/*!***************************************************!*\
  !*** ./src/pages/floweditor/nodes/logic/delay.js ***!
  \***************************************************/
/*! exports provided: delayNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delayNode", function() { return delayNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");


const delayNode = {
  group: 'LOGIC',
  name: 'delay',
  title: 'DELAY',
  inputs: 1,
  outputs: 1,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Delay',
          configs: {
            val: {
              name: 'Value',
              type: 'string'
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getText: item => {
    const {
      val
    } = item.props;
    return `DELAY ${val}`;
  },
  toDsl: () => {
    const {
      val
    } = item.props;
    return [`\xF4${String.fromCharCode(val)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(delayNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/logic/if_else.js":
/*!*****************************************************!*\
  !*** ./src/pages/floweditor/nodes/logic/if_else.js ***!
  \*****************************************************/
/*! exports provided: ifElseNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ifElseNode", function() { return ifElseNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/utils */ "./src/lib/utils.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");




const eqOptions = ['changed', '=', '<', '>', '<=', '>=', '!='];

const compareValue = type => {
  const checkValue = Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValueType"])('params.device', 'params.value', type);
  return config => {
    if (config.params.val_type != 255) return false;
    return checkValue(config);
  };
};

const ifElseNode = {
  group: 'LOGIC',
  name: 'if/else',
  title: 'IF / ELSE',
  inputs: 1,
  outputs: 2,
  getEditorConfig: () => {
    const isBit = compareValue(0);
    const isByte = compareValue(1);
    const isInt16 = compareValue(2);
    const isInt32 = compareValue(4);
    const isString = compareValue(5);

    const notChanged = config => {
      console.log(config.params);
      return config.params.eq != 'changed';
    };

    return {
      groups: {
        params: {
          name: 'IF',
          configs: {
            device: {
              name: 'Check Device',
              type: 'select',
              options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"]
            },
            value: {
              name: 'Check Value',
              type: 'select',
              options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('params.device')
            },
            eq: {
              name: 'Check',
              type: 'select',
              options: eqOptions
            },
            val_type: {
              name: 'Value',
              type: 'select',
              if: notChanged,
              options: [{
                name: 'state',
                value: 0
              }, {
                name: 'custom',
                value: 255
              }],
              var: 'params.val_type'
            },
            val_string: {
              name: 'String',
              if: isString,
              type: 'string',
              var: 'params.val'
            },
            val_bit: {
              name: 'Bit',
              if: isBit,
              type: 'select',
              options: [0, 1],
              var: 'params.val'
            },
            val_byte: {
              name: 'Byte',
              if: isByte,
              type: 'number',
              min: 0,
              max: 255,
              var: 'params.val'
            },
            val_int16: {
              name: 'Int16',
              if: isInt16,
              type: 'number',
              min: 0,
              max: 65535,
              var: 'params.val'
            },
            val_int32: {
              name: 'Int32',
              if: isInt32,
              type: 'number',
              min: 0,
              max: 4294967295,
              var: 'params.val'
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    state: 255,
    val: 0
  }),
  getText: item => {
    const {
      device,
      value,
      val,
      eq,
      val_type
    } = item.params;
    if (device === undefined || value === undefined) return 'click to configure';
    const deviceName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].name`);
    const valueName = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get(`plugins[${device}].state.values[${value}].name`);
    let text = `IF ${deviceName}#${valueName} ${eq} `;

    if (eq !== 'changed') {
      text += val_type ? val : '[state]';
    }

    return text;
  },
  toDsl: item => {
    const {
      device,
      value,
      val,
      eq,
      val_type
    } = item.params;
    const comp = eqOptions.findIndex(o => o == eq);
    const sendval = val_type === 0 ? 255 : val;
    return [`\xFC\x01${String.fromCharCode(device)}${String.fromCharCode(value)}${String.fromCharCode(comp)}\x01${String.fromCharCode(sendval)}%%output%%`, `\xFD%%output%%\xFE`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(ifElseNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/logic/math.js":
/*!**************************************************!*\
  !*** ./src/pages/floweditor/nodes/logic/math.js ***!
  \**************************************************/
/*! exports provided: mathNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mathNode", function() { return mathNode; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lib/utils */ "./src/lib/utils.js");



const mathNode = {
  group: 'LOGIC',
  name: 'math',
  title: 'MATH',
  inputs: 1,
  outputs: 2,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Expression',
          configs: {
            expr: {
              name: '',
              type: 'string',
              help: 'tinymath expression, available vars: "state", "x" and "y"'
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    expr: 'state'
  }),
  getText: item => {
    const {
      expr
    } = item.params;
    return 'state = ' + expr;
  },
  toDsl: item => {
    const {
      expr
    } = item.params;
    return [`\xEE${expr}\x00`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["generateWidgetComponent"])(mathNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/alexa.js":
/*!******************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/alexa.js ***!
  \******************************************************/
/*! exports provided: alexaNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "alexaNode", function() { return alexaNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");



const alexaOptions = () => {
  return _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('alexa.triggers', []).map((t, i) => ({
    name: t.name,
    value: i
  }));
};

const alexaNode = {
  group: 'TRIGGERS',
  name: 'alexa',
  title: 'ALEXA',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Alexa',
          configs: {
            trigger: {
              name: 'Trigger',
              type: 'select',
              options: alexaOptions
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    touch: 0
  }),
  getText: item => {
    const t = item.params && item.params.trigger;
    return `on alexa ${t}`;
  },
  toDsl: item => {
    const t = item.params && item.params.trigger || 0;
    return [`\xFF\xFE\x00\xFF\x06${String.fromCharCode(t)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(alexaNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/bluetooth.js":
/*!**********************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/bluetooth.js ***!
  \**********************************************************/
/*! exports provided: bluetoothNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bluetoothNode", function() { return bluetoothNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");


const bluetoothNode = {
  group: 'TRIGGERS',
  name: 'bluetooth',
  title: 'BLUETOOTH',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    const btOptions = () => {
      return _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('bluetooth.server.values', []).map((t, i) => ({
        name: t.name,
        value: i
      }));
    };

    return {
      groups: {
        params: {
          name: 'Bluetooth',
          configs: {
            value: {
              name: 'Trigger',
              type: 'select',
              options: btOptions
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    touch: 0
  }),
  getText: item => {
    const t = item.params && item.params.value;
    return `on bt ${t}`;
  },
  toDsl: item => {
    const t = item.params && item.params.value || 0;
    return [`\xFF\xFE\x00\xFF\x09${String.fromCharCode(t)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(bluetoothNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/boot.js":
/*!*****************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/boot.js ***!
  \*****************************************************/
/*! exports provided: bootNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bootNode", function() { return bootNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");

const bootNode = {
  group: 'TRIGGERS',
  name: 'system boot',
  title: 'BOOT',
  inputs: 0,
  outputs: 1,
  getComponent: () => {
    return component;
  },
  getText: item => {
    return `on boot`;
  },
  toDsl: function (item, {
    events
  }) {
    return [`\xFF\xFE\x00\xFF\x03\x01`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(bootNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/clock.js":
/*!******************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/clock.js ***!
  \******************************************************/
/*! exports provided: clockNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clockNode", function() { return clockNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");

const clockNode = {
  group: 'TRIGGERS',
  name: 'clock',
  title: 'CRON',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Cron',
          configs: {
            expr: {
              name: 'Cron Expr',
              type: 'string'
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    expr: '* * * * * *'
  }),
  getText: item => {
    const t = item.params && item.params.expr;
    return `on ${t}`;
  },
  toDsl: function (item, {
    events
  }) {
    const t = item.params && item.params.expr;
    return [`\xFF\xFE\x00\xFF\x08${t}\x00`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(clockNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/event.js":
/*!******************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/event.js ***!
  \******************************************************/
/*! exports provided: eventNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventNode", function() { return eventNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");

const eventNode = {
  group: 'TRIGGERS',
  name: 'event',
  title: 'EVENT',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Event',
          configs: {
            event: {
              name: 'Event',
              type: 'string'
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    event: ''
  }),
  getText: item => {
    const t = item.params && item.params.event;
    return `on ${t}`;
  },
  toDsl: function (item, {
    events
  }) {
    const event = events.find(e => e.name === item.params.event);
    if (!event) return null;
    return [`\xFF\xFE\x00\xFF\x01${Object(_helper__WEBPACK_IMPORTED_MODULE_0__["getString"])(Object(_helper__WEBPACK_IMPORTED_MODULE_0__["toByteArray"])(event.value, 2))}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(eventNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/hw_interrupt.js":
/*!*************************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/hw_interrupt.js ***!
  \*************************************************************/
/*! exports provided: hwinterruptNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hwinterruptNode", function() { return hwinterruptNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");


const hwinterruptNode = {
  group: 'TRIGGERS',
  name: 'hardware interrupt',
  title: 'HW INTERRUPT',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    return {
      groups: {
        params: {
          name: 'Interrupt',
          configs: {
            int: {
              name: 'pin',
              type: 'select',
              options: window.io_pins.getPins('interrupt')
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    timer: 0
  }),
  getText: item => {
    const t = item.params && item.params.int;
    return `on interrupt ${t}`;
  },
  toDsl: item => {
    const i = item.params && item.params.int || 0;
    return [`\xFF\xFE\x00\xFF\x05${String.fromCharCode(i)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(hwinterruptNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/hw_timer.js":
/*!*********************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/hw_timer.js ***!
  \*********************************************************/
/*! exports provided: hwtimerNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hwtimerNode", function() { return hwtimerNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");


const hwtimerNode = {
  group: 'TRIGGERS',
  name: 'hardware timer',
  title: 'HW TIMER',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    const timerOption = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('hardware.timer', []).map((t, i) => ({
      name: `timer_${i}`,
      value: i,
      enabled: t.enabled
    })).filter(t => t.enabled);
    return {
      groups: {
        params: {
          name: 'HwTimer',
          configs: {
            timer: {
              name: 'Timer',
              type: 'select',
              options: timerOption
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    timer: 0
  }),
  getText: item => {
    const t = item.params && item.params.timer;
    return `on hw_timer${t}`;
  },
  toDsl: item => {
    const timer = item.params && item.params.timer || 0;
    return [`\xFF\xFE\x00\xFF\x04${String.fromCharCode(timer)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(hwtimerNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/timer.js":
/*!******************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/timer.js ***!
  \******************************************************/
/*! exports provided: timerNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timerNode", function() { return timerNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");

const timerNode = {
  group: 'TRIGGERS',
  name: 'timer',
  title: 'TIMER',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    const timerOption = [0, 1, 2, 3, 4, 5, 6, 7];
    return {
      groups: {
        params: {
          name: 'Timer',
          configs: {
            timer: {
              name: 'Timer',
              type: 'select',
              options: timerOption
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    timer: 0
  }),
  getText: item => {
    const t = item.params && item.params.timer;
    return `on timer${t}`;
  },
  toDsl: item => {
    const timer = item.params && item.params.timer || 0;
    return [`\xFF\xFE\x00\xFF\x02${String.fromCharCode(timer)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(timerNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/triggers/touch.js":
/*!******************************************************!*\
  !*** ./src/pages/floweditor/nodes/triggers/touch.js ***!
  \******************************************************/
/*! exports provided: touchNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "touchNode", function() { return touchNode; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/pages/floweditor/nodes/helper.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/settings */ "./src/lib/settings.js");


const touchNode = {
  group: 'TRIGGERS',
  name: 'touch',
  title: 'TOUCH',
  inputs: 0,
  outputs: 1,
  getEditorConfig: () => {
    const touchOptions = () => {
      const getTouch = pin => [4, 0, 2, 15, 13, 12, 14, 27, 33, 32].findIndex(x => x == pin);

      return _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('hardware.gpio', []).map((t, i) => t && t.mode == 4 ? {
        name: `GPIO ${i}`,
        value: getTouch(i)
      } : null).filter(gpio => gpio);
    };

    return {
      groups: {
        params: {
          name: 'Touch',
          configs: {
            touch: {
              name: 'pin',
              type: 'select',
              options: touchOptions
            }
          }
        }
      }
    };
  },
  getComponent: () => {
    return component;
  },
  getDefault: () => ({
    touch: 0
  }),
  getText: item => {
    const t = item.params && item.params.touch;
    return `on touch${t}`;
  },
  toDsl: item => {
    const t = item.params && item.params.touch || 0;
    return [`\xFF\xFE\x00\xFF\x07${String.fromCharCode(t)}`];
  }
};
const component = Object(_helper__WEBPACK_IMPORTED_MODULE_0__["generateWidgetComponent"])(touchNode);


/***/ }),

/***/ "./src/pages/floweditor/nodes/widget.js":
/*!**********************************************!*\
  !*** ./src/pages/floweditor/nodes/widget.js ***!
  \**********************************************/
/*! exports provided: Widget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Widget", function() { return Widget; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget_output__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget_output */ "./src/pages/floweditor/nodes/widget_output.js");
/* harmony import */ var _widget_input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./widget_input */ "./src/pages/floweditor/nodes/widget_input.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




const style = {
  cursor: 'move'
};
class Widget extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onMouseMove", e => {
      this.props.onMouseMove({
        x: e.pageX - this.offset[0],
        y: e.pageY - this.offset[1]
      }, this.props.item);
    });

    _defineProperty(this, "onMouseDown", e => {
      this.offset = [e.layerX, e.layerY];
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    });

    _defineProperty(this, "onMouseUp", () => {
      this.offset = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    });
  }

  render() {
    const item = this.props.item;
    const className = `node group-${item.group}`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: { ...style
      },
      className: className,
      onClick: () => {
        this.props.onClickHandler(item);
      }
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      className: "node-inputs"
    }, [...new Array(this.node.inputs)].map(() => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_widget_input__WEBPACK_IMPORTED_MODULE_2__["WidgetInput"], {
        node: item
      });
    })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      className: "node-outputs"
    }, [...new Array(this.node.outputs)].map((x, i) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_widget_output__WEBPACK_IMPORTED_MODULE_1__["WidgetOutput"], {
        node: item,
        o: i,
        onArrow: this.props.onArrow
      });
    })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: {
        display: 'inline-block'
      },
      ref: e => this.base = e,
      onContextMenu: e => {
        e.preventDefault();
        this.props.onRightClickHandler(item);
      }
    }, this.renderComponent()));
  }

  componentDidMount() {
    this.base.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    this.base.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

}

/***/ }),

/***/ "./src/pages/floweditor/nodes/widget_connection.js":
/*!*********************************************************!*\
  !*** ./src/pages/floweditor/nodes/widget_connection.js ***!
  \*********************************************************/
/*! exports provided: WidgetConnection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidgetConnection", function() { return WidgetConnection; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

class WidgetConnection extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  setPath(x1, y1, x2, y2, tension = 0.5) {
    const delta = (x2 - x1) * tension;
    const hx1 = x1 + delta;
    const hy1 = y1;
    const hx2 = x2 - delta;
    const hy2 = y2;
    const path = `M ${x1} ${y1} C ${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`;
    return path;
  }

  render() {
    const style = {
      'z-index': '-1',
      position: 'absolute',
      top: '0',
      left: '0'
    };
    const {
      fill,
      color
    } = this.props;
    const path = this.setPath(this.props.from[0], this.props.from[1], this.props.to[0], this.props.to[1]);
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("svg", {
      width: "100%",
      height: "100%",
      style: style
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("path", {
      fill: fill,
      stroke: color,
      d: path
    }));
  }

}

/***/ }),

/***/ "./src/pages/floweditor/nodes/widget_input.js":
/*!****************************************************!*\
  !*** ./src/pages/floweditor/nodes/widget_input.js ***!
  \****************************************************/
/*! exports provided: WidgetInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidgetInput", function() { return WidgetInput; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

class WidgetInput extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    const id = `node-${this.props.node.id}-i-0`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: id,
      className: "node-input"
    });
  }

}

/***/ }),

/***/ "./src/pages/floweditor/nodes/widget_output.js":
/*!*****************************************************!*\
  !*** ./src/pages/floweditor/nodes/widget_output.js ***!
  \*****************************************************/
/*! exports provided: WidgetOutput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidgetOutput", function() { return WidgetOutput; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget_connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget_connection */ "./src/pages/floweditor/nodes/widget_connection.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class WidgetOutput extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onRightclick", e => {
      this.props.onArrow(this.el, null);
      e.preventDefault();
      e.stopPropagation();
    });

    _defineProperty(this, "onMouseMove", e => {
      this.props.onArrow(this.el, {
        x: e.pageX - this.offset[0],
        y: e.pageY - this.offset[1]
      });
    });

    _defineProperty(this, "onMouseDown", e => {
      this.offset = [e.layerX, e.layerY];
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      e.preventDefault();
      e.stopPropagation();
    });

    _defineProperty(this, "onMouseUp", e => {
      this.offset = null;
      const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      const input = elemBelow ? elemBelow.closest('.node-input') : null;

      if (!input) {
        this.props.onArrow(this.el, null);
      } else {
        this.props.onArrow(this.el, input.id); // const inputRect = input.getBoundingClientRect();
        // this.setState({ x: inputRect.x, y: inputRect.y + inputRect.height/2 });
        //lineSvg.setPath(x1, y1, x2, y2);
        // const connection = {
        //     output,
        //     input,
        //     svg: lineSvg,
        //     start: { x: x1, y: y1 },
        //     end: { x: x2, y: y2 },
        // };
        // output.lines.push(connection);
        // input.lines.push(connection);
      }

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    });
  }

  render() {
    const id = `node-${this.props.node.id}-o-${this.props.o}`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: id,
      className: "node-output",
      ref: el => this.el = el,
      onContextMenu: this.onRightclick
    });
  }

  componentDidMount() {
    this.el.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    this.el.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

}

/***/ }),

/***/ "./src/pages/floweditor/page.js":
/*!**************************************!*\
  !*** ./src/pages/floweditor/page.js ***!
  \**************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return Page; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _controlbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controlbox */ "./src/pages/floweditor/controlbox.js");
/* harmony import */ var _DropPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DropPage */ "./src/pages/floweditor/DropPage.js");
/* harmony import */ var _toolbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toolbox */ "./src/pages/floweditor/toolbox.js");
/* harmony import */ var _nodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes */ "./src/pages/floweditor/nodes/index.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const containerStyle = {
  height: 'calc(100vh - 52px)',
  flex: '1 1 auto',
  display: 'flex'
};
class Page extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onClickHandler", item => {
      this.setState({
        selected: item
      });
    });

    _defineProperty(this, "getItemComponent", item => {
      const node = this.nodes.find(n => n.name == item.name);
      return node.getComponent();
    });

    this.state = {
      selected: null,
      nodes: null
    };
    this.nodes = Object(_nodes__WEBPACK_IMPORTED_MODULE_4__["getNodes"])();
  }

  render() {
    const pageStyle = {
      position: 'relative',
      overflow: 'auto',
      flex: '1 1 85%'
    };
    const toolboxStyle = {
      flex: '1 1 15%',
      overflow: 'auto',
      'min-width': '240px'
    };
    const toolboxItemStyle = {
      width: '220px',
      margin: '1px'
    };
    const controlStyle = {
      border: '1px solid gray',
      padding: '20px',
      width: '300px'
    };
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "canvas",
      style: containerStyle
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_toolbox__WEBPACK_IMPORTED_MODULE_3__["Toolbox"], {
      style: toolboxStyle,
      itemStyle: toolboxItemStyle,
      nodes: this.nodes
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_DropPage__WEBPACK_IMPORTED_MODULE_2__["DropPage"], {
      style: pageStyle,
      rules: this.props.rules,
      grid: "5",
      getComponent: this.getItemComponent,
      onSelect: this.onClickHandler
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_controlbox__WEBPACK_IMPORTED_MODULE_1__["Controlbox"], {
      style: controlStyle,
      item: this.state.selected,
      nodes: this.nodes
    }));
  }

}

/***/ }),

/***/ "./src/pages/floweditor/toolbox.js":
/*!*****************************************!*\
  !*** ./src/pages/floweditor/toolbox.js ***!
  \*****************************************/
/*! exports provided: Toolbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Toolbox", function() { return Toolbox; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _toolbox_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toolbox_item */ "./src/pages/floweditor/toolbox_item.js");


class Toolbox extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: this.props.style
    }, this.props.nodes.map(widget => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_toolbox_item__WEBPACK_IMPORTED_MODULE_1__["ToolboxItem"], {
        itemStyle: this.props.itemStyle,
        widget: widget
      });
    }));
  }

}

/***/ }),

/***/ "./src/pages/floweditor/toolbox_item.js":
/*!**********************************************!*\
  !*** ./src/pages/floweditor/toolbox_item.js ***!
  \**********************************************/
/*! exports provided: ToolboxItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolboxItem", function() { return ToolboxItem; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);


const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  'border-radius': '5px',
  'text-align': 'center',
  padding: '5px 10px',
  cursor: 'move'
};
const boxSource = {
  beginDrag(props) {
    return props.widget;
  }

};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

class ToolboxItemComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    const {
      isDragging,
      connectDragSource,
      itemStyle
    } = this.props;
    const {
      title,
      group
    } = this.props.widget;
    const opacity = isDragging ? '0.4' : '1';
    const className = `node group-${group}`;
    return connectDragSource(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      className: className,
      style: { ...style,
        ...itemStyle,
        opacity
      }
    }, title));
  }

}

const ToolboxItem = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DragSource"])('box', boxSource, collect)(ToolboxItemComponent);

/***/ }),

/***/ "./src/pages/fs.js":
/*!*************************!*\
  !*** ./src/pages/fs.js ***!
  \*************************/
/*! exports provided: FSPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FSPage", function() { return FSPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");



class FSPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };

    this.saveForm = async () => {
      _lib_loader__WEBPACK_IMPORTED_MODULE_2__["loader"].show();
      await Object(_lib_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])(this.file.files[0]);
      await this.fetch();
    };

    this.deleteFile = e => {
      const fileName = e.currentTarget.dataset.name;
      Object(_lib_esp__WEBPACK_IMPORTED_MODULE_1__["deleteFile"])(fileName).then(() => this.fetch());
    };
  }

  fetch() {
    fetch('/filelist').then(response => response.json()).then(fileList => {
      this.setState({
        files: fileList
      });
    });
  }

  render(props) {
    _lib_loader__WEBPACK_IMPORTED_MODULE_2__["loader"].hide();
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      class: "pure-form pure-form-aligned"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "pure-control-group"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", {
      for: "file",
      class: "pure-checkbox"
    }, "File:"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      id: "file",
      type: "file",
      ref: ref => this.file = ref
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.saveForm
    }, "upload"))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("table", {
      class: "pure-table"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("thead", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("tr", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("th", null, "File"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("th", null, "Size"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("th", null))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("tbody", null, this.state.files.map(file => {
      const url = `/${file.file}`;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("tr", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("td", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: url
      }, file.file)), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("td", null, file.size), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("td", null, file.file === 'config.json' ? null : Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
        type: "button",
        onClick: this.deleteFile,
        "data-name": file.file
      }, "X")));
    }))));
  }

  componentDidMount() {
    this.fetch();
  }

}

/***/ }),

/***/ "./src/pages/index.js":
/*!****************************!*\
  !*** ./src/pages/index.js ***!
  \****************************/
/*! exports provided: ControllersPage, DashboardPage, DevicesPage, ConfigPage, ConfigAdvancedPage, types, ConfigBluetoothPage, pins, ConfigHardwarePage, ConfigPluginsPage, ConfigLCDPage, ConfigLCDScreenPage, ConfigLCDWidgetPage, RebootPage, LoadPage, UpdatePage, RulesPage, ToolsPage, FSPage, FactoryResetPage, DiscoverPage, ControllerAlexaPage, ControllerAlertsPage, AlertsPage, AlertsEditPage, DevicesEditPage, DiffPage, RulesEditorPage, SetupPage, SysVarsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controllers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers */ "./src/pages/controllers.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllersPage", function() { return _controllers__WEBPACK_IMPORTED_MODULE_0__["ControllersPage"]; });

/* harmony import */ var _dashboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard */ "./src/pages/dashboard.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DashboardPage", function() { return _dashboard__WEBPACK_IMPORTED_MODULE_1__["DashboardPage"]; });

/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./devices */ "./src/pages/devices.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DevicesPage", function() { return _devices__WEBPACK_IMPORTED_MODULE_2__["DevicesPage"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./src/pages/config.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigPage", function() { return _config__WEBPACK_IMPORTED_MODULE_3__["ConfigPage"]; });

/* harmony import */ var _config_advanced__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.advanced */ "./src/pages/config.advanced.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigAdvancedPage", function() { return _config_advanced__WEBPACK_IMPORTED_MODULE_4__["ConfigAdvancedPage"]; });

/* harmony import */ var _config_bluetooth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config.bluetooth */ "./src/pages/config.bluetooth.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "types", function() { return _config_bluetooth__WEBPACK_IMPORTED_MODULE_5__["types"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigBluetoothPage", function() { return _config_bluetooth__WEBPACK_IMPORTED_MODULE_5__["ConfigBluetoothPage"]; });

/* harmony import */ var _config_hardware__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.hardware */ "./src/pages/config.hardware.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pins", function() { return _config_hardware__WEBPACK_IMPORTED_MODULE_6__["pins"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigHardwarePage", function() { return _config_hardware__WEBPACK_IMPORTED_MODULE_6__["ConfigHardwarePage"]; });

/* harmony import */ var _config_plugins__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config.plugins */ "./src/pages/config.plugins.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigPluginsPage", function() { return _config_plugins__WEBPACK_IMPORTED_MODULE_7__["ConfigPluginsPage"]; });

/* harmony import */ var _config_lcd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./config.lcd */ "./src/pages/config.lcd.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDPage", function() { return _config_lcd__WEBPACK_IMPORTED_MODULE_8__["ConfigLCDPage"]; });

/* harmony import */ var _config_lcd_screen__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./config.lcd.screen */ "./src/pages/config.lcd.screen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDScreenPage", function() { return _config_lcd_screen__WEBPACK_IMPORTED_MODULE_9__["ConfigLCDScreenPage"]; });

/* harmony import */ var _config_lcd_widget__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./config.lcd.widget */ "./src/pages/config.lcd.widget.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigLCDWidgetPage", function() { return _config_lcd_widget__WEBPACK_IMPORTED_MODULE_10__["ConfigLCDWidgetPage"]; });

/* harmony import */ var _reboot__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./reboot */ "./src/pages/reboot.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RebootPage", function() { return _reboot__WEBPACK_IMPORTED_MODULE_11__["RebootPage"]; });

/* harmony import */ var _load__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./load */ "./src/pages/load.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadPage", function() { return _load__WEBPACK_IMPORTED_MODULE_12__["LoadPage"]; });

/* harmony import */ var _update__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./update */ "./src/pages/update.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdatePage", function() { return _update__WEBPACK_IMPORTED_MODULE_13__["UpdatePage"]; });

/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./rules */ "./src/pages/rules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RulesPage", function() { return _rules__WEBPACK_IMPORTED_MODULE_14__["RulesPage"]; });

/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tools */ "./src/pages/tools.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ToolsPage", function() { return _tools__WEBPACK_IMPORTED_MODULE_15__["ToolsPage"]; });

/* harmony import */ var _fs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./fs */ "./src/pages/fs.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FSPage", function() { return _fs__WEBPACK_IMPORTED_MODULE_16__["FSPage"]; });

/* harmony import */ var _factory_reset__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./factory_reset */ "./src/pages/factory_reset.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FactoryResetPage", function() { return _factory_reset__WEBPACK_IMPORTED_MODULE_17__["FactoryResetPage"]; });

/* harmony import */ var _discover__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./discover */ "./src/pages/discover.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscoverPage", function() { return _discover__WEBPACK_IMPORTED_MODULE_18__["DiscoverPage"]; });

/* harmony import */ var _controllers_alexa__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./controllers.alexa */ "./src/pages/controllers.alexa.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllerAlexaPage", function() { return _controllers_alexa__WEBPACK_IMPORTED_MODULE_19__["ControllerAlexaPage"]; });

/* harmony import */ var _controllers_alerts__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./controllers.alerts */ "./src/pages/controllers.alerts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllerAlertsPage", function() { return _controllers_alerts__WEBPACK_IMPORTED_MODULE_20__["ControllerAlertsPage"]; });

/* harmony import */ var _alerts__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./alerts */ "./src/pages/alerts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertsPage", function() { return _alerts__WEBPACK_IMPORTED_MODULE_21__["AlertsPage"]; });

/* harmony import */ var _alerts_edit__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./alerts.edit */ "./src/pages/alerts.edit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertsEditPage", function() { return _alerts_edit__WEBPACK_IMPORTED_MODULE_22__["AlertsEditPage"]; });

/* harmony import */ var _devices_edit__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./devices.edit */ "./src/pages/devices.edit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DevicesEditPage", function() { return _devices_edit__WEBPACK_IMPORTED_MODULE_23__["DevicesEditPage"]; });

/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./diff */ "./src/pages/diff.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiffPage", function() { return _diff__WEBPACK_IMPORTED_MODULE_24__["DiffPage"]; });

/* harmony import */ var _rules_editor__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./rules.editor */ "./src/pages/rules.editor.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RulesEditorPage", function() { return _rules_editor__WEBPACK_IMPORTED_MODULE_25__["RulesEditorPage"]; });

/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./setup */ "./src/pages/setup.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetupPage", function() { return _setup__WEBPACK_IMPORTED_MODULE_26__["SetupPage"]; });

/* harmony import */ var _tools_sysvars__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./tools.sysvars */ "./src/pages/tools.sysvars.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SysVarsPage", function() { return _tools_sysvars__WEBPACK_IMPORTED_MODULE_27__["SysVarsPage"]; });






























/***/ }),

/***/ "./src/pages/lcdscreen/controlbox.js":
/*!*******************************************!*\
  !*** ./src/pages/lcdscreen/controlbox.js ***!
  \*******************************************/
/*! exports provided: Controlbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Controlbox", function() { return Controlbox; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widgets */ "./src/pages/lcdscreen/widgets/index.js");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/form */ "./src/components/form/index.js");



const style = {
  position: 'relative',
  border: '1px solid gray',
  padding: '20px',
  left: '-350px',
  width: '300px'
};
class Controlbox extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render(props) {
    const widget = props.item && _widgets__WEBPACK_IMPORTED_MODULE_1__["widgets"].find(w => w.name == props.item.name);

    if (widget && widget.editorComponent) {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        style: style
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(widget.editorComponent, {
        item: props.item
      }));
    } else if (widget && widget.editorConfig) {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        style: style
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_2__["Form"], {
        config: widget.editorConfig,
        selected: props.item
      }));
    }

    return null;
  }

}

/***/ }),

/***/ "./src/pages/lcdscreen/index.js":
/*!**************************************!*\
  !*** ./src/pages/lcdscreen/index.js ***!
  \**************************************/
/*! exports provided: LcdScreenComponent, LcdScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcdScreenComponent", function() { return LcdScreenComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcdScreen", function() { return LcdScreen; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dnd-html5-backend */ "./node_modules/react-dnd-html5-backend/lib/cjs/index.js");
/* harmony import */ var react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _toolbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toolbox */ "./src/pages/lcdscreen/toolbox.js");
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./page */ "./src/pages/lcdscreen/page.js");





class LcdScreenComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      grid: 1
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_toolbox__WEBPACK_IMPORTED_MODULE_3__["Toolbox"], null), "grid: ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      value: this.state.grid,
      onChange: e => {
        this.setState({
          grid: e.currentTarget.value
        });
      }
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "1"
    }, "1px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "5"
    }, "5px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "10"
    }, "10px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "15"
    }, "15px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "20"
    }, "20px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "30"
    }, "30px"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "50"
    }, "50px")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_page__WEBPACK_IMPORTED_MODULE_4__["Page"], {
      page: props.page,
      widget: props.widget,
      grid: this.state.grid
    }));
  }

}
const LcdScreen = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DragDropContext"])(react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_2___default.a)(LcdScreenComponent);

/***/ }),

/***/ "./src/pages/lcdscreen/page.js":
/*!*************************************!*\
  !*** ./src/pages/lcdscreen/page.js ***!
  \*************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return Page; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./widgets */ "./src/pages/lcdscreen/widgets/index.js");
/* harmony import */ var _controlbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controlbox */ "./src/pages/lcdscreen/controlbox.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const containerStyle = {
  position: 'relative',
  top: '25px'
};
const style = {
  height: '240px',
  width: '320px',
  position: 'absolute',
  border: '1px solid black',
  overflow: 'scroll'
};

class PageComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onClickHandler", item => {
      this.setState({
        selected: item
      });
    });

    _defineProperty(this, "onMoveHandler", (e, item) => {
      const x = roundToGrid(e.x - this.position.left + this.el.scrollLeft, this.props.grid);
      const y = roundToGrid(e.y - this.position.top + this.el.scrollTop, this.props.grid);
      const existingItem = this.state.items.find(i => i.id === item.id);
      existingItem.position.x = x;
      existingItem.position.y = y;
      this.forceUpdate();
    });

    _defineProperty(this, "onRightClickHandler", item => {
      this.state.items.splice(this.state.items.findIndex(i => i.id == item.id), 1);
      this.forceUpdate();
    });

    _defineProperty(this, "renderItem", item => {
      const itemStyle = {
        position: 'absolute',
        top: `${item.position.y}px`,
        left: `${item.position.x}px`
      };
      const W = Object(_widgets__WEBPACK_IMPORTED_MODULE_3__["getWidgets"])().find(w => w.name == item.name).component;
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        style: itemStyle
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(W, {
        conf: item,
        onClickHandler: this.onClickHandler,
        onRightClickHandler: this.onRightClickHandler,
        onMouseMove: this.onMoveHandler
      }));
    });

    let items;

    if (props.page) {
      this.width = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.params.width`) + 'px';
      this.height = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.params.height`) + 'px';
      items = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.pages[${props.page}].items`);

      if (!items) {
        items = [];
        _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set(`lcd.pages[${props.page}].items`, items);
      }
    } else if (props.widget) {
      this.width = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.widgets[${props.widget}].width`, _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.params.width`)) + 'px';
      this.height = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.widgets[${props.widget}].height`, 80) + 'px';
      items = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`lcd.widgets[${props.widget}].items`);

      if (!items) {
        items = [];
        _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set(`lcd.widgets[${props.widget}].items`, items);
      }
    } else {
      throw 'need page or widget nr';
    }

    this.state = {
      items
    };
  }

  findNextId() {
    let x = 0;
    this.state.items.forEach(i => {
      if (i.id > x) x = i.id;
    });
    return x + 1;
  }

  render() {
    const {
      isOver,
      connectDropTarget
    } = this.props;
    return connectDropTarget(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: containerStyle
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: Object.assign({}, style, {
        width: this.width,
        height: this.height
      }),
      ref: el => {
        this.el = el;
      }
    }, this.state.items.map(item => {
      return this.renderItem(item);
    })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_controlbox__WEBPACK_IMPORTED_MODULE_4__["Controlbox"], {
      item: this.state.selected
    })));
  }

  componentDidMount() {
    this.position = this.el.getBoundingClientRect();
  }

}

const roundToGrid = (num, grid) => {
  let down = num - num % grid;
  let up = num + grid - num % grid;
  return Math.abs(num - up) < num - down ? up : down;
};

const target = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const offset = monitor.getClientOffset();
    const oi = monitor.getInitialClientOffset();
    const si = monitor.getInitialSourceClientOffset();
    const co = monitor.getSourceClientOffset();
    const ii = monitor.getDifferenceFromInitialOffset();
    const x = roundToGrid(offset.x - component.position.left + component.el.scrollLeft, component.props.grid);
    const y = roundToGrid(offset.y - component.position.top + component.el.scrollTop, component.props.grid);

    if (!item.id) {
      component.state.items.push({
        id: component.findNextId(),
        name: item.name,
        position: {
          x,
          y
        }
      });
    } else {
      const existingItem = component.state.items.find(i => i.id === item.id);
      existingItem.position.x = x;
      existingItem.position.y = y;
    }
  }

};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const Page = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DropTarget"])('box', target, collect)(PageComponent);

/***/ }),

/***/ "./src/pages/lcdscreen/toolbox.js":
/*!****************************************!*\
  !*** ./src/pages/lcdscreen/toolbox.js ***!
  \****************************************/
/*! exports provided: Toolbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Toolbox", function() { return Toolbox; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widgets */ "./src/pages/lcdscreen/widgets/index.js");
/* harmony import */ var _toolbox_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toolbox_item */ "./src/pages/lcdscreen/toolbox_item.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../lib/settings */ "./src/lib/settings.js");




class Toolbox extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(_widgets__WEBPACK_IMPORTED_MODULE_1__["getWidgets"])().map(widget => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_toolbox_item__WEBPACK_IMPORTED_MODULE_2__["ToolboxItem"], {
        widget: widget
      });
    }));
  }

}

/***/ }),

/***/ "./src/pages/lcdscreen/toolbox_item.js":
/*!*********************************************!*\
  !*** ./src/pages/lcdscreen/toolbox_item.js ***!
  \*********************************************/
/*! exports provided: ToolboxItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolboxItem", function() { return ToolboxItem; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);


const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
const boxSource = {
  beginDrag(props) {
    return props.widget;
  }

};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

class ToolboxItemComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    const {
      isDragging,
      connectDragSource
    } = this.props;
    const {
      icon,
      title
    } = this.props.widget;
    const opacity = isDragging ? '0.4' : '1';
    return connectDragSource(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: { ...style,
        opacity
      }
    }, title));
  }

}

const ToolboxItem = Object(preact_dnd__WEBPACK_IMPORTED_MODULE_1__["DragSource"])('box', boxSource, collect)(ToolboxItemComponent);

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/box.js":
/*!********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/box.js ***!
  \********************************************/
/*! exports provided: Box, boxEditorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Box", function() { return Box; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boxEditorConfig", function() { return boxEditorConfig; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");


const style = {
  border: '1px dashed gray',
  cursor: 'move',
  position: 'relative'
};
const titleStyle = {
  position: 'relative',
  top: '-10px',
  background: 'white'
};
class Box extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    const {
      width,
      height
    } = this.props.conf; // style.width = this.props.conf.width + 'px';
    // style.height = this.props.conf.height + 'px';

    style.margin = `${width}px ${height}px`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: style
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
      style: titleStyle
    }, this.props.conf.text));
  }

}
const boxEditorConfig = {
  groups: {
    config: {
      name: 'Box',
      configs: {
        text: {
          name: 'Title',
          type: 'string',
          var: 'text'
        },
        width: {
          name: 'Width',
          type: 'number',
          var: 'width'
        },
        height: {
          name: 'Height',
          type: 'number',
          var: 'height'
        }
      }
    }
  }
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/button.js":
/*!***********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/button.js ***!
  \***********************************************/
/*! exports provided: Button, buttonEditorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonEditorConfig", function() { return buttonEditorConfig; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/utils */ "./src/lib/utils.js");



const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
class Button extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", null, this.props.conf.value ? 'ON' : 'OFF');
  }

}
const buttonEditorConfig = {
  groups: {
    config: {
      name: 'Button',
      configs: {
        device: {
          name: 'Check Device',
          type: 'select',
          options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"],
          var: 'device'
        },
        value: {
          name: 'Check Value',
          type: 'select',
          options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('device'),
          var: 'value'
        },
        event: {
          name: 'Event',
          type: 'string',
          var: 'event'
        }
      }
    }
  }
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/image.js":
/*!**********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/image.js ***!
  \**********************************************/
/*! exports provided: Image */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return Image; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");


const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
class Image extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    return null;
  }

}

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/index.js":
/*!**********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/index.js ***!
  \**********************************************/
/*! exports provided: widgets, getWidgets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "widgets", function() { return widgets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWidgets", function() { return getWidgets; });
/* harmony import */ var _label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./label */ "./src/pages/lcdscreen/widgets/label.js");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image */ "./src/pages/lcdscreen/widgets/image.js");
/* harmony import */ var _slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./slider */ "./src/pages/lcdscreen/widgets/slider.js");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./button */ "./src/pages/lcdscreen/widgets/button.js");
/* harmony import */ var _box__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./box */ "./src/pages/lcdscreen/widgets/box.js");
/* harmony import */ var _value__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./value */ "./src/pages/lcdscreen/widgets/value.js");
/* harmony import */ var _widget_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./widget_component */ "./src/pages/lcdscreen/widgets/widget_component.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../lib/settings */ "./src/lib/settings.js");








const widgets = [{
  name: 'label',
  title: 'label',
  component: _label__WEBPACK_IMPORTED_MODULE_0__["Label"],
  editorConfig: _label__WEBPACK_IMPORTED_MODULE_0__["labelEditorConfig"]
}, {
  name: 'image',
  title: 'image',
  component: _image__WEBPACK_IMPORTED_MODULE_1__["Image"]
}, {
  name: 'button',
  title: 'button',
  component: _button__WEBPACK_IMPORTED_MODULE_3__["Button"],
  editorConfig: _button__WEBPACK_IMPORTED_MODULE_3__["buttonEditorConfig"]
}, {
  name: 'slider',
  title: 'slider',
  component: _slider__WEBPACK_IMPORTED_MODULE_2__["Slider"],
  editorConfig: _slider__WEBPACK_IMPORTED_MODULE_2__["sliderEditorConfig"]
}, {
  name: 'box',
  title: 'box',
  component: _box__WEBPACK_IMPORTED_MODULE_4__["Box"],
  editorConfig: _box__WEBPACK_IMPORTED_MODULE_4__["boxEditorConfig"]
}, {
  name: 'value',
  title: 'value',
  component: _value__WEBPACK_IMPORTED_MODULE_5__["Value"],
  editorConfig: _value__WEBPACK_IMPORTED_MODULE_5__["valueEditorConfig"]
}];
const getWidgets = () => {
  return [...widgets, ..._lib_settings__WEBPACK_IMPORTED_MODULE_7__["settings"].get('lcd.widgets', []).map(widget => ({
    name: widget.idx,
    title: widget.name,
    component: _widget_component__WEBPACK_IMPORTED_MODULE_6__["WidgetComponent"]
  }))];
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/label.js":
/*!**********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/label.js ***!
  \**********************************************/
/*! exports provided: Label, labelEditorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return Label; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "labelEditorConfig", function() { return labelEditorConfig; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");


const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
class Label extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    if (this.props.conf.text === undefined) {
      this.props.conf.text = 'label';
    }

    ;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, this.props.conf.text);
  }

}
const labelEditorConfig = {
  groups: {
    config: {
      name: 'Label',
      configs: {
        text: {
          name: 'Text',
          type: 'string',
          var: 'text'
        }
      }
    }
  }
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/slider.js":
/*!***********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/slider.js ***!
  \***********************************************/
/*! exports provided: Slider, sliderEditorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Slider", function() { return Slider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sliderEditorConfig", function() { return sliderEditorConfig; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/utils */ "./src/lib/utils.js");



const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
class Slider extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      type: "range",
      max: this.props.conf.max,
      min: this.props.conf.min
    });
  }

}
const sliderEditorConfig = {
  groups: {
    config: {
      name: 'Slider',
      configs: {
        device: {
          name: 'Check Device',
          type: 'select',
          options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"],
          var: 'device'
        },
        value: {
          name: 'Check Value',
          type: 'select',
          options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('device'),
          var: 'value'
        },
        event: {
          name: 'Event',
          type: 'string',
          var: 'event'
        },
        min: {
          name: 'Min',
          type: 'number',
          var: 'min'
        },
        max: {
          name: 'Max',
          type: 'number',
          var: 'max'
        }
      }
    }
  }
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/value.js":
/*!**********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/value.js ***!
  \**********************************************/
/*! exports provided: Value, valueEditorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Value", function() { return Value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "valueEditorConfig", function() { return valueEditorConfig; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/utils */ "./src/lib/utils.js");



const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move'
};
class Value extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, "$", this.props.conf.value);
  }

}
const valueEditorConfig = {
  groups: {
    config: {
      name: 'Value',
      configs: {
        device: {
          name: 'Check Device',
          type: 'select',
          options: _lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTasks"],
          var: 'device'
        },
        value: {
          name: 'Check Value',
          type: 'select',
          options: Object(_lib_utils__WEBPACK_IMPORTED_MODULE_2__["getTaskValues"])('device'),
          var: 'value'
        }
      }
    }
  }
};

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/widget.js":
/*!***********************************************!*\
  !*** ./src/pages/lcdscreen/widgets/widget.js ***!
  \***********************************************/
/*! exports provided: Widget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Widget", function() { return Widget; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact-dnd */ "./node_modules/preact-dnd/lib/index.js");
/* harmony import */ var preact_dnd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_dnd__WEBPACK_IMPORTED_MODULE_1__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move'
};
class Widget extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "onMouseMove", e => {
      this.props.onMouseMove({
        x: e.pageX - this.offset[0],
        y: e.pageY - this.offset[1]
      }, this.props.conf);
    });

    _defineProperty(this, "onMouseDown", e => {
      this.offset = [e.layerX, e.layerY];
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    });

    _defineProperty(this, "onMouseUp", () => {
      this.offset = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    });
  }

  render() {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: { ...style
      },
      ref: e => this.base = e,
      onDblClick: () => {
        this.props.onClickHandler(this.props.conf);
      },
      onContextMenu: e => {
        e.preventDefault();
        this.props.onRightClickHandler(this.props.conf);
      }
    }, this.renderComponent());
  }

  componentDidMount() {
    this.base.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    this.base.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

}

/***/ }),

/***/ "./src/pages/lcdscreen/widgets/widget_component.js":
/*!*********************************************************!*\
  !*** ./src/pages/lcdscreen/widgets/widget_component.js ***!
  \*********************************************************/
/*! exports provided: WidgetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidgetComponent", function() { return WidgetComponent; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget */ "./src/pages/lcdscreen/widgets/widget.js");


const style = {
  display: 'inline-block',
  backgroundColor: 'white',
  cursor: 'move'
};
class WidgetComponent extends _widget__WEBPACK_IMPORTED_MODULE_1__["Widget"] {
  renderComponent() {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: Object.assign({}, style, {
        width: (this.props.conf.width || 320) + 'px',
        height: (this.props.conf.height || 30) + 'px'
      })
    }, this.props.conf.name);
  }

}

/***/ }),

/***/ "./src/pages/load.js":
/*!***************************!*\
  !*** ./src/pages/load.js ***!
  \***************************/
/*! exports provided: LoadPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadPage", function() { return LoadPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");


class LoadPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    this.saveForm = () => {
      Object(_lib_esp__WEBPACK_IMPORTED_MODULE_1__["storeFile"])(this.file.files[0]);
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      class: "pure-form pure-form-aligned"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "pure-control-group"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", {
      for: "file",
      class: "pure-checkbox"
    }, "File:"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      id: "file",
      type: "file",
      ref: ref => this.file = ref
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.saveForm
    }, "upload")));
  }

}

/***/ }),

/***/ "./src/pages/reboot.js":
/*!*****************************!*\
  !*** ./src/pages/reboot.js ***!
  \*****************************/
/*! exports provided: RebootPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RebootPage", function() { return RebootPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");



class RebootPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, "ESPEasy is rebooting ... please wait a while, this page will auto refresh.");
  }

  componentDidMount() {
    _lib_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].show();
    fetch('/reboot').then(() => {
      setTimeout(() => {
        const name = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get('unit.name');
        _lib_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].hide();
        window.location.href = `http://${name}.local`;
      }, window.location.href.includes('local') ? 2000 : 10000);
    });
  }

}

/***/ }),

/***/ "./src/pages/rules.editor.js":
/*!***********************************!*\
  !*** ./src/pages/rules.editor.js ***!
  \***********************************/
/*! exports provided: RulesEditorPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RulesEditorPage", function() { return RulesEditorPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _floweditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./floweditor */ "./src/pages/floweditor/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");



class RulesEditorPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.devices = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get('plugins');
    this.rules = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].editor.get('rules[0]');

    if (!this.rules) {
      this.rules = {
        nodes: [],
        connections: [],
        name: 'rule1'
      };
      const rules = [this.rules];
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].editor.set('rules', rules);
    }
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_floweditor__WEBPACK_IMPORTED_MODULE_1__["FlowEditor"], {
      devices: this.devices,
      rules: this.rules
    });
  }

}

/***/ }),

/***/ "./src/pages/rules.js":
/*!****************************!*\
  !*** ./src/pages/rules.js ***!
  \****************************/
/*! exports provided: RulesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RulesPage", function() { return RulesPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

const rules = [{
  name: 'Rule 1',
  file: 'rules1.txt',
  index: 1
}, {
  name: 'Rule 2',
  file: 'rules2.txt',
  index: 2
}, {
  name: 'Rule 3',
  file: 'rules3.txt',
  index: 3
}, {
  name: 'Rule 4',
  file: 'rules4.txt',
  index: 4
}];
class RulesPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      selected: rules[0]
    };

    this.selectionChanged = e => {
      this.setState({
        selected: rules[e.currentTarget.value]
      });
    };

    this.saveRule = () => {
      const data = new FormData();
      data.append('set', this.state.selected.index);
      data.append('rules', this.text.value);
      fetch('/rules', {
        method: 'POST',
        body: data
      }).then(res => {
        console.log('succesfully saved');
        console.log(res.text());
      });
    };

    this.fetch();
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      onChange: this.selectionChanged
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "0"
    }, "Rule 1"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "1"
    }, "Rule 2"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "2"
    }, "Rule 3"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "3"
    }, "Rule 4"))), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("textarea", {
      style: "width: 100%; height: 400px",
      ref: ref => this.text = ref
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.saveRule
    }, "Save"))));
  }

  async fetch() {
    const text = await fetch(this.state.selected.file).then(response => response.text());
    this.text.value = text;
  }

  async componentDidUpdate() {
    this.fetch();
  }

}

/***/ }),

/***/ "./src/pages/setup.js":
/*!****************************!*\
  !*** ./src/pages/setup.js ***!
  \****************************/
/*! exports provided: SetupPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetupPage", function() { return SetupPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");




const formConfig = {
  groups: {
    wifi: {
      name: 'WiFi',
      configs: {
        ssid: {
          name: 'SSID',
          type: 'select',
          options: [],
          var: 'security[0].WifiSSID'
        },
        passwd: {
          name: 'Password',
          type: 'password',
          var: 'security[0].WifiKey'
        }
      }
    }
  }
};
class SetupPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    };
    _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].show();

    this.save = () => {
      _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].show();
      const data = new FormData();
      data.append('ssid', this.config.security[0].WifiSSID);
      data.append('pass', this.config.security[0].WifiKey);
      fetch('/setup', {
        method: 'POST',
        data
      }).then(() => {
        setTimeout(() => {
          _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].hide();
          window.location.href = '/';
        }, 5000);
      });
    };
  }

  render(props) {
    formConfig.groups.wifi.configs.ssid.options = this.state.devices.map(device => ({
      name: device.ssid,
      value: device.ssd
    }));
    const config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get('config');
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: config
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.save
    }, "CONTINUE"));
  }

  componentDidMount() {
    fetch('/wifiscanner').then(r => r.json()).then(r => {
      this.setState({
        devices: r
      });
      _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].hide();
    });
  }

}

/***/ }),

/***/ "./src/pages/tools.js":
/*!****************************!*\
  !*** ./src/pages/tools.js ***!
  \****************************/
/*! exports provided: ToolsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolsPage", function() { return ToolsPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");
/* harmony import */ var _floweditor_nodes_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./floweditor/nodes/helper */ "./src/pages/floweditor/nodes/helper.js");




const CMD = {
  SET: 0xf0,
  SET_CFG: 0xf1,
  EVENT: 0xf2,
  TIMER: 0xf3,
  DELAY: 0xf4,
  RESET: 0xf5,
  GPIO: 0xf6,
  GET: 0xf7,
  GET_CFG: 0xf8,
  VAR: 0xf9,
  SEND: 0xfa,
  X8: 0xfb,
  IF: 0xfc,
  ELSE: 0xfd,
  ENDIF: 0xfe,
  ENDON: 0xff
};
class ToolsPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.history = '';
    this.events = {};
    this.state = {
      cmd: 242,
      event: null,
      device: null,
      state: null,
      value: 0
    };

    this.sendCommand = e => {
      const cmdParts = this.cmd.value.split(',');
      const cmdArray = [];
      const cmd = CMD[cmdParts[0].toUpperCase()];
      if (!cmd) return;
      cmdParts.forEach((part, i) => {
        if (i === 0) {
          cmdArray.push(cmd);
          return;
        }

        const val = parseInt(part);
        cmdArray.push(val);
      });
      fetch(`/cmd/3`, {
        method: 'POST',
        body: new Uint8Array(cmdArray)
      }).then(response => response.text()).then(response => {
        this.cmdOutput.value = response;
      });
    };

    this.sendCommand2 = () => {
      const cmdArray = [];
      cmdArray.push(this.state.cmd);

      if (this.state.cmd === 242) {
        // event
        const event = Object(_floweditor_nodes_helper__WEBPACK_IMPORTED_MODULE_3__["toByteArray"])(this.state.event, 2);
        cmdArray.push(event[1]);
        cmdArray.push(event[0]);
        cmdArray.push(0);
      } else {
        cmdArray.push(this.state.device);
        cmdArray.push(this.state.state);
        if (this.state.cmd === 240) cmdArray.push(1);
        cmdArray.push(this.state.val);
      }

      fetch(`/cmd`, {
        method: 'POST',
        body: new Uint8Array(cmdArray)
      }).then(response => response.text()).then(response => {
        this.cmdOutput.value = response;
      });
    };
  }

  fetch() {
    fetch('/logs').then(response => response.text()).then(response => {
      response.split('\n').map(log => {
        if (log.trim() === '') return;
        let formatted = log.trim().substr(4);
        formatted = formatted.substr(0, formatted.length - 4);
        const cls = formatted.substr(0, 3);
        formatted = formatted.substr(3);
        this.history += `<div class="log_level c${cls}"><span class="date"></span><span class="value">${formatted}</span></div>`;
        this.log.innerHTML = this.history;

        if (true) {
          this.log.scrollTop = this.log.scrollHeight;
        }
      });
    });
  }

  render(props) {
    const devices = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('plugins');

    const setCmd = e => {
      this.setState({
        cmd: parseInt(e.currentTarget.value),
        event: null,
        device: null,
        state: null
      });
    };

    const setEvent = e => {
      this.setState({
        event: parseInt(e.currentTarget.value)
      });
    };

    const setDevice = e => {
      this.setState({
        device: parseInt(e.currentTarget.value),
        state: null
      });
    };

    const setDeviceState = e => {
      this.setState({
        state: e.currentTarget.value
      });
    };

    const setDeviceStateVal = e => {
      this.setState({
        val: e.currentTarget.value
      });
    };

    const device_state = this.state.device !== null ? this.device_state[this.state.device] || {} : {};
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      style: "width: 100%; height: 200px; overflow-y: scroll; border: 1px solid gray; margin-bottom: 10px;",
      ref: ref => this.log = ref
    }, "loading logs ..."), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, "Command:", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      value: this.state.cmd,
      onChange: setCmd
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "242"
    }, "event"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "240"
    }, "set state")), this.state.cmd === 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      value: this.state.event,
      onChange: setEvent
    }, Object.keys(this.events).map(key => {
      const i = this.events[key];
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
        value: i
      }, key);
    })), this.state.cmd !== 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      value: this.state.device,
      onChange: setDevice
    }, devices.map((device, i) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
        value: i
      }, device.name);
    })), this.state.cmd !== 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      value: this.state.state,
      onChange: setDeviceState
    }, Object.keys(device_state).map((state, i) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
        value: i
      }, state);
    })), this.state.cmd !== 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      type: "text",
      onChange: setDeviceStateVal
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.sendCommand2
    }, "send")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("textarea", {
      readonly: true,
      style: "width: 100%; height: 200px",
      ref: ref => this.cmdOutput = ref
    }));
  }

  async componentDidMount() {
    this.device_state = await Object(_lib_esp__WEBPACK_IMPORTED_MODULE_2__["loadDevices"])();
    this.events = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].events;
    this.forceUpdate();
    this.interval = setInterval(() => {
      this.fetch();
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

}

/***/ }),

/***/ "./src/pages/tools.sysvars.js":
/*!************************************!*\
  !*** ./src/pages/tools.sysvars.js ***!
  \************************************/
/*! exports provided: SysVarsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SysVarsPage", function() { return SysVarsPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

class SysVarsPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      device: props.params[0],
      vars: {}
    };
  }

  fetch() {
    fetch(`/system`).then(response => response.json()).then(vars => {
      this.setState({
        vars
      });
    });
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      class: "pure-form pure-form-aligned"
    }, Object.keys(this.state.vars).map(v => {
      const value = this.state.vars[v];
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("fieldset", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", null, v), value // Object.keys(value).map((v1, i) => {
      //     const value1 = value[v1];
      //     return (
      //         <div class="pure-control-group">
      //             <label class="pure-checkbox">{v1}</label>
      //             <input readOnly={true} type="text" value={value1} />
      //         </div>
      //     )
      // })
      );
    }));
  }

  componentDidMount() {
    this.fetch();
  }

}

/***/ }),

/***/ "./src/pages/update.js":
/*!*****************************!*\
  !*** ./src/pages/update.js ***!
  \*****************************/
/*! exports provided: UpdatePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdatePage", function() { return UpdatePage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _lib_esp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/esp */ "./src/lib/esp.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");



class UpdatePage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    this.saveForm = () => {
      _lib_loader__WEBPACK_IMPORTED_MODULE_2__["loader"].show();
      Object(_lib_esp__WEBPACK_IMPORTED_MODULE_1__["fetchProgress"])('/update', {
        method: 'POST',
        body: this.file.files[0],
        onProgress: e => {
          const perc = 100 * e.loaded / e.total;
          this.setState({
            progress: perc
          });
        }
      }).then(() => {
        window.location.href = '#config/reboot';
      });
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("form", {
      class: "pure-form pure-form-aligned"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "pure-control-group"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", {
      for: "file",
      class: "pure-checkbox"
    }, "Firmware:"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      id: "file",
      type: "file",
      ref: ref => this.file = ref
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.saveForm
    }, "upload"), this.state.progress ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, " ", Math.round(this.state.progress), "%") : null));
  }

}

/***/ })

/******/ });
//# sourceMappingURL=app.js.map