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

  render(props, state) {
    const params = getFragment().split('/').slice(2);
    const active = this.state.menuActive ? 'active' : '';
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "layout",
      class: active
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      id: "menuLink",
      class: "menu-link",
      onClick: this.menuToggle
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null)), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_menu__WEBPACK_IMPORTED_MODULE_3__["Menu"], {
      menus: _lib_menu__WEBPACK_IMPORTED_MODULE_9__["menu"].menus,
      selected: state.menu
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_page__WEBPACK_IMPORTED_MODULE_4__["Page"], {
      page: state.page,
      params: params,
      changed: this.state.changed
    }));
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

      if (this.state.changed !== !!diff.length) {
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
  await Object(_lib_config__WEBPACK_IMPORTED_MODULE_5__["loadRules"])();
  await Object(_lib_plugins__WEBPACK_IMPORTED_MODULE_8__["loadPlugins"])();
  Object(preact__WEBPACK_IMPORTED_MODULE_0__["render"])(Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(App, null), document.body);
};

load();
console.log(document.location);

/***/ }),

/***/ "./src/components/espeasy_p2p/index.js":
/*!*********************************************!*\
  !*** ./src/components/espeasy_p2p/index.js ***!
  \*********************************************/
/*! exports provided: EspEaspP2PComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EspEaspP2PComponent", function() { return EspEaspP2PComponent; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");

class EspEaspP2PComponent extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };

    this.refresh = () => {
      fetch('/node_list_json').then(res => res.json()).then(nodes => {
        this.setState({
          nodes
        });
      });
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("ul", null, this.state.nodes.map(node => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", null, "Unit ", node.first, ": ", node.name, " [", node.ip, "]");
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.refresh
    }, "REFRESH"));
  }

  componentDidMount() {
    this.refresh();
  }

}

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
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
          id: id,
          onChange: this.onChange(id, varName, config)
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
        }));

      case 'gpio':
        options = window.pins();

        const selectPin = (val, name, form) => {
          const pins = window.pins();
          const selectedPin = pins.find(pin => pin.value == val);
          form.props.config.groups[name].configs = { ...selectedPin.configs
          };
          form.forceUpdate();
        };

        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
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
        }));

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
    const classes = `pure-control-group ${configArray.length === 3 ? 'group-3' : ''}`;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      className: classes
    }, configArray.map((conf, i) => {
      const varId = configArray.length > 1 ? `${id}.${i}` : id;
      const varName = conf.var ? conf.var : varId;
      const val = varName.startsWith('ROOT') ? _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(varName.replace('ROOT.', '')) : Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(values, varName, null);

      if (conf.if) {
        const val = Object(_lib_helpers__WEBPACK_IMPORTED_MODULE_1__["get"])(_lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].settings, conf.if, false);

        if (conf.ifval === undefined && !val) {
          return null;
        }

        if (conf.ifval != val) return null;
      }

      if (conf.type === 'custom') {
        const CustomComponent = conf.component;
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(CustomComponent, {
          conf: conf,
          values: values
        });
      }

      return [Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("label", {
        for: varId
      }, conf.name, " ", conf.help ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: "fa fa-info-circle"
      }) : ''), this.renderConfig(varId, conf, val, varName)];
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
  renderMenuItem(menu) {
    if (menu.adminOnly && _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].userName !== 'admin') return null;

    if (menu.action) {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", {
        class: "pure-menu-item"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: `#${menu.href}`,
        onClick: menu.action,
        class: "pure-menu-link"
      }, menu.title));
    }

    if (menu.href === this.props.selected.href) {
      return [Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", {
        class: "pure-menu-item pure-menu-item-selected"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
        href: `#${menu.href}`,
        class: "pure-menu-link"
      }, menu.title)), ...menu.children.map(child => {
        if (child.action) {
          return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", {
            class: "pure-menu-item submenu"
          }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
            href: `#${child.href}`,
            onClick: child.action,
            class: "pure-menu-link"
          }, child.title));
        }

        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("li", {
          class: "pure-menu-item submenu"
        }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
          href: `#${child.href}`,
          class: "pure-menu-link"
        }, child.title));
      })];
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
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "menu"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "pure-menu"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      class: "pure-menu-heading",
      href: "/"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "ESP"), "Easy"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("ul", {
      class: "pure-menu-list"
    }, props.menus.map(menu => this.renderMenuItem(menu)))));
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
  getBreadcrumbs(page) {
    if (!page) return null;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, " > ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      href: `#${page.href}`
    }, page.pagetitle == null ? page.title : page.pagetitle));
  }

  render(props) {
    const PageComponent = props.page.component;
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      id: "main"
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "header"
    }, this.getBreadcrumbs(props.page.parent), " > ", props.page.pagetitle == null ? props.page.title : props.page.pagetitle, props.changed ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
      style: "float: right",
      href: "#tools/diff"
    }, "CHANGED! Click here to SAVE") : null), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
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


const i2cAddr = [{
  value: 56,
  name: '0x38'
}, {
  value: 57,
  name: '0x39'
}, {
  value: 58,
  name: '0x3A'
}, {
  value: 59,
  name: '0x3B'
}];

class PCA9685 extends _defs__WEBPACK_IMPORTED_MODULE_0__["Device"] {
  constructor() {
    super();

    _defineProperty(this, "defaults", () => ({
      'params.addr': 56
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
        'state.values[0].name': 'State'
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
      return {
        params: {
          name: 'Config',
          configs: { ...this.getValueProps(values),
            add: {
              value: 'Add Variable',
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
      'state.values[0].name': 'Dummy',
      'state.values[0].type': 0,
      'state.values[0].value': 0
    }));

    this.vals = 0;
  }

}

const dummy = new Dummy();

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
        'state.values[0].name': 'Switch'
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
    'state.values[1].name': 'Humidity'
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
    'state.values[1].name': 'Humidity',
    'state.values[2].name': 'Pressure'
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
    'state.values[0].name': 'Temperature'
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
    'state.values[0].name': 'Output'
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
    'state.values[0].name': 'Analog'
  }),
  params: {
    name: 'Settings',
    configs: {
      gpio: {
        name: 'GPIO',
        type: 'select',
        options: () => window.io_pins.getPins('analog_in')
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
      return [...new Array(8)].map((x, i) => ({
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
        }
      }
    };
    this.pins = {
      name: 'Pin Configuration',
      configs: {}
    };

    for (let i = 0; i < 8; i++) {
      this.pins.configs[i] = {
        name: `Pin ${i} boot state`,
        type: 'select',
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
  name: 'Generic - Switch',
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
  name: 'IO - PCF8674',
  value: 9,
  fields: _9_pcf8574__WEBPACK_IMPORTED_MODULE_5__["pcf8574"]
}, {
  name: 'IO - PCF8674',
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
}].sort((a, b) => a.name.localeCompare(b.name));

/***/ }),

/***/ "./src/lib/config.js":
/*!***************************!*\
  !*** ./src/lib/config.js ***!
  \***************************/
/*! exports provided: loadConfig, saveConfig, loadRules */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadConfig", function() { return loadConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveConfig", function() { return saveConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadRules", function() { return loadRules; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./espeasy */ "./src/lib/espeasy.js");


const loadConfig = () => {
  return fetch('/config.json').then(r => {
    _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].user(r.headers.get('user').replace(',', '').trim());
    return r.json();
  }).then(c => {
    _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].init(c);
    return c;
  });
};
const saveConfig = () => {
  return Object(_espeasy__WEBPACK_IMPORTED_MODULE_1__["storeFile"])('config.json', JSON.stringify(_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get()));
};
const loadRules = async () => {
  const r1 = await fetch('/r1.txt').then(r => r.json()).catch(r => []);
  const events = await fetch('/events.json').then(r => r.json()).catch(r => []);
  const pins = []; // report on used pins

  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].events = events;
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].rules = r1;
  _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].r1pins = pins;
};

/***/ }),

