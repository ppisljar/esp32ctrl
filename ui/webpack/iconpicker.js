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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugins/iconpicker/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugins/iconpicker/bulma/defaultOptions.js":
/*!********************************************************!*\
  !*** ./src/plugins/iconpicker/bulma/defaultOptions.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const defaultOptions = {
  iconSets: [{
    name: 'simpleLine',
    // Name displayed on tab
    css: 'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css',
    // CSS url containing icons rules
    prefix: 'icon-',
    // CSS rules prefix to identify icons
    displayPrefix: ''
  }, {
    name: 'fontAwesome',
    // Name displayed on tab
    css: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
    // CSS url containing icons rules
    prefix: 'fa-',
    // CSS rules prefix to identify icons
    displayPrefix: 'fas fa-icon'
  }, {
    name: 'material',
    // Name displayed on tab
    css: 'https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css',
    // CSS url containing icons rules
    prefix: 'mdi-',
    // CSS rules prefix to identify icons
    displayPrefix: 'mdi mdi-icon'
  }]
};
/* harmony default export */ __webpack_exports__["default"] = (defaultOptions);

/***/ }),

/***/ "./src/plugins/iconpicker/bulma/events.js":
/*!************************************************!*\
  !*** ./src/plugins/iconpicker/bulma/events.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EventEmitter; });
class EventEmitter {
  constructor(listeners = []) {
    this._listeners = new Map(listeners);
    this._middlewares = new Map();
  }

  listenerCount(eventName) {
    if (!this._listeners.has(eventName)) {
      return 0;
    }

    const eventListeners = this._listeners.get(eventName);

    return eventListeners.length;
  }

  removeListeners(eventName = null, middleware = false) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeListeners(e, middleware));
      } else {
        this._listeners.delete(eventName);

        if (middleware) {
          this.removeMiddleware(eventName);
        }
      }
    } else {
      this._listeners = new Map();
    }
  }

  middleware(eventName, fn) {
    if (Array.isArray(eventName)) {
      name.forEach(e => this.middleware(e, fn));
    } else {
      if (!Array.isArray(this._middlewares.get(eventName))) {
        this._middlewares.set(eventName, []);
      }

      this._middlewares.get(eventName).push(fn);
    }
  }

  removeMiddleware(eventName = null) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeMiddleware(e));
      } else {
        this._middlewares.delete(eventName);
      }
    } else {
      this._middlewares = new Map();
    }
  }

  on(name, callback, once = false) {
    if (Array.isArray(name)) {
      name.forEach(e => this.on(e, callback));
    } else {
      name = name.toString();
      const split = name.split(/,|, | /);

      if (split.length > 1) {
        split.forEach(e => this.on(e, callback));
      } else {
        if (!Array.isArray(this._listeners.get(name))) {
          this._listeners.set(name, []);
        }

        this._listeners.get(name).push({
          once: once,
          callback: callback
        });
      }
    }
  }

  once(name, callback) {
    this.on(name, callback, true);
  }

  emit(name, data, silent = false) {
    name = name.toString();

    let listeners = this._listeners.get(name);

    let middlewares = null;
    let doneCount = 0;
    let execute = silent;

    if (Array.isArray(listeners)) {
      listeners.forEach((listener, index) => {
        // Start Middleware checks unless we're doing a silent emit
        if (!silent) {
          middlewares = this._middlewares.get(name); // Check and execute Middleware

          if (Array.isArray(middlewares)) {
            middlewares.forEach(middleware => {
              middleware(data, (newData = null) => {
                if (newData !== null) {
                  data = newData;
                }

                doneCount++;
              }, name);
            });

            if (doneCount >= middlewares.length) {
              execute = true;
            }
          } else {
            execute = true;
          }
        } // If Middleware checks have been passed, execute


        if (execute) {
          if (listener.once) {
            listeners[index] = null;
          }

          listener.callback(data);
        }
      }); // Dirty way of removing used Events

      while (listeners.indexOf(null) !== -1) {
        listeners.splice(listeners.indexOf(null), 1);
      }
    }
  }

}

/***/ }),

/***/ "./src/plugins/iconpicker/bulma/index.js":
/*!***********************************************!*\
  !*** ./src/plugins/iconpicker/bulma/index.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return bulmaIconpicker; });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/plugins/iconpicker/bulma/events.js");
/* harmony import */ var _defaultOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultOptions */ "./src/plugins/iconpicker/bulma/defaultOptions.js");



let fetchStyle = function (url) {
  return new Promise((resolve, reject) => {
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';

    link.onload = function () {
      resolve();
    };

    link.href = url;

    if (!document.querySelector('link[href="' + url + '"]')) {
      let headScript = document.querySelector('head');
      headScript.append(link);
    }
  });
};

