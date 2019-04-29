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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*global wc_add_to_cart_variation_params, woo_variation_swatches_options */
;(function ($, window, document, undefined) {
    /**
     * VariationForm class which handles variation forms and attributes.
     */
    var VariationForm = function VariationForm($form) {
        this.$form = $form;
        this.$attributeFields = $form.find('.variations select');
        this.$singleVariation = $form.find('.single_variation');
        this.$singleVariationWrap = $form.find('.single_variation_wrap');
        this.$resetVariations = $form.find('.reset_variations');
        this.$product = $form.closest('.product');
        this.variationData = $form.data('product_variations');
        this.useAjax = false === this.variationData;
        this.xhr = false;
        this.loading = true;

        // Initial state.
        this.$singleVariationWrap.show();
        this.$form.off('.wc-variation-form');

        // Methods.
        this.getChosenAttributes = this.getChosenAttributes.bind(this);
        this.findMatchingVariations = this.findMatchingVariations.bind(this);
        this.isMatch = this.isMatch.bind(this);
        this.toggleResetLink = this.toggleResetLink.bind(this);

        // Events.
        $form.on('click.wc-variation-form', '.reset_variations', { variationForm: this }, this.onReset);
        $form.on('reload_product_variations', { variationForm: this }, this.onReload);
        $form.on('hide_variation', { variationForm: this }, this.onHide);
        $form.on('show_variation', { variationForm: this }, this.onShow);
        $form.on('click', '.single_add_to_cart_button', { variationForm: this }, this.onAddToCart);
        $form.on('reset_data', { variationForm: this }, this.onResetDisplayedVariation);
        $form.on('reset_image', { variationForm: this }, this.onResetImage);
        $form.on('change.wc-variation-form', '.variations select', { variationForm: this }, this.onChange);
        $form.on('found_variation.wc-variation-form', { variationForm: this }, this.onFoundVariation);
        $form.on('check_variations.wc-variation-form', { variationForm: this }, this.onFindVariation);
        $form.on('update_variation_values.wc-variation-form', { variationForm: this }, this.onUpdateAttributes);

        // WOO VARIATION GALLERY CHANGES
        this.init($form);
    };

    // After Gallery Init
    VariationForm.prototype.afterGalleryInit = function ($form) {
        setTimeout(function () {
            // $form.trigger('check_variations');
            $form.trigger('wc_variation_form');
            $form.loading = false;
        }, 100);
    };

    // Variation form events
    VariationForm.prototype.init = function ($form) {
        var _this = this;

        var product_id = $form.data('product_id');
        if (this.useAjax) {
            wp.ajax.send('wvs_get_available_variations', {
                data: {
                    product_id: product_id
                },
                success: function success(data) {
                    $form.data('product_variations', data);
                    _this.useAjax = false;

                    // Init after gallery.
                    _this.afterGalleryInit($form);
                },
                error: function error(e) {
                    // Init after gallery.
                    _this.afterGalleryInit($form);
                    console.error('Variation not available on variation id ' + product_id + '.');
                }
            });
        } else {
            // Init after gallery.
            this.afterGalleryInit($form);
        }
    };

    /**
     * Reset all fields.
     */
    VariationForm.prototype.onReset = function (event) {
        event.preventDefault();
        event.data.variationForm.$attributeFields.val('').change();
        event.data.variationForm.$form.trigger('reset_data');
    };

    /**
     * Reload variation data from the DOM.
     */
    VariationForm.prototype.onReload = function (event) {
        var form = event.data.variationForm;
        form.variationData = form.$form.data('product_variations');
        form.useAjax = false === form.variationData;
        form.$form.trigger('check_variations');
    };

    /**
     * When a variation is hidden.
     */
    VariationForm.prototype.onHide = function (event) {
        event.preventDefault();
        event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('wc-variation-is-unavailable').addClass('disabled wc-variation-selection-needed');
        event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-enabled').addClass('woocommerce-variation-add-to-cart-disabled');
    };

    /**
     * When a variation is shown.
     */
    VariationForm.prototype.onShow = function (event, variation, purchasable) {
        event.preventDefault();
        if (purchasable) {
            event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('disabled wc-variation-selection-needed wc-variation-is-unavailable');
            event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-disabled').addClass('woocommerce-variation-add-to-cart-enabled');
        } else {
            event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('wc-variation-selection-needed').addClass('disabled wc-variation-is-unavailable');
            event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-enabled').addClass('woocommerce-variation-add-to-cart-disabled');
        }
    };

    /**
     * When the cart button is pressed.
     */
    VariationForm.prototype.onAddToCart = function (event) {
        if ($(this).is('.disabled')) {
            event.preventDefault();

            if ($(this).is('.wc-variation-is-unavailable')) {
                window.alert(wc_add_to_cart_variation_params.i18n_unavailable_text);
            } else if ($(this).is('.wc-variation-selection-needed')) {
                window.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text);
            }
        }
    };

    /**
     * When displayed variation data is reset.
     */
    VariationForm.prototype.onResetDisplayedVariation = function (event) {
        var form = event.data.variationForm;
        form.$product.find('.product_meta').find('.sku').wc_reset_content();
        form.$product.find('.product_weight').wc_reset_content();
        form.$product.find('.product_dimensions').wc_reset_content();
        form.$form.trigger('reset_image');
        form.$singleVariation.slideUp(200).trigger('hide_variation');
    };

    /**
     * When the product image is reset.
     */
    VariationForm.prototype.onResetImage = function (event) {
        event.data.variationForm.$form.wc_variations_image_update(false);
    };

    /**
     * Looks for matching variations for current selected attributes.
     */
    VariationForm.prototype.onFindVariation = function (event) {
        var form = event.data.variationForm,
            attributes = form.getChosenAttributes(),
            currentAttributes = attributes.data;

        if (attributes.count === attributes.chosenCount) {
            if (form.useAjax) {
                if (form.xhr) {
                    form.xhr.abort();
                }
                form.$form.block({ message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });
                currentAttributes.product_id = parseInt(form.$form.data('product_id'), 10);
                currentAttributes.custom_data = form.$form.data('custom_data');
                form.xhr = $.ajax({
                    url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_variation'),
                    type: 'POST',
                    data: currentAttributes,
                    success: function success(variation) {
                        if (variation) {
                            form.$form.trigger('found_variation', [variation]);
                        } else {
                            form.$form.trigger('reset_data');
                            attributes.chosenCount = 0;

                            if (!form.loading) {
                                form.$form.find('.single_variation').after('<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>');
                                form.$form.find('.wc-no-matching-variations').slideDown(200);
                            }
                        }
                    },
                    complete: function complete() {
                        form.$form.unblock();
                    }
                });
            } else {
                form.$form.trigger('update_variation_values');

                var matching_variations = form.findMatchingVariations(form.variationData, currentAttributes),
                    variation = matching_variations.shift();

                if (variation) {
                    form.$form.trigger('found_variation', [variation]);
                } else {
                    form.$form.trigger('reset_data');
                    attributes.chosenCount = 0;

                    if (!form.loading) {
                        form.$form.find('.single_variation').after('<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>');
                        form.$form.find('.wc-no-matching-variations').slideDown(200);
                    }
                }
            }
        } else {
            form.$form.trigger('update_variation_values');
            form.$form.trigger('reset_data');
        }

        // Show reset link.
        form.toggleResetLink(attributes.chosenCount > 0);
    };

    /**
     * Triggered when a variation has been found which matches all attributes.
     */
    VariationForm.prototype.onFoundVariation = function (event, variation) {
        var form = event.data.variationForm,
            $sku = form.$product.find('.product_meta').find('.sku'),
            $weight = form.$product.find('.product_weight'),
            $dimensions = form.$product.find('.product_dimensions'),
            $qty = form.$singleVariationWrap.find('.quantity'),
            purchasable = true,
            variation_id = '',
            template = false,
            $template_html = '';

        if (variation.sku) {
            $sku.wc_set_content(variation.sku);
        } else {
            $sku.wc_reset_content();
        }

        if (variation.weight) {
            $weight.wc_set_content(variation.weight_html);
        } else {
            $weight.wc_reset_content();
        }

        if (variation.dimensions) {
            $dimensions.wc_set_content(variation.dimensions_html);
        } else {
            $dimensions.wc_reset_content();
        }

        form.$form.wc_variations_image_update(variation);

        if (!variation.variation_is_visible) {
            template = wp.template('unavailable-variation-template');
        } else {
            template = wp.template('variation-template');
            variation_id = variation.variation_id;
        }

        $template_html = template({
            variation: variation
        });
        $template_html = $template_html.replace('/*<![CDATA[*/', '');
        $template_html = $template_html.replace('/*]]>*/', '');

        form.$singleVariation.html($template_html);
        form.$form.find('input[name="variation_id"], input.variation_id').val(variation.variation_id).change();

        // Hide or show qty input
        if (variation.is_sold_individually === 'yes') {
            $qty.find('input.qty').val('1').attr('min', '1').attr('max', '');
            $qty.hide();
        } else {
            $qty.find('input.qty').attr('min', variation.min_qty).attr('max', variation.max_qty);
            $qty.show();
        }

        // Enable or disable the add to cart button
        if (!variation.is_purchasable || !variation.is_in_stock || !variation.variation_is_visible) {
            purchasable = false;
        }

        // Reveal
        if ($.trim(form.$singleVariation.text())) {
            form.$singleVariation.slideDown(200).trigger('show_variation', [variation, purchasable]);
        } else {
            form.$singleVariation.show().trigger('show_variation', [variation, purchasable]);
        }
    };

    /**
     * Triggered when an attribute field changes.
     */
    VariationForm.prototype.onChange = function (event) {
        var form = event.data.variationForm;

        form.$form.find('input[name="variation_id"], input.variation_id').val('').change();
        form.$form.find('.wc-no-matching-variations').remove();

        if (form.useAjax) {
            form.$form.trigger('check_variations');
        } else {
            form.$form.trigger('woocommerce_variation_select_change');
            form.$form.trigger('check_variations');
            $(this).blur();
        }

        // Custom event for when variation selection has been changed
        form.$form.trigger('woocommerce_variation_has_changed');
    };

    /**
     * Escape quotes in a string.
     * @param {string} string
     * @return {string}
     */
    VariationForm.prototype.addSlashes = function (string) {
        string = string.replace(/'/g, '\\\'');
        string = string.replace(/"/g, '\\\"');
        return string;
    };

    /**
     * Updates attributes in the DOM to show valid values.
     */
    VariationForm.prototype.onUpdateAttributes = function (event) {
        var form = event.data.variationForm,
            attributes = form.getChosenAttributes(),
            currentAttributes = attributes.data;

        if (form.useAjax) {
            return;
        }

        // Loop through selects and disable/enable options based on selections.
        form.$attributeFields.each(function (index, el) {
            var current_attr_select = $(el),
                current_attr_name = current_attr_select.data('attribute_name') || current_attr_select.attr('name'),
                show_option_none = $(el).data('show_option_none'),
                option_gt_filter = ':gt(0)',
                attached_options_count = 0,
                new_attr_select = $('<select/>'),
                selected_attr_val = current_attr_select.val() || '',
                selected_attr_val_valid = true;

            // Reference options set at first.
            if (!current_attr_select.data('attribute_html')) {
                var refSelect = current_attr_select.clone();

                refSelect.find('option').removeAttr('disabled attached').removeAttr('selected');

                current_attr_select.data('attribute_options', refSelect.find('option' + option_gt_filter).get()); // Legacy data attribute.
                current_attr_select.data('attribute_html', refSelect.html());
            }

            new_attr_select.html(current_attr_select.data('attribute_html'));

            // The attribute of this select field should not be taken into account when calculating its matching variations:
            // The constraints of this attribute are shaped by the values of the other attributes.
            var checkAttributes = $.extend(true, {}, currentAttributes);

            checkAttributes[current_attr_name] = '';

            var variations = form.findMatchingVariations(form.variationData, checkAttributes);

            // Loop through variations.
            for (var num in variations) {
                if (typeof variations[num] !== 'undefined') {
                    var variationAttributes = variations[num].attributes;

                    for (var attr_name in variationAttributes) {
                        if (variationAttributes.hasOwnProperty(attr_name)) {
                            var attr_val = variationAttributes[attr_name],
                                variation_active = '';

                            if (attr_name === current_attr_name) {
                                if (variations[num].variation_is_active) {
                                    variation_active = 'enabled';
                                }

                                if (attr_val) {
                                    // Decode entities and add slashes.
                                    attr_val = $('<div/>').html(attr_val).text();

                                    // Attach.
                                    new_attr_select.find('option[value="' + form.addSlashes(attr_val) + '"]').addClass('attached ' + variation_active);
                                } else {
                                    // Attach all apart from placeholder.
                                    new_attr_select.find('option:gt(0)').addClass('attached ' + variation_active);
                                }
                            }
                        }
                    }
                }
            }

            // Count available options.
            attached_options_count = new_attr_select.find('option.attached').length;

            // Check if current selection is in attached options.
            if (selected_attr_val && (attached_options_count === 0 || new_attr_select.find('option.attached.enabled[value="' + form.addSlashes(selected_attr_val) + '"]').length === 0)) {
                selected_attr_val_valid = false;
            }

            // Detach the placeholder if:
            // - Valid options exist.
            // - The current selection is non-empty.
            // - The current selection is valid.
            // - Placeholders are not set to be permanently visible.
            if (attached_options_count > 0 && selected_attr_val && selected_attr_val_valid && 'no' === show_option_none) {
                new_attr_select.find('option:first').remove();
                option_gt_filter = '';
            }

            // Detach unattached.
            new_attr_select.find('option' + option_gt_filter + ':not(.attached)').remove();

            // Finally, copy to DOM and set value.
            current_attr_select.html(new_attr_select.html());
            current_attr_select.find('option' + option_gt_filter + ':not(.enabled)').prop('disabled', true);

            // Choose selected value.
            if (selected_attr_val) {
                // If the previously selected value is no longer available, fall back to the placeholder (it's going to be there).
                if (selected_attr_val_valid) {
                    current_attr_select.val(selected_attr_val);
                } else {
                    current_attr_select.val('').change();
                }
            } else {
                current_attr_select.val(''); // No change event to prevent infinite loop.
            }
        });

        // Custom event for when variations have been updated.
        form.$form.trigger('woocommerce_update_variation_values');
    };

    /**
     * Get chosen attributes from form.
     * @return array
     */
    VariationForm.prototype.getChosenAttributes = function () {
        var data = {};
        var count = 0;
        var chosen = 0;

        this.$attributeFields.each(function () {
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
    };

    /**
     * Find matching variations for attributes.
     */
    VariationForm.prototype.findMatchingVariations = function (variations, attributes) {
        var matching = [];
        for (var i = 0; i < variations.length; i++) {
            var variation = variations[i];

            if (this.isMatch(variation.attributes, attributes)) {
                matching.push(variation);
            }
        }
        return matching;
    };

    /**
     * See if attributes match.
     * @return {Boolean}
     */
    VariationForm.prototype.isMatch = function (variation_attributes, attributes) {
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
    };

    /**
     * Show or hide the reset link.
     */
    VariationForm.prototype.toggleResetLink = function (on) {
        if (on) {
            if (this.$resetVariations.css('visibility') === 'hidden') {
                this.$resetVariations.css('visibility', 'visible').hide().fadeIn();
            }
        } else {
            this.$resetVariations.css('visibility', 'hidden');
        }
    };

    /**
     * Function to call wc_variation_form on jquery selector.
     */
    $.fn.wc_variation_form = function () {
        new VariationForm(this);
        return this;
    };

    /**
     * Stores the default text for an element so it can be reset later
     */
    $.fn.wc_set_content = function (content) {
        if (undefined === this.attr('data-o_content')) {
            this.attr('data-o_content', this.text());
        }
        this.text(content);
    };

    /**
     * Stores the default text for an element so it can be reset later
     */
    $.fn.wc_reset_content = function () {
        if (undefined !== this.attr('data-o_content')) {
            this.text(this.attr('data-o_content'));
        }
    };

    /**
     * Stores a default attribute for an element so it can be reset later
     */
    $.fn.wc_set_variation_attr = function (attr, value) {
        if (undefined === this.attr('data-o_' + attr)) {
            this.attr('data-o_' + attr, !this.attr(attr) ? '' : this.attr(attr));
        }
        if (false === value) {
            this.removeAttr(attr);
        } else {
            this.attr(attr, value);
        }
    };

    /**
     * Reset a default attribute for an element so it can be reset later
     */
    $.fn.wc_reset_variation_attr = function (attr) {
        if (undefined !== this.attr('data-o_' + attr)) {
            this.attr(attr, this.attr('data-o_' + attr));
        }
    };

    /**
     * Reset the slide position if the variation has a different image than the current one
     */
    $.fn.wc_maybe_trigger_slide_position_reset = function (variation) {
        var $form = $(this),
            $product = $form.closest('.product'),
            $product_gallery = $product.find('.images'),
            reset_slide_position = false,
            new_image_id = variation && variation.image_id ? variation.image_id : '';

        if ($form.attr('current-image') !== new_image_id) {
            reset_slide_position = true;
        }

        $form.attr('current-image', new_image_id);

        if (reset_slide_position) {
            $product_gallery.trigger('woocommerce_gallery_reset_slide_position');
        }
    };

    /**
     * Sets product images for the chosen variation
     */
    $.fn.wc_variations_image_update = function (variation) {
        var $form = this,
            $product = $form.closest('.product'),
            $product_gallery = $product.find('.images'),
            $gallery_nav = $product.find('.flex-control-nav'),
            $gallery_img = $gallery_nav.find('li:eq(0) img'),
            $product_img_wrap = $product_gallery.find('.woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder').eq(0),
            $product_img = $product_img_wrap.find('.wp-post-image'),
            $product_link = $product_img_wrap.find('a').eq(0);

        if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {
            // See if the gallery has an image with the same original src as the image we want to switch to.
            var galleryHasImage = $gallery_nav.find('li img[data-o_src="' + variation.image.gallery_thumbnail_src + '"]').length > 0;

            // If the gallery has the image, reset the images. We'll scroll to the correct one.
            if (galleryHasImage) {
                $form.wc_variations_image_reset();
            }

            // See if gallery has a matching image we can slide to.
            var slideToImage = $gallery_nav.find('li img[src="' + variation.image.gallery_thumbnail_src + '"]');

            if (slideToImage.length > 0) {
                slideToImage.trigger('click');
                $form.attr('current-image', variation.image_id);
                window.setTimeout(function () {
                    $(window).trigger('resize');
                    $product_gallery.trigger('woocommerce_gallery_init_zoom');
                }, 20);
                return;
            }

            $product_img.wc_set_variation_attr('src', variation.image.src);
            $product_img.wc_set_variation_attr('height', variation.image.src_h);
            $product_img.wc_set_variation_attr('width', variation.image.src_w);
            $product_img.wc_set_variation_attr('srcset', variation.image.srcset);
            $product_img.wc_set_variation_attr('sizes', variation.image.sizes);
            $product_img.wc_set_variation_attr('title', variation.image.title);
            $product_img.wc_set_variation_attr('alt', variation.image.alt);
            $product_img.wc_set_variation_attr('data-src', variation.image.full_src);
            $product_img.wc_set_variation_attr('data-large_image', variation.image.full_src);
            $product_img.wc_set_variation_attr('data-large_image_width', variation.image.full_src_w);
            $product_img.wc_set_variation_attr('data-large_image_height', variation.image.full_src_h);
            $product_img_wrap.wc_set_variation_attr('data-thumb', variation.image.src);
            $gallery_img.wc_set_variation_attr('src', variation.image.gallery_thumbnail_src);
            $product_link.wc_set_variation_attr('href', variation.image.full_src);
        } else {
            $form.wc_variations_image_reset();
        }

        window.setTimeout(function () {
            $(window).trigger('resize');
            $form.wc_maybe_trigger_slide_position_reset(variation);
            $product_gallery.trigger('woocommerce_gallery_init_zoom');
        }, 20);
    };

    /**
     * Reset main image to defaults.
     */
    $.fn.wc_variations_image_reset = function () {
        var $form = this,
            $product = $form.closest('.product'),
            $product_gallery = $product.find('.images'),
            $gallery_nav = $product.find('.flex-control-nav'),
            $gallery_img = $gallery_nav.find('li:eq(0) img'),
            $product_img_wrap = $product_gallery.find('.woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder').eq(0),
            $product_img = $product_img_wrap.find('.wp-post-image'),
            $product_link = $product_img_wrap.find('a').eq(0);

        $product_img.wc_reset_variation_attr('src');
        $product_img.wc_reset_variation_attr('width');
        $product_img.wc_reset_variation_attr('height');
        $product_img.wc_reset_variation_attr('srcset');
        $product_img.wc_reset_variation_attr('sizes');
        $product_img.wc_reset_variation_attr('title');
        $product_img.wc_reset_variation_attr('alt');
        $product_img.wc_reset_variation_attr('data-src');
        $product_img.wc_reset_variation_attr('data-large_image');
        $product_img.wc_reset_variation_attr('data-large_image_width');
        $product_img.wc_reset_variation_attr('data-large_image_height');
        $product_img_wrap.wc_reset_variation_attr('data-thumb');
        $gallery_img.wc_reset_variation_attr('src');
        $product_link.wc_reset_variation_attr('href');
    };

    $(function () {
        if (typeof wc_add_to_cart_variation_params !== 'undefined') {
            $('.variations_form').each(function () {
                $(this).wc_variation_form();
            });
        }
    });

    /**
     * Matches inline variation objects to chosen attributes
     * @deprecated 2.6.9
     * @type {Object}
     */
    var wc_variation_form_matcher = {
        find_matching_variations: function find_matching_variations(product_variations, settings) {
            var matching = [];
            for (var i = 0; i < product_variations.length; i++) {
                var variation = product_variations[i];

                if (wc_variation_form_matcher.variations_match(variation.attributes, settings)) {
                    matching.push(variation);
                }
            }
            return matching;
        },
        variations_match: function variations_match(attrs1, attrs2) {
            var match = true;
            for (var attr_name in attrs1) {
                if (attrs1.hasOwnProperty(attr_name)) {
                    var val1 = attrs1[attr_name];
                    var val2 = attrs2[attr_name];
                    if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
                        match = false;
                    }
                }
            }
            return match;
        }
    };
})(jQuery, window, document);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2FkZC10by1jYXJ0LXZhcmlhdGlvbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1OTg5YjQ4N2ExMWY0OTYxMTg5YyIsIndlYnBhY2s6Ly8vc3JjL2pzL2FkZC10by1jYXJ0LXZhcmlhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nzcy9mcm9udGVuZC5zY3NzPzQ0NWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Njc3MvdGhlbWUtb3ZlcnJpZGUuc2Nzcz8wODdmIiwid2VicGFjazovLy8uL3NyYy9zY3NzL2JhY2tlbmQuc2Nzcz9mYTY3Il0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDU5ODliNDg3YTExZjQ5NjExODljIiwiLypnbG9iYWwgd2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcywgd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19vcHRpb25zICovXG47KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICAvKipcbiAgICAgKiBWYXJpYXRpb25Gb3JtIGNsYXNzIHdoaWNoIGhhbmRsZXMgdmFyaWF0aW9uIGZvcm1zIGFuZCBhdHRyaWJ1dGVzLlxuICAgICAqL1xuICAgIHZhciBWYXJpYXRpb25Gb3JtID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgIHRoaXMuJGZvcm0gICAgICAgICAgICAgICAgPSAkZm9ybTtcbiAgICAgICAgdGhpcy4kYXR0cmlidXRlRmllbGRzICAgICA9ICRmb3JtLmZpbmQoJy52YXJpYXRpb25zIHNlbGVjdCcpO1xuICAgICAgICB0aGlzLiRzaW5nbGVWYXJpYXRpb24gICAgID0gJGZvcm0uZmluZCgnLnNpbmdsZV92YXJpYXRpb24nKTtcbiAgICAgICAgdGhpcy4kc2luZ2xlVmFyaWF0aW9uV3JhcCA9ICRmb3JtLmZpbmQoJy5zaW5nbGVfdmFyaWF0aW9uX3dyYXAnKTtcbiAgICAgICAgdGhpcy4kcmVzZXRWYXJpYXRpb25zICAgICA9ICRmb3JtLmZpbmQoJy5yZXNldF92YXJpYXRpb25zJyk7XG4gICAgICAgIHRoaXMuJHByb2R1Y3QgICAgICAgICAgICAgPSAkZm9ybS5jbG9zZXN0KCcucHJvZHVjdCcpO1xuICAgICAgICB0aGlzLnZhcmlhdGlvbkRhdGEgICAgICAgID0gJGZvcm0uZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJyk7XG4gICAgICAgIHRoaXMudXNlQWpheCAgICAgICAgICAgICAgPSBmYWxzZSA9PT0gdGhpcy52YXJpYXRpb25EYXRhO1xuICAgICAgICB0aGlzLnhociAgICAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9hZGluZyAgICAgICAgICAgICAgPSB0cnVlO1xuXG4gICAgICAgIC8vIEluaXRpYWwgc3RhdGUuXG4gICAgICAgIHRoaXMuJHNpbmdsZVZhcmlhdGlvbldyYXAuc2hvdygpO1xuICAgICAgICB0aGlzLiRmb3JtLm9mZignLndjLXZhcmlhdGlvbi1mb3JtJyk7XG5cbiAgICAgICAgLy8gTWV0aG9kcy5cbiAgICAgICAgdGhpcy5nZXRDaG9zZW5BdHRyaWJ1dGVzICAgID0gdGhpcy5nZXRDaG9zZW5BdHRyaWJ1dGVzLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZmluZE1hdGNoaW5nVmFyaWF0aW9ucyA9IHRoaXMuZmluZE1hdGNoaW5nVmFyaWF0aW9ucy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmlzTWF0Y2ggICAgICAgICAgICAgICAgPSB0aGlzLmlzTWF0Y2guYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50b2dnbGVSZXNldExpbmsgICAgICAgID0gdGhpcy50b2dnbGVSZXNldExpbmsuYmluZCh0aGlzKTtcblxuICAgICAgICAvLyBFdmVudHMuXG4gICAgICAgICRmb3JtLm9uKCdjbGljay53Yy12YXJpYXRpb24tZm9ybScsICcucmVzZXRfdmFyaWF0aW9ucycsIHt2YXJpYXRpb25Gb3JtIDogdGhpc30sIHRoaXMub25SZXNldCk7XG4gICAgICAgICRmb3JtLm9uKCdyZWxvYWRfcHJvZHVjdF92YXJpYXRpb25zJywge3ZhcmlhdGlvbkZvcm0gOiB0aGlzfSwgdGhpcy5vblJlbG9hZCk7XG4gICAgICAgICRmb3JtLm9uKCdoaWRlX3ZhcmlhdGlvbicsIHt2YXJpYXRpb25Gb3JtIDogdGhpc30sIHRoaXMub25IaWRlKTtcbiAgICAgICAgJGZvcm0ub24oJ3Nob3dfdmFyaWF0aW9uJywge3ZhcmlhdGlvbkZvcm0gOiB0aGlzfSwgdGhpcy5vblNob3cpO1xuICAgICAgICAkZm9ybS5vbignY2xpY2snLCAnLnNpbmdsZV9hZGRfdG9fY2FydF9idXR0b24nLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXN9LCB0aGlzLm9uQWRkVG9DYXJ0KTtcbiAgICAgICAgJGZvcm0ub24oJ3Jlc2V0X2RhdGEnLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXN9LCB0aGlzLm9uUmVzZXREaXNwbGF5ZWRWYXJpYXRpb24pO1xuICAgICAgICAkZm9ybS5vbigncmVzZXRfaW1hZ2UnLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXN9LCB0aGlzLm9uUmVzZXRJbWFnZSk7XG4gICAgICAgICRmb3JtLm9uKCdjaGFuZ2Uud2MtdmFyaWF0aW9uLWZvcm0nLCAnLnZhcmlhdGlvbnMgc2VsZWN0Jywge3ZhcmlhdGlvbkZvcm0gOiB0aGlzfSwgdGhpcy5vbkNoYW5nZSk7XG4gICAgICAgICRmb3JtLm9uKCdmb3VuZF92YXJpYXRpb24ud2MtdmFyaWF0aW9uLWZvcm0nLCB7dmFyaWF0aW9uRm9ybSA6IHRoaXN9LCB0aGlzLm9uRm91bmRWYXJpYXRpb24pO1xuICAgICAgICAkZm9ybS5vbignY2hlY2tfdmFyaWF0aW9ucy53Yy12YXJpYXRpb24tZm9ybScsIHt2YXJpYXRpb25Gb3JtIDogdGhpc30sIHRoaXMub25GaW5kVmFyaWF0aW9uKTtcbiAgICAgICAgJGZvcm0ub24oJ3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzLndjLXZhcmlhdGlvbi1mb3JtJywge3ZhcmlhdGlvbkZvcm0gOiB0aGlzfSwgdGhpcy5vblVwZGF0ZUF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIC8vIFdPTyBWQVJJQVRJT04gR0FMTEVSWSBDSEFOR0VTXG4gICAgICAgIHRoaXMuaW5pdCgkZm9ybSlcbiAgICB9O1xuXG4gICAgLy8gQWZ0ZXIgR2FsbGVyeSBJbml0XG4gICAgVmFyaWF0aW9uRm9ybS5wcm90b3R5cGUuYWZ0ZXJHYWxsZXJ5SW5pdCA9IGZ1bmN0aW9uICgkZm9ybSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICRmb3JtLnRyaWdnZXIoJ2NoZWNrX3ZhcmlhdGlvbnMnKTtcbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ3djX3ZhcmlhdGlvbl9mb3JtJyk7XG4gICAgICAgICAgICAkZm9ybS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgfTtcblxuICAgIC8vIFZhcmlhdGlvbiBmb3JtIGV2ZW50c1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoJGZvcm0pIHtcblxuICAgICAgICBsZXQgcHJvZHVjdF9pZCA9ICRmb3JtLmRhdGEoJ3Byb2R1Y3RfaWQnKTtcbiAgICAgICAgaWYgKHRoaXMudXNlQWpheCkge1xuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3dnNfZ2V0X2F2YWlsYWJsZV92YXJpYXRpb25zJywge1xuICAgICAgICAgICAgICAgIGRhdGEgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VBamF4ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5pdCBhZnRlciBnYWxsZXJ5LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFmdGVyR2FsbGVyeUluaXQoJGZvcm0pO1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciAgIDogKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5pdCBhZnRlciBnYWxsZXJ5LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFmdGVyR2FsbGVyeUluaXQoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBWYXJpYXRpb24gbm90IGF2YWlsYWJsZSBvbiB2YXJpYXRpb24gaWQgJHtwcm9kdWN0X2lkfS5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluaXQgYWZ0ZXIgZ2FsbGVyeS5cbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJHYWxsZXJ5SW5pdCgkZm9ybSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzZXQgYWxsIGZpZWxkcy5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5vblJlc2V0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LmRhdGEudmFyaWF0aW9uRm9ybS4kYXR0cmlidXRlRmllbGRzLnZhbCgnJykuY2hhbmdlKCk7XG4gICAgICAgIGV2ZW50LmRhdGEudmFyaWF0aW9uRm9ybS4kZm9ybS50cmlnZ2VyKCdyZXNldF9kYXRhJyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbG9hZCB2YXJpYXRpb24gZGF0YSBmcm9tIHRoZSBET00uXG4gICAgICovXG4gICAgVmFyaWF0aW9uRm9ybS5wcm90b3R5cGUub25SZWxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGZvcm0gICAgICAgICAgID0gZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtO1xuICAgICAgICBmb3JtLnZhcmlhdGlvbkRhdGEgPSBmb3JtLiRmb3JtLmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9ucycpO1xuICAgICAgICBmb3JtLnVzZUFqYXggICAgICAgPSBmYWxzZSA9PT0gZm9ybS52YXJpYXRpb25EYXRhO1xuICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ2NoZWNrX3ZhcmlhdGlvbnMnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBhIHZhcmlhdGlvbiBpcyBoaWRkZW4uXG4gICAgICovXG4gICAgVmFyaWF0aW9uRm9ybS5wcm90b3R5cGUub25IaWRlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LmRhdGEudmFyaWF0aW9uRm9ybS4kZm9ybS5maW5kKCcuc2luZ2xlX2FkZF90b19jYXJ0X2J1dHRvbicpLnJlbW92ZUNsYXNzKCd3Yy12YXJpYXRpb24taXMtdW5hdmFpbGFibGUnKS5hZGRDbGFzcygnZGlzYWJsZWQgd2MtdmFyaWF0aW9uLXNlbGVjdGlvbi1uZWVkZWQnKTtcbiAgICAgICAgZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtLiRmb3JtLmZpbmQoJy53b29jb21tZXJjZS12YXJpYXRpb24tYWRkLXRvLWNhcnQnKS5yZW1vdmVDbGFzcygnd29vY29tbWVyY2UtdmFyaWF0aW9uLWFkZC10by1jYXJ0LWVuYWJsZWQnKS5hZGRDbGFzcygnd29vY29tbWVyY2UtdmFyaWF0aW9uLWFkZC10by1jYXJ0LWRpc2FibGVkJyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYSB2YXJpYXRpb24gaXMgc2hvd24uXG4gICAgICovXG4gICAgVmFyaWF0aW9uRm9ybS5wcm90b3R5cGUub25TaG93ID0gZnVuY3Rpb24gKGV2ZW50LCB2YXJpYXRpb24sIHB1cmNoYXNhYmxlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChwdXJjaGFzYWJsZSkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtLiRmb3JtLmZpbmQoJy5zaW5nbGVfYWRkX3RvX2NhcnRfYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIHdjLXZhcmlhdGlvbi1zZWxlY3Rpb24tbmVlZGVkIHdjLXZhcmlhdGlvbi1pcy11bmF2YWlsYWJsZScpO1xuICAgICAgICAgICAgZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtLiRmb3JtLmZpbmQoJy53b29jb21tZXJjZS12YXJpYXRpb24tYWRkLXRvLWNhcnQnKS5yZW1vdmVDbGFzcygnd29vY29tbWVyY2UtdmFyaWF0aW9uLWFkZC10by1jYXJ0LWRpc2FibGVkJykuYWRkQ2xhc3MoJ3dvb2NvbW1lcmNlLXZhcmlhdGlvbi1hZGQtdG8tY2FydC1lbmFibGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLnZhcmlhdGlvbkZvcm0uJGZvcm0uZmluZCgnLnNpbmdsZV9hZGRfdG9fY2FydF9idXR0b24nKS5yZW1vdmVDbGFzcygnd2MtdmFyaWF0aW9uLXNlbGVjdGlvbi1uZWVkZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQgd2MtdmFyaWF0aW9uLWlzLXVuYXZhaWxhYmxlJyk7XG4gICAgICAgICAgICBldmVudC5kYXRhLnZhcmlhdGlvbkZvcm0uJGZvcm0uZmluZCgnLndvb2NvbW1lcmNlLXZhcmlhdGlvbi1hZGQtdG8tY2FydCcpLnJlbW92ZUNsYXNzKCd3b29jb21tZXJjZS12YXJpYXRpb24tYWRkLXRvLWNhcnQtZW5hYmxlZCcpLmFkZENsYXNzKCd3b29jb21tZXJjZS12YXJpYXRpb24tYWRkLXRvLWNhcnQtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHRoZSBjYXJ0IGJ1dHRvbiBpcyBwcmVzc2VkLlxuICAgICAqL1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLm9uQWRkVG9DYXJ0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmlzKCcuZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJy53Yy12YXJpYXRpb24taXMtdW5hdmFpbGFibGUnKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCh3Y19hZGRfdG9fY2FydF92YXJpYXRpb25fcGFyYW1zLmkxOG5fdW5hdmFpbGFibGVfdGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgkKHRoaXMpLmlzKCcud2MtdmFyaWF0aW9uLXNlbGVjdGlvbi1uZWVkZWQnKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCh3Y19hZGRfdG9fY2FydF92YXJpYXRpb25fcGFyYW1zLmkxOG5fbWFrZV9hX3NlbGVjdGlvbl90ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRpc3BsYXllZCB2YXJpYXRpb24gZGF0YSBpcyByZXNldC5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5vblJlc2V0RGlzcGxheWVkVmFyaWF0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBmb3JtID0gZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtO1xuICAgICAgICBmb3JtLiRwcm9kdWN0LmZpbmQoJy5wcm9kdWN0X21ldGEnKS5maW5kKCcuc2t1Jykud2NfcmVzZXRfY29udGVudCgpO1xuICAgICAgICBmb3JtLiRwcm9kdWN0LmZpbmQoJy5wcm9kdWN0X3dlaWdodCcpLndjX3Jlc2V0X2NvbnRlbnQoKTtcbiAgICAgICAgZm9ybS4kcHJvZHVjdC5maW5kKCcucHJvZHVjdF9kaW1lbnNpb25zJykud2NfcmVzZXRfY29udGVudCgpO1xuICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3Jlc2V0X2ltYWdlJyk7XG4gICAgICAgIGZvcm0uJHNpbmdsZVZhcmlhdGlvbi5zbGlkZVVwKDIwMCkudHJpZ2dlcignaGlkZV92YXJpYXRpb24nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiB0aGUgcHJvZHVjdCBpbWFnZSBpcyByZXNldC5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5vblJlc2V0SW1hZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtLiRmb3JtLndjX3ZhcmlhdGlvbnNfaW1hZ2VfdXBkYXRlKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTG9va3MgZm9yIG1hdGNoaW5nIHZhcmlhdGlvbnMgZm9yIGN1cnJlbnQgc2VsZWN0ZWQgYXR0cmlidXRlcy5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5vbkZpbmRWYXJpYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGZvcm0gICAgICAgICAgICAgID0gZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtLFxuICAgICAgICAgICAgYXR0cmlidXRlcyAgICAgICAgPSBmb3JtLmdldENob3NlbkF0dHJpYnV0ZXMoKSxcbiAgICAgICAgICAgIGN1cnJlbnRBdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5kYXRhO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmNvdW50ID09PSBhdHRyaWJ1dGVzLmNob3NlbkNvdW50KSB7XG4gICAgICAgICAgICBpZiAoZm9ybS51c2VBamF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm0ueGhyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm0ueGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvcm0uJGZvcm0uYmxvY2soe21lc3NhZ2UgOiBudWxsLCBvdmVybGF5Q1NTIDoge2JhY2tncm91bmQgOiAnI2ZmZicsIG9wYWNpdHkgOiAwLjZ9fSk7XG4gICAgICAgICAgICAgICAgY3VycmVudEF0dHJpYnV0ZXMucHJvZHVjdF9pZCAgPSBwYXJzZUludChmb3JtLiRmb3JtLmRhdGEoJ3Byb2R1Y3RfaWQnKSwgMTApO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRBdHRyaWJ1dGVzLmN1c3RvbV9kYXRhID0gZm9ybS4kZm9ybS5kYXRhKCdjdXN0b21fZGF0YScpO1xuICAgICAgICAgICAgICAgIGZvcm0ueGhyICAgICAgICAgICAgICAgICAgICAgID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsICAgICAgOiB3Y19hZGRfdG9fY2FydF92YXJpYXRpb25fcGFyYW1zLndjX2FqYXhfdXJsLnRvU3RyaW5nKCkucmVwbGFjZSgnJSVlbmRwb2ludCUlJywgJ2dldF92YXJpYXRpb24nKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgICAgIDogY3VycmVudEF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgIDogZnVuY3Rpb24gKHZhcmlhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0uJGZvcm0udHJpZ2dlcignZm91bmRfdmFyaWF0aW9uJywgW3ZhcmlhdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS4kZm9ybS50cmlnZ2VyKCdyZXNldF9kYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jaG9zZW5Db3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcm0ubG9hZGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLiRmb3JtLmZpbmQoJy5zaW5nbGVfdmFyaWF0aW9uJykuYWZ0ZXIoJzxwIGNsYXNzPVwid2Mtbm8tbWF0Y2hpbmctdmFyaWF0aW9ucyB3b29jb21tZXJjZS1pbmZvXCI+JyArIHdjX2FkZF90b19jYXJ0X3ZhcmlhdGlvbl9wYXJhbXMuaTE4bl9ub19tYXRjaGluZ192YXJpYXRpb25zX3RleHQgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLiRmb3JtLmZpbmQoJy53Yy1uby1tYXRjaGluZy12YXJpYXRpb25zJykuc2xpZGVEb3duKDIwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0uJGZvcm0udW5ibG9jaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hpbmdfdmFyaWF0aW9ucyA9IGZvcm0uZmluZE1hdGNoaW5nVmFyaWF0aW9ucyhmb3JtLnZhcmlhdGlvbkRhdGEsIGN1cnJlbnRBdHRyaWJ1dGVzKSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWF0aW9uICAgICAgICAgICA9IG1hdGNoaW5nX3ZhcmlhdGlvbnMuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YXJpYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybS4kZm9ybS50cmlnZ2VyKCdmb3VuZF92YXJpYXRpb24nLCBbdmFyaWF0aW9uXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3Jlc2V0X2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5jaG9zZW5Db3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3JtLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0uJGZvcm0uZmluZCgnLnNpbmdsZV92YXJpYXRpb24nKS5hZnRlcignPHAgY2xhc3M9XCJ3Yy1uby1tYXRjaGluZy12YXJpYXRpb25zIHdvb2NvbW1lcmNlLWluZm9cIj4nICsgd2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcy5pMThuX25vX21hdGNoaW5nX3ZhcmlhdGlvbnNfdGV4dCArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtLiRmb3JtLmZpbmQoJy53Yy1uby1tYXRjaGluZy12YXJpYXRpb25zJykuc2xpZGVEb3duKDIwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzJyk7XG4gICAgICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3Jlc2V0X2RhdGEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNob3cgcmVzZXQgbGluay5cbiAgICAgICAgZm9ybS50b2dnbGVSZXNldExpbmsoYXR0cmlidXRlcy5jaG9zZW5Db3VudCA+IDApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgd2hlbiBhIHZhcmlhdGlvbiBoYXMgYmVlbiBmb3VuZCB3aGljaCBtYXRjaGVzIGFsbCBhdHRyaWJ1dGVzLlxuICAgICAqL1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLm9uRm91bmRWYXJpYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQsIHZhcmlhdGlvbikge1xuICAgICAgICB2YXIgZm9ybSAgICAgICAgICAgPSBldmVudC5kYXRhLnZhcmlhdGlvbkZvcm0sXG4gICAgICAgICAgICAkc2t1ICAgICAgICAgICA9IGZvcm0uJHByb2R1Y3QuZmluZCgnLnByb2R1Y3RfbWV0YScpLmZpbmQoJy5za3UnKSxcbiAgICAgICAgICAgICR3ZWlnaHQgICAgICAgID0gZm9ybS4kcHJvZHVjdC5maW5kKCcucHJvZHVjdF93ZWlnaHQnKSxcbiAgICAgICAgICAgICRkaW1lbnNpb25zICAgID0gZm9ybS4kcHJvZHVjdC5maW5kKCcucHJvZHVjdF9kaW1lbnNpb25zJyksXG4gICAgICAgICAgICAkcXR5ICAgICAgICAgICA9IGZvcm0uJHNpbmdsZVZhcmlhdGlvbldyYXAuZmluZCgnLnF1YW50aXR5JyksXG4gICAgICAgICAgICBwdXJjaGFzYWJsZSAgICA9IHRydWUsXG4gICAgICAgICAgICB2YXJpYXRpb25faWQgICA9ICcnLFxuICAgICAgICAgICAgdGVtcGxhdGUgICAgICAgPSBmYWxzZSxcbiAgICAgICAgICAgICR0ZW1wbGF0ZV9odG1sID0gJyc7XG5cbiAgICAgICAgaWYgKHZhcmlhdGlvbi5za3UpIHtcbiAgICAgICAgICAgICRza3Uud2Nfc2V0X2NvbnRlbnQodmFyaWF0aW9uLnNrdSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkc2t1LndjX3Jlc2V0X2NvbnRlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJpYXRpb24ud2VpZ2h0KSB7XG4gICAgICAgICAgICAkd2VpZ2h0LndjX3NldF9jb250ZW50KHZhcmlhdGlvbi53ZWlnaHRfaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkd2VpZ2h0LndjX3Jlc2V0X2NvbnRlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJpYXRpb24uZGltZW5zaW9ucykge1xuICAgICAgICAgICAgJGRpbWVuc2lvbnMud2Nfc2V0X2NvbnRlbnQodmFyaWF0aW9uLmRpbWVuc2lvbnNfaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZGltZW5zaW9ucy53Y19yZXNldF9jb250ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtLiRmb3JtLndjX3ZhcmlhdGlvbnNfaW1hZ2VfdXBkYXRlKHZhcmlhdGlvbik7XG5cbiAgICAgICAgaWYgKCF2YXJpYXRpb24udmFyaWF0aW9uX2lzX3Zpc2libGUpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gd3AudGVtcGxhdGUoJ3VuYXZhaWxhYmxlLXZhcmlhdGlvbi10ZW1wbGF0ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGUgICAgID0gd3AudGVtcGxhdGUoJ3ZhcmlhdGlvbi10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgdmFyaWF0aW9uX2lkID0gdmFyaWF0aW9uLnZhcmlhdGlvbl9pZDtcbiAgICAgICAgfVxuXG4gICAgICAgICR0ZW1wbGF0ZV9odG1sID0gdGVtcGxhdGUoe1xuICAgICAgICAgICAgdmFyaWF0aW9uIDogdmFyaWF0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICAkdGVtcGxhdGVfaHRtbCA9ICR0ZW1wbGF0ZV9odG1sLnJlcGxhY2UoJy8qPCFbQ0RBVEFbKi8nLCAnJyk7XG4gICAgICAgICR0ZW1wbGF0ZV9odG1sID0gJHRlbXBsYXRlX2h0bWwucmVwbGFjZSgnLypdXT4qLycsICcnKTtcblxuICAgICAgICBmb3JtLiRzaW5nbGVWYXJpYXRpb24uaHRtbCgkdGVtcGxhdGVfaHRtbCk7XG4gICAgICAgIGZvcm0uJGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cInZhcmlhdGlvbl9pZFwiXSwgaW5wdXQudmFyaWF0aW9uX2lkJykudmFsKHZhcmlhdGlvbi52YXJpYXRpb25faWQpLmNoYW5nZSgpO1xuXG4gICAgICAgIC8vIEhpZGUgb3Igc2hvdyBxdHkgaW5wdXRcbiAgICAgICAgaWYgKHZhcmlhdGlvbi5pc19zb2xkX2luZGl2aWR1YWxseSA9PT0gJ3llcycpIHtcbiAgICAgICAgICAgICRxdHkuZmluZCgnaW5wdXQucXR5JykudmFsKCcxJykuYXR0cignbWluJywgJzEnKS5hdHRyKCdtYXgnLCAnJyk7XG4gICAgICAgICAgICAkcXR5LmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRxdHkuZmluZCgnaW5wdXQucXR5JykuYXR0cignbWluJywgdmFyaWF0aW9uLm1pbl9xdHkpLmF0dHIoJ21heCcsIHZhcmlhdGlvbi5tYXhfcXR5KTtcbiAgICAgICAgICAgICRxdHkuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5hYmxlIG9yIGRpc2FibGUgdGhlIGFkZCB0byBjYXJ0IGJ1dHRvblxuICAgICAgICBpZiAoIXZhcmlhdGlvbi5pc19wdXJjaGFzYWJsZSB8fCAhdmFyaWF0aW9uLmlzX2luX3N0b2NrIHx8ICF2YXJpYXRpb24udmFyaWF0aW9uX2lzX3Zpc2libGUpIHtcbiAgICAgICAgICAgIHB1cmNoYXNhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXZlYWxcbiAgICAgICAgaWYgKCQudHJpbShmb3JtLiRzaW5nbGVWYXJpYXRpb24udGV4dCgpKSkge1xuICAgICAgICAgICAgZm9ybS4kc2luZ2xlVmFyaWF0aW9uLnNsaWRlRG93bigyMDApLnRyaWdnZXIoJ3Nob3dfdmFyaWF0aW9uJywgW3ZhcmlhdGlvbiwgcHVyY2hhc2FibGVdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0uJHNpbmdsZVZhcmlhdGlvbi5zaG93KCkudHJpZ2dlcignc2hvd192YXJpYXRpb24nLCBbdmFyaWF0aW9uLCBwdXJjaGFzYWJsZV0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJlZCB3aGVuIGFuIGF0dHJpYnV0ZSBmaWVsZCBjaGFuZ2VzLlxuICAgICAqL1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLm9uQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBmb3JtID0gZXZlbnQuZGF0YS52YXJpYXRpb25Gb3JtO1xuXG4gICAgICAgIGZvcm0uJGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cInZhcmlhdGlvbl9pZFwiXSwgaW5wdXQudmFyaWF0aW9uX2lkJykudmFsKCcnKS5jaGFuZ2UoKTtcbiAgICAgICAgZm9ybS4kZm9ybS5maW5kKCcud2Mtbm8tbWF0Y2hpbmctdmFyaWF0aW9ucycpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChmb3JtLnVzZUFqYXgpIHtcbiAgICAgICAgICAgIGZvcm0uJGZvcm0udHJpZ2dlcignY2hlY2tfdmFyaWF0aW9ucycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9ybS4kZm9ybS50cmlnZ2VyKCd3b29jb21tZXJjZV92YXJpYXRpb25fc2VsZWN0X2NoYW5nZScpO1xuICAgICAgICAgICAgZm9ybS4kZm9ybS50cmlnZ2VyKCdjaGVja192YXJpYXRpb25zJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmJsdXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEN1c3RvbSBldmVudCBmb3Igd2hlbiB2YXJpYXRpb24gc2VsZWN0aW9uIGhhcyBiZWVuIGNoYW5nZWRcbiAgICAgICAgZm9ybS4kZm9ybS50cmlnZ2VyKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXNjYXBlIHF1b3RlcyBpbiBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLmFkZFNsYXNoZXMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC8nL2csICdcXFxcXFwnJyk7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cIi9nLCAnXFxcXFxcXCInKTtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBhdHRyaWJ1dGVzIGluIHRoZSBET00gdG8gc2hvdyB2YWxpZCB2YWx1ZXMuXG4gICAgICovXG4gICAgVmFyaWF0aW9uRm9ybS5wcm90b3R5cGUub25VcGRhdGVBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBmb3JtICAgICAgICAgICAgICA9IGV2ZW50LmRhdGEudmFyaWF0aW9uRm9ybSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgICAgICAgID0gZm9ybS5nZXRDaG9zZW5BdHRyaWJ1dGVzKCksXG4gICAgICAgICAgICBjdXJyZW50QXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuZGF0YTtcblxuICAgICAgICBpZiAoZm9ybS51c2VBamF4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggc2VsZWN0cyBhbmQgZGlzYWJsZS9lbmFibGUgb3B0aW9ucyBiYXNlZCBvbiBzZWxlY3Rpb25zLlxuICAgICAgICBmb3JtLiRhdHRyaWJ1dGVGaWVsZHMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF9hdHRyX3NlbGVjdCAgICAgPSAkKGVsKSxcbiAgICAgICAgICAgICAgICBjdXJyZW50X2F0dHJfbmFtZSAgICAgICA9IGN1cnJlbnRfYXR0cl9zZWxlY3QuZGF0YSgnYXR0cmlidXRlX25hbWUnKSB8fCBjdXJyZW50X2F0dHJfc2VsZWN0LmF0dHIoJ25hbWUnKSxcbiAgICAgICAgICAgICAgICBzaG93X29wdGlvbl9ub25lICAgICAgICA9ICQoZWwpLmRhdGEoJ3Nob3dfb3B0aW9uX25vbmUnKSxcbiAgICAgICAgICAgICAgICBvcHRpb25fZ3RfZmlsdGVyICAgICAgICA9ICc6Z3QoMCknLFxuICAgICAgICAgICAgICAgIGF0dGFjaGVkX29wdGlvbnNfY291bnQgID0gMCxcbiAgICAgICAgICAgICAgICBuZXdfYXR0cl9zZWxlY3QgICAgICAgICA9ICQoJzxzZWxlY3QvPicpLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJfdmFsICAgICAgID0gY3VycmVudF9hdHRyX3NlbGVjdC52YWwoKSB8fCAnJyxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyX3ZhbF92YWxpZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZSBvcHRpb25zIHNldCBhdCBmaXJzdC5cbiAgICAgICAgICAgIGlmICghY3VycmVudF9hdHRyX3NlbGVjdC5kYXRhKCdhdHRyaWJ1dGVfaHRtbCcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZlNlbGVjdCA9IGN1cnJlbnRfYXR0cl9zZWxlY3QuY2xvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJlZlNlbGVjdC5maW5kKCdvcHRpb24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCBhdHRhY2hlZCcpLnJlbW92ZUF0dHIoJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50X2F0dHJfc2VsZWN0LmRhdGEoJ2F0dHJpYnV0ZV9vcHRpb25zJywgcmVmU2VsZWN0LmZpbmQoJ29wdGlvbicgKyBvcHRpb25fZ3RfZmlsdGVyKS5nZXQoKSk7IC8vIExlZ2FjeSBkYXRhIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAgICBjdXJyZW50X2F0dHJfc2VsZWN0LmRhdGEoJ2F0dHJpYnV0ZV9odG1sJywgcmVmU2VsZWN0Lmh0bWwoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld19hdHRyX3NlbGVjdC5odG1sKGN1cnJlbnRfYXR0cl9zZWxlY3QuZGF0YSgnYXR0cmlidXRlX2h0bWwnKSk7XG5cbiAgICAgICAgICAgIC8vIFRoZSBhdHRyaWJ1dGUgb2YgdGhpcyBzZWxlY3QgZmllbGQgc2hvdWxkIG5vdCBiZSB0YWtlbiBpbnRvIGFjY291bnQgd2hlbiBjYWxjdWxhdGluZyBpdHMgbWF0Y2hpbmcgdmFyaWF0aW9uczpcbiAgICAgICAgICAgIC8vIFRoZSBjb25zdHJhaW50cyBvZiB0aGlzIGF0dHJpYnV0ZSBhcmUgc2hhcGVkIGJ5IHRoZSB2YWx1ZXMgb2YgdGhlIG90aGVyIGF0dHJpYnV0ZXMuXG4gICAgICAgICAgICB2YXIgY2hlY2tBdHRyaWJ1dGVzID0gJC5leHRlbmQodHJ1ZSwge30sIGN1cnJlbnRBdHRyaWJ1dGVzKTtcblxuICAgICAgICAgICAgY2hlY2tBdHRyaWJ1dGVzW2N1cnJlbnRfYXR0cl9uYW1lXSA9ICcnO1xuXG4gICAgICAgICAgICB2YXIgdmFyaWF0aW9ucyA9IGZvcm0uZmluZE1hdGNoaW5nVmFyaWF0aW9ucyhmb3JtLnZhcmlhdGlvbkRhdGEsIGNoZWNrQXR0cmlidXRlcyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB2YXJpYXRpb25zLlxuICAgICAgICAgICAgZm9yICh2YXIgbnVtIGluIHZhcmlhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHZhcmlhdGlvbnNbbnVtXSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YXJpYXRpb25BdHRyaWJ1dGVzID0gdmFyaWF0aW9uc1tudW1dLmF0dHJpYnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYXR0cl9uYW1lIGluIHZhcmlhdGlvbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYXRpb25BdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHJfbmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cl92YWwgICAgICAgICA9IHZhcmlhdGlvbkF0dHJpYnV0ZXNbYXR0cl9uYW1lXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWF0aW9uX2FjdGl2ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJfbmFtZSA9PT0gY3VycmVudF9hdHRyX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbnNbbnVtXS52YXJpYXRpb25faXNfYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYXRpb25fYWN0aXZlID0gJ2VuYWJsZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJfdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWNvZGUgZW50aXRpZXMgYW5kIGFkZCBzbGFzaGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cl92YWwgPSAkKCc8ZGl2Lz4nKS5odG1sKGF0dHJfdmFsKS50ZXh0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF0dGFjaC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19hdHRyX3NlbGVjdC5maW5kKCdvcHRpb25bdmFsdWU9XCInICsgZm9ybS5hZGRTbGFzaGVzKGF0dHJfdmFsKSArICdcIl0nKS5hZGRDbGFzcygnYXR0YWNoZWQgJyArIHZhcmlhdGlvbl9hY3RpdmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXR0YWNoIGFsbCBhcGFydCBmcm9tIHBsYWNlaG9sZGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2F0dHJfc2VsZWN0LmZpbmQoJ29wdGlvbjpndCgwKScpLmFkZENsYXNzKCdhdHRhY2hlZCAnICsgdmFyaWF0aW9uX2FjdGl2ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvdW50IGF2YWlsYWJsZSBvcHRpb25zLlxuICAgICAgICAgICAgYXR0YWNoZWRfb3B0aW9uc19jb3VudCA9IG5ld19hdHRyX3NlbGVjdC5maW5kKCdvcHRpb24uYXR0YWNoZWQnKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGluIGF0dGFjaGVkIG9wdGlvbnMuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRfYXR0cl92YWwgJiYgKGF0dGFjaGVkX29wdGlvbnNfY291bnQgPT09IDAgfHwgbmV3X2F0dHJfc2VsZWN0LmZpbmQoJ29wdGlvbi5hdHRhY2hlZC5lbmFibGVkW3ZhbHVlPVwiJyArIGZvcm0uYWRkU2xhc2hlcyhzZWxlY3RlZF9hdHRyX3ZhbCkgKyAnXCJdJykubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJfdmFsX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERldGFjaCB0aGUgcGxhY2Vob2xkZXIgaWY6XG4gICAgICAgICAgICAvLyAtIFZhbGlkIG9wdGlvbnMgZXhpc3QuXG4gICAgICAgICAgICAvLyAtIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBub24tZW1wdHkuXG4gICAgICAgICAgICAvLyAtIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgICAgIC8vIC0gUGxhY2Vob2xkZXJzIGFyZSBub3Qgc2V0IHRvIGJlIHBlcm1hbmVudGx5IHZpc2libGUuXG4gICAgICAgICAgICBpZiAoYXR0YWNoZWRfb3B0aW9uc19jb3VudCA+IDAgJiYgc2VsZWN0ZWRfYXR0cl92YWwgJiYgc2VsZWN0ZWRfYXR0cl92YWxfdmFsaWQgJiYgKCdubycgPT09IHNob3dfb3B0aW9uX25vbmUpKSB7XG4gICAgICAgICAgICAgICAgbmV3X2F0dHJfc2VsZWN0LmZpbmQoJ29wdGlvbjpmaXJzdCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIG9wdGlvbl9ndF9maWx0ZXIgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGV0YWNoIHVuYXR0YWNoZWQuXG4gICAgICAgICAgICBuZXdfYXR0cl9zZWxlY3QuZmluZCgnb3B0aW9uJyArIG9wdGlvbl9ndF9maWx0ZXIgKyAnOm5vdCguYXR0YWNoZWQpJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIEZpbmFsbHksIGNvcHkgdG8gRE9NIGFuZCBzZXQgdmFsdWUuXG4gICAgICAgICAgICBjdXJyZW50X2F0dHJfc2VsZWN0Lmh0bWwobmV3X2F0dHJfc2VsZWN0Lmh0bWwoKSk7XG4gICAgICAgICAgICBjdXJyZW50X2F0dHJfc2VsZWN0LmZpbmQoJ29wdGlvbicgKyBvcHRpb25fZ3RfZmlsdGVyICsgJzpub3QoLmVuYWJsZWQpJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gQ2hvb3NlIHNlbGVjdGVkIHZhbHVlLlxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkX2F0dHJfdmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgdmFsdWUgaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSwgZmFsbCBiYWNrIHRvIHRoZSBwbGFjZWhvbGRlciAoaXQncyBnb2luZyB0byBiZSB0aGVyZSkuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkX2F0dHJfdmFsX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfYXR0cl9zZWxlY3QudmFsKHNlbGVjdGVkX2F0dHJfdmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfYXR0cl9zZWxlY3QudmFsKCcnKS5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50X2F0dHJfc2VsZWN0LnZhbCgnJyk7IC8vIE5vIGNoYW5nZSBldmVudCB0byBwcmV2ZW50IGluZmluaXRlIGxvb3AuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEN1c3RvbSBldmVudCBmb3Igd2hlbiB2YXJpYXRpb25zIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgICAgICBmb3JtLiRmb3JtLnRyaWdnZXIoJ3dvb2NvbW1lcmNlX3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzJyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBjaG9zZW4gYXR0cmlidXRlcyBmcm9tIGZvcm0uXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICAqL1xuICAgIFZhcmlhdGlvbkZvcm0ucHJvdG90eXBlLmdldENob3NlbkF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgPSB7fTtcbiAgICAgICAgdmFyIGNvdW50ICA9IDA7XG4gICAgICAgIHZhciBjaG9zZW4gPSAwO1xuXG4gICAgICAgIHRoaXMuJGF0dHJpYnV0ZUZpZWxkcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfbmFtZSA9ICQodGhpcykuZGF0YSgnYXR0cmlidXRlX25hbWUnKSB8fCAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSAgICAgICAgICA9ICQodGhpcykudmFsKCkgfHwgJyc7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY2hvc2VuKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBkYXRhW2F0dHJpYnV0ZV9uYW1lXSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2NvdW50JyAgICAgICA6IGNvdW50LFxuICAgICAgICAgICAgJ2Nob3NlbkNvdW50JyA6IGNob3NlbixcbiAgICAgICAgICAgICdkYXRhJyAgICAgICAgOiBkYXRhXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgbWF0Y2hpbmcgdmFyaWF0aW9ucyBmb3IgYXR0cmlidXRlcy5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5maW5kTWF0Y2hpbmdWYXJpYXRpb25zID0gZnVuY3Rpb24gKHZhcmlhdGlvbnMsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIG1hdGNoaW5nID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFyaWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhcmlhdGlvbiA9IHZhcmlhdGlvbnNbaV07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTWF0Y2godmFyaWF0aW9uLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hpbmcucHVzaCh2YXJpYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaGluZztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VlIGlmIGF0dHJpYnV0ZXMgbWF0Y2guXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS5pc01hdGNoID0gZnVuY3Rpb24gKHZhcmlhdGlvbl9hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGF0dHJfbmFtZSBpbiB2YXJpYXRpb25fYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKHZhcmlhdGlvbl9hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHJfbmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsMSA9IHZhcmlhdGlvbl9hdHRyaWJ1dGVzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBhdHRyaWJ1dGVzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgIT09IHVuZGVmaW5lZCAmJiB2YWwyICE9PSB1bmRlZmluZWQgJiYgdmFsMS5sZW5ndGggIT09IDAgJiYgdmFsMi5sZW5ndGggIT09IDAgJiYgdmFsMSAhPT0gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNob3cgb3IgaGlkZSB0aGUgcmVzZXQgbGluay5cbiAgICAgKi9cbiAgICBWYXJpYXRpb25Gb3JtLnByb3RvdHlwZS50b2dnbGVSZXNldExpbmsgPSBmdW5jdGlvbiAob24pIHtcbiAgICAgICAgaWYgKG9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy4kcmVzZXRWYXJpYXRpb25zLmNzcygndmlzaWJpbGl0eScpID09PSAnaGlkZGVuJykge1xuICAgICAgICAgICAgICAgIHRoaXMuJHJlc2V0VmFyaWF0aW9ucy5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpLmhpZGUoKS5mYWRlSW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0VmFyaWF0aW9ucy5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gY2FsbCB3Y192YXJpYXRpb25fZm9ybSBvbiBqcXVlcnkgc2VsZWN0b3IuXG4gICAgICovXG4gICAgJC5mbi53Y192YXJpYXRpb25fZm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmV3IFZhcmlhdGlvbkZvcm0odGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZXMgdGhlIGRlZmF1bHQgdGV4dCBmb3IgYW4gZWxlbWVudCBzbyBpdCBjYW4gYmUgcmVzZXQgbGF0ZXJcbiAgICAgKi9cbiAgICAkLmZuLndjX3NldF9jb250ZW50ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdGhpcy5hdHRyKCdkYXRhLW9fY29udGVudCcpKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHIoJ2RhdGEtb19jb250ZW50JywgdGhpcy50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dChjb250ZW50KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RvcmVzIHRoZSBkZWZhdWx0IHRleHQgZm9yIGFuIGVsZW1lbnQgc28gaXQgY2FuIGJlIHJlc2V0IGxhdGVyXG4gICAgICovXG4gICAgJC5mbi53Y19yZXNldF9jb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSB0aGlzLmF0dHIoJ2RhdGEtb19jb250ZW50JykpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dCh0aGlzLmF0dHIoJ2RhdGEtb19jb250ZW50JykpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlcyBhIGRlZmF1bHQgYXR0cmlidXRlIGZvciBhbiBlbGVtZW50IHNvIGl0IGNhbiBiZSByZXNldCBsYXRlclxuICAgICAqL1xuICAgICQuZm4ud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyID0gZnVuY3Rpb24gKGF0dHIsIHZhbHVlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMuYXR0cignZGF0YS1vXycgKyBhdHRyKSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyKCdkYXRhLW9fJyArIGF0dHIsICghdGhpcy5hdHRyKGF0dHIpKSA/ICcnIDogdGhpcy5hdHRyKGF0dHIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFsc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHIoYXR0cik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF0dHIoYXR0ciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc2V0IGEgZGVmYXVsdCBhdHRyaWJ1dGUgZm9yIGFuIGVsZW1lbnQgc28gaXQgY2FuIGJlIHJlc2V0IGxhdGVyXG4gICAgICovXG4gICAgJC5mbi53Y19yZXNldF92YXJpYXRpb25fYXR0ciA9IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgIT09IHRoaXMuYXR0cignZGF0YS1vXycgKyBhdHRyKSkge1xuICAgICAgICAgICAgdGhpcy5hdHRyKGF0dHIsIHRoaXMuYXR0cignZGF0YS1vXycgKyBhdHRyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNsaWRlIHBvc2l0aW9uIGlmIHRoZSB2YXJpYXRpb24gaGFzIGEgZGlmZmVyZW50IGltYWdlIHRoYW4gdGhlIGN1cnJlbnQgb25lXG4gICAgICovXG4gICAgJC5mbi53Y19tYXliZV90cmlnZ2VyX3NsaWRlX3Bvc2l0aW9uX3Jlc2V0ID0gZnVuY3Rpb24gKHZhcmlhdGlvbikge1xuICAgICAgICB2YXIgJGZvcm0gICAgICAgICAgICAgICAgPSAkKHRoaXMpLFxuICAgICAgICAgICAgJHByb2R1Y3QgICAgICAgICAgICAgPSAkZm9ybS5jbG9zZXN0KCcucHJvZHVjdCcpLFxuICAgICAgICAgICAgJHByb2R1Y3RfZ2FsbGVyeSAgICAgPSAkcHJvZHVjdC5maW5kKCcuaW1hZ2VzJyksXG4gICAgICAgICAgICByZXNldF9zbGlkZV9wb3NpdGlvbiA9IGZhbHNlLFxuICAgICAgICAgICAgbmV3X2ltYWdlX2lkICAgICAgICAgPSAodmFyaWF0aW9uICYmIHZhcmlhdGlvbi5pbWFnZV9pZCkgPyB2YXJpYXRpb24uaW1hZ2VfaWQgOiAnJztcblxuICAgICAgICBpZiAoJGZvcm0uYXR0cignY3VycmVudC1pbWFnZScpICE9PSBuZXdfaW1hZ2VfaWQpIHtcbiAgICAgICAgICAgIHJlc2V0X3NsaWRlX3Bvc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRmb3JtLmF0dHIoJ2N1cnJlbnQtaW1hZ2UnLCBuZXdfaW1hZ2VfaWQpO1xuXG4gICAgICAgIGlmIChyZXNldF9zbGlkZV9wb3NpdGlvbikge1xuICAgICAgICAgICAgJHByb2R1Y3RfZ2FsbGVyeS50cmlnZ2VyKCd3b29jb21tZXJjZV9nYWxsZXJ5X3Jlc2V0X3NsaWRlX3Bvc2l0aW9uJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyBwcm9kdWN0IGltYWdlcyBmb3IgdGhlIGNob3NlbiB2YXJpYXRpb25cbiAgICAgKi9cbiAgICAkLmZuLndjX3ZhcmlhdGlvbnNfaW1hZ2VfdXBkYXRlID0gZnVuY3Rpb24gKHZhcmlhdGlvbikge1xuICAgICAgICB2YXIgJGZvcm0gICAgICAgICAgICAgPSB0aGlzLFxuICAgICAgICAgICAgJHByb2R1Y3QgICAgICAgICAgPSAkZm9ybS5jbG9zZXN0KCcucHJvZHVjdCcpLFxuICAgICAgICAgICAgJHByb2R1Y3RfZ2FsbGVyeSAgPSAkcHJvZHVjdC5maW5kKCcuaW1hZ2VzJyksXG4gICAgICAgICAgICAkZ2FsbGVyeV9uYXYgICAgICA9ICRwcm9kdWN0LmZpbmQoJy5mbGV4LWNvbnRyb2wtbmF2JyksXG4gICAgICAgICAgICAkZ2FsbGVyeV9pbWcgICAgICA9ICRnYWxsZXJ5X25hdi5maW5kKCdsaTplcSgwKSBpbWcnKSxcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZ193cmFwID0gJHByb2R1Y3RfZ2FsbGVyeS5maW5kKCcud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X19pbWFnZSwgLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeV9faW1hZ2UtLXBsYWNlaG9sZGVyJykuZXEoMCksXG4gICAgICAgICAgICAkcHJvZHVjdF9pbWcgICAgICA9ICRwcm9kdWN0X2ltZ193cmFwLmZpbmQoJy53cC1wb3N0LWltYWdlJyksXG4gICAgICAgICAgICAkcHJvZHVjdF9saW5rICAgICA9ICRwcm9kdWN0X2ltZ193cmFwLmZpbmQoJ2EnKS5lcSgwKTtcblxuICAgICAgICBpZiAodmFyaWF0aW9uICYmIHZhcmlhdGlvbi5pbWFnZSAmJiB2YXJpYXRpb24uaW1hZ2Uuc3JjICYmIHZhcmlhdGlvbi5pbWFnZS5zcmMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy8gU2VlIGlmIHRoZSBnYWxsZXJ5IGhhcyBhbiBpbWFnZSB3aXRoIHRoZSBzYW1lIG9yaWdpbmFsIHNyYyBhcyB0aGUgaW1hZ2Ugd2Ugd2FudCB0byBzd2l0Y2ggdG8uXG4gICAgICAgICAgICB2YXIgZ2FsbGVyeUhhc0ltYWdlID0gJGdhbGxlcnlfbmF2LmZpbmQoJ2xpIGltZ1tkYXRhLW9fc3JjPVwiJyArIHZhcmlhdGlvbi5pbWFnZS5nYWxsZXJ5X3RodW1ibmFpbF9zcmMgKyAnXCJdJykubGVuZ3RoID4gMDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGdhbGxlcnkgaGFzIHRoZSBpbWFnZSwgcmVzZXQgdGhlIGltYWdlcy4gV2UnbGwgc2Nyb2xsIHRvIHRoZSBjb3JyZWN0IG9uZS5cbiAgICAgICAgICAgIGlmIChnYWxsZXJ5SGFzSW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAkZm9ybS53Y192YXJpYXRpb25zX2ltYWdlX3Jlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlZSBpZiBnYWxsZXJ5IGhhcyBhIG1hdGNoaW5nIGltYWdlIHdlIGNhbiBzbGlkZSB0by5cbiAgICAgICAgICAgIHZhciBzbGlkZVRvSW1hZ2UgPSAkZ2FsbGVyeV9uYXYuZmluZCgnbGkgaW1nW3NyYz1cIicgKyB2YXJpYXRpb24uaW1hZ2UuZ2FsbGVyeV90aHVtYm5haWxfc3JjICsgJ1wiXScpO1xuXG4gICAgICAgICAgICBpZiAoc2xpZGVUb0ltYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzbGlkZVRvSW1hZ2UudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdjdXJyZW50LWltYWdlJywgdmFyaWF0aW9uLmltYWdlX2lkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHByb2R1Y3RfZ2FsbGVyeS50cmlnZ2VyKCd3b29jb21tZXJjZV9nYWxsZXJ5X2luaXRfem9vbScpO1xuICAgICAgICAgICAgICAgIH0sIDIwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRwcm9kdWN0X2ltZy53Y19zZXRfdmFyaWF0aW9uX2F0dHIoJ3NyYycsIHZhcmlhdGlvbi5pbWFnZS5zcmMpO1xuICAgICAgICAgICAgJHByb2R1Y3RfaW1nLndjX3NldF92YXJpYXRpb25fYXR0cignaGVpZ2h0JywgdmFyaWF0aW9uLmltYWdlLnNyY19oKTtcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZy53Y19zZXRfdmFyaWF0aW9uX2F0dHIoJ3dpZHRoJywgdmFyaWF0aW9uLmltYWdlLnNyY193KTtcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZy53Y19zZXRfdmFyaWF0aW9uX2F0dHIoJ3NyY3NldCcsIHZhcmlhdGlvbi5pbWFnZS5zcmNzZXQpO1xuICAgICAgICAgICAgJHByb2R1Y3RfaW1nLndjX3NldF92YXJpYXRpb25fYXR0cignc2l6ZXMnLCB2YXJpYXRpb24uaW1hZ2Uuc2l6ZXMpO1xuICAgICAgICAgICAgJHByb2R1Y3RfaW1nLndjX3NldF92YXJpYXRpb25fYXR0cigndGl0bGUnLCB2YXJpYXRpb24uaW1hZ2UudGl0bGUpO1xuICAgICAgICAgICAgJHByb2R1Y3RfaW1nLndjX3NldF92YXJpYXRpb25fYXR0cignYWx0JywgdmFyaWF0aW9uLmltYWdlLmFsdCk7XG4gICAgICAgICAgICAkcHJvZHVjdF9pbWcud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdkYXRhLXNyYycsIHZhcmlhdGlvbi5pbWFnZS5mdWxsX3NyYyk7XG4gICAgICAgICAgICAkcHJvZHVjdF9pbWcud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdkYXRhLWxhcmdlX2ltYWdlJywgdmFyaWF0aW9uLmltYWdlLmZ1bGxfc3JjKTtcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZy53Y19zZXRfdmFyaWF0aW9uX2F0dHIoJ2RhdGEtbGFyZ2VfaW1hZ2Vfd2lkdGgnLCB2YXJpYXRpb24uaW1hZ2UuZnVsbF9zcmNfdyk7XG4gICAgICAgICAgICAkcHJvZHVjdF9pbWcud2Nfc2V0X3ZhcmlhdGlvbl9hdHRyKCdkYXRhLWxhcmdlX2ltYWdlX2hlaWdodCcsIHZhcmlhdGlvbi5pbWFnZS5mdWxsX3NyY19oKTtcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZ193cmFwLndjX3NldF92YXJpYXRpb25fYXR0cignZGF0YS10aHVtYicsIHZhcmlhdGlvbi5pbWFnZS5zcmMpO1xuICAgICAgICAgICAgJGdhbGxlcnlfaW1nLndjX3NldF92YXJpYXRpb25fYXR0cignc3JjJywgdmFyaWF0aW9uLmltYWdlLmdhbGxlcnlfdGh1bWJuYWlsX3NyYyk7XG4gICAgICAgICAgICAkcHJvZHVjdF9saW5rLndjX3NldF92YXJpYXRpb25fYXR0cignaHJlZicsIHZhcmlhdGlvbi5pbWFnZS5mdWxsX3NyYyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZm9ybS53Y192YXJpYXRpb25zX2ltYWdlX3Jlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgICAgICAgICAkZm9ybS53Y19tYXliZV90cmlnZ2VyX3NsaWRlX3Bvc2l0aW9uX3Jlc2V0KHZhcmlhdGlvbik7XG4gICAgICAgICAgICAkcHJvZHVjdF9nYWxsZXJ5LnRyaWdnZXIoJ3dvb2NvbW1lcmNlX2dhbGxlcnlfaW5pdF96b29tJyk7XG4gICAgICAgIH0sIDIwKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzZXQgbWFpbiBpbWFnZSB0byBkZWZhdWx0cy5cbiAgICAgKi9cbiAgICAkLmZuLndjX3ZhcmlhdGlvbnNfaW1hZ2VfcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZm9ybSAgICAgICAgICAgICA9IHRoaXMsXG4gICAgICAgICAgICAkcHJvZHVjdCAgICAgICAgICA9ICRmb3JtLmNsb3Nlc3QoJy5wcm9kdWN0JyksXG4gICAgICAgICAgICAkcHJvZHVjdF9nYWxsZXJ5ICA9ICRwcm9kdWN0LmZpbmQoJy5pbWFnZXMnKSxcbiAgICAgICAgICAgICRnYWxsZXJ5X25hdiAgICAgID0gJHByb2R1Y3QuZmluZCgnLmZsZXgtY29udHJvbC1uYXYnKSxcbiAgICAgICAgICAgICRnYWxsZXJ5X2ltZyAgICAgID0gJGdhbGxlcnlfbmF2LmZpbmQoJ2xpOmVxKDApIGltZycpLFxuICAgICAgICAgICAgJHByb2R1Y3RfaW1nX3dyYXAgPSAkcHJvZHVjdF9nYWxsZXJ5LmZpbmQoJy53b29jb21tZXJjZS1wcm9kdWN0LWdhbGxlcnlfX2ltYWdlLCAud29vY29tbWVyY2UtcHJvZHVjdC1nYWxsZXJ5X19pbWFnZS0tcGxhY2Vob2xkZXInKS5lcSgwKSxcbiAgICAgICAgICAgICRwcm9kdWN0X2ltZyAgICAgID0gJHByb2R1Y3RfaW1nX3dyYXAuZmluZCgnLndwLXBvc3QtaW1hZ2UnKSxcbiAgICAgICAgICAgICRwcm9kdWN0X2xpbmsgICAgID0gJHByb2R1Y3RfaW1nX3dyYXAuZmluZCgnYScpLmVxKDApO1xuXG4gICAgICAgICRwcm9kdWN0X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignc3JjJyk7XG4gICAgICAgICRwcm9kdWN0X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignd2lkdGgnKTtcbiAgICAgICAgJHByb2R1Y3RfaW1nLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdoZWlnaHQnKTtcbiAgICAgICAgJHByb2R1Y3RfaW1nLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdzcmNzZXQnKTtcbiAgICAgICAgJHByb2R1Y3RfaW1nLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdzaXplcycpO1xuICAgICAgICAkcHJvZHVjdF9pbWcud2NfcmVzZXRfdmFyaWF0aW9uX2F0dHIoJ3RpdGxlJyk7XG4gICAgICAgICRwcm9kdWN0X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignYWx0Jyk7XG4gICAgICAgICRwcm9kdWN0X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignZGF0YS1zcmMnKTtcbiAgICAgICAgJHByb2R1Y3RfaW1nLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdkYXRhLWxhcmdlX2ltYWdlJyk7XG4gICAgICAgICRwcm9kdWN0X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignZGF0YS1sYXJnZV9pbWFnZV93aWR0aCcpO1xuICAgICAgICAkcHJvZHVjdF9pbWcud2NfcmVzZXRfdmFyaWF0aW9uX2F0dHIoJ2RhdGEtbGFyZ2VfaW1hZ2VfaGVpZ2h0Jyk7XG4gICAgICAgICRwcm9kdWN0X2ltZ193cmFwLndjX3Jlc2V0X3ZhcmlhdGlvbl9hdHRyKCdkYXRhLXRodW1iJyk7XG4gICAgICAgICRnYWxsZXJ5X2ltZy53Y19yZXNldF92YXJpYXRpb25fYXR0cignc3JjJyk7XG4gICAgICAgICRwcm9kdWN0X2xpbmsud2NfcmVzZXRfdmFyaWF0aW9uX2F0dHIoJ2hyZWYnKTtcbiAgICB9O1xuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2NfYWRkX3RvX2NhcnRfdmFyaWF0aW9uX3BhcmFtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQoJy52YXJpYXRpb25zX2Zvcm0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLndjX3ZhcmlhdGlvbl9mb3JtKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTWF0Y2hlcyBpbmxpbmUgdmFyaWF0aW9uIG9iamVjdHMgdG8gY2hvc2VuIGF0dHJpYnV0ZXNcbiAgICAgKiBAZGVwcmVjYXRlZCAyLjYuOVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdmFyIHdjX3ZhcmlhdGlvbl9mb3JtX21hdGNoZXIgPSB7XG4gICAgICAgIGZpbmRfbWF0Y2hpbmdfdmFyaWF0aW9ucyA6IGZ1bmN0aW9uIChwcm9kdWN0X3ZhcmlhdGlvbnMsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmcgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhcmlhdGlvbiA9IHByb2R1Y3RfdmFyaWF0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh3Y192YXJpYXRpb25fZm9ybV9tYXRjaGVyLnZhcmlhdGlvbnNfbWF0Y2godmFyaWF0aW9uLmF0dHJpYnV0ZXMsIHNldHRpbmdzKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZy5wdXNoKHZhcmlhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoaW5nO1xuICAgICAgICB9LFxuICAgICAgICB2YXJpYXRpb25zX21hdGNoICAgICAgICAgOiBmdW5jdGlvbiAoYXR0cnMxLCBhdHRyczIpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKHZhciBhdHRyX25hbWUgaW4gYXR0cnMxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzMS5oYXNPd25Qcm9wZXJ0eShhdHRyX25hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwxID0gYXR0cnMxW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwyID0gYXR0cnMyW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwxICE9PSB1bmRlZmluZWQgJiYgdmFsMiAhPT0gdW5kZWZpbmVkICYmIHZhbDEubGVuZ3RoICE9PSAwICYmIHZhbDIubGVuZ3RoICE9PSAwICYmIHZhbDEgIT09IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9hZGQtdG8tY2FydC12YXJpYXRpb24uanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvZnJvbnRlbmQuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvdGhlbWUtb3ZlcnJpZGUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Njc3MvYmFja2VuZC5zY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBa0JBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwQkE7QUFzQkE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF4QkE7QUEyQkE7Ozs7OztBQ2h1QkE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=