/***/ "./src/lib/espeasy.js":
/*!****************************!*\
  !*** ./src/lib/espeasy.js ***!
  \****************************/
/*! exports provided: getJsonStat, loadDevices, getConfigNodes, getVariables, getDashboardConfigNodes, fetchProgress, storeFile, deleteFile, storeDashboardConfig, loadDashboardConfig, storeRuleConfig, loadRuleConfig, storeRule, getEvents, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getJsonStat", function() { return getJsonStat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadDevices", function() { return loadDevices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConfigNodes", function() { return getConfigNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVariables", function() { return getVariables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardConfigNodes", function() { return getDashboardConfigNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgress", function() { return fetchProgress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeFile", function() { return storeFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteFile", function() { return deleteFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeDashboardConfig", function() { return storeDashboardConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadDashboardConfig", function() { return loadDashboardConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeRuleConfig", function() { return storeRuleConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadRuleConfig", function() { return loadRuleConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeRule", function() { return storeRule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEvents", function() { return getEvents; });
/* harmony import */ var mini_toastr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mini-toastr */ "./node_modules/mini-toastr/mini-toastr.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/lib/loader.js");
/* harmony import */ var _node_definitions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_definitions */ "./src/lib/node_definitions.js");



const getJsonStat = async (url = '') => {
  return await fetch(`${url}/plugin_state/`).then(response => response.json());
};
const loadDevices = async url => {
  return getJsonStat(url); //.then(response => response.Sensors);
}; // check if we correctly set ids here!!!! <--------------------------

const getConfigNodes = async devices => {
  const vars = [];
  const deviceNodes = devices.map((device, i) => {
    if (!device) return [];
    const taskValues = device.state ? device.state.values || [] : [];
    taskValues.map((value, j) => vars.push({
      value: `${device.id}-${j}`,
      name: `${device.name}#${value.name}`
    })); // todo: remove

    const taskValues1 = device.settings ? device.settings.values || [] : [];
    taskValues1.map((value, j) => vars.push({
      value: `${device.id}-${j}`,
      name: `${device.name}#${value.name}`
    }));
    if (!vars.length) return [];
    const result = [{
      group: 'TRIGGERS',
      type: device.name || `${i}-${device.type}`,
      inputs: [],
      outputs: [1],
      config: [{
        name: 'variable',
        type: 'select',
        values: taskValues.map(value => value.name),
        value: taskValues.length ? taskValues[0].name : ''
      }, {
        name: 'euqality',
        type: 'select',
        values: [{
          name: '',
          value: 0
        }, {
          name: '=',
          value: 1
        }, {
          name: '<',
          value: 2
        }, {
          name: '>',
          value: 3
        }, {
          name: '<=',
          value: 4
        }, {
          name: '>=',
          value: 5
        }, {
          name: '!=',
          value: 6
        }],
        value: ''
      }, {
        name: 'value',
        type: 'number'
      }],
      indent: true,
      toString: function () {
        const comparison = this.config[1].value === '' ? 'changes' : `${this.config[1].values.find(v => v.value == this.config[1].value).name} ${this.config[2].value}`;
        return `when ${this.type}.${this.config[0].value} ${comparison}`;
      },
      toDsl: function () {
        const comparison = this.config[1].value === '' ? `\x00\x01` : `${String.fromCharCode(this.config[1].value)}\x01${String.fromCharCode(this.config[2].value)}`;
        return [`\xFF\xFE\x00\xFF\x00${String.fromCharCode(device.id)}${String.fromCharCode(this.config[0].value)}${comparison}%%output%%\xFF`];
      }
    }];
    return result;
  }).flat();
  const mainNodes = Object(_node_definitions__WEBPACK_IMPORTED_MODULE_2__["getNodes"])(deviceNodes, vars);
  return [...mainNodes, ...deviceNodes];
};
const getVariables = async () => {
  const urls = ['']; //, 'http://192.168.1.130'

  const vars = {};
  await Promise.all(urls.map(async url => {
    const stat = await getJsonStat(url);
    stat.Sensors.map(device => {
      device.TaskValues.map(value => {
        vars[`${stat.System.Name}@${device.TaskName}#${value.Name}`] = value.Value;
      });
    });
  }));
  return vars;
};
const getDashboardConfigNodes = async url => {
  const devices = await loadDevices(url);
  const vars = [];
  const nodes = devices.map(device => {
    device.TaskValues.map(value => vars.push(`${device.TaskName}#${value.Name}`));
    return [];
  }).flat();
  return {
    nodes,
    vars
  };
};
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
const storeDashboardConfig = async config => {
  storeFile('d1.txt', config);
};
const loadDashboardConfig = async nodes => {
  return await fetch('/d1.txt').then(response => response.json());
};
const storeRuleConfig = async config => {
  storeFile('r1.txt', config);
};
const loadRuleConfig = async () => {
  return await fetch('/r1.txt').then(response => response.json()).catch(r => []);
};
const storeRule = async data => {
  await storeFile('events.json', JSON.stringify(data.events));
  await storeFile('rules.dat', new Uint8Array(data.rules));
  return;
};
const getEvents = async data => {
  return fetch('/events.json').then(r => r.json()).catch(r => []);
};
/* harmony default export */ __webpack_exports__["default"] = ({
  getJsonStat,
  loadDevices,
  getConfigNodes,
  getDashboardConfigNodes,
  getVariables,
  storeFile,
  deleteFile,
  storeDashboardConfig,
  loadDashboardConfig,
  storeRuleConfig,
  loadRuleConfig,
  storeRule
});

/***/ }),

/***/ "./src/lib/floweditor.js":
/*!*******************************!*\
  !*** ./src/lib/floweditor.js ***!
  \*******************************/
