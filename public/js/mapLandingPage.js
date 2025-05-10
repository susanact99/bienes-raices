/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapLandingPage.js":
/*!**********************************!*\
  !*** ./src/js/mapLandingPage.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n(function () {\r\n    const lat = 43.4896365;\r\n    const lng = -8.2243143;\r\n    const map = L.map('map-landing-page').setView([lat, lng], 14);\r\n\r\n    let markers = new L.FeatureGroup().addTo(map)\r\n\r\n    let properties = []\r\n\r\n    //Filtros\r\n    const filters = {\r\n        category: '',\r\n        price: ''\r\n    }\r\n\r\n    const categorySelect = document.querySelector('#categories')\r\n    const pricesSelect = document.querySelector('#prices')\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n\r\n    //Filtrado de categorias y precios\r\n    categorySelect.addEventListener('change', e => {\r\n        filters.category = +e.target.value\r\n        filterProperties()\r\n    })\r\n\r\n    pricesSelect.addEventListener('change', e => {\r\n        filters.price = +e.target.value\r\n    })\r\n\r\n    const getProperties = async () => {\r\n        try {\r\n            const url = '/api/properties'\r\n            const response = await fetch(url)\r\n            properties = await response.json()\r\n\r\n            showProperties(properties)\r\n\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    const showProperties = properties => {\r\n\r\n        //Limpiar los markers previos//para revisar la funciones a usar se hace un console.log de markers y se revisa prototype\r\n        markers.clearLayers()\r\n\r\n        properties.forEach(property => {\r\n            //Agregar los pines\r\n            const marker = new L.marker([property?.lat, property?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(map)\r\n            const popupContent = `\r\n               <p class=\"text-indigo-600 font-bold\">${property.category.name}</p>\r\n               <h1 class=\"text-xl font-extrabold uppercase my-3\">${property?.title}</h1>\r\n               <img src=\"/uploads/${property.image}\" alt=\"Imagen de la propiedad ${property.title}\">\r\n               <p class=\"text-gray-600 my-2 font-bold brock\">${property.price.name}</p> \r\n               <a href=\"/property/${property.id}\" class=\"bg-gray-100 block p-3 text-center font-bold uppercase hover:bg-gray-200\">Ver propiedad</a>\r\n            `;\r\n\r\n            marker.bindPopup(popupContent);\r\n            \r\n\r\n            markers.addLayer(marker)\r\n        });\r\n    }\r\n\r\n    const filterProperties = () => {\r\n        const result = properties.filter(filterCategory).filter(filterPrice)\r\n        showProperties(result)\r\n    }\r\n\r\n    const filterCategory = (property) => {\r\n        return filters.category ? property.categoryId === filters.category : property\r\n    }\r\n    const filterPrice = (property) => {\r\n        return filters.price ? property.priceId === filters.price : property\r\n    }\r\n\r\n    getProperties()\r\n})()\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapLandingPage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapLandingPage.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;