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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(7);
    }).then(function () {
        // Init on Ajax Popup :)
        $(document).on('wc_variation_form', '.variations_form', function () {
            $(this).WooVariationSwatchesPro();
        });
    });
}); // end of jquery main wrapper

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================================================
// WooCommerce Variation Change
/*global wc_add_to_cart_variation_params, woo_variation_swatches_options */
// ================================================================

var WooVariationSwatchesPro = function ($) {

    var Default = {};

    var WooVariationSwatchesPro = function () {
        function WooVariationSwatchesPro(element, config) {
            _classCallCheck(this, WooVariationSwatchesPro);

            // Assign
            this._el = element;
            this._element = $(element);
            this._config = $.extend({}, Default, config);
            this._generated = {};
            this.product_variations = this._element.data('product_variations');
            this.is_ajax_variation = !this.product_variations;
            this.is_loop = this._element.hasClass('wvs-archive-variation-wrapper');
            this._attributeFields = this._element.find('.variations select');
            // this._wrapper           = this._element.closest('.wvs-pro-product');
            this._wrapper = this._element.closest(woo_variation_swatches_options.archive_product_wrapper);
            this._cart_button = this._wrapper.find('.wvs_add_to_cart_button');
            this._cart_button_ajax = this._wrapper.find('.wvs_ajax_add_to_cart');
            this._cart_button_html = this._cart_button.clone().html();
            // this._image             = this._wrapper.find('.wp-post-image');
            this._image = this._wrapper.find(woo_variation_swatches_options.archive_image_selector);
            this._price = this._wrapper.find('.price');
            this._price_html = this._price.clone().html();
            this._product_id = this._cart_button.data('product_id');
            this._variation_shown = false;

            if ($.trim(woo_variation_swatches_options.archive_add_to_cart_button_selector)) {
                this._cart_button = this._wrapper.find(woo_variation_swatches_options.archive_add_to_cart_button_selector);
                this._cart_button_ajax = this._wrapper.find(woo_variation_swatches_options.archive_add_to_cart_button_selector);
            }

            // Call
            this.init(this.is_ajax_variation);
            this.onVariationShownHide();
            this.addToCartButton(this.is_ajax_variation);

            if (this.is_loop) {
                this.foundVariation(this.is_ajax_variation);

                // Archive Page Also
                if (woo_variation_swatches_options.enable_single_variation_preview_archive && woo_variation_swatches_options.enable_single_variation_preview && woo_variation_swatches_options.single_variation_preview_attribute) {
                    this._attributeFieldSingle = this._element.find('.variations select#' + woo_variation_swatches_options.single_variation_preview_attribute);
                    this.changeImages();
                }
            } else {

                if (woo_variation_swatches_options.enable_single_variation_preview && woo_variation_swatches_options.single_variation_preview_attribute) {
                    this._attributeFieldSingle = this._element.find('.variations select#' + woo_variation_swatches_options.single_variation_preview_attribute);
                    this.changeImages();
                }

                if (woo_variation_swatches_options.enable_linkable_variation_url) {
                    this.generateVariationURL();
                }
            }

            $(document).trigger('woo_variation_swatches_pro', [this._element]);
        }

        _createClass(WooVariationSwatchesPro, [{
            key: 'generateVariationURL',
            value: function generateVariationURL() {
                var _this2 = this;

                var url = new URL(window.location.toString());
                var search = url.searchParams.toString();

                var originalUrl = url.origin + url.pathname;

                this._element.on('check_variations.wc-variation-form', function (event) {

                    var attributes = void 0;

                    if (woo_variation_swatches_options.wc_bundles_enabled) {
                        url = new URL(window.location.toString());
                        search = url.searchParams.toString();
                        attributes = _this2.getChosenAttributesBundleSupport();
                    } else {
                        attributes = _this2.getChosenAttributes();
                    }

                    var attributesObject = Object.keys(attributes).reduce(function (attrs, current) {

                        if (attributes[current]) {
                            attrs[current] = attributes[current];
                        }
                        return attrs;
                    }, {});

                    var searchObject = [].concat(_toConsumableArray(new URLSearchParams(search).keys())).reduce(function (attrs, current) {
                        attrs[current] = new URLSearchParams(search).get(current);
                        return attrs;
                    }, {});

                    var data = _extends({}, searchObject, attributesObject);

                    var params = $.param(data);

                    window.history.pushState({}, '', _this2.addQueryArg(originalUrl, params));
                });
            }
        }, {
            key: 'setDefaultImages',
            value: function setDefaultImages() {
                var _this3 = this;

                _.delay(function () {
                    var _this = _this3;
                    var product_variations = _this3._element.data('product_variations');
                    var selectedIndex = void 0;

                    _this3._element.find('ul.variable-items-wrapper.wvs-catalog-variable-wrapper > li:not(.disabled):not(.woo-variation-swatches-variable-item-more)').each(function (i, el) {

                        $(this).off('wvs-selected-item.catalog-image-hover');
                        $(this).off('wvs-selected-item.catalog-image-click');
                        $(this).off('mouseenter.catalog-image-hover');
                        $(this).off('mouseleave.catalog-image-hover');

                        if ($(this).hasClass('selected')) {
                            selectedIndex = i;
                        }

                        if (woo_variation_swatches_options.catalog_mode_event === 'hover') {

                            $(this).on('mouseenter.catalog-image-hover', function (event) {
                                event.stopPropagation();

                                $(this).trigger('click').trigger('focusin');
                                var is_mobile = $('body').hasClass('woo-variation-swatches-on-mobile');

                                if (is_mobile) {
                                    $(this).trigger('touchstart');
                                }
                            });
                        }
                    });
                }, 2);
            }
        }, {
            key: 'onVariationShownHide',
            value: function onVariationShownHide() {
                var _this4 = this;

                this._element.on('show_variation', { variationForm: this._element }, function (event) {
                    _this4._variation_shown = true;
                });

                this._element.on('hide_variation', { variationForm: this._element }, function (event) {
                    _this4._variation_shown = false;
                    _this4.setDefaultImages();

                    if (_this4.is_loop) {
                        _this4.shopResetDisplayedVariation();
                    }
                });
            }
        }, {
            key: 'init',
            value: function init(is_ajax) {
                var _this5 = this;

                _.delay(function () {
                    _this5.setDefaultImages();
                    _this5._element.trigger('woo_variation_swatches_pro_init', [_this5, _this5.product_variations]);
                    $(document).trigger('woo_variation_swatches_pro_loaded', [_this5._element, _this5.product_variations]);
                }, 2);
            }
        }, {
            key: 'foundVariation',
            value: function foundVariation() {
                var _this6 = this;

                this._element.on('found_variation.wvs-variation-form', { variationForm: this._element }, function (event, variation) {

                    event.stopPropagation();
                    _this6.variationsImageUpdate(variation);

                    var template = false,
                        $template_html = '',
                        $view_cart_button = _this6._wrapper.find('.added_to_cart'),
                        $view_cart_button2 = _this6._wrapper.find('.added_to_cart_button'),
                        $price = _this6._wrapper.find('.price');

                    if (!variation.variation_is_visible) {
                        template = wp.template('unavailable-variation-template');
                    } else {
                        template = wp.template('wvs-variation-template');
                    }

                    $template_html = template({
                        variation: variation,
                        price_html: $(variation.price_html).unwrap().html() || _this6._price_html
                    });

                    $template_html = $template_html.replace('/*<![CDATA[*/', '');
                    $template_html = $template_html.replace('/*]]>*/', '');

                    $price.html($template_html);

                    _this6._cart_button.data('variation_id', variation.variation_id);
                    _this6._cart_button.data('variation', _this6.getChosenAttributes());

                    // If not catalog mode
                    if (!woo_variation_swatches_options.enable_catalog_mode) {

                        // Cart Text
                        if (woo_variation_swatches_options.archive_add_to_cart_text) {
                            _this6._cart_button.html(woo_variation_swatches_options.archive_add_to_cart_text);
                        } else {
                            if (wc_add_to_cart_variation_params.i18n_add_to_cart.trim()) {
                                _this6._cart_button.text(wc_add_to_cart_variation_params.i18n_add_to_cart);
                            }
                        }

                        // Ajax Add to cart
                        if ('no' === wc_add_to_cart_variation_params.enable_ajax_add_to_cart) {
                            var params = $.param(_extends({}, _this6.getChosenAttributes(), { 'add-to-cart': _this6._product_id, variation_id: variation.variation_id }));

                            // console.log(params)
                            _this6._cart_button.prop('href', _this6.addQueryArg(_this6._cart_button.data('add_to_cart_url'), params));
                        }
                    }

                    // Resetting Buttons
                    _this6._cart_button.removeClass('added');
                    if ($view_cart_button.length > 0) {
                        $view_cart_button.remove();
                    }
                    if ($view_cart_button2.length > 0) {
                        $view_cart_button2.remove();
                    }
                });

                this._element.on('reset_image.wvs-variation-form', { variationForm: this._element }, function (event) {
                    _this6.variationsImageUpdate(false);
                });

                this._element.on('reset_data.wvs-variation-form', { variationForm: this._element }, function (event) {
                    _this6.shopResetDisplayedVariation();
                });
            }
        }, {
            key: 'shopResetDisplayedVariation',
            value: function shopResetDisplayedVariation() {
                var $price = this._wrapper.find('.price'),
                    $view_cart_button = this._wrapper.find('.added_to_cart'),
                    $view_cart_button2 = this._wrapper.find('.added_to_cart_button');

                $price.html(this._price_html);

                this._cart_button.data('variation_id', '');
                this._cart_button.data('variation', '');

                //  If not catalog mode
                if (!woo_variation_swatches_options.enable_catalog_mode) {
                    //
                    if (woo_variation_swatches_options.archive_add_to_cart_select_options) {
                        this._cart_button.html(woo_variation_swatches_options.archive_add_to_cart_select_options);
                    } else {
                        if (wc_add_to_cart_variation_params.i18n_select_options.trim()) {
                            this._cart_button.text(wc_add_to_cart_variation_params.i18n_select_options);
                        }
                    }

                    if ('no' === wc_add_to_cart_variation_params.enable_ajax_add_to_cart) {
                        this._cart_button.prop('href', this._cart_button.data('product_permalink'));
                    }
                }

                // Resetting Buttons
                this._cart_button.removeClass('added');
                if ($view_cart_button.length > 0) {
                    $view_cart_button.remove();
                }
                if ($view_cart_button2.length > 0) {
                    $view_cart_button2.remove();
                }
            }
        }, {
            key: 'variationsImageUpdate',
            value: function variationsImageUpdate(variation) {

                this._image.addClass('wvs-pro-image-load').one('webkitAnimationEnd oanimationend msAnimationEnd animationend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    $(this).removeClass('wvs-pro-image-load');
                });

                if (variation && variation.image && variation.image.thumb_src && variation.image.thumb_src.length > 1) {
                    this._image.wc_set_variation_attr('src', variation.image.thumb_src);
                    this._image.wc_set_variation_attr('height', variation.image.thumb_src_h);
                    this._image.wc_set_variation_attr('width', variation.image.thumb_src_w);
                    this._image.wc_set_variation_attr('srcset', variation.image.thumb_srcset);
                    this._image.wc_set_variation_attr('sizes', variation.image.thumb_sizes);
                    this._image.wc_set_variation_attr('title', variation.image.title);
                    this._image.wc_set_variation_attr('alt', variation.image.alt);
                } else {
                    this._image.wc_reset_variation_attr('src');
                    this._image.wc_reset_variation_attr('width');
                    this._image.wc_reset_variation_attr('height');
                    this._image.wc_reset_variation_attr('srcset');
                    this._image.wc_reset_variation_attr('sizes');
                    this._image.wc_reset_variation_attr('title');
                    this._image.wc_reset_variation_attr('alt');
                }
            }
        }, {
            key: 'addToCartButton',
            value: function addToCartButton() {
                this._cart_button_ajax.off('click.wvs-pro-archive-add-to-cart');
                this._cart_button_ajax.on('click.wvs-pro-archive-add-to-cart', function (event) {

                    var $button = $(this);

                    if (woo_variation_swatches_options.enable_catalog_mode) {
                        return true;
                    }

                    if (!$button.data('variation_id')) {
                        return true;
                    }

                    event.preventDefault(); // Don't move it
                    event.stopPropagation(); // Don't move it

                    $button.removeClass('added');
                    $button.addClass('loading');

                    var data = {
                        action: "wvs_add_variation_to_cart"
                    };

                    $.each($button.data(), function (key, value) {
                        data[key] = value;
                    });

                    // Trigger event.
                    $(document.body).trigger('adding_to_cart', [$button, data]);

                    // Ajax action.
                    $.post(wc_add_to_cart_variation_params.ajax_url.toString(), data, function (response) {
                        if (!response) {
                            return;
                        }

                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        }

                        // Redirect to cart option
                        if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                            window.location = wc_add_to_cart_params.cart_url;
                            return;
                        }

                        // Trigger event so themes can refresh other areas.
                        $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $button]);
                    });
                });
            }
        }, {
            key: 'getChosenAttributesBundleSupport',
            value: function getChosenAttributesBundleSupport() {
                var data = {};
                var count = 0;
                var chosen = 0;

                this._attributeFields.each(function () {
                    var attribute_name = $(this).attr('name');
                    var value = $(this).val() || '';

                    if (value.length > 0) {
                        chosen++;
                    }

                    count++;
                    data[attribute_name] = value;
                });

                return data;
            }
        }, {
            key: 'getChosenAttributes',
            value: function getChosenAttributes() {
                var data = {};
                var count = 0;
                var chosen = 0;

                this._attributeFields.each(function () {
                    var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
                    var value = $(this).val() || '';

                    if (value.length > 0) {
                        chosen++;
                    }

                    count++;
                    data[attribute_name] = value;
                });

                return data;
            }
        }, {
            key: 'addQueryArg',
            value: function addQueryArg(url, query) {
                if (query) {
                    // remove optional leading symbols
                    query = query.trim().replace(/^(\?|#|&)/, '').replace(/(\?|#|&)$/, '');

                    // don't append empty query
                    query = query ? '?' + query : query;

                    var parts = url.split(/[\?\#]/);
                    var start = parts[0];
                    if (query && /\:\/\/[^\/]*$/.test(start)) {
                        // e.g. http://foo.com -> http://foo.com/
                        start = start + '/';
                    }
                    var match = url.match(/(\#.*)$/);
                    url = start + query;
                    if (match) {
                        // add hash back in
                        url = url + match[0];
                    }
                }
                return url;
            }
        }, {
            key: 'onResetDisplayedVariation',
            value: function onResetDisplayedVariation(event) {

                this._element.closest('.product').find('.product_meta').find('.sku').wc_reset_content();
                this._element.closest('.product').find('.product_weight').wc_reset_content();
                this._element.closest('.product').find('.product_dimensions').wc_reset_content();
                this._element.trigger('reset_image');
                this._element.find('.single_variation').slideUp(200).trigger('hide_variation');
            }

            // Single Attribute Change Image

        }, {
            key: 'changeImages',
            value: function changeImages() {
                var _this7 = this;

                // console.log(this._element.data('events'))
                var events = this._element.data('events');

                var reset_data_fn = jQuery.extend(true, {}, events.reset_data);

                this._element.on('check_variations.wc-variation-form', function (event) {

                    var variationData = _this7._element.data('product_variations');

                    var allAttributes = _this7.getChosenAttributesAll(),
                        allCurrentAttributes = allAttributes.data,
                        attributes = _this7.getChosenAttributesSingle(),
                        currentAttributes = attributes.data;

                    //  allAttributes.count !== allAttributes.chosenCount && attributes.count === attributes.chosenCount

                    if (attributes.count > 0) {

                        if (allAttributes.count !== allAttributes.chosenCount && attributes.count === attributes.chosenCount) {
                            // this._element.off('reset_data');
                            _this7._element.off('reset_data');
                        } else {

                            _this7._element.off('reset_data');
                            // Reattach Unbinded Event functions
                            for (var key in reset_data_fn) {

                                if (reset_data_fn.hasOwnProperty(key)) {
                                    var fn = reset_data_fn[key];
                                    var namespace = fn.namespace ? '.' + fn.namespace : '';
                                    var data = fn.data ? fn.data : {};
                                    var handler = fn.handler ? fn.handler : function () {};
                                    _this7._element.on('reset_data' + namespace, data, handler);
                                }
                            }

                            // this._element.off('reset_data');
                            /*  this._element.on('reset_data', (event) => {
                                  // this.onResetDisplayedVariation();
                              });
                              this._element.on('reset_data.wvs-variation-form', (event) => {
                                  // this.shopResetDisplayedVariation();
                              });*/
                        }
                    }

                    if (attributes.count > 0 && allAttributes.count !== allAttributes.chosenCount && attributes.count === attributes.chosenCount) {

                        _this7._element.trigger('update_variation_values');

                        var matching_variations = _this7.findMatchingVariations(variationData, currentAttributes),
                            variation = matching_variations.shift();

                        if (variation) {

                            _.delay(function () {

                                _this7._element.trigger('found_variation', [variation]);
                                _this7._element.trigger('hide_variation');

                                // Note: if we trigger "found_variation" client can click add to cart without select
                                /*if (woo_variation_swatches_options.using_custom_gallery_script) {
                                    this._element.trigger('found_variation', [variation]);
                                    this._element.trigger('hide_variation');
                                }
                                else {
                                    if (is_loop) {
                                        this.variationsImageUpdate(variation);
                                    }
                                     this._element.wc_variations_image_update(variation);
                                    this._element.trigger('show_variation', [variation]);
                                }*/
                                _this7._element.trigger('wvs_pro_single_preview_found_variation', [_this7, variation]);
                            }, 50);
                        } else {
                            attributes.chosenCount = 0;

                            _this7._element.trigger('update_variation_values');
                            _this7._element.trigger('reset_data');
                        }
                    }
                });
            }
        }, {
            key: 'getChosenAttributesAll',
            value: function getChosenAttributesAll() {
                var data = {};
                var count = 0;
                var chosen = 0;

                this._attributeFields.each(function () {
                    var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
                    var value = $(this).val() || '';

                    if (value.length > 0) {
                        chosen++;
                    }

                    count++;
                    data[attribute_name] = value;
                });

                return {
                    'count': count,
                    'chosenCount': chosen,
                    'data': data
                };
            }
        }, {
            key: 'getChosenAttributesSingle',
            value: function getChosenAttributesSingle() {
                var data = {};
                var count = 0;
                var chosen = 0;

                this._attributeFieldSingle.each(function () {
                    var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
                    var value = $(this).val() || '';

                    if (value.length > 0) {
                        chosen++;
                    }

                    count++;
                    data[attribute_name] = value;
                });

                return {
                    'count': count,
                    'chosenCount': chosen,
                    'data': data
                };
            }
        }, {
            key: 'findMatchingVariations',
            value: function findMatchingVariations(variations, attributes) {
                var matching = [];
                for (var i = 0; i < variations.length; i++) {
                    var variation = variations[i];

                    if (this.isMatch(variation.attributes, attributes)) {
                        matching.push(variation);
                    }
                }
                return matching;
            }
        }, {
            key: 'isMatch',
            value: function isMatch(variation_attributes, attributes) {
                var match = true;
                for (var attr_name in variation_attributes) {
                    if (variation_attributes.hasOwnProperty(attr_name)) {
                        var val1 = variation_attributes[attr_name];
                        var val2 = attributes[attr_name];
                        if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
                            match = false;
                        }
                    }
                }
                return match;
            }
        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config) {
                return this.each(function () {
                    new WooVariationSwatchesPro(this, config);
                });
            }
        }]);

        return WooVariationSwatchesPro;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn['WooVariationSwatchesPro'] = WooVariationSwatchesPro._jQueryInterface;
    $.fn['WooVariationSwatchesPro'].Constructor = WooVariationSwatchesPro;
    $.fn['WooVariationSwatchesPro'].noConflict = function () {
        $.fn['WooVariationSwatchesPro'] = $.fn['WooVariationSwatchesPro'];
        return WooVariationSwatchesPro._jQueryInterface;
    };

    return WooVariationSwatchesPro;
}(jQuery);

/* harmony default export */ __webpack_exports__["default"] = (WooVariationSwatchesPro);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2Zyb250ZW5kLXByby5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1OTg5YjQ4N2ExMWY0OTYxMTg5YyIsIndlYnBhY2s6Ly8vc3JjL2pzL2Zyb250ZW5kLmpzIiwid2VicGFjazovLy9zcmMvanMvV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTk4OWI0ODdhMTFmNDk2MTE4OWMiLCJqUXVlcnkoJCA9PiB7XG4gICAgaW1wb3J0KCcuL1dvb1ZhcmlhdGlvblN3YXRjaGVzUHJvJykudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIEluaXQgb24gQWpheCBQb3B1cCA6KVxuICAgICAgICAkKGRvY3VtZW50KS5vbignd2NfdmFyaWF0aW9uX2Zvcm0nLCAnLnZhcmlhdGlvbnNfZm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8oKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsgIC8vIGVuZCBvZiBqcXVlcnkgbWFpbiB3cmFwcGVyXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9mcm9udGVuZC5qcyIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFdvb0NvbW1lcmNlIFZhcmlhdGlvbiBDaGFuZ2Vcbi8qZ2xvYmFsIHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMsIHdvb192YXJpYXRpb25fc3dhdGNoZXNfb3B0aW9ucyAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBXb29WYXJpYXRpb25Td2F0Y2hlc1BybyA9ICgoJCkgPT4ge1xuXG4gICAgY29uc3QgRGVmYXVsdCA9IHt9O1xuXG4gICAgY2xhc3MgV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8ge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuXG4gICAgICAgICAgICAvLyBBc3NpZ25cbiAgICAgICAgICAgIHRoaXMuX2VsICAgICAgICAgICAgICAgID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgICAgICAgICAgID0gJChlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZyAgICAgICAgICAgID0gJC5leHRlbmQoe30sIERlZmF1bHQsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZWQgICAgICAgICA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMgPSB0aGlzLl9lbGVtZW50LmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9ucycpO1xuICAgICAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiAgPSAhdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnM7XG4gICAgICAgICAgICB0aGlzLmlzX2xvb3AgICAgICAgICAgICA9IHRoaXMuX2VsZW1lbnQuaGFzQ2xhc3MoJ3d2cy1hcmNoaXZlLXZhcmlhdGlvbi13cmFwcGVyJyk7XG4gICAgICAgICAgICB0aGlzLl9hdHRyaWJ1dGVGaWVsZHMgICA9IHRoaXMuX2VsZW1lbnQuZmluZCgnLnZhcmlhdGlvbnMgc2VsZWN0Jyk7XG4gICAgICAgICAgICAvLyB0aGlzLl93cmFwcGVyICAgICAgICAgICA9IHRoaXMuX2VsZW1lbnQuY2xvc2VzdCgnLnd2cy1wcm8tcHJvZHVjdCcpO1xuICAgICAgICAgICAgdGhpcy5fd3JhcHBlciAgICAgICAgICAgPSB0aGlzLl9lbGVtZW50LmNsb3Nlc3Qod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmFyY2hpdmVfcHJvZHVjdF93cmFwcGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uICAgICAgID0gdGhpcy5fd3JhcHBlci5maW5kKCcud3ZzX2FkZF90b19jYXJ0X2J1dHRvbicpO1xuICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b25fYWpheCAgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy53dnNfYWpheF9hZGRfdG9fY2FydCcpO1xuICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b25faHRtbCAgPSB0aGlzLl9jYXJ0X2J1dHRvbi5jbG9uZSgpLmh0bWwoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX2ltYWdlICAgICAgICAgICAgID0gdGhpcy5fd3JhcHBlci5maW5kKCcud3AtcG9zdC1pbWFnZScpO1xuICAgICAgICAgICAgdGhpcy5faW1hZ2UgICAgICAgICAgICAgPSB0aGlzLl93cmFwcGVyLmZpbmQod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmFyY2hpdmVfaW1hZ2Vfc2VsZWN0b3IpO1xuICAgICAgICAgICAgdGhpcy5fcHJpY2UgICAgICAgICAgICAgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy5wcmljZScpO1xuICAgICAgICAgICAgdGhpcy5fcHJpY2VfaHRtbCAgICAgICAgPSB0aGlzLl9wcmljZS5jbG9uZSgpLmh0bWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2R1Y3RfaWQgICAgICAgID0gdGhpcy5fY2FydF9idXR0b24uZGF0YSgncHJvZHVjdF9pZCcpO1xuICAgICAgICAgICAgdGhpcy5fdmFyaWF0aW9uX3Nob3duICAgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKCQudHJpbSh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuYXJjaGl2ZV9hZGRfdG9fY2FydF9idXR0b25fc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24gICAgICA9IHRoaXMuX3dyYXBwZXIuZmluZCh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuYXJjaGl2ZV9hZGRfdG9fY2FydF9idXR0b25fc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uX2FqYXggPSB0aGlzLl93cmFwcGVyLmZpbmQod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmFyY2hpdmVfYWRkX3RvX2NhcnRfYnV0dG9uX3NlbGVjdG9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2FsbFxuICAgICAgICAgICAgdGhpcy5pbml0KHRoaXMuaXNfYWpheF92YXJpYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5vblZhcmlhdGlvblNob3duSGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5hZGRUb0NhcnRCdXR0b24odGhpcy5pc19hamF4X3ZhcmlhdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2xvb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvdW5kVmFyaWF0aW9uKHRoaXMuaXNfYWpheF92YXJpYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgLy8gQXJjaGl2ZSBQYWdlIEFsc29cbiAgICAgICAgICAgICAgICBpZiAod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmVuYWJsZV9zaW5nbGVfdmFyaWF0aW9uX3ByZXZpZXdfYXJjaGl2ZSAmJiB3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuZW5hYmxlX3NpbmdsZV92YXJpYXRpb25fcHJldmlldyAmJiB3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuc2luZ2xlX3ZhcmlhdGlvbl9wcmV2aWV3X2F0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hdHRyaWJ1dGVGaWVsZFNpbmdsZSA9IHRoaXMuX2VsZW1lbnQuZmluZChgLnZhcmlhdGlvbnMgc2VsZWN0IyR7d29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLnNpbmdsZV92YXJpYXRpb25fcHJldmlld19hdHRyaWJ1dGV9YCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlSW1hZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmVuYWJsZV9zaW5nbGVfdmFyaWF0aW9uX3ByZXZpZXcgJiYgd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLnNpbmdsZV92YXJpYXRpb25fcHJldmlld19hdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlRmllbGRTaW5nbGUgPSB0aGlzLl9lbGVtZW50LmZpbmQoYC52YXJpYXRpb25zIHNlbGVjdCMke3dvb192YXJpYXRpb25fc3dhdGNoZXNfb3B0aW9ucy5zaW5nbGVfdmFyaWF0aW9uX3ByZXZpZXdfYXR0cmlidXRlfWApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUltYWdlcygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuZW5hYmxlX2xpbmthYmxlX3ZhcmlhdGlvbl91cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVZhcmlhdGlvblVSTCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcignd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm8nLCBbdGhpcy5fZWxlbWVudF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBuZXcgV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8odGhpcywgY29uZmlnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlVmFyaWF0aW9uVVJMKCkge1xuXG4gICAgICAgICAgICBsZXQgdXJsICAgID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBsZXQgc2VhcmNoID0gdXJsLnNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBsZXQgb3JpZ2luYWxVcmwgPSB1cmwub3JpZ2luICsgdXJsLnBhdGhuYW1lO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdjaGVja192YXJpYXRpb25zLndjLXZhcmlhdGlvbi1mb3JtJywgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlcztcblxuICAgICAgICAgICAgICAgIGlmICh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMud2NfYnVuZGxlc19lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCAgICAgICAgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoICAgICA9IHVybC5zZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyA9IHRoaXMuZ2V0Q2hvc2VuQXR0cmlidXRlc0J1bmRsZVN1cHBvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLmdldENob3NlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlc09iamVjdCA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cnMsIGN1cnJlbnQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tjdXJyZW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnNbY3VycmVudF0gPSBhdHRyaWJ1dGVzW2N1cnJlbnRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRycztcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoT2JqZWN0ID0gWy4uLm5ldyBVUkxTZWFyY2hQYXJhbXMoc2VhcmNoKS5rZXlzKCldLnJlZHVjZSgoYXR0cnMsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbY3VycmVudF0gPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHNlYXJjaCkuZ2V0KGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlYXJjaE9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgLi4uYXR0cmlidXRlc09iamVjdFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gJC5wYXJhbShkYXRhKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIHRoaXMuYWRkUXVlcnlBcmcob3JpZ2luYWxVcmwsIHBhcmFtcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXREZWZhdWx0SW1hZ2VzKCkge1xuICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF90aGlzICAgICAgICAgICAgICA9IHRoaXM7XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RfdmFyaWF0aW9ucyA9IHRoaXMuX2VsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJyk7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSW5kZXg7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LmZpbmQoJ3VsLnZhcmlhYmxlLWl0ZW1zLXdyYXBwZXIud3ZzLWNhdGFsb2ctdmFyaWFibGUtd3JhcHBlciA+IGxpOm5vdCguZGlzYWJsZWQpOm5vdCgud29vLXZhcmlhdGlvbi1zd2F0Y2hlcy12YXJpYWJsZS1pdGVtLW1vcmUpJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9mZignd3ZzLXNlbGVjdGVkLWl0ZW0uY2F0YWxvZy1pbWFnZS1ob3ZlcicpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9mZignd3ZzLXNlbGVjdGVkLWl0ZW0uY2F0YWxvZy1pbWFnZS1jbGljaycpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9mZignbW91c2VlbnRlci5jYXRhbG9nLWltYWdlLWhvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub2ZmKCdtb3VzZWxlYXZlLmNhdGFsb2ctaW1hZ2UtaG92ZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmNhdGFsb2dfbW9kZV9ldmVudCA9PT0gJ2hvdmVyJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdtb3VzZWVudGVyLmNhdGFsb2ctaW1hZ2UtaG92ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignY2xpY2snKS50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlzX21vYmlsZSA9ICQoJ2JvZHknKS5oYXNDbGFzcygnd29vLXZhcmlhdGlvbi1zd2F0Y2hlcy1vbi1tb2JpbGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc19tb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCd0b3VjaHN0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDIpXG4gICAgICAgIH1cblxuICAgICAgICBvblZhcmlhdGlvblNob3duSGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3Nob3dfdmFyaWF0aW9uJywge3ZhcmlhdGlvbkZvcm0gOiB0aGlzLl9lbGVtZW50fSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFyaWF0aW9uX3Nob3duID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdoaWRlX3ZhcmlhdGlvbicsIHt2YXJpYXRpb25Gb3JtIDogdGhpcy5fZWxlbWVudH0sIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhcmlhdGlvbl9zaG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdEltYWdlcygpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNfbG9vcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3BSZXNldERpc3BsYXllZFZhcmlhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdChpc19hamF4KSB7XG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHRJbWFnZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnLCBbdGhpcywgdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnNdKVxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2xvYWRlZCcsIFt0aGlzLl9lbGVtZW50LCB0aGlzLnByb2R1Y3RfdmFyaWF0aW9uc10pXG4gICAgICAgICAgICB9LCAyKVxuICAgICAgICB9XG5cbiAgICAgICAgZm91bmRWYXJpYXRpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ2ZvdW5kX3ZhcmlhdGlvbi53dnMtdmFyaWF0aW9uLWZvcm0nLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXMuX2VsZW1lbnR9LCAoZXZlbnQsIHZhcmlhdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy52YXJpYXRpb25zSW1hZ2VVcGRhdGUodmFyaWF0aW9uKVxuXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlICAgICAgICAgICA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGVfaHRtbCAgICAgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgJHZpZXdfY2FydF9idXR0b24gID0gdGhpcy5fd3JhcHBlci5maW5kKCcuYWRkZWRfdG9fY2FydCcpLFxuICAgICAgICAgICAgICAgICAgICAkdmlld19jYXJ0X2J1dHRvbjIgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy5hZGRlZF90b19jYXJ0X2J1dHRvbicpLFxuICAgICAgICAgICAgICAgICAgICAkcHJpY2UgICAgICAgICAgICAgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy5wcmljZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2YXJpYXRpb24udmFyaWF0aW9uX2lzX3Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSgndW5hdmFpbGFibGUtdmFyaWF0aW9uLXRlbXBsYXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCd3dnMtdmFyaWF0aW9uLXRlbXBsYXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlX2h0bWwgPSB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhdGlvbiAgOiB2YXJpYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHByaWNlX2h0bWwgOiAkKHZhcmlhdGlvbi5wcmljZV9odG1sKS51bndyYXAoKS5odG1sKCkgfHwgdGhpcy5fcHJpY2VfaHRtbFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlX2h0bWwgPSAkdGVtcGxhdGVfaHRtbC5yZXBsYWNlKCcvKjwhW0NEQVRBWyovJywgJycpO1xuICAgICAgICAgICAgICAgICR0ZW1wbGF0ZV9odG1sID0gJHRlbXBsYXRlX2h0bWwucmVwbGFjZSgnLypdXT4qLycsICcnKTtcblxuICAgICAgICAgICAgICAgICRwcmljZS5odG1sKCR0ZW1wbGF0ZV9odG1sKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uLmRhdGEoJ3ZhcmlhdGlvbl9pZCcsIHZhcmlhdGlvbi52YXJpYXRpb25faWQpXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24uZGF0YSgndmFyaWF0aW9uJywgdGhpcy5nZXRDaG9zZW5BdHRyaWJ1dGVzKCkpXG5cbiAgICAgICAgICAgICAgICAvLyBJZiBub3QgY2F0YWxvZyBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKCF3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuZW5hYmxlX2NhdGFsb2dfbW9kZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENhcnQgVGV4dFxuICAgICAgICAgICAgICAgICAgICBpZiAod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmFyY2hpdmVfYWRkX3RvX2NhcnRfdGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24uaHRtbCh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuYXJjaGl2ZV9hZGRfdG9fY2FydF90ZXh0KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMuaTE4bl9hZGRfdG9fY2FydC50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXJ0X2J1dHRvbi50ZXh0KHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMuaTE4bl9hZGRfdG9fY2FydClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFqYXggQWRkIHRvIGNhcnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCdubycgPT09IHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMuZW5hYmxlX2FqYXhfYWRkX3RvX2NhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSAkLnBhcmFtKHsuLi50aGlzLmdldENob3NlbkF0dHJpYnV0ZXMoKSwgJ2FkZC10by1jYXJ0JyA6IHRoaXMuX3Byb2R1Y3RfaWQsIHZhcmlhdGlvbl9pZCA6IHZhcmlhdGlvbi52YXJpYXRpb25faWR9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24ucHJvcCgnaHJlZicsIHRoaXMuYWRkUXVlcnlBcmcodGhpcy5fY2FydF9idXR0b24uZGF0YSgnYWRkX3RvX2NhcnRfdXJsJyksIHBhcmFtcykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZXNldHRpbmcgQnV0dG9uc1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uLnJlbW92ZUNsYXNzKCdhZGRlZCcpXG4gICAgICAgICAgICAgICAgaWYgKCR2aWV3X2NhcnRfYnV0dG9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJHZpZXdfY2FydF9idXR0b24ucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCR2aWV3X2NhcnRfYnV0dG9uMi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICR2aWV3X2NhcnRfYnV0dG9uMi5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdyZXNldF9pbWFnZS53dnMtdmFyaWF0aW9uLWZvcm0nLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXMuX2VsZW1lbnR9LCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhdGlvbnNJbWFnZVVwZGF0ZShmYWxzZSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdyZXNldF9kYXRhLnd2cy12YXJpYXRpb24tZm9ybScsIHt2YXJpYXRpb25Gb3JtIDogdGhpcy5fZWxlbWVudH0sIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvcFJlc2V0RGlzcGxheWVkVmFyaWF0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3BSZXNldERpc3BsYXllZFZhcmlhdGlvbigpIHtcbiAgICAgICAgICAgIGxldCAkcHJpY2UgICAgICAgICAgICAgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy5wcmljZScpLFxuICAgICAgICAgICAgICAgICR2aWV3X2NhcnRfYnV0dG9uICA9IHRoaXMuX3dyYXBwZXIuZmluZCgnLmFkZGVkX3RvX2NhcnQnKSxcbiAgICAgICAgICAgICAgICAkdmlld19jYXJ0X2J1dHRvbjIgPSB0aGlzLl93cmFwcGVyLmZpbmQoJy5hZGRlZF90b19jYXJ0X2J1dHRvbicpO1xuXG4gICAgICAgICAgICAkcHJpY2UuaHRtbCh0aGlzLl9wcmljZV9odG1sKTtcblxuICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24uZGF0YSgndmFyaWF0aW9uX2lkJywgJycpO1xuICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24uZGF0YSgndmFyaWF0aW9uJywgJycpO1xuXG4gICAgICAgICAgICAvLyAgSWYgbm90IGNhdGFsb2cgbW9kZVxuICAgICAgICAgICAgaWYgKCF3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMuZW5hYmxlX2NhdGFsb2dfbW9kZSkge1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgaWYgKHdvb192YXJpYXRpb25fc3dhdGNoZXNfb3B0aW9ucy5hcmNoaXZlX2FkZF90b19jYXJ0X3NlbGVjdF9vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uLmh0bWwod29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zLmFyY2hpdmVfYWRkX3RvX2NhcnRfc2VsZWN0X29wdGlvbnMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAod2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcy5pMThuX3NlbGVjdF9vcHRpb25zLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FydF9idXR0b24udGV4dCh3Y19hZGRfdG9fY2FydF92YXJpYXRpb25fcGFyYW1zLmkxOG5fc2VsZWN0X29wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJ25vJyA9PT0gd2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcy5lbmFibGVfYWpheF9hZGRfdG9fY2FydCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXJ0X2J1dHRvbi5wcm9wKCdocmVmJywgdGhpcy5fY2FydF9idXR0b24uZGF0YSgncHJvZHVjdF9wZXJtYWxpbmsnKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlc2V0dGluZyBCdXR0b25zXG4gICAgICAgICAgICB0aGlzLl9jYXJ0X2J1dHRvbi5yZW1vdmVDbGFzcygnYWRkZWQnKVxuICAgICAgICAgICAgaWYgKCR2aWV3X2NhcnRfYnV0dG9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkdmlld19jYXJ0X2J1dHRvbi5yZW1vdmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCR2aWV3X2NhcnRfYnV0dG9uMi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJHZpZXdfY2FydF9idXR0b24yLnJlbW92ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXJpYXRpb25zSW1hZ2VVcGRhdGUodmFyaWF0aW9uKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2ltYWdlLmFkZENsYXNzKCd3dnMtcHJvLWltYWdlLWxvYWQnKS5vbmUoJ3dlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIG1zQW5pbWF0aW9uRW5kIGFuaW1hdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24gKCkgeyQodGhpcykucmVtb3ZlQ2xhc3MoJ3d2cy1wcm8taW1hZ2UtbG9hZCcpIH0pO1xuXG4gICAgICAgICAgICBpZiAodmFyaWF0aW9uICYmIHZhcmlhdGlvbi5pbWFnZSAmJiB2YXJpYXRpb24uaW1hZ2UudGh1bWJfc3JjICYmIHZhcmlhdGlvbi5pbWFnZS50aHVtYl9zcmMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3NldF92YXJpYXRpb25fYXR0cignc3JjJywgdmFyaWF0aW9uLmltYWdlLnRodW1iX3NyYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2Uud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdoZWlnaHQnLCB2YXJpYXRpb24uaW1hZ2UudGh1bWJfc3JjX2gpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3NldF92YXJpYXRpb25fYXR0cignd2lkdGgnLCB2YXJpYXRpb24uaW1hZ2UudGh1bWJfc3JjX3cpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3NldF92YXJpYXRpb25fYXR0cignc3Jjc2V0JywgdmFyaWF0aW9uLmltYWdlLnRodW1iX3NyY3NldCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2Uud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdzaXplcycsIHZhcmlhdGlvbi5pbWFnZS50aHVtYl9zaXplcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2Uud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCd0aXRsZScsIHZhcmlhdGlvbi5pbWFnZS50aXRsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2Uud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdhbHQnLCB2YXJpYXRpb24uaW1hZ2UuYWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdzcmMnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZS53Y19yZXNldF92YXJpYXRpb25fYXR0cignd2lkdGgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZS53Y19yZXNldF92YXJpYXRpb25fYXR0cignaGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faW1hZ2Uud2NfcmVzZXRfdmFyaWF0aW9uX2F0dHIoJ3NyY3NldCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdzaXplcycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdhbHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvQ2FydEJ1dHRvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uX2FqYXgub2ZmKCdjbGljay53dnMtcHJvLWFyY2hpdmUtYWRkLXRvLWNhcnQnKTtcbiAgICAgICAgICAgIHRoaXMuX2NhcnRfYnV0dG9uX2FqYXgub24oJ2NsaWNrLnd2cy1wcm8tYXJjaGl2ZS1hZGQtdG8tY2FydCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgbGV0ICRidXR0b24gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdvb192YXJpYXRpb25fc3dhdGNoZXNfb3B0aW9ucy5lbmFibGVfY2F0YWxvZ19tb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghJGJ1dHRvbi5kYXRhKCd2YXJpYXRpb25faWQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBEb24ndCBtb3ZlIGl0XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIERvbid0IG1vdmUgaXRcblxuICAgICAgICAgICAgICAgICRidXR0b24ucmVtb3ZlQ2xhc3MoJ2FkZGVkJyk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA6IFwid3ZzX2FkZF92YXJpYXRpb25fdG9fY2FydFwiLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goJGJ1dHRvbi5kYXRhKCksIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciBldmVudC5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnRyaWdnZXIoJ2FkZGluZ190b19jYXJ0JywgWyRidXR0b24sIGRhdGFdKTtcblxuICAgICAgICAgICAgICAgIC8vIEFqYXggYWN0aW9uLlxuICAgICAgICAgICAgICAgICQucG9zdCh3Y19hZGRfdG9fY2FydF92YXJpYXRpb25fcGFyYW1zLmFqYXhfdXJsLnRvU3RyaW5nKCksIGRhdGEsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3IgJiYgcmVzcG9uc2UucHJvZHVjdF91cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHJlc3BvbnNlLnByb2R1Y3RfdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVkaXJlY3QgdG8gY2FydCBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3JlZGlyZWN0X2FmdGVyX2FkZCA9PT0gJ3llcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdjX2FkZF90b19jYXJ0X3BhcmFtcy5jYXJ0X3VybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgZXZlbnQgc28gdGhlbWVzIGNhbiByZWZyZXNoIG90aGVyIGFyZWFzLlxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnRyaWdnZXIoJ2FkZGVkX3RvX2NhcnQnLCBbcmVzcG9uc2UuZnJhZ21lbnRzLCByZXNwb25zZS5jYXJ0X2hhc2gsICRidXR0b25dKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBnZXRDaG9zZW5BdHRyaWJ1dGVzQnVuZGxlU3VwcG9ydCgpIHtcbiAgICAgICAgICAgIGxldCBkYXRhICAgPSB7fTtcbiAgICAgICAgICAgIGxldCBjb3VudCAgPSAwO1xuICAgICAgICAgICAgbGV0IGNob3NlbiA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZUZpZWxkcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgICAgICAgICAgPSAkKHRoaXMpLnZhbCgpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvc2VuKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICBkYXRhW2F0dHJpYnV0ZV9uYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q2hvc2VuQXR0cmlidXRlcygpIHtcbiAgICAgICAgICAgIGxldCBkYXRhICAgPSB7fTtcbiAgICAgICAgICAgIGxldCBjb3VudCAgPSAwO1xuICAgICAgICAgICAgbGV0IGNob3NlbiA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZUZpZWxkcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJykgfHwgJCh0aGlzKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlICAgICAgICAgID0gJCh0aGlzKS52YWwoKSB8fCAnJztcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob3NlbisrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgZGF0YVthdHRyaWJ1dGVfbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFF1ZXJ5QXJnKHVybCwgcXVlcnkpIHtcbiAgICAgICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBvcHRpb25hbCBsZWFkaW5nIHN5bWJvbHNcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKS5yZXBsYWNlKC9eKFxcP3wjfCYpLywgJycpLnJlcGxhY2UoLyhcXD98I3wmKSQvLCAnJylcblxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFwcGVuZCBlbXB0eSBxdWVyeVxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkgPyAoJz8nICsgcXVlcnkpIDogcXVlcnlcblxuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHVybC5zcGxpdCgvW1xcP1xcI10vKVxuICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IHBhcnRzWzBdXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXJ5ICYmIC9cXDpcXC9cXC9bXlxcL10qJC8udGVzdChzdGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZS5nLiBodHRwOi8vZm9vLmNvbSAtPiBodHRwOi8vZm9vLmNvbS9cbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBzdGFydCArICcvJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2goLyhcXCMuKikkLylcbiAgICAgICAgICAgICAgICB1cmwgICAgICAgPSBzdGFydCArIHF1ZXJ5XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7IC8vIGFkZCBoYXNoIGJhY2sgaW5cbiAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsICsgbWF0Y2hbMF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXJsXG4gICAgICAgIH1cblxuICAgICAgICBvblJlc2V0RGlzcGxheWVkVmFyaWF0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuY2xvc2VzdCgnLnByb2R1Y3QnKS5maW5kKCcucHJvZHVjdF9tZXRhJykuZmluZCgnLnNrdScpLndjX3Jlc2V0X2NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuY2xvc2VzdCgnLnByb2R1Y3QnKS5maW5kKCcucHJvZHVjdF93ZWlnaHQnKS53Y19yZXNldF9jb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmNsb3Nlc3QoJy5wcm9kdWN0JykuZmluZCgnLnByb2R1Y3RfZGltZW5zaW9ucycpLndjX3Jlc2V0X2NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcigncmVzZXRfaW1hZ2UnKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuZmluZCgnLnNpbmdsZV92YXJpYXRpb24nKS5zbGlkZVVwKDIwMCkudHJpZ2dlcignaGlkZV92YXJpYXRpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNpbmdsZSBBdHRyaWJ1dGUgQ2hhbmdlIEltYWdlXG5cbiAgICAgICAgY2hhbmdlSW1hZ2VzKCkge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLl9lbGVtZW50LmRhdGEoJ2V2ZW50cycpKVxuICAgICAgICAgICAgbGV0IGV2ZW50cyA9IHRoaXMuX2VsZW1lbnQuZGF0YSgnZXZlbnRzJyk7XG5cbiAgICAgICAgICAgIGxldCByZXNldF9kYXRhX2ZuID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgZXZlbnRzLnJlc2V0X2RhdGEpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdjaGVja192YXJpYXRpb25zLndjLXZhcmlhdGlvbi1mb3JtJywgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFyaWF0aW9uRGF0YSA9IHRoaXMuX2VsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYWxsQXR0cmlidXRlcyAgICAgICAgPSB0aGlzLmdldENob3NlbkF0dHJpYnV0ZXNBbGwoKSxcbiAgICAgICAgICAgICAgICAgICAgYWxsQ3VycmVudEF0dHJpYnV0ZXMgPSBhbGxBdHRyaWJ1dGVzLmRhdGEsXG5cbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICAgPSB0aGlzLmdldENob3NlbkF0dHJpYnV0ZXNTaW5nbGUoKSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEF0dHJpYnV0ZXMgICAgPSBhdHRyaWJ1dGVzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyAgYWxsQXR0cmlidXRlcy5jb3VudCAhPT0gYWxsQXR0cmlidXRlcy5jaG9zZW5Db3VudCAmJiBhdHRyaWJ1dGVzLmNvdW50ID09PSBhdHRyaWJ1dGVzLmNob3NlbkNvdW50XG5cbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5jb3VudCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsQXR0cmlidXRlcy5jb3VudCAhPT0gYWxsQXR0cmlidXRlcy5jaG9zZW5Db3VudCAmJiBhdHRyaWJ1dGVzLmNvdW50ID09PSBhdHRyaWJ1dGVzLmNob3NlbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9lbGVtZW50Lm9mZigncmVzZXRfZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vZmYoJ3Jlc2V0X2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vZmYoJ3Jlc2V0X2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlYXR0YWNoIFVuYmluZGVkIEV2ZW50IGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc2V0X2RhdGFfZm4pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNldF9kYXRhX2ZuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZuICAgICAgICA9IHJlc2V0X2RhdGFfZm5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWVzcGFjZSA9IGZuLm5hbWVzcGFjZSA/IGAuJHtmbi5uYW1lc3BhY2V9YCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSAgICAgID0gZm4uZGF0YSA/IGZuLmRhdGEgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXIgICA9IGZuLmhhbmRsZXIgPyBmbi5oYW5kbGVyIDogKCkgPT4ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oYHJlc2V0X2RhdGEke25hbWVzcGFjZX1gLCBkYXRhLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2VsZW1lbnQub2ZmKCdyZXNldF9kYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiAgdGhpcy5fZWxlbWVudC5vbigncmVzZXRfZGF0YScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5vblJlc2V0RGlzcGxheWVkVmFyaWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCdyZXNldF9kYXRhLnd2cy12YXJpYXRpb24tZm9ybScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5zaG9wUmVzZXREaXNwbGF5ZWRWYXJpYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmNvdW50ID4gMCAmJiBhbGxBdHRyaWJ1dGVzLmNvdW50ICE9PSBhbGxBdHRyaWJ1dGVzLmNob3NlbkNvdW50ICYmIGF0dHJpYnV0ZXMuY291bnQgPT09IGF0dHJpYnV0ZXMuY2hvc2VuQ291bnQpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoaW5nX3ZhcmlhdGlvbnMgPSB0aGlzLmZpbmRNYXRjaGluZ1ZhcmlhdGlvbnModmFyaWF0aW9uRGF0YSwgY3VycmVudEF0dHJpYnV0ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWF0aW9uICAgICAgICAgICA9IG1hdGNoaW5nX3ZhcmlhdGlvbnMuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWF0aW9uKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCdmb3VuZF92YXJpYXRpb24nLCBbdmFyaWF0aW9uXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCdoaWRlX3ZhcmlhdGlvbicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZTogaWYgd2UgdHJpZ2dlciBcImZvdW5kX3ZhcmlhdGlvblwiIGNsaWVudCBjYW4gY2xpY2sgYWRkIHRvIGNhcnQgd2l0aG91dCBzZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmlmICh3b29fdmFyaWF0aW9uX3N3YXRjaGVzX29wdGlvbnMudXNpbmdfY3VzdG9tX2dhbGxlcnlfc2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcignZm91bmRfdmFyaWF0aW9uJywgW3ZhcmlhdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ2hpZGVfdmFyaWF0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNfbG9vcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYXRpb25zSW1hZ2VVcGRhdGUodmFyaWF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQud2NfdmFyaWF0aW9uc19pbWFnZV91cGRhdGUodmFyaWF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCdzaG93X3ZhcmlhdGlvbicsIFt2YXJpYXRpb25dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnRyaWdnZXIoJ3d2c19wcm9fc2luZ2xlX3ByZXZpZXdfZm91bmRfdmFyaWF0aW9uJywgW3RoaXMsIHZhcmlhdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jaG9zZW5Db3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcigndXBkYXRlX3ZhcmlhdGlvbl92YWx1ZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudHJpZ2dlcigncmVzZXRfZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDaG9zZW5BdHRyaWJ1dGVzQWxsKCkge1xuICAgICAgICAgICAgbGV0IGRhdGEgICA9IHt9O1xuICAgICAgICAgICAgbGV0IGNvdW50ICA9IDA7XG4gICAgICAgICAgICBsZXQgY2hvc2VuID0gMDtcblxuICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlRmllbGRzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVfbmFtZSA9ICQodGhpcykuZGF0YSgnYXR0cmlidXRlX25hbWUnKSB8fCAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgICAgICAgICAgPSAkKHRoaXMpLnZhbCgpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvc2VuKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICBkYXRhW2F0dHJpYnV0ZV9uYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2NvdW50JyAgICAgICA6IGNvdW50LFxuICAgICAgICAgICAgICAgICdjaG9zZW5Db3VudCcgOiBjaG9zZW4sXG4gICAgICAgICAgICAgICAgJ2RhdGEnICAgICAgICA6IGRhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDaG9zZW5BdHRyaWJ1dGVzU2luZ2xlKCkge1xuICAgICAgICAgICAgbGV0IGRhdGEgICA9IHt9O1xuICAgICAgICAgICAgbGV0IGNvdW50ICA9IDA7XG4gICAgICAgICAgICBsZXQgY2hvc2VuID0gMDtcblxuICAgICAgICAgICAgdGhpcy5fYXR0cmlidXRlRmllbGRTaW5nbGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZV9uYW1lID0gJCh0aGlzKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpIHx8ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSAgICAgICAgICA9ICQodGhpcykudmFsKCkgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjaG9zZW4rKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIGRhdGFbYXR0cmlidXRlX25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnY291bnQnICAgICAgIDogY291bnQsXG4gICAgICAgICAgICAgICAgJ2Nob3NlbkNvdW50JyA6IGNob3NlbixcbiAgICAgICAgICAgICAgICAnZGF0YScgICAgICAgIDogZGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRNYXRjaGluZ1ZhcmlhdGlvbnModmFyaWF0aW9ucywgYXR0cmlidXRlcykge1xuICAgICAgICAgICAgbGV0IG1hdGNoaW5nID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhcmlhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFyaWF0aW9uID0gdmFyaWF0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTWF0Y2godmFyaWF0aW9uLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nLnB1c2godmFyaWF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hpbmc7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXNNYXRjaCh2YXJpYXRpb25fYXR0cmlidXRlcywgYXR0cmlidXRlcykge1xuICAgICAgICAgICAgbGV0IG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGF0dHJfbmFtZSBpbiB2YXJpYXRpb25fYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGlmICh2YXJpYXRpb25fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyX25hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWwxID0gdmFyaWF0aW9uX2F0dHJpYnV0ZXNbYXR0cl9uYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbDIgPSBhdHRyaWJ1dGVzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwxICE9PSB1bmRlZmluZWQgJiYgdmFsMiAhPT0gdW5kZWZpbmVkICYmIHZhbDEubGVuZ3RoICE9PSAwICYmIHZhbDIubGVuZ3RoICE9PSAwICYmIHZhbDEgIT09IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogalF1ZXJ5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICAkLmZuWydXb29WYXJpYXRpb25Td2F0Y2hlc1BybyddID0gV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8uX2pRdWVyeUludGVyZmFjZTtcbiAgICAkLmZuWydXb29WYXJpYXRpb25Td2F0Y2hlc1BybyddLkNvbnN0cnVjdG9yID0gV29vVmFyaWF0aW9uU3dhdGNoZXNQcm87XG4gICAgJC5mblsnV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8nXS5ub0NvbmZsaWN0ICA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJC5mblsnV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8nXSA9ICQuZm5bJ1dvb1ZhcmlhdGlvblN3YXRjaGVzUHJvJ107XG4gICAgICAgIHJldHVybiBXb29WYXJpYXRpb25Td2F0Y2hlc1Byby5falF1ZXJ5SW50ZXJmYWNlXG4gICAgfVxuXG4gICAgcmV0dXJuIFdvb1ZhcmlhdGlvblN3YXRjaGVzUHJvO1xuXG59KShqUXVlcnkpO1xuXG5leHBvcnQgZGVmYXVsdCBXb29WYXJpYXRpb25Td2F0Y2hlc1Byb1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvV29vVmFyaWF0aW9uU3dhdGNoZXNQcm8uanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBOURBO0FBQUE7QUFBQTtBQXFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEvR0E7QUFBQTtBQUFBO0FBaUhBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBakpBO0FBQUE7QUFBQTtBQW1KQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoS0E7QUFBQTtBQUFBO0FBa0tBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF4S0E7QUFBQTtBQUFBO0FBMEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsUEE7QUFBQTtBQUFBO0FBcVBBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdlJBO0FBQUE7QUFBQTtBQUNBO0FBMFJBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBL1NBO0FBQUE7QUFBQTtBQWtUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJXQTtBQUFBO0FBQUE7QUF3V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBelhBO0FBQUE7QUFBQTtBQTRYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3WUE7QUFBQTtBQUFBO0FBZ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcGFBO0FBQUE7QUFBQTtBQUNBO0FBdWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhiQTtBQUFBO0FBQUE7QUFpYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6Z0JBO0FBQUE7QUFBQTtBQTRnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFqaUJBO0FBQUE7QUFBQTtBQW9pQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUF6akJBO0FBQUE7QUFBQTtBQTRqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFya0JBO0FBQUE7QUFBQTtBQXdrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbmxCQTtBQUFBO0FBQUE7QUFnRUE7QUFDQTtBQUNBO0FBQ0E7QUFuRUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQXFsQkE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBIiwic291cmNlUm9vdCI6IiJ9