/*! exports provided: FlowEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowEditor", function() { return FlowEditor; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/lib/helpers.js");
 // todo:
// improve relability of moving elements around
// global config

const color = '#000000';

const saveChart = renderedNodes => {
  // find initial nodes (triggers);
  const triggers = renderedNodes.filter(node => node.inputs.length === 0); // for each initial node walk the tree and produce one 'rule'

  const result = triggers.map(trigger => {
    const walkRule = rule => {
      return {
        t: rule.type,
        v: rule.config.map(config => config.value),
        o: rule.outputs.map(out => out.lines.map(line => walkRule(line.input.nodeObject))),
        c: [rule.position.x, rule.position.y]
      };
    };

    return walkRule(trigger);
  });
  return result;
};

const loadChart = (config, chart, from) => {
  config.map(config => {
    let node = chart.renderedNodes.find(n => n.position.x === config.c[0] && n.position.y === config.c[1]);

    if (!node) {
      const configNode = chart.nodes.find(n => config.t == n.type);
      if (!configNode) return;
      node = new NodeUI(chart, configNode, {
        x: config.c[0],
        y: config.c[1]
      });
      node.config.map((cfg, i) => {
        cfg.value = config.v[i];
      });
      node.render();

      node.destroy = () => {
        chart.renderedNodes.splice(chart.renderedNodes.indexOf(node), 1);
        node = null;
      };

      chart.renderedNodes.push(node);
    }

    if (from) {
      const fromDimension = from.getBoundingClientRect();
      const toDimension = node.inputs[0].getBoundingClientRect();
      const lineSvg = new svgArrow(document.body.clientWidth, document.body.clientHeight, 'none', color);
      chart.canvas.appendChild(lineSvg.element);
      const x1 = fromDimension.x + fromDimension.width;
      const y1 = fromDimension.y + fromDimension.height / 2;
      const x2 = toDimension.x;
      const y2 = toDimension.y + toDimension.height / 2;
      lineSvg.setPath(x1, y1, x2, y2);
      const connection = {
        output: from,
        input: node.inputs[0],
        svg: lineSvg,
        start: {
          x: x1,
          y: y1
        },
        end: {
          x: x2,
          y: y2
        }
      };
      node.inputs[0].lines.push(connection);
      from.lines.push(connection);
    }

    config.o.map((output, outputI) => {
      loadChart(output, chart, node.outputs[outputI]);
    });
  });
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

const exportChart = renderedNodes => {
  // find initial nodes (triggers);
  const triggers = renderedNodes.filter(node => node.group === 'TRIGGERS');
  const eventMap = {
    'init': 0
  };
  const events = renderedNodes.filter(node => node.type === 'event').map((event, i) => ({
    value: i,
    name: event.config[0].value
  }));
  events.forEach(event => {
    eventMap[event.name] = event.value;
  });
  let result = ''; // for each initial node walk the tree and produce one 'rule'

  triggers.map(trigger => {
    const walkRule = (r, i) => {
      const rules = r.toDsl ? r.toDsl({
        events
      }) : [];
      if (rules === null) return null;
      let ruleset = '';
      r.outputs.map((out, outI) => {
        let rule = rules[outI] || r.type;
        let subrule = '';

        if (out.lines) {
          out.lines.map(line => {
            subrule += walkRule(line.input.nodeObject, r.indent ? i + 1 : i);
          });
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

    const rule = walkRule(trigger, 0);
    if (rule === null) return;
    result += rule + "\xFF";
  });
  const bytes = stringToAsciiByteArray(result);
  return {
    rules: bytes,
    events: eventMap
  };
}; // drag and drop helpers


const dNd = {
  enableNativeDrag: (nodeElement, data) => {
    nodeElement.draggable = true;

    nodeElement.ondragstart = ev => {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["getKeys"])(data).map(key => {
        ev.dataTransfer.setData(key, data[key]);
      });
    };
  },
  enableNativeDrop: (nodeElement, fn) => {
    nodeElement.ondragover = ev => {
      ev.preventDefault();
    };

    nodeElement.ondrop = fn;
  } // svg helpers

};

class svgArrow {
  constructor(width, height, fill, color) {
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.element.setAttribute('style', 'z-index: -1;position:absolute;top:0px;left:0px');
    this.element.setAttribute('width', width);
    this.element.setAttribute('height', height);
    this.element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.line.setAttributeNS(null, "fill", fill);
    this.line.setAttributeNS(null, "stroke", color);
    this.element.appendChild(this.line);
  }

  setPath(x1, y1, x2, y2, tension = 0.5) {
    const delta = (x2 - x1) * tension;
    const hx1 = x1 + delta;
    const hy1 = y1;
    const hx2 = x2 - delta;
    const hy2 = y2;
    const path = `M ${x1} ${y1} C ${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`;
    this.line.setAttributeNS(null, "d", path);
  }

} // node configuration (each node in the left menu is represented by an instance of this object)


class Node {
  constructor(conf) {
    this.type = conf.type;
    this.group = conf.group;
    this.config = conf.config.map(config => Object.assign({}, config));
    this.inputs = conf.inputs.map(input => {});
    this.outputs = conf.outputs.map(output => {});
    this.toDsl = conf.toDsl;
    this.toString = conf.toString;
    this.toHtml = conf.toHtml;
    this.indent = conf.indent;
  }

} // node UI (each node in your flow diagram is represented by an instance of this object)


class NodeUI extends Node {
  constructor(chart, conf, position) {
    super(conf);
    this.chart = chart;
    this.canvas = chart.canvas;
    this.position = position;
    this.lines = [];
    this.linesEnd = [];
    this.toDsl = conf.toDsl;
    this.toString = conf.toString;
    this.toHtml = conf.toHtml;
    this.indent = conf.indent;
  }

  updateInputsOutputs(inputs, outputs) {
    inputs.map(input => {
      const rect = input.getBoundingClientRect();
      input.lines.map(line => {
        line.end.x = rect.x;
        line.end.y = rect.y + rect.height / 2;
        line.svg.setPath(line.start.x, line.start.y, line.end.x, line.end.y);
      });
    });
    outputs.map(output => {
      const rect = output.getBoundingClientRect();
      output.lines.map(line => {
        line.start.x = rect.x + rect.width;
        line.start.y = rect.y + rect.height / 2;
        line.svg.setPath(line.start.x, line.start.y, line.end.x, line.end.y);
      });
    });
  }

  handleMoveEvent(ev) {
    if (!this.canvas.canEdit) return;
    const shiftX = ev.clientX - this.element.getBoundingClientRect().left;
    const shiftY = ev.clientY - this.element.getBoundingClientRect().top;

    const onMouseMove = ev => {
      const newy = ev.y - shiftY;
      const newx = ev.x - shiftX;
      this.position.y = newy - newy % this.canvas.gridSize;
      this.position.x = newx - newx % this.canvas.gridSize;
      this.element.style.top = `${this.position.y}px`;
      this.element.style.left = `${this.position.x}px`;
      this.updateInputsOutputs(this.inputs, this.outputs);
    };

    const onMouseUp = ev => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  handleDblClickEvent(ev) {
    if (!this.canvas.canEdit) return;
    if (this.config.length) showConfigBox(this.type, this.config, () => {
      if (this.toHtml) {
        this.text.innerHTML = this.toHtml();
      } else {
        this.text.textContent = this.toString();
      }
    }, this.chart);
  }

  handleRightClickEvent(ev) {
    if (!this.canvas.canEdit) return;
    this.inputs.map(input => {
      input.lines.map(line => {
        line.output.lines = [];
        line.svg.element.parentNode.removeChild(line.svg.element);
      });
      input.lines = [];
    });
    this.outputs.map(output => {
      output.lines.map(line => {
        const index = line.input.lines.indexOf(line);
        line.input.lines.splice(index, 1);
        line.svg.element.parentNode.removeChild(line.svg.element);
      });
      output.lines = [];
    });
    this.element.parentNode.removeChild(this.element);
    if (this.destroy) this.destroy();
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  }

  render() {
    this.element = document.createElement('div');
    this.element.nodeObject = this;
    this.element.className = `node node-chart group-${this.group}`;
    this.text = document.createElement('span');

    if (this.toHtml) {
      this.text.innerHTML = this.toHtml();
    } else {
      this.text.textContent = this.toString();
    }

    this.element.appendChild(this.text);
    this.element.style.top = `${this.position.y}px`;
    this.element.style.left = `${this.position.x}px`;
    const inputs = document.createElement('div');
    inputs.className = 'node-inputs';
    this.element.appendChild(inputs);
    this.inputs.map((val, index) => {
      const input = this.inputs[index] = document.createElement('div');
      input.className = 'node-input';
      input.nodeObject = this;
      input.lines = [];

      input.onmousedown = ev => {
        ev.preventDefault();
        ev.stopPropagation();
      };

      inputs.appendChild(input);
    });
    const outputs = document.createElement('div');
    outputs.className = 'node-outputs';
    this.element.appendChild(outputs);
    this.outputs.map((val, index) => {
      const output = this.outputs[index] = document.createElement('div');
      output.className = 'node-output';
      output.nodeObject = this;
      output.lines = [];

      output.oncontextmenu = ev => {
        output.lines.map(line => {
          line.svg.element.parentNode.removeChild(line.svg.element);
        });
        output.lines = [];
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      };

      output.onmousedown = ev => {
        ev.stopPropagation();
        if (output.lines.length) return;
        const rects = output.getBoundingClientRect();
        const x1 = rects.x + rects.width;
        const y1 = rects.y + rects.height / 2;
        const lineSvg = new svgArrow(document.body.clientWidth, document.body.clientHeight, 'none', color);
        this.canvas.appendChild(lineSvg.element);

        const onMouseMove = ev => {
          lineSvg.setPath(x1, y1, ev.pageX, ev.pageY);
        };

        const onMouseUp = ev => {
          const elemBelow = document.elementFromPoint(ev.clientX, ev.clientY);
          const input = elemBelow ? elemBelow.closest('.node-input') : null;

          if (!input) {
            lineSvg.element.remove();
          } else {
            const inputRect = input.getBoundingClientRect();
            const x2 = inputRect.x;
            const y2 = inputRect.y + inputRect.height / 2;
            lineSvg.setPath(x1, y1, x2, y2);
            const connection = {
              output,
              input,
              svg: lineSvg,
              start: {
                x: x1,
                y: y1
              },
              end: {
                x: x2,
                y: y2
              }
            };
            output.lines.push(connection);
            input.lines.push(connection);
          }

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      outputs.appendChild(output);
    });
    this.element.ondblclick = this.handleDblClickEvent.bind(this);
    this.element.onmousedown = this.handleMoveEvent.bind(this);
    this.element.oncontextmenu = this.handleRightClickEvent.bind(this);
    this.canvas.appendChild(this.element);
  }

}

const getCfgUI = (cfg, chart) => {
  const template = document.createElement('template');
  const help = cfg.help ? `<span class='tooltip fa fa-info-circle'><tooltip>${cfg.help}</tooltip></span>` : '';

  const getSelectOptions = opt => {
    const val = opt.value != null ? opt.value : opt;
    const name = opt.name != null ? opt.name : opt;
    const selected = val == cfg.value ? 'selected' : '';
    const disabled = opt.disabld ? 'disabled' : '';
    return `<option value="${val}" ${selected} ${disabled}>${name}${opt.disabled ? ` [${opt.disabled}]` : ''}</option>`;
  };

  switch (cfg.type) {
    case 'text':
      template.innerHTML = `<div class="pure-control-group"><label>${cfg.name}</label><input type='text' name='${cfg.name}' value='${cfg.value}' />${help}</div>`;
      break;

    case 'number':
      template.innerHTML = `<div class="pure-control-group"><label>${cfg.name}</label><input type='number' name='${cfg.name}' value='${cfg.value}' />${help}</div>`;
      break;

    case 'select':
      const values = typeof cfg.values == 'function' ? cfg.values(chart) : cfg.values;
      template.innerHTML = `<div class="pure-control-group"><label>${cfg.name}</label><select name='${cfg.name}'>${values.map(val => getSelectOptions(val))}</select>${help}</div>`;
      break;

    case 'textselect':
      template.innerHTML = `<div class="pure-control-group"><label>${cfg.name}</label><div style="position:relative;display:inline-block;height:30px;">
            <select style="position:absolute;"
                    onchange="document.getElementById('displayValue').value=this.options[this.selectedIndex].text; document.getElementById('idValue').value=this.options[this.selectedIndex].value;">
                    ${cfg.values.map(val => getSelectOptions(val))}
            </select>
            <input type="text" name="${cfg.name}" id="displayValue" 
                   placeholder="add/select a value" onfocus="this.select()"
                   style="position:absolute;top:0px;left:0px;z-index:100;width: 190px;"  >
            <input name="idValue" id="idValue" type="hidden">
          </div></div>`;
  }

  return template.content.cloneNode(true);
};

const showConfigBox = (type, config, onclose, chart) => {
  const template = document.createElement('template');
  template.innerHTML = `
        <div class='configbox'>
            <form class="pure-form pure-form-aligned" name=configform onsubmit="return false;">
                <fieldset>
                    <label>${type}</label>
                    <div class="configbox-body"></div>
                </fieldset>
            </form>
            <div class="configbox-footer">
                <button class="pure-button pure-button-primary" id=ob>OK</button>
                <button class="pure-button" id=cb>Cancel</button>
            </div>
        </div>
    `;
  document.body.appendChild(template.content.cloneNode(true));
  const configBox = document.body.querySelectorAll('.configbox')[0];
  const body = document.body.querySelectorAll('.configbox-body')[0];
  const okButton = document.getElementById('ob');
  const cancelButton = document.getElementById('cb');

  cancelButton.onclick = () => {
    configBox.remove();
  };

  okButton.onclick = () => {
    // set configuration to node
    config.map(cfg => {
      cfg.value = document.forms['configform'].elements[cfg.name].value;
    });
    configBox.remove();
    onclose();
  };

  config.map(cfg => {
    const cfgUI = getCfgUI(cfg, chart);
    body.appendChild(cfgUI);
  });
};

class FlowEditor {
  constructor(element, nodes, config) {
    this.nodes = [];
    this.renderedNodes = [];
    this.onSave = config.onSave;
    this.canEdit = !config.readOnly;
    this.debug = config.debug != null ? config.debug : true;
    this.gridSize = config.gridSize || 1;
    this.element = element;
    nodes.map(nodeConfig => {
      if (nodeConfig.if !== undefined && !nodeConfig.if()) return;
      const node = new Node(nodeConfig);
      this.nodes.push(node);
    });
    this.render();
    if (this.canEdit) dNd.enableNativeDrop(this.canvas, ev => {
      const configNode = this.nodes.find(node => node.type == ev.dataTransfer.getData('type'));
      let node = new NodeUI(this, configNode, {
        x: ev.x,
        y: ev.y
      });
      node.render();

      node.destroy = () => {
        this.renderedNodes.splice(this.renderedNodes.indexOf(node), 1);
        node = null;
      };

      this.renderedNodes.push(node);
    });
  }

  loadConfig(config) {
    loadChart(config, this);
  }

  saveConfig() {
    return saveChart(this.renderedNodes);
  }

  renderContainers() {
    if (this.canEdit) {
      this.sidebar = document.createElement('div');
      this.sidebar.className = 'sidebar';
      this.element.appendChild(this.sidebar);
    }

    this.canvas = document.createElement('div');
    this.canvas.className = 'canvas';
    this.canvas.canEdit = this.canEdit;
    this.canvas.gridSize = this.gridSize;
    this.element.appendChild(this.canvas);

    if (this.canEdit && this.debug) {
      this.debug = document.createElement('div');
      this.debug.className = 'debug';
      const text = document.createElement('div');
      this.debug.appendChild(text);
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'SAVE';

      saveBtn.onclick = () => {
        const config = JSON.stringify(saveChart(this.renderedNodes));
        const rules = exportChart(this.renderedNodes);
        this.onSave(config, rules);
      };

      const loadBtn = document.createElement('button');
      loadBtn.textContent = 'LOAD';

      loadBtn.onclick = () => {
        const input = prompt('enter config');
        loadChart(JSON.parse(input), this);
      };

      const exportBtn = document.createElement('button');
      exportBtn.textContent = 'EXPORT';

      exportBtn.onclick = () => {
        const exported = exportChart(this.renderedNodes);
        text.textContent = exported;
      };

      this.debug.appendChild(exportBtn);
      this.debug.appendChild(saveBtn);
      this.debug.appendChild(loadBtn);
      this.debug.appendChild(text);
      this.element.appendChild(this.debug);
    }
  }

  renderConfigNodes() {
    const groups = {};
    this.nodes.map(node => {
      if (!groups[node.group]) {
        const group = document.createElement('div');
        group.className = 'group';
        group.textContent = node.group;
        this.sidebar.appendChild(group);
        groups[node.group] = group;
      }

      const nodeElement = document.createElement('div');
      nodeElement.className = `node group-${node.group}`;
      nodeElement.textContent = node.type;
      groups[node.group].appendChild(nodeElement);
      dNd.enableNativeDrag(nodeElement, {
        type: node.type
      });
    });
  }

  render() {
    this.renderContainers();
    if (this.canEdit) this.renderConfigNodes();
  }

}

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
/* harmony import */ var _espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./espeasy */ "./src/lib/espeasy.js");
/* harmony import */ var _pages_dashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/dashboard */ "./src/pages/dashboard.js");




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
  component: _pages_dashboard__WEBPACK_IMPORTED_MODULE_2__["DashboardPage"],
  children: []
}, {
  title: 'Devices',
  href: 'devices',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DevicesPage"],
  children: []
}, //{ title: 'Controllers', href: 'controllers', component: ControllersPage, children: [] },
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
  title: 'Edit Controller',
  href: 'controllers/edit',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["ControllerEditPage"]
}, {
  title: 'Edit Device',
  href: 'devices/edit',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["DevicesEditPage"]
}, {
  title: 'Edit Alert',
  href: 'alerts/edit',
  component: _pages__WEBPACK_IMPORTED_MODULE_0__["AlertsEditPage"]
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

/***/ "./src/lib/node_definitions.js":
/*!*************************************!*\
  !*** ./src/lib/node_definitions.js ***!
  \*************************************/
/*! exports provided: getNodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodes", function() { return getNodes; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/lib/settings.js");
/* harmony import */ var _pins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pins */ "./src/lib/pins.js");


