/*!
 * WooCommerce Variation Swatches Pro v1.0.31 
 * 
 * Author: Emran Ahmed ( emran.bd.08@gmail.com ) 
 * Date: 2018-12-18 19:51:20
 * Released under the GPLv3 license.
 */
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),

/***/ 9:
/***/ (function(module, exports) {

/* global wp, wvs_pro_product_variation_data, woocommerce_admin_meta_boxes_variations, woocommerce_admin, accounting */

jQuery(function ($) {

    $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
        wp.ajax.send("wvs_pro_load_product_attributes", {
            success: function success(data) {
                $('#wvs-pro-product-variable-swatches-options').html(data);
                $(document.body).trigger('wvs_pro_product_swatches_variation_loaded');
            },
            data: {
                post_id: wvs_pro_product_variation_data.post_id,
                nonce: wvs_pro_product_variation_data.nonce
            }
        });
    });

    $(document.body).on('click', '.wvs_pro_save_product_attributes', function () {

        var data = $('.wvs-pro-product-variable-swatches-options').find('input, select, textarea').serialize();

        $('#wvs-pro-product-variable-swatches-options').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        wp.ajax.send("wvs_pro_save_product_attributes", {
            success: function success(data) {
                $('#wvs-pro-product-variable-swatches-options').unblock();
            },
            error: function error(_error) {
                // console.error(error)
                $('#wvs-pro-product-variable-swatches-options').unblock();
            },

            data: {
                post_id: wvs_pro_product_variation_data.post_id,
                nonce: wvs_pro_product_variation_data.nonce,
                data: data
            }
        });
    });

    $(document.body).on('click', '.wvs_pro_reset_product_attributes', function () {
        if (confirm(wvs_pro_product_variation_data.reset_notice)) {
            $('#wvs-pro-product-variable-swatches-options').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
            wp.ajax.send("wvs_pro_reset_product_attributes", {
                success: function success(data) {
                    $('#woocommerce-product-data').trigger('woocommerce_variations_loaded');
                    $('#wvs-pro-product-variable-swatches-options').unblock();
                },
                error: function error(_error2) {
                    // console.error(error)
                    $('#wvs-pro-product-variable-swatches-options').unblock();
                },

                data: {
                    post_id: wvs_pro_product_variation_data.post_id,
                    nonce: wvs_pro_product_variation_data.nonce
                }
            });
        }
    });

    $.fn.wvs_pro_product_attribute_type = function (options) {
        return this.each(function () {
            var _this = this;

            var $wrapper = $(this).closest('.wvs-pro-variable-swatches-attribute-wrapper');

            var change_classes = function change_classes() {
                var value = $(_this).val();
                var visible_class = 'visible_if_' + value;

                var existing_classes = Object.keys(wvs_pro_product_variation_data.attribute_types).map(function (type) {
                    return 'visible_if_' + type;
                }).join(' ');

                $wrapper.removeClass(existing_classes).removeClass('visible_if_custom').addClass(visible_class);
                return value;
            };

            $(this).on('change', function (e) {
                var value = change_classes();
                $wrapper.find('.wvs-pro-swatch-tax-type').val(value).trigger('change.taxonomy');
            });

            $(this).on('change.attribute', function (e) {
                change_classes();
            });
        });
    };

    $.fn.wvs_pro_product_taxonomy_type = function (options) {
        return this.each(function () {
            var _this2 = this;

            var $wrapper = $(this).closest('.wvs-pro-variable-swatches-attribute-tax-wrapper');
            var $main_wrapper = $(this).closest('.wvs-pro-variable-swatches-attribute-wrapper');

            var change_classes = function change_classes() {
                var value = $(_this2).val();
                var visible_class = 'visible_if_tax_' + value;

                var existing_classes = Object.keys(wvs_pro_product_variation_data.attribute_types).map(function (type) {
                    return 'visible_if_tax_' + type;
                }).join(' ');

                $wrapper.removeClass(existing_classes).addClass(visible_class);
                return value;
            };

            $(this).on('change', function (e) {

                change_classes();

                var allValues = [];
                $main_wrapper.find('.wvs-pro-swatch-tax-type').each(function () {
                    allValues.push($(this).val());
                });

                var uniqueValues = _.uniq(allValues);
                var is_all_tax_same = uniqueValues.length === 1;

                if (is_all_tax_same) {
                    $main_wrapper.find('.wvs-pro-swatch-option-type').val(uniqueValues.toString()).trigger('change.attribute');
                } else {
                    $main_wrapper.find('.wvs-pro-swatch-option-type').val('custom').trigger('change.attribute');
                }
            });

            $(this).on('change.taxonomy', function (e) {
                change_classes();
            });
        });
    };

    $.fn.wvs_pro_product_taxonomy_item_tooltip_type = function (options) {
        return this.each(function () {
            var _this3 = this;

            var $wrapper = $(this).closest('tbody');

            var change_classes = function change_classes() {
                var value = $(_this3).val();
                var visible_class = 'visible_if_item_tooltip_type_' + value;

                var existing_classes = ['', 'text', 'image', 'no'].map(function (type) {
                    return 'visible_if_item_tooltip_type_' + type;
                }).join(' ');

                $wrapper.find('.wvs-pro-item-tooltip-type-item').removeClass(existing_classes).addClass(visible_class);
                return value;
            };

            $(this).on('change', function (e) {
                change_classes();
            });

            $(this).trigger('change');
        });
    };

    $('.wvs-pro-swatch-option-type').wvs_pro_product_attribute_type();
    $('.wvs-pro-swatch-tax-type').wvs_pro_product_taxonomy_type();
    $('.wvs-pro-item-tooltip-type').wvs_pro_product_taxonomy_item_tooltip_type();

    // Re Init
    $(document.body).on('wvs_pro_product_swatches_variation_loaded', function () {
        $('.wvs-pro-swatch-option-type').wvs_pro_product_attribute_type();
        $('.wvs-pro-swatch-tax-type').wvs_pro_product_taxonomy_type();
        $('.wvs-pro-item-tooltip-type').wvs_pro_product_taxonomy_item_tooltip_type();
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2FkbWluLXByby5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1OTg5YjQ4N2ExMWY0OTYxMTg5YyIsIndlYnBhY2s6Ly8vc3JjL2pzL2JhY2tlbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTk4OWI0ODdhMTFmNDk2MTE4OWMiLCIvKiBnbG9iYWwgd3AsIHd2c19wcm9fcHJvZHVjdF92YXJpYXRpb25fZGF0YSwgd29vY29tbWVyY2VfYWRtaW5fbWV0YV9ib3hlc192YXJpYXRpb25zLCB3b29jb21tZXJjZV9hZG1pbiwgYWNjb3VudGluZyAqL1xuXG5qUXVlcnkoZnVuY3Rpb24gKCQpIHtcblxuICAgICQoJyN3b29jb21tZXJjZS1wcm9kdWN0LWRhdGEnKS5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uc19sb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdwLmFqYXguc2VuZChcInd2c19wcm9fbG9hZF9wcm9kdWN0X2F0dHJpYnV0ZXNcIiwge1xuICAgICAgICAgICAgc3VjY2VzcyA6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgJCgnI3d2cy1wcm8tcHJvZHVjdC12YXJpYWJsZS1zd2F0Y2hlcy1vcHRpb25zJykuaHRtbChkYXRhKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnRyaWdnZXIoJ3d2c19wcm9fcHJvZHVjdF9zd2F0Y2hlc192YXJpYXRpb25fbG9hZGVkJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhICAgIDoge1xuICAgICAgICAgICAgICAgIHBvc3RfaWQgOiB3dnNfcHJvX3Byb2R1Y3RfdmFyaWF0aW9uX2RhdGEucG9zdF9pZCxcbiAgICAgICAgICAgICAgICBub25jZSAgIDogd3ZzX3Byb19wcm9kdWN0X3ZhcmlhdGlvbl9kYXRhLm5vbmNlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy53dnNfcHJvX3NhdmVfcHJvZHVjdF9hdHRyaWJ1dGVzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGxldCBkYXRhID0gJCgnLnd2cy1wcm8tcHJvZHVjdC12YXJpYWJsZS1zd2F0Y2hlcy1vcHRpb25zJykuZmluZCgnaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEnKS5zZXJpYWxpemUoKVxuXG4gICAgICAgICQoJyN3dnMtcHJvLXByb2R1Y3QtdmFyaWFibGUtc3dhdGNoZXMtb3B0aW9ucycpLmJsb2NrKHtcbiAgICAgICAgICAgIG1lc3NhZ2UgICAgOiBudWxsLFxuICAgICAgICAgICAgb3ZlcmxheUNTUyA6IHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kIDogJyNmZmYnLFxuICAgICAgICAgICAgICAgIG9wYWNpdHkgICAgOiAwLjZcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB3cC5hamF4LnNlbmQoXCJ3dnNfcHJvX3NhdmVfcHJvZHVjdF9hdHRyaWJ1dGVzXCIsIHtcbiAgICAgICAgICAgIHN1Y2Nlc3MgOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICQoJyN3dnMtcHJvLXByb2R1Y3QtdmFyaWFibGUtc3dhdGNoZXMtb3B0aW9ucycpLnVuYmxvY2soKTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yICAgOiAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICQoJyN3dnMtcHJvLXByb2R1Y3QtdmFyaWFibGUtc3dhdGNoZXMtb3B0aW9ucycpLnVuYmxvY2soKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgcG9zdF9pZCA6IHd2c19wcm9fcHJvZHVjdF92YXJpYXRpb25fZGF0YS5wb3N0X2lkLFxuICAgICAgICAgICAgICAgIG5vbmNlICAgOiB3dnNfcHJvX3Byb2R1Y3RfdmFyaWF0aW9uX2RhdGEubm9uY2UsXG4gICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy53dnNfcHJvX3Jlc2V0X3Byb2R1Y3RfYXR0cmlidXRlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0od3ZzX3Byb19wcm9kdWN0X3ZhcmlhdGlvbl9kYXRhLnJlc2V0X25vdGljZSkpIHtcbiAgICAgICAgICAgICQoJyN3dnMtcHJvLXByb2R1Y3QtdmFyaWFibGUtc3dhdGNoZXMtb3B0aW9ucycpLmJsb2NrKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICBvdmVybGF5Q1NTIDoge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kIDogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ICAgIDogMC42XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHdwLmFqYXguc2VuZChcInd2c19wcm9fcmVzZXRfcHJvZHVjdF9hdHRyaWJ1dGVzXCIsIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzIDogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3dvb2NvbW1lcmNlLXByb2R1Y3QtZGF0YScpLnRyaWdnZXIoJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbnNfbG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyN3dnMtcHJvLXByb2R1Y3QtdmFyaWFibGUtc3dhdGNoZXMtb3B0aW9ucycpLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yICAgOiAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgJCgnI3d2cy1wcm8tcHJvZHVjdC12YXJpYWJsZS1zd2F0Y2hlcy1vcHRpb25zJykudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgICAgICBwb3N0X2lkIDogd3ZzX3Byb19wcm9kdWN0X3ZhcmlhdGlvbl9kYXRhLnBvc3RfaWQsXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlICAgOiB3dnNfcHJvX3Byb2R1Y3RfdmFyaWF0aW9uX2RhdGEubm9uY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJC5mbi53dnNfcHJvX3Byb2R1Y3RfYXR0cmlidXRlX3R5cGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCAkd3JhcHBlciA9ICQodGhpcykuY2xvc2VzdCgnLnd2cy1wcm8tdmFyaWFibGUtc3dhdGNoZXMtYXR0cmlidXRlLXdyYXBwZXInKTtcblxuICAgICAgICAgICAgbGV0IGNoYW5nZV9jbGFzc2VzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSAgICAgICAgID0gJCh0aGlzKS52YWwoKVxuICAgICAgICAgICAgICAgIGxldCB2aXNpYmxlX2NsYXNzID0gYHZpc2libGVfaWZfJHt2YWx1ZX1gO1xuXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nX2NsYXNzZXMgPSBPYmplY3Qua2V5cyh3dnNfcHJvX3Byb2R1Y3RfdmFyaWF0aW9uX2RhdGEuYXR0cmlidXRlX3R5cGVzKS5tYXAoKHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGB2aXNpYmxlX2lmXyR7dHlwZX1gXG4gICAgICAgICAgICAgICAgfSkuam9pbignICcpO1xuXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoZXhpc3RpbmdfY2xhc3NlcykucmVtb3ZlQ2xhc3MoJ3Zpc2libGVfaWZfY3VzdG9tJykuYWRkQ2xhc3ModmlzaWJsZV9jbGFzcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNoYW5nZV9jbGFzc2VzKCk7XG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuZmluZCgnLnd2cy1wcm8tc3dhdGNoLXRheC10eXBlJykudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UudGF4b25vbXknKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZS5hdHRyaWJ1dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZV9jbGFzc2VzKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5mbi53dnNfcHJvX3Byb2R1Y3RfdGF4b25vbXlfdHlwZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBsZXQgJHdyYXBwZXIgICAgICA9ICQodGhpcykuY2xvc2VzdCgnLnd2cy1wcm8tdmFyaWFibGUtc3dhdGNoZXMtYXR0cmlidXRlLXRheC13cmFwcGVyJyk7XG4gICAgICAgICAgICBsZXQgJG1haW5fd3JhcHBlciA9ICQodGhpcykuY2xvc2VzdCgnLnd2cy1wcm8tdmFyaWFibGUtc3dhdGNoZXMtYXR0cmlidXRlLXdyYXBwZXInKTtcblxuICAgICAgICAgICAgbGV0IGNoYW5nZV9jbGFzc2VzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSAgICAgICAgID0gJCh0aGlzKS52YWwoKVxuICAgICAgICAgICAgICAgIGxldCB2aXNpYmxlX2NsYXNzID0gYHZpc2libGVfaWZfdGF4XyR7dmFsdWV9YDtcblxuICAgICAgICAgICAgICAgIGxldCBleGlzdGluZ19jbGFzc2VzID0gT2JqZWN0LmtleXMod3ZzX3Byb19wcm9kdWN0X3ZhcmlhdGlvbl9kYXRhLmF0dHJpYnV0ZV90eXBlcykubWFwKCh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgdmlzaWJsZV9pZl90YXhfJHt0eXBlfWBcbiAgICAgICAgICAgICAgICB9KS5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcyhleGlzdGluZ19jbGFzc2VzKS5hZGRDbGFzcyh2aXNpYmxlX2NsYXNzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgY2hhbmdlX2NsYXNzZXMoKVxuXG4gICAgICAgICAgICAgICAgbGV0IGFsbFZhbHVlcyA9IFtdXG4gICAgICAgICAgICAgICAgJG1haW5fd3JhcHBlci5maW5kKCcud3ZzLXByby1zd2F0Y2gtdGF4LXR5cGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsVmFsdWVzLnB1c2goJCh0aGlzKS52YWwoKSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCB1bmlxdWVWYWx1ZXMgICAgPSBfLnVuaXEoYWxsVmFsdWVzKVxuICAgICAgICAgICAgICAgIGxldCBpc19hbGxfdGF4X3NhbWUgPSB1bmlxdWVWYWx1ZXMubGVuZ3RoID09PSAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzX2FsbF90YXhfc2FtZSkge1xuICAgICAgICAgICAgICAgICAgICAkbWFpbl93cmFwcGVyLmZpbmQoJy53dnMtcHJvLXN3YXRjaC1vcHRpb24tdHlwZScpLnZhbCh1bmlxdWVWYWx1ZXMudG9TdHJpbmcoKSkudHJpZ2dlcignY2hhbmdlLmF0dHJpYnV0ZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkbWFpbl93cmFwcGVyLmZpbmQoJy53dnMtcHJvLXN3YXRjaC1vcHRpb24tdHlwZScpLnZhbCgnY3VzdG9tJykudHJpZ2dlcignY2hhbmdlLmF0dHJpYnV0ZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZS50YXhvbm9teScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlX2NsYXNzZXMoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuZm4ud3ZzX3Byb19wcm9kdWN0X3RheG9ub215X2l0ZW1fdG9vbHRpcF90eXBlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGxldCAkd3JhcHBlciA9ICQodGhpcykuY2xvc2VzdCgndGJvZHknKTtcblxuICAgICAgICAgICAgbGV0IGNoYW5nZV9jbGFzc2VzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSAgICAgICAgID0gJCh0aGlzKS52YWwoKVxuICAgICAgICAgICAgICAgIGxldCB2aXNpYmxlX2NsYXNzID0gYHZpc2libGVfaWZfaXRlbV90b29sdGlwX3R5cGVfJHt2YWx1ZX1gO1xuXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nX2NsYXNzZXMgPSBbJycsICd0ZXh0JywgJ2ltYWdlJywgJ25vJ10ubWFwKCh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgdmlzaWJsZV9pZl9pdGVtX3Rvb2x0aXBfdHlwZV8ke3R5cGV9YFxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy53dnMtcHJvLWl0ZW0tdG9vbHRpcC10eXBlLWl0ZW0nKS5yZW1vdmVDbGFzcyhleGlzdGluZ19jbGFzc2VzKS5hZGRDbGFzcyh2aXNpYmxlX2NsYXNzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZV9jbGFzc2VzKClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJCgnLnd2cy1wcm8tc3dhdGNoLW9wdGlvbi10eXBlJykud3ZzX3Byb19wcm9kdWN0X2F0dHJpYnV0ZV90eXBlKCk7XG4gICAgJCgnLnd2cy1wcm8tc3dhdGNoLXRheC10eXBlJykud3ZzX3Byb19wcm9kdWN0X3RheG9ub215X3R5cGUoKTtcbiAgICAkKCcud3ZzLXByby1pdGVtLXRvb2x0aXAtdHlwZScpLnd2c19wcm9fcHJvZHVjdF90YXhvbm9teV9pdGVtX3Rvb2x0aXBfdHlwZSgpO1xuXG4gICAgLy8gUmUgSW5pdFxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ3d2c19wcm9fcHJvZHVjdF9zd2F0Y2hlc192YXJpYXRpb25fbG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAkKCcud3ZzLXByby1zd2F0Y2gtb3B0aW9uLXR5cGUnKS53dnNfcHJvX3Byb2R1Y3RfYXR0cmlidXRlX3R5cGUoKTtcbiAgICAgICAgJCgnLnd2cy1wcm8tc3dhdGNoLXRheC10eXBlJykud3ZzX3Byb19wcm9kdWN0X3RheG9ub215X3R5cGUoKTtcbiAgICAgICAgJCgnLnd2cy1wcm8taXRlbS10b29sdGlwLXR5cGUnKS53dnNfcHJvX3Byb2R1Y3RfdGF4b25vbXlfaXRlbV90b29sdGlwX3R5cGUoKTtcbiAgICB9KVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9iYWNrZW5kLmpzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUxBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFWQTtBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUZBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQVZBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9