class bulmaIconpicker extends _events__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(selector, options = {}) {
    super();
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector; // An invalid selector or non-DOM node has been provided.

    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this._clickEvents = ['click']; /// Set default options and merge with instance defined

    this.options = { ..._defaultOptions__WEBPACK_IMPORTED_MODULE_1__["default"],
      ...options
    };
    this.icons = [];
    this.id = 'iconPicker' + new Date().getTime();
    this.init();
  }
  /**
   * Initiate all DOM element containing carousel class
   * @method
   * @return {Array} Array of all Carousel instances
   */


  static attach(selector = '[data-action="iconPicker"]', options = {}) {
    let instances = new Array();
    const elements = document.querySelectorAll(selector);
    [].forEach.call(elements, element => {
      if (element.bulmaIconpicker) return;
      setTimeout(() => {
        const bi = new bulmaIconpicker(element, options);
        element.bulmaIconpicker = bi;
        instances.push(bi);
      }, 100);
    });
    return instances;
  }

  init() {
    this.createModal();
    this.createPreview();
    this.options.iconSets.forEach(iconSet => {
      fetchStyle(iconSet.css); // Parse CSS file to get array of all available icons

      fetch(iconSet.css, {
        mode: 'cors'
      }).then(res => {
        return res.text();
      }).then(css => {
        this.icons[iconSet.name] = this.parseCSS(css, iconSet.prefix || 'fa-', iconSet.displayPrefix || '');
        this.modalSetTabs.querySelector('a').click();
        var touchEvent = new Event('touchstart');
        this.modalSetTabs.querySelector('a').dispatchEvent(touchEvent);
      });
    });
  }

  createPreview() {
    this.preview = document.createElement('div');
    this.preview.className = 'icon is-large';
    this.preview.classList.add('iconpicker-preview');
    let iconPreview = document.createElement('i');
    iconPreview.className = 'iconpicker-icon-preview';

    if (this.element.value.length) {
      let classes = this.element.value.split(' ');
      classes.forEach(cls => {
        if (cls) iconPreview.classList.add(cls);
      });
    }

    this.preview.appendChild(iconPreview);

    this._clickEvents.forEach(event => {
      this.preview.addEventListener(event, e => {
        e.preventDefault();
        this.modal.classList.add('is-active');
      });
    });

    this.element.parentNode.insertBefore(this.preview, this.element.nextSibling);
  }

  parseCSS(css, prefix = 'fa-', displayPrefix = '') {
    const iconPattern = new RegExp('\\.' + prefix + '([^\\.!:]*)::?before\\s*{\\s*content:\\s*["|\']\\\\[^\'|"]*["|\'];?\\s*}', 'g');
    const index = 1;
    let icons = [],
        icon,
        match;

    while (match = iconPattern.exec(css)) {
      icon = {
        prefix: prefix,
        selector: prefix + match[index].trim(':'),
        name: this.ucwords(match[index]).trim(':'),
        filter: match[index].trim(':'),
        displayPrefix: displayPrefix
      };
      icons[match[index]] = icon;
    }

    if (Object.getOwnPropertyNames(this.icons).length == 0) {
      console.warn("No icons found in CSS file");
    }

    return icons;
  }

  ucwords(str) {
    return (str + '').replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase();
    });
  }

  drawIcons(iconSet) {
    this.iconsList.innerHTML = '';

    if (iconSet) {
      for (let [iconName, icon] of Object.entries(iconSet)) {
        this.iconsList.appendChild(this.createIconPreview(icon));
      }
    }
  }

  createIconPreview(icon, prefix = 'fa-') {
    let iconLink = document.createElement('a');
    iconLink.dataset.title = icon['name'];
    iconLink.setAttribute('title', icon['name']);
    iconLink.dataset.icon = icon['selector'];
    iconLink.dataset.filter = icon['filter'];
    let iconPreview = document.createElement('i');
    iconPreview.className = 'iconpicker-icon-preview';

    if (icon['displayPrefix'].length) {
      prefix = icon['displayPrefix'].split(' ');
      prefix.forEach(pfx => {
        if (pfx) iconPreview.classList.add(pfx);
      });
    }

    iconPreview.classList.add(icon['selector']);
    iconLink.appendChild(iconPreview);

    this._clickEvents.forEach(event => {
      iconLink.addEventListener(event, e => {
        e.preventDefault();
        this.preview.innerHTML = '';
        this.element.value = e.target.classList.length ? e.target.classList : e.target.children[0].classList;
        this.element.dispatchEvent(new Event('change'));
        this.preview.appendChild(e.target.cloneNode(true));
        this.modal.classList.remove('is-active');
      });
    });

    return iconLink;
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.classList.add('iconpicker-modal');
    this.modal.id = this.id;
    let modalBackground = document.createElement('div');
    modalBackground.className = 'modal-background';
    let modalCard = document.createElement('div');
    modalCard.className = 'modal-card';
    let modalHeader = document.createElement('header');
    modalHeader.className = 'modal-card-head';
    let modalHeaderTitle = document.createElement('p');
    modalHeaderTitle.className = 'modal-card-title';
    modalHeaderTitle.innerHTML = 'iconPicker';
    this.modalHeaderSearch = document.createElement('input');
    this.modalHeaderSearch.setAttribute('type', 'search');
    this.modalHeaderSearch.setAttribute('placeholder', 'Search');
    this.modalHeaderSearch.className = 'iconpicker-search';
    this.modalHeaderSearch.addEventListener('input', e => {
      this.filter(e.target.value);
    });
    let modalHeaderClose = document.createElement('button');
    modalHeaderClose.className = 'delete';

    this._clickEvents.forEach(event => {
      modalHeaderClose.addEventListener(event, e => {
        e.preventDefault();
        this.modal.classList.remove('is-active');
      });
    });

    modalCard.appendChild(modalHeader);
    this.modalBody = document.createElement('section');
    this.modalBody.className = 'modal-card-body';

    if (this.options.iconSets.length >= 1) {
      let modalSets = document.createElement('div');
      modalSets.className = 'iconpicker-sets';
      modalSets.classList.add('tabs');
      this.modalSetTabs = document.createElement('ul');
      this.options.iconSets.forEach(iconSet => {
        let modalSetTab = document.createElement('li');
        let modalSetTabLink = document.createElement('a');
        modalSetTabLink.dataset.iconset = iconSet.name;
        modalSetTabLink.innerHTML = iconSet.name;

        this._clickEvents.forEach(event => {
          modalSetTabLink.addEventListener(event, e => {
            e.preventDefault();
            var activeModalTabs = this.modalSetTabs.querySelectorAll('.is-active');
            [].forEach.call(activeModalTabs, function (activeModalTab) {
              activeModalTab.classList.remove('is-active');
            });
            e.target.parentNode.classList.add('is-active');
            this.drawIcons(this.icons[e.target.dataset.iconset]);
            this.filter(this.modalHeaderSearch.value);
          });
        });

        modalSetTab.appendChild(modalSetTabLink);
        this.modalSetTabs.appendChild(modalSetTab);
      });
      modalSets.appendChild(this.modalSetTabs);
      modalCard.appendChild(modalSets);
    }

    this.iconsList = document.createElement('div');
    this.iconsList.className = 'iconpicker-icons';
    modalHeader.appendChild(modalHeaderTitle);
    modalHeader.appendChild(this.modalHeaderSearch);
    modalHeader.appendChild(modalHeaderClose);
    this.modalBody.appendChild(this.iconsList);
    modalCard.appendChild(this.modalBody);
    this.modal.appendChild(modalBackground);
    this.modal.appendChild(modalCard);
    document.body.appendChild(this.modal);
  }

  filter(value = '') {
    if (value === '') {
      this.iconsList.querySelectorAll('[data-filter]').forEach(el => {
        el.classList.remove('is-hidden');
      });
      return;
    }

    this.iconsList.querySelectorAll('[data-filter]').forEach(el => {
      el.classList.remove('is-hidden');
    });
    this.iconsList.querySelectorAll('[data-filter]:not([data-filter*="' + value + '"])').forEach(el => {
      el.classList.add('is-hidden');
    });
  }

}

/***/ }),

/***/ "./src/plugins/iconpicker/index.js":
/*!*****************************************!*\
  !*** ./src/plugins/iconpicker/index.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bulma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bulma */ "./src/plugins/iconpicker/bulma/index.js");

const pluginAPI = window.getPluginAPI();
pluginAPI.page.appendStyles('https://cdn.jsdelivr.net/npm/bulma-iconpicker@2.1.0/dist/css/bulma-iconpicker.min.css');
pluginAPI.page.appendStyles('https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css');
pluginAPI.page.appendStyles('https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css');
pluginAPI.page.appendStyles('https://use.fontawesome.com/releases/v5.8.1/css/all.css'); //pluginAPI.page.appendScript('https://cdn.jsdelivr.net/npm/bulma-iconpicker@2.1.0/dist/js/bulma-iconpicker.min.js');

pluginAPI.page.onLoad(() => {
  //if (!window.bulmaIconpicker) return;
  if (document.getElementsByClassName('iconpicker').length) {
    _bulma__WEBPACK_IMPORTED_MODULE_0__["default"].attach('.iconpicker');
  }
});

/***/ })

/******/ });
//# sourceMappingURL=iconpicker.js.map