const getNodes = (devices, vars) => {
  const nodes = [// TRIGGERS
  {
    group: 'TRIGGERS',
    type: 'timer',
    inputs: [],
    outputs: [1],
    config: [{
      name: 'timer',
      type: 'select',
      values: [1, 2, 3, 4, 5, 6, 7, 8],
      value: 1
    }],
    indent: true,
    toString: function () {
      return `on timer ${this.config[0].value}`;
    },
    toDsl: function () {
      return [`\xFF\xFE\x00\xFF\x02${String.fromCharCode(this.config[0].value)}`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'event',
    inputs: [],
    outputs: [1],
    config: [{
      name: 'name',
      type: 'text',
      value: 'eventname'
    }],
    indent: true,
    toString: function () {
      return `event ${this.config[0].value}`;
    },
    toDsl: function ({
      events
    }) {
      const event = events.find(e => e.name === this.config[0].value);
      if (!event) return null;
      return [`\xFF\xFE\x00\xFF\x01${String.fromCharCode(event.value)}`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'clock',
    inputs: [],
    outputs: [1],
    config: [],
    indent: true,
    toString: () => {
      return 'clock';
    },
    toDsl: () => {
      return [`\xFF\xFE\x00\xFF\x03\x00`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'system boot',
    inputs: [],
    outputs: [1],
    config: [],
    indent: true,
    toString: function () {
      return `on boot`;
    },
    toDsl: function () {
      return [`\xFF\xFE\x00\xFF\x03\x01`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'hardware timer',
    inputs: [],
    outputs: [1],
    config: [{
      name: 'timer',
      type: 'select',
      values: function () {
        return _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.timer', []).map((t, i) => ({
          name: `timer_${i}`,
          value: i,
          enabled: t.enabled
        })).filter(t => t.enabled);
      },
      value: 0
    }],
    if: function () {
      return this.config[0].values().length > 0;
    },
    indent: true,
    toString: function () {
      return `on hw_timer ${this.config[0].value}`;
    },
    toDsl: function () {
      return [`\xFF\xFE\x00\xFF\x04${String.fromCharCode(this.config[0].value)}`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'hardware interrupt',
    inputs: [],
    outputs: [1],
    config: [{
      name: 'timer',
      type: 'select',
      values: () => {
        return window.io_pins.getPins('interrupt');
      },
      value: 0
    }],
    if: function () {
      return this.config[0].values().length > 0;
    },
    indent: true,
    toString: function () {
      return `on hw_interrupt ${this.config[0].value}`;
    },
    toDsl: function () {
      return [`\xFF\xFE\x00\xFF\x05${String.fromCharCode(this.config[0].value)}`];
    }
  }, {
    group: 'TRIGGERS',
    type: 'alexa',
    inputs: [],
    outputs: [1],
    config: [{
      name: 'trigger',
      type: 'select',
      values: function () {
        return _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('alexa.triggers', []).map((t, i) => ({
          name: t.name,
          value: i
        }));
      }
    }],
    if: () => {
      return _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('alexa.triggers', []).length > 0;
    },
    indent: true,
    toString: function () {
      const vals = this.config[0].values();
      const val = vals.find(v => v.value == this.config[0].value) || {
        name: ''
      };
      return `on alexa '${val.name}'`;
    },
    toDsl: function () {
      return [`\xFF\xFE\x00\xFF\x06${String.fromCharCode(this.config[0].value)}`];
    }
  }, // LOGIC
  {
    group: 'LOGIC',
    type: 'if/else',
    inputs: [1],
    outputs: [1, 2],
    config: [{
      name: 'state',
      type: 'select',
      values: [...vars, {
        name: 'state',
        value: 255
      }]
    }, {
      name: 'equality',
      type: 'select',
      values: [' changed ', '=', '<', '>', '<=', '>=', '!='],
      value: 0
    }, {
      name: 'value',
      type: 'text',
      value: ''
    }],
    indent: true,
    toString: function () {
      const val = this.config[0].values.find(v => v.value == this.config[0].value);
      return `IF ${val ? val.name : ''}${this.config[1].value}${this.config[2].value}`;
    },
    toDsl: function () {
      const eq = this.config[1].values.findIndex(v => v === this.config[1].value);
      const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
      return [`\xFC\x01${devprop}${String.fromCharCode(eq)}\x01${String.fromCharCode(this.config[2].value)}%%output%%`, `\xFD%%output%%\xFE`];
    }
  }, {
    group: 'LOGIC',
    type: 'delay',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'delay',
      type: 'number'
    }],
    toString: function () {
      return `delay: ${this.config[0].value}`;
    },
    toDsl: function () {
      return [`\xF4${String.fromCharCode(this.config[0].value)}`];
    }
  }, // ACTIONS
  {
    group: 'ACTIONS',
    type: 'get state',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'state',
      type: 'select',
      values: [...vars]
    }],
    toString: function () {
      const val = this.config[0].values.find(v => v.value == this.config[0].value);
      return `GET ${val ? val.name : ''}`;
    },
    toDsl: function () {
      const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
      return [`\xF7${devprop}\x01`];
    }
  }, {
    group: 'ACTIONS',
    type: 'set state',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'state',
      type: 'select',
      values: [...vars, {
        name: 'state',
        value: 255
      }]
    }, {
      name: 'value',
      type: 'select',
      values: [0, 1, {
        value: 255,
        name: 'state'
      }]
    }],
    toString: function () {
      const val = this.config[0].values.find(v => v.value == this.config[0].value);
      const val2 = this.config[1].value == 255 ? 'state' : this.config[1].value;
      return `SET ${val ? val.name : ''} = ${val2}`;
    },
    toDsl: function () {
      const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
      return [`\xF0${devprop}\x01${String.fromCharCode(this.config[1].value)}`];
    }
  }, {
    group: 'ACTIONS',
    type: 'fire event',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'name',
      type: 'select',
      values: chart => {
        const events = chart.renderedNodes.filter(node => node.type === 'event');
        return events.map((event, i) => ({
          value: event.config[0].value,
          name: event.config[0].value
        }));
      }
    }],
    toString: function () {
      return `event ${this.config[0].value}`;
    },
    toDsl: function ({
      events
    }) {
      const event = events.find(e => e.name === this.config[0].value);
      if (!event) return '';
      return [`\xF2${String.fromCharCode(event.value)}`];
    }
  }, {
    group: 'ACTIONS',
    type: 'settimer',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'timer',
      type: 'select',
      values: [1, 2, 3, 4, 5, 6, 7, 8]
    }, {
      name: 'value',
      type: 'number'
    }],
    toString: function () {
      return `timer${this.config[0].value} = ${this.config[1].value}`;
    },
    toDsl: function () {
      return [`\xF3${String.fromCharCode(this.config[0].value)}${String.fromCharCode(this.config[1].value)}`];
    }
  }, {
    group: 'ACTIONS',
    type: 'set hw_timer',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'timer',
      type: 'select',
      values: function () {
        return _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.timer', []).map((t, i) => ({
          name: `timer_${i}`,
          value: i,
          enabled: t.enabled
        })).filter(t => t.enabled);
      }
    }, {
      name: 'value',
      type: 'text',
      help: 'units: d (day), h (hour), m (minute), s (second), u (milisecond)\nFor example: 4s will wait for 4 seconds.'
    }],
    toString: function () {
      return `hw_timer${this.config[0].value} = ${this.config[1].value}`;
    },
    toDsl: function () {
      const timer = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get(`hardware.timer.${this.config[0].value}`);
      const freq = BigInt(80000 / timer.divider);
      const unit = this.config[1].value.substr(-1);
      let time = BigInt(this.config[1].value.substr(0, this.config[1].value.length - 1));

      switch (unit) {
        //case 'u': break;
        case 's':
          time *= BigInt(1000);
          break;

        case 'm':
          time *= BigInt(1000 * 60);
          break;

        case 'h':
          time *= BigInt(1000 * 60 * 60);
          break;

        case 'd':
          time *= BigInt(1000 * 60 * 60 * 24);
          break;
      }

      const value = freq * time;

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

      return [`\xE2${String.fromCharCode(this.config[0].value)}${getString(toByteArray(value, 8))}`];
    }
  }, {
    group: 'ACTIONS',
    type: 'MQTT',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'topic',
      type: 'text'
    }, {
      name: 'command',
      type: 'text'
    }],
    toString: function () {
      return `mqtt ${this.config[1].value}`;
    },
    toDsl: function () {
      return [`Publish ${this.config[0].value},${this.config[1].value}\n`];
    }
  }, {
    group: 'ACTIONS',
    type: 'HTTP',
    inputs: [1],
    outputs: [1],
    config: [{
      name: 'url',
      type: 'text'
    }],
    toString: function () {
      return `HTTP ${this.config[0].value}`;
    },
    toDsl: function () {
      return [`\xEF${this.config[0].value}\x00`];
    }
  }];
  return nodes;
};

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
      allPins.find(ap => ap.value == i2c["scl"]).disabled = "I2C";
      allPins.find(ap => ap.value == i2c["sda"]).disabled = "I2C";
    }

    const sdcard = _settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('hardware.sdcard');

    if (sdcard && sdcard['enabled']) {
      [2, 4, 12, 13, 14, 15].forEach(x => {
        allPins.find(ap => ap.value == x).disabled = "SDCARD";
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
/* harmony import */ var _espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./espeasy */ "./src/lib/espeasy.js");
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
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', url);
    document.head.appendChild(linkElement);
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
    espeasy: _espeasy__WEBPACK_IMPORTED_MODULE_1__["default"],
    page
  };
};

