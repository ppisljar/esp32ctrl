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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugins/amcharts/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugins/amcharts/index.js":
/*!***************************************!*\
  !*** ./src/plugins/amcharts/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const pluginAPI = window.getPluginAPI(); //pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/core.js');
//pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/charts.js');
//pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/themes/animated.js');

function groupBy(xs, prop) {
  var grouped = {};

  for (var i = 0; i < xs.length; i++) {
    var p = xs[i][prop];

    if (!grouped[p]) {
      grouped[p] = [];
    }

    grouped[p].push(xs[i]);
  }

  return grouped;
}

var series_length = 0;
pluginAPI.page.onLoad(() => {
  if (document.getElementsByClassName('chart').length) {
    setTimeout(() => {
      am4core.ready(function () {
        var chart = am4core.create("chart", am4charts.XYChart);
        chart.dataSource.url = "/log.csv";
        chart.dataSource.parser = new am4core.CSVParser();
        chart.dataSource.parser.options.numberFields = ['value']; // chart.dataSource.parser.options.dateFields = ['timestamp']
        // chart.dataSource.parser.options.dateFormat = 'x';

        chart.dataSource.parser.options.useColumnNames = true;
        chart.dataSource.reloadFrequency = 5000;
        chart.dataSource.events.on("parseended", function (ev) {
          // parsed data is assigned to data source's `data` property
          var data = ev.target.data;
          var grouped = groupBy(data, 'id');

          if (Object.keys(grouped).length !== series_length) {
            series_length = Object.keys(grouped).length;
            chart.series.length = 0;

            for (let key in grouped) {
              var series1 = chart.series.push(new am4charts.LineSeries());
              series1.dataFields.valueY = "value";
              series1.dataFields.categoryX = "timestamp";
              series1.data = grouped[key];
              series1.name = "Value";
              series1.strokeWidth = 3;
              series1.tensionX = 0.7;
              series1.bullets.push(new am4charts.CircleBullet());
            }
          } else {
            let i = 0;

            for (let key in grouped) {
              var series1 = chart.series.values[i++];
              series1.data = grouped[key];
            }
          }
        }); // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "timestamp"; // Create value axis

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      });
    }, 3000);
  }
});

/***/ })

/******/ });
//# sourceMappingURL=amcharts.js.map