window.getPluginAPI = getPluginAPI;
const firePageLoad = () => {
  onPageLoadHandlers.forEach(h => h());
};
const loadPlugins = async () => {
  return Promise.all(_settings__WEBPACK_IMPORTED_MODULE_0__["settings"].get('ui_plugins', []).filter(p => p.enabled).map(async plugin => {
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
  }

  getRules() {
    return this.rules;
  }

  setRules(rules) {
    this.storedRules = JSON.parse(JSON.stringify(rules));
    this.rulesChanged = false;
  }
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

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/*! exports provided: getTasks, getTaskValues */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTasks", function() { return getTasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTaskValues", function() { return getTaskValues; });
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");
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
const formConfig = {
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
    bluetooth: {
      name: 'Bluetooth Settinggs',
      configs: {
        enabled: {
          name: 'Enabled',
          type: 'checkbox'
        }
      }
    },
    gpio: {
      name: 'GPIO boot states',
      configs: [...new Array(32)].map((x, i) => {
        return [{
          name: `Pin Mode GPIO-${i}`,
          type: 'select',
          options: pinState,
          var: `gpio.${i}.mode`
        }, {
          name: 'interrupt',
          type: 'checkbox',
          if: `hardware.gpio.${i}.mode`,
          ifval: 3,
          var: `gpio.${i}.interrupt`
        }];
      })
    }
  }
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

    formConfig.onSave = values => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set('hardware', values);
      window.location.href = '#devices';
    };

    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
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
const formConfig = {
  groups: {
    unit: {
      name: 'General',
      configs: {
        name: {
          name: 'Unit Name',
          type: 'string'
        },
        nr: {
          name: 'Unit Number',
          type: 'number'
        },
        appendToHost: {
          name: 'Append Unit Name to Hostname',
          type: 'checkbox'
        },
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
        ssid: {
          name: 'SSID',
          type: 'string'
        },
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
class ConfigPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    formConfig.onSave = values => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].set(`config`, values);
      window.location.href = '#devices';
    };

    const config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get();
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(_components_form__WEBPACK_IMPORTED_MODULE_1__["Form"], {
      config: formConfig,
      selected: config
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
    this.plugins = _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('ui_plugins');

    if (this.plugins) {
      this.plugins = [{
        name: 'IconSelector',
        enabled: false,
        url: 'http://localhost:8080/build/iconpicker.js'
      }];
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set('ui_plugins', this.plugins);
    }

    this.handleEnableToggle = e => {
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
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

/***/ "./src/pages/controllers.edit.js":
/*!***************************************!*\
  !*** ./src/pages/controllers.edit.js ***!
  \***************************************/
/*! exports provided: protocols, ControllerEditPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "protocols", function() { return protocols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControllerEditPage", function() { return ControllerEditPage; });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.mjs");
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/form */ "./src/components/form/index.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.js");
/* harmony import */ var _components_espeasy_p2p__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/espeasy_p2p */ "./src/components/espeasy_p2p/index.js");





const protocols = [{
  name: '- Standalone -',
  value: 0
}, {
  name: 'Domoticz HTTP',
  value: 1
}, {
  name: 'Domoticz MQTT',
  value: 2
}, {
  name: 'Nodo Telnet',
  value: 3
}, {
  name: 'ThingSpeak',
  value: 4
}, {
  name: 'OpenHAB MQTT',
  value: 5
}, {
  name: 'PiDome MQTT',
  value: 6
}, {
  name: 'Emoncms',
  value: 7
}, {
  name: 'Generic HTTP',
  value: 8
}, {
  name: 'FHEM HTTP',
  value: 9
}, {
  name: 'Generic UDP',
  value: 10
}, {
  name: 'ESPEasy P2P Networking',
  value: 13
}, {
  name: 'Email',
  value: 25
}];
const baseFields = {
  dns: {
    name: 'Locate Controller',
    type: 'select',
    options: [{
      value: 0,
      name: 'Use IP Address'
    }, {
      value: 1,
      name: 'Use Hostname'
    }]
  },
  IP: {
    name: 'IP',
    type: 'ip'
  },
  hostname: {
    name: 'Hostname',
    type: 'string'
  },
  port: {
    name: 'Port',
    type: 'number'
  },
  minimal_time_between: {
    name: 'Minimum Send Interval',
    type: 'number'
  },
  max_queue_depth: {
    name: 'Max Queue Depth',
    type: 'number'
  },
  max_retry: {
    name: 'Max Retries',
    type: 'number'
  },
  delete_oldest: {
    name: 'Full Queue Action',
    type: 'select',
    options: [{
      value: 0,
      name: 'Ignore New'
    }, {
      value: 1,
      name: 'Delete Oldest'
    }]
  },
  must_check_reply: {
    name: 'Check Reply',
    type: 'select',
    options: [{
      value: 0,
      name: 'Ignore Acknowledgement'
    }, {
      value: 1,
      name: 'Check Acknowledgement'
    }]
  },
  client_timeout: {
    name: 'Client Timeout',
    type: 'number'
  }
};
const user = {
  name: 'Controller User',
  type: 'string'
};
const password = {
  name: 'Controller Password',
  type: 'password'
};
const subscribe = {
  name: 'Controller Subscribe',
  type: 'string'
};
const publish = {
  name: 'Controller Publish',
  type: 'string'
};
const lwtTopicField = {
  MQTT_lwt_topic: {
    name: 'Controller LWT topic:',
    type: 'string'
  },
  lwt_message_connect: {
    name: 'LWT Connect Message',
    type: 'string'
  },
  lwt_message_disconnect: {
    name: 'LWT Disconnect Message',
    type: 'string'
  }
};
const baseDefaults = {
  port: 1883,
  minimal_time_between: 100,
  max_queue_depth: 10,
  max_retry: 10,
  client_timeout: 1000
};
const getDefaults = {
  1: () => ({
    // Domoticz HTTP
    port: 8080
  }),
  2: () => ({
    // Domoticz MQTT
    subscribe: 'domoticz/out',
    public: 'domoticz/in'
  }),
  3: () => ({
    // Nodo Telnet
    port: 23
  }),
  4: () => ({
    // ThingSpeak
    port: 80
  }),
  5: () => ({
    // OpenHAB MQTT
    subscribe: '/%sysname%/#',
    publish: '/%sysname%/%tskname%/%valname%'
  }),
  6: () => ({
    // PiDome MQTT
    subscribe: '/Home/#',
    publish: '/hooks/devices/%id%/SensorData/%valname%'
  }),
  7: () => ({
    // Emoncms
    port: 80
  }),
  8: () => ({
    // Generic HTTP
    port: 80,
    publish: 'demo.php?name=%sysname%&task=%tskname%&valuename=%valname%&value=%value%'
  }),
  9: () => ({
    // FHEM HTTP
    port: 8383
  }),
  10: () => ({
    // Generic UDP
    port: 514,
    publish: '%sysname%_%tskname%_%valname%=%value%'
  }),
  13: () => ({
    // EspEasy P2P
    port: 65501,
    Custom: 1
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

const getFormConfig = type => {
  let additionalFields = {};
  let additionalGroups = {};

  switch (Number(type)) {
    case 2: // Domoticz MQTT

    case 5:
      // OpenHAB MQTT
      additionalFields = { ...baseFields,
        user,
        password,
        subscribe,
        publish,
        ...lwtTopicField
      };
      break;

    case 6:
      // 'PiDome MQTT'
      additionalFields = { ...baseFields,
        subscribe,
        publish,
        ...lwtTopicField
      };
      break;

    case 3: //'Nodo Telnet'

    case 7:
      //'Emoncms':
      additionalFields = { ...baseFields,
        password
      };
      break;

    case 8:
      // 'Generic HTTP'
      additionalFields = { ...baseFields,
        user,
        password,
        subscribe,
        publish
      };
      break;

    case 1: // Domoticz HTTP

    case 9:
      // 'FHEM HTTP'
      additionalFields = { ...baseFields,
        user,
        password
      };
      break;

    case 10:
      //'Generic UDP': 
      additionalFields = { ...baseFields,
        subscribe,
        publish
      };
      break;

    case 13:
      //'ESPEasy P2P Networking':
      additionalGroups = {
        global: {
          name: 'Global Settings',
          configs: {
            port: {
              name: 'UDP Port',
              type: 'number',
              var: 'ROOT.config.espnetwork.port'
            }
          }
        },
        nodes: {
          name: 'Connected Nodes',
          configs: {
            nodes: {
              type: 'custom',
              component: _components_espeasy_p2p__WEBPACK_IMPORTED_MODULE_4__["EspEaspP2PComponent"]
            }
          }
        }
      };
      break;

    case 0:
    default:
      additionalFields = { ...baseFields
      };
  }

  return {
    groups: {
      settings: {
        name: 'Controller Settings',
        configs: {
          protocol: {
            name: 'Protocol',
            type: 'select',
            var: 'protocol',
            options: protocols
          },
          enabled: {
            name: 'Enabled',
            type: 'checkbox',
            var: 'enabled'
          },
          ...additionalFields
        }
      },
      ...additionalGroups
    }
  };
}; // todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 


class ControllerEditPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.config = _lib_settings__WEBPACK_IMPORTED_MODULE_2__["settings"].get(`controllers[${props.params[0]}]`);
    this.state = {
      protocol: this.config.protocol
    };
  }

  render(props) {
    const formConfig = getFormConfig(this.state.protocol);

    formConfig.groups.settings.configs.protocol.onChange = e => {
      this.setState({
        protocol: e.currentTarget.value
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
/* harmony import */ var _controllers_edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controllers.edit */ "./src/pages/controllers.edit.js");



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
      }, i + 1, ": ", c.enabled ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "\u2713") : Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("b", null, "\u2717"), "\xA0\xA0[", _controllers_edit__WEBPACK_IMPORTED_MODULE_2__["protocols"].find(p => p.value === c.protocol).name, "] PORT:", c.settings.port, " HOST:", c.settings.host, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");



class DashboardPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      devices: _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].get('plugins').filter(p => p && p.enabled),
      deviceState: []
    };

    this.renderSwitch = (device, deviceState) => {
      const state = deviceState[device.state.values[0].name];

      const buttonClick = async () => {
        await fetch(`/plugin/${device.id}/state/0/${state ? 0 : 1}`); // deviceState[device.state.values[0].name] = !state;
        // this.forceUpdate(); 
      };

      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "icon"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "body"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "info"
      }, device.name, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
        onClick: buttonClick
      }, !state ? 'ON' : 'OFF')))));
    }; // TODO: we should have a generic way to access device values


    this.renderSensor = (device, deviceState) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        className: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "icon"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "body"
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
        className: "device"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "icon"
      }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", {
        class: device.icon
      })), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "body"
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

        default:
          return null;
      }
    };
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, this.state.devices.map((device, i) => {
      return this.renderDevice(device, this.state.deviceState[device.id] || {});
    }));
  }

  fetchDevices() {
    Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["loadDevices"])().then(deviceState => {
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
      'data-action': 'iconPicker'
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");
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
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.addDevice
    }, "add device")), tasks.map((task, i) => {
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
        defaultChecked: task.enabled,
        "data-prop": enabledProp,
        onChange: this.handleEnableToggle
      }), "\xA0\xA0", task.name, " [", deviceType, "]", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("a", {
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
      }, "down")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
        class: "vars"
      }, vals.map(v => {
        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("span", null, v.name, ": ", v.value, " ");
      }))));
    }));
  }

  fetchDevices() {
    Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_3__["loadDevices"])().then(devices => {
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

    this.applyChanges = () => {
      this.diff.map(d => {
        const input = this.form.elements[d.path];

        if (!input.checked) {
          _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].set(input.name, d.val1);
        }
      });
      _lib_settings__WEBPACK_IMPORTED_MODULE_1__["settings"].apply();
      _lib_loader__WEBPACK_IMPORTED_MODULE_3__["loader"].show();
      Object(_lib_config__WEBPACK_IMPORTED_MODULE_2__["saveConfig"])().then(() => {
        window.location.href = '#config/reboot';
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");



class FSPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };

    this.saveForm = async () => {
      _lib_loader__WEBPACK_IMPORTED_MODULE_2__["loader"].show();
      await Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_1__["storeFile"])(this.file.files[0]);
      await this.fetch();
    };

    this.deleteFile = e => {
      const fileName = e.currentTarget.dataset.name;
      Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_1__["deleteFile"])(fileName).then(() => this.fetch());
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
/*! exports provided: ControllersPage, DevicesPage, ConfigPage, ConfigAdvancedPage, pins, ConfigHardwarePage, RebootPage, LoadPage, UpdatePage, RulesPage, ToolsPage, FSPage, FactoryResetPage, DiscoverPage, protocols, ControllerEditPage, types, ControllerAlexaPage, ControllerAlertsPage, AlertsPage, AlertsEditPage, DevicesEditPage, DiffPage, RulesEditorPage, SetupPage, SysVarsPage, ConfigPluginsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controllers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers */ "./src/pages/controllers.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllersPage", function() { return _controllers__WEBPACK_IMPORTED_MODULE_0__["ControllersPage"]; });

/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./devices */ "./src/pages/devices.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DevicesPage", function() { return _devices__WEBPACK_IMPORTED_MODULE_1__["DevicesPage"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./src/pages/config.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigPage", function() { return _config__WEBPACK_IMPORTED_MODULE_2__["ConfigPage"]; });

/* harmony import */ var _config_advanced__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.advanced */ "./src/pages/config.advanced.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigAdvancedPage", function() { return _config_advanced__WEBPACK_IMPORTED_MODULE_3__["ConfigAdvancedPage"]; });

/* harmony import */ var _config_hardware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.hardware */ "./src/pages/config.hardware.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pins", function() { return _config_hardware__WEBPACK_IMPORTED_MODULE_4__["pins"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigHardwarePage", function() { return _config_hardware__WEBPACK_IMPORTED_MODULE_4__["ConfigHardwarePage"]; });

/* harmony import */ var _config_plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config.plugins */ "./src/pages/config.plugins.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConfigPluginsPage", function() { return _config_plugins__WEBPACK_IMPORTED_MODULE_5__["ConfigPluginsPage"]; });

/* harmony import */ var _reboot__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reboot */ "./src/pages/reboot.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RebootPage", function() { return _reboot__WEBPACK_IMPORTED_MODULE_6__["RebootPage"]; });

/* harmony import */ var _load__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./load */ "./src/pages/load.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadPage", function() { return _load__WEBPACK_IMPORTED_MODULE_7__["LoadPage"]; });

/* harmony import */ var _update__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./update */ "./src/pages/update.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdatePage", function() { return _update__WEBPACK_IMPORTED_MODULE_8__["UpdatePage"]; });

/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./rules */ "./src/pages/rules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RulesPage", function() { return _rules__WEBPACK_IMPORTED_MODULE_9__["RulesPage"]; });

/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./tools */ "./src/pages/tools.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ToolsPage", function() { return _tools__WEBPACK_IMPORTED_MODULE_10__["ToolsPage"]; });

/* harmony import */ var _fs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./fs */ "./src/pages/fs.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FSPage", function() { return _fs__WEBPACK_IMPORTED_MODULE_11__["FSPage"]; });

/* harmony import */ var _factory_reset__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./factory_reset */ "./src/pages/factory_reset.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FactoryResetPage", function() { return _factory_reset__WEBPACK_IMPORTED_MODULE_12__["FactoryResetPage"]; });

/* harmony import */ var _discover__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./discover */ "./src/pages/discover.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscoverPage", function() { return _discover__WEBPACK_IMPORTED_MODULE_13__["DiscoverPage"]; });

/* harmony import */ var _controllers_edit__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./controllers.edit */ "./src/pages/controllers.edit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "protocols", function() { return _controllers_edit__WEBPACK_IMPORTED_MODULE_14__["protocols"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllerEditPage", function() { return _controllers_edit__WEBPACK_IMPORTED_MODULE_14__["ControllerEditPage"]; });

/* harmony import */ var _controllers_alexa__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./controllers.alexa */ "./src/pages/controllers.alexa.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "types", function() { return _controllers_alexa__WEBPACK_IMPORTED_MODULE_15__["types"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllerAlexaPage", function() { return _controllers_alexa__WEBPACK_IMPORTED_MODULE_15__["ControllerAlexaPage"]; });

/* harmony import */ var _controllers_alerts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./controllers.alerts */ "./src/pages/controllers.alerts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControllerAlertsPage", function() { return _controllers_alerts__WEBPACK_IMPORTED_MODULE_16__["ControllerAlertsPage"]; });

/* harmony import */ var _alerts__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./alerts */ "./src/pages/alerts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertsPage", function() { return _alerts__WEBPACK_IMPORTED_MODULE_17__["AlertsPage"]; });

/* harmony import */ var _alerts_edit__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./alerts.edit */ "./src/pages/alerts.edit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertsEditPage", function() { return _alerts_edit__WEBPACK_IMPORTED_MODULE_18__["AlertsEditPage"]; });

/* harmony import */ var _devices_edit__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./devices.edit */ "./src/pages/devices.edit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DevicesEditPage", function() { return _devices_edit__WEBPACK_IMPORTED_MODULE_19__["DevicesEditPage"]; });

/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./diff */ "./src/pages/diff.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiffPage", function() { return _diff__WEBPACK_IMPORTED_MODULE_20__["DiffPage"]; });

/* harmony import */ var _rules_editor__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./rules.editor */ "./src/pages/rules.editor.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RulesEditorPage", function() { return _rules_editor__WEBPACK_IMPORTED_MODULE_21__["RulesEditorPage"]; });

/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./setup */ "./src/pages/setup.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetupPage", function() { return _setup__WEBPACK_IMPORTED_MODULE_22__["SetupPage"]; });

/* harmony import */ var _tools_sysvars__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./tools.sysvars */ "./src/pages/tools.sysvars.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SysVarsPage", function() { return _tools_sysvars__WEBPACK_IMPORTED_MODULE_23__["SysVarsPage"]; });


























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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");


class LoadPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    this.saveForm = () => {
      Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_1__["storeFile"])(this.file.files[0]);
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


class RebootPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, "ESPEasy is rebooting ... please wait a while, this page will auto refresh.");
  }

  componentDidMount() {
    _lib_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].show();
    fetch('/reboot').then(() => {
      setTimeout(() => {
        _lib_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].hide();
        window.location.hash = '#devices';
        window.location.reload();
      }, 5000);
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
/* harmony import */ var _lib_floweditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/floweditor */ "./src/lib/floweditor.js");
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");
/* harmony import */ var _lib_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/settings */ "./src/lib/settings.js");




class RulesEditorPage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.devices = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].get('plugins');
    this.rules = _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].rules;
  }

  render(props) {
    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", {
      class: "editor",
      ref: ref => this.element = ref
    });
  }

  componentDidMount() {
    Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["getConfigNodes"])(this.devices).then(nodes => {
      this.chart = new _lib_floweditor__WEBPACK_IMPORTED_MODULE_1__["FlowEditor"](this.element, nodes, {
        onSave: (config, rules) => {
          _lib_settings__WEBPACK_IMPORTED_MODULE_3__["settings"].rules = JSON.parse(config);
          Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["storeRuleConfig"])(config);
          Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["storeRule"])(rules);
        }
      });
      this.chart.loadConfig(this.rules);
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");



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
        cmdArray.push(this.state.event);
      } else {
        cmdArray.push(this.state.device);
        cmdArray.push(this.state.state);
        if (this.state.cmd === 240) cmdArray.push(this.state.value);
      }

      fetch(`/cmd/3`, {
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
        this.history += `<div class="log_level"><span class="date"></span><span class="value">${log}</span></div>`;
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
        cmd: parseInt(e.currentTarget.value)
      });
    };

    const setEvent = e => {
      this.setState({
        event: parseInt(e.currentTarget.value)
      });
    };

    const setDevice = e => {
      this.setState({
        device: parseInt(e.currentTarget.value)
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
      style: "width: 100%; height: 200px; overflow-y: scroll;",
      ref: ref => this.log = ref
    }, "loading logs ..."), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, "Command: ", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("input", {
      type: "text",
      ref: ref => this.cmd = ref
    }), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
      type: "button",
      onClick: this.sendCommand
    }, "send")), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, "Command:", Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      onChange: setCmd
    }, Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "242"
    }, "event"), Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
      value: "240"
    }, "set state")), this.state.cmd === 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      onChange: setEvent
    }, Object.keys(this.events).map(key => {
      const i = this.events[key];
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
        value: i
      }, key);
    })), this.state.cmd !== 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
      onChange: setDevice
    }, devices.map((device, i) => {
      return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("option", {
        value: i
      }, device.name);
    })), this.state.cmd !== 242 && Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])("select", {
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
      style: "width: 100%; height: 200px",
      ref: ref => this.cmdOutput = ref
    }));
  }

  async componentDidMount() {
    this.device_state = await Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["loadDevices"])();
    this.events = await Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_2__["getEvents"])();
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
/* harmony import */ var _lib_espeasy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/espeasy */ "./src/lib/espeasy.js");
/* harmony import */ var _lib_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/loader */ "./src/lib/loader.js");



class UpdatePage extends preact__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    this.saveForm = () => {
      _lib_loader__WEBPACK_IMPORTED_MODULE_2__["loader"].show();
      Object(_lib_espeasy__WEBPACK_IMPORTED_MODULE_1__["fetchProgress"])('/update', {
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