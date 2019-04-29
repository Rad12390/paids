<?php
	
	defined( 'ABSPATH' ) or die( 'Keep Silent' );
	
	// Ajax request of non ajax variation
	if ( ! function_exists( 'wvs_pro_get_available_variations' ) ):
		function wvs_pro_get_available_variations() {
			$product_id = absint( $_POST[ 'product_id' ] );
			$product    = wc_get_product( $product_id );
			$data       = array_values( $product->get_available_variations() );
			wp_send_json_success( $data );
		}
	endif;
	
	// Get Pro Product Option
	if ( ! function_exists( 'wvs_pro_get_product_option' ) ):
		function wvs_pro_get_product_option( $product_id, $option_name = false ) {
			
			$options = get_post_meta( $product_id, '_wvs_product_attributes', true );
			
			if ( ! $option_name ) {
				return $options;
			}
			
			if ( isset( $options[ $option_name ] ) ) {
				return $options[ $option_name ];
			}
			
			return null;
		}
	endif;
	
	// Radio Attribute Type
	if ( ! function_exists( 'wvs_pro_radio_attribute_type' ) ) :
		function wvs_pro_radio_attribute_type( $types ) {
			$types[ 'radio' ] = array(
				'title'   => esc_html__( 'Radio', 'woo-variation-swatches-pro' ),
				'output'  => 'wvs_radio_variation_attribute_options',
				'preview' => 'wvs_radio_variation_attribute_preview'
			);
			
			return $types;
		}
	endif;
	
	// Add to cart ajax function
	if ( ! function_exists( 'wvs_pro_add_to_cart' ) ):
		function wvs_pro_add_to_cart() {
			
			ob_start();
			
			$product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $_POST[ 'product_id' ] ) );
			$product           = wc_get_product( $product_id );
			$quantity          = empty( $_POST[ 'quantity' ] ) ? 1 : wc_stock_amount( $_POST[ 'quantity' ] );
			$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
			$product_status    = get_post_status( $product_id );
			$variation_id      = absint( $_POST[ 'variation_id' ] );
			$variation         = $_POST[ 'variation' ];
			
			// If Not a variation
			if ( 'variable' != $product->get_type() || empty( $variation_id ) ) {
				// If there was an error adding to the cart, redirect to the product page to show any errors
				$data = array(
					'error'       => true,
					'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
				);
				
				wp_send_json( $data );
			}
			
			if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) && 'publish' === $product_status ) {
				
				do_action( 'woocommerce_ajax_added_to_cart', $product_id );
				
				if ( 'yes' === get_option( 'woocommerce_cart_redirect_after_add' ) ) {
					wc_add_to_cart_message( array( $product_id => $quantity ), true );
				}
				
				// Return fragments
				WC_AJAX::get_refreshed_fragments();
				
			} else {
				
				// If there was an error adding to the cart, redirect to the product page to show any errors
				$data = array(
					'error'       => true,
					'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
				);
				
				wp_send_json( $data );
			}
		}
	endif;
	
	// Loop cart arguments
	if ( ! function_exists( 'wvs_pro_loop_add_to_cart_args' ) ):
		function wvs_pro_loop_add_to_cart_args( $args, $product ) {
			
			// return $args;
			
			if ( $product->is_type( 'variable' ) ) {
				
				if ( ! woo_variation_swatches()->get_option( 'show_on_archive' ) ) {
					return $args;
				}
				
				$get_variations = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );
				
				$enable_catalog_mode = (bool) woo_variation_swatches()->get_option( 'enable_catalog_mode' );
				
				if ( ! $enable_catalog_mode ) {
					$args[ 'class' ] .= ' wvs_add_to_cart_button';
				}
				
				// Based On WooCommerce Settings
				if ( 'yes' === get_option( 'woocommerce_enable_ajax_add_to_cart' ) && ! $enable_catalog_mode ) {
					$args[ 'class' ] .= ' wvs_ajax_add_to_cart';
				} else {
					$args[ 'attributes' ][ 'data-product_permalink' ] = $product->add_to_cart_url();
					// $args[ 'attributes' ][ 'data-add_to_cart_url' ]   = $product->is_purchasable() && $product->is_in_stock() ? remove_query_arg( 'added-to-cart', add_query_arg( 'add-to-cart', $product->get_id() ) ) : get_permalink( $product->get_id() );
					$args[ 'attributes' ][ 'data-add_to_cart_url' ] = $product->is_purchasable() && $product->is_in_stock() ? wvs_pro_get_current_url() : get_permalink( $product->get_id() );
				}
				
				// variation_id
				$args[ 'attributes' ][ 'data-variation_id' ] = "";
				$args[ 'attributes' ][ 'data-variation' ]    = "";
				
				$args[ 'variations' ] = array(
					'available_variations' => $get_variations ? array_values( $product->get_available_variations() ) : false,
					'attributes'           => $product->get_variation_attributes(),
					'selected_attributes'  => $product->get_default_attributes(),
				);
			}
			
			return $args;
		}
	endif;
	
	// Add to cart link
	if ( ! function_exists( 'wvs_pro_loop_add_to_cart_link' ) ):
		function wvs_pro_loop_add_to_cart_link( $link, $product ) {
			echo $link;
			
			if ( apply_filters( 'wvs_pro_use_add_to_cart_link_archive_template', true, $product ) ) {
				wvs_pro_archive_variation_template();
			}
		}
	endif;
	
	// Add to cart options
	if ( ! function_exists( 'wvs_pro_loop_add_to_cart_options' ) ):
		function wvs_pro_loop_add_to_cart_options( $args = array() ) {
			global $product;
			
			if ( $product ) {
				$defaults = array(
					'quantity'   => 1,
					'class'      => implode( ' ', array_filter( array(
						                                            'button',
						                                            'product_type_' . $product->get_type(),
						                                            $product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '',
						                                            $product->supports( 'ajax_add_to_cart' ) ? 'ajax_add_to_cart' : '',
					                                            ) ) ),
					'attributes' => array(
						'data-product_id'  => $product->get_id(),
						'data-product_sku' => $product->get_sku(),
						'aria-label'       => $product->add_to_cart_description(),
						'rel'              => 'nofollow',
					),
				);
				
				return apply_filters( 'woocommerce_loop_add_to_cart_args', wp_parse_args( $args, $defaults ), $product );
			}
		}
	endif;
	
	// Archive Variation Template
	if ( ! function_exists( 'wvs_pro_archive_variation_template' ) ):
		function wvs_pro_archive_variation_template( $args = array() ) {
			global $product;
			
			if ( ! woo_variation_swatches()->get_option( 'show_on_archive' ) ) {
				return;
			}
			
			if ( $product->is_type( 'variable' ) && apply_filters( 'wvs_pro_show_archive_variation_template', true, $product ) ) {
				
				$options = wvs_pro_loop_add_to_cart_options( $args );
				
				wc_get_template( 'wvs-archive-variation.php', compact( 'options', 'product' ), '', trailingslashit( woo_variation_swatches_pro()->template_path() ) );
			}
		}
	endif;
	
	// Product loop post class
	if ( ! function_exists( 'wvs_pro_product_loop_post_class' ) ):
		function wvs_pro_product_loop_post_class( $classes, $class, $product_id ) {
			
			if ( apply_filters( 'disable_wvs_pro_post_class', false, $product_id ) ) {
				return $classes;
			}
			
			if ( 'product' === get_post_type( $product_id ) ) {
				$product = wc_get_product( $product_id );
				if ( $product->is_type( 'variable' ) ) {
					$classes[] = 'wvs-pro-product';
					$classes[] = sprintf( 'wvs-pro-%s-cart-button', woo_variation_swatches()->get_option( 'archive_swatches_position' ) );
				}
			}
			
			return $classes;
		}
	endif;
	
	// Change script data
	if ( ! function_exists( 'wvs_pro_wc_get_script_data' ) ):
		function wvs_pro_wc_get_script_data( $params, $handle ) {
			if ( 'wc-add-to-cart-variation' == $handle ) {
				$params = array_merge( $params, array(
					'ajax_url'                => WC()->ajax_url(),
					'i18n_view_cart'          => apply_filters( 'wvs_pro_view_cart_text', esc_attr__( 'View cart', 'woocommerce' ) ),
					'i18n_add_to_cart'        => apply_filters( 'wvs_pro_add_to_cart_text', esc_attr__( 'Add to cart', 'woocommerce' ) ),
					'i18n_select_options'     => apply_filters( 'wvs_pro_select_options_text', esc_attr__( 'Select options', 'woocommerce' ) ),
					'cart_url'                => apply_filters( 'woocommerce_add_to_cart_redirect', wc_get_cart_url() ),
					'is_cart'                 => is_cart(),
					'cart_redirect_after_add' => get_option( 'woocommerce_cart_redirect_after_add' ),
					'enable_ajax_add_to_cart' => get_option( 'woocommerce_enable_ajax_add_to_cart' )
				) );
				
				wc_get_template( 'wvs-variation-template.php', array(), '', trailingslashit( woo_variation_swatches_pro()->template_path() ) );
			}
			
			return $params;
		}
	endif;
	
	// Get Current URL
	if ( ! function_exists( 'wvs_pro_get_current_url' ) ):
		function wvs_pro_get_current_url( $args = array() ) {
			global $wp;
			
			return esc_url( trailingslashit( home_url( add_query_arg( $args, $wp->request ) ) ) );
		}
	endif;
	
	// Simple Product Add To Cart URL Fix
	if ( ! function_exists( 'wvs_simple_product_cart_url' ) ):
		function wvs_simple_product_cart_url( $url, $product ) {
			
			if ( 'simple' === $product->get_type() ) {
				$url = $product->is_purchasable() && $product->is_in_stock() ? remove_query_arg( 'added-to-cart', add_query_arg( 'add-to-cart', $product->get_id(), wvs_pro_get_current_url() ) ) : get_permalink( $product->get_id() );
			}
			
			return $url;
		}
	endif;
	
	// Attribute select-box
	if ( ! function_exists( 'wvs_pro_variation_attribute_options' ) ):
		function wvs_pro_variation_attribute_options( $args = array(), $hide_select = true ) {
			
			$args = wp_parse_args( $args, array(
				'options'          => false,
				'attribute'        => false,
				'product'          => false,
				'selected'         => false,
				'name'             => '',
				'id'               => '',
				'class'            => '',
				'type'             => '',
				'show_option_none' => esc_html__( 'Choose an option', 'woo-variation-swatches-pro' )
			) );
			
			$type                  = $args[ 'type' ];
			$options               = $args[ 'options' ];
			$product               = $args[ 'product' ];
			$attribute             = $args[ 'attribute' ];
			$name                  = $args[ 'name' ] ? $args[ 'name' ] : wc_variation_attribute_name( $attribute );
			$id                    = $args[ 'id' ] ? $args[ 'id' ] : sanitize_title( $attribute );
			$class                 = $args[ 'class' ];
			$show_option_none      = $args[ 'show_option_none' ] ? true : false;
			$show_option_none_text = $args[ 'show_option_none' ] ? $args[ 'show_option_none' ] : esc_html__( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.
			
			if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
				$attributes = $product->get_variation_attributes();
				$options    = $attributes[ $attribute ];
			}
			
			if ( $product && $hide_select ) {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . ' hide woo-variation-raw-select woo-variation-raw-type-' . esc_attr( $type ) . '" style="display:none" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			} else {
				echo '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" name="' . esc_attr( $name ) . '" data-attribute_name="' . esc_attr( wc_variation_attribute_name( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
			}
			
			if ( $args[ 'show_option_none' ] ) {
				echo '<option value="">' . esc_html( $show_option_none_text ) . '</option>';
			}
			
			if ( ! empty( $options ) ) {
				if ( $product && taxonomy_exists( $attribute ) ) {
					// Get terms if this is a taxonomy - ordered. We need the names too.
					$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
					
					foreach ( $terms as $term ) {
						if ( in_array( $term->slug, $options ) ) {
							echo '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args[ 'selected' ] ), $term->slug, false ) . '>' . apply_filters( 'woocommerce_variation_option_name', $term->name ) . '</option>';
						}
					}
				} else {
					foreach ( $options as $option ) {
						// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
						$selected = sanitize_title( $args[ 'selected' ] ) === $args[ 'selected' ] ? selected( $args[ 'selected' ], sanitize_title( $option ), false ) : selected( $args[ 'selected' ], $option, false );
						echo '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option ) ) . '</option>';
					}
				}
			}
			
			echo '</select>';
		}
	endif;
	
	
	if ( ! function_exists( 'wvs_archive_swatches_has_more' ) ):
		function wvs_archive_swatches_has_more( $count ) {
			
			$limit        = absint( woo_variation_swatches()->get_option( 'catalog_mode_display_limit' ) );
			$catalog_mode = (bool) woo_variation_swatches()->get_option( 'enable_catalog_mode' );
			
			if ( $limit === 0 || ! $catalog_mode ) {
				return false;
			}
			
			return $limit <= $count;
		}
	endif;
	
	
	if ( ! function_exists( 'wvs_archive_swatches_more' ) ):
		function wvs_archive_swatches_more( $product_id ) {
			
			$data = '<li class="woo-variation-swatches-variable-item-more">';
			$data .= sprintf( '<a style="font-size: small" href="%s">%s</a>', esc_url( get_permalink( $product_id ) ), esc_html__( 'More', 'woo-variation-swatches-pro' ) );
			$data .= '</li>';
			
			return $data;
		}
	endif;
	
	// Function override
	function wvs_variable_item( $type, $options, $args, $saved_attribute = array() ) {
		
		$product              = $args[ 'product' ];
		$attribute            = $args[ 'attribute' ];
		$data                 = '';
		$is_archive           = ( isset( $args[ 'is_archive' ] ) && $args[ 'is_archive' ] );
		$show_archive_tooltip = woo_variation_swatches()->get_option( 'show_tooltip_on_archive' );
		
		if ( ! empty( $options ) ) {
			$name          = uniqid( wc_variation_attribute_name( $attribute ) );
			$display_count = 0;
			
			if ( $product && taxonomy_exists( $attribute ) ) {
				
				$terms = wc_get_product_terms( $product->get_id(), $attribute, array( 'fields' => 'all' ) );
				foreach ( $terms as $term ) {
					if ( in_array( $term->slug, $options ) ) {
						
						$term_id = $term->term_id;
						
						$type = isset( $saved_attribute[ 'terms' ][ $term_id ][ 'type' ] ) ? $saved_attribute[ 'terms' ][ $term_id ][ 'type' ] : $type;
						
						$selected_class = ( sanitize_title( $args[ 'selected' ] ) == $term->slug ) ? 'selected' : '';
						
						// Tooltip
						// from attributes
						$default_tooltip_type = get_term_meta( $term_id, 'show_tooltip', true );
						$default_tooltip_type = empty( $default_tooltip_type ) ? 'text' : $default_tooltip_type;
						
						// from product attribute
						$default_tooltip_type = ( isset( $saved_attribute[ 'show_tooltip' ] ) && ! empty( $saved_attribute[ 'show_tooltip' ] ) ) ? $saved_attribute[ 'show_tooltip' ] : $default_tooltip_type;
						
						// from attribute
						$default_tooltip_text = trim( get_term_meta( $term_id, 'tooltip_text', true ) );
						// from attribute fallback
						$default_tooltip_text = empty( $default_tooltip_text ) ? trim( apply_filters( 'wvs_variable_item_tooltip', $term->name, $term, $args ) ) : $default_tooltip_text;
						
						// from attribute
						$default_tooltip_image = trim( get_term_meta( $term_id, 'tooltip_image', true ) );
						
						
						// from product attribute item
						$tooltip_type  = ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && ! empty( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_type' ] ) ) ? trim( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_type' ] ) : $default_tooltip_type;
						$tooltip_text  = ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && ! empty( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_text' ] ) ) ? trim( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_text' ] ) : $default_tooltip_text;
						$tooltip_image = ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && ! empty( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_image' ] ) ) ? trim( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_image' ] ) : $default_tooltip_image;
						
						// from product attribute item
						
						if ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && empty( $saved_attribute[ 'terms' ][ $term_id ][ 'tooltip_type' ] ) ) {
							$tooltip_type = $default_tooltip_type;
							$tooltip_text = $default_tooltip_text;
						}
						
						$show_tooltip = ! empty( $tooltip_type ) || $tooltip_type !== 'no';
						
						if ( $is_archive ) {
							$show_tooltip = $show_archive_tooltip;
						}
						
						$tooltip_html_attr = '';
						$tooltip_html_attr .= ( $show_tooltip && $tooltip_text && $tooltip_type == 'text' ) ? sprintf( 'data-wvstooltip="%s"', esc_attr( $tooltip_text ) ) : '';
						
						$tooltip_image_width = absint( woo_variation_swatches()->get_option( 'tooltip_image_width' ) );
						
						$tooltip_image_size  = apply_filters( 'wvs_tooltip_image_size', array( $tooltip_image_width, $tooltip_image_width ) );
						$tooltip_image_width = apply_filters( 'wvs_tooltip_image_width', sprintf( '%dpx', $tooltip_image_width ) );
						
						$tooltip_html_image = ( $show_tooltip && $tooltip_type == 'image' && $tooltip_image ) ? wp_get_attachment_image_url( $tooltip_image, $tooltip_image_size ) : false;
						
						if ( wp_is_mobile() ) {
							$tooltip_html_attr .= ( $show_tooltip ) ? ' tabindex="2"' : '';
						}
						
						// More...
						if ( $is_archive && wvs_archive_swatches_has_more( $display_count ) ) {
							$data .= wvs_archive_swatches_more( $product->get_id() );
							break;
						}
						
						
						$data .= sprintf( '<li %1$s class="variable-item %2$s-variable-item %2$s-variable-item-%3$s %4$s" title="%5$s" data-value="%3$s">', $tooltip_html_attr, esc_attr( $type ), esc_attr( $term->slug ), esc_attr( $selected_class ), esc_html( $term->name ) );
						
						if ( $tooltip_html_image ):
							$data .= '<span style="width: ' . $tooltip_image_width . '" class="image-tooltip-wrapper"><img alt="' . $term->name . '" src="' . $tooltip_html_image . '"></span>';
						endif;
						
						switch ( $type ):
							case 'color':
								$global_color = sanitize_hex_color( get_term_meta( $term->term_id, 'product_attribute_color', true ) );
								$color        = ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && ! empty( $saved_attribute[ 'terms' ][ $term_id ][ 'color' ] ) ) ? $saved_attribute[ 'terms' ][ $term_id ][ 'color' ] : $global_color;
								$data         .= sprintf( '<span class="variable-item-span variable-item-span-%s" style="background-color:%s;"></span>', esc_attr( $type ), esc_attr( $color ) );
								break;
							
							case 'image':
								$global_attachment_id = absint( get_term_meta( $term->term_id, 'product_attribute_image', true ) );
								
								$attachment_id = ( isset( $saved_attribute[ 'terms' ][ $term_id ] ) && ! empty( $saved_attribute[ 'terms' ][ $term_id ][ 'image_id' ] ) ) ? $saved_attribute[ 'terms' ][ $term_id ][ 'image_id' ] : $global_attachment_id;
								
								$global_image_size = woo_variation_swatches()->get_option( 'attribute_image_size' );
								
								$image_size = ( isset( $saved_attribute[ 'image_size' ] ) && ! empty( $saved_attribute[ 'image_size' ] ) ) ? $saved_attribute[ 'image_size' ] : $global_image_size;
								
								$image_url = wp_get_attachment_image_url( $attachment_id, apply_filters( 'wvs_product_attribute_image_size', $image_size ) );
								$data      .= sprintf( '<img alt="%s" src="%s" />', esc_attr( $term->name ), esc_url( $image_url ) );
								break;
							
							case 'button':
								$data .= sprintf( '<span class="variable-item-span variable-item-span-%s">%s</span>', esc_attr( $type ), esc_html( $term->name ) );
								break;
							
							case 'radio':
								$id   = uniqid( $term->slug );
								$data .= sprintf( '<input name="%1$s" id="%2$s" class="wvs-radio-variable-item" %3$s  type="radio" value="%4$s" data-value="%4$s" /><label for="%2$s">%5$s</label>', $name, $id, checked( sanitize_title( $args[ 'selected' ] ), $term->slug, false ), esc_attr( $term->slug ), esc_html( $term->name ) );
								break;
							
							default:
								$data .= apply_filters( 'wvs_variable_default_item_content', '', $term, $args );
								break;
						endswitch;
						
						
						$data .= '</li>';
						
						$display_count ++;
					}
				}
			} else {
				
				// Custom Attributes
				$terms = $saved_attribute[ 'terms' ];
				foreach ( $terms as $term_id => $term ) {
					
					$type = isset( $term[ 'type' ] ) ? $term[ 'type' ] : $saved_attribute[ 'type' ];
					
					$selected_class = ( sanitize_title( $args[ 'selected' ] ) == $term_id ) ? 'selected' : '';
					
					// Tooltip
					
					$default_tooltip_type = ( isset( $saved_attribute[ 'show_tooltip' ] ) && ! empty( $saved_attribute[ 'show_tooltip' ] ) ) ? $saved_attribute[ 'show_tooltip' ] : 'text';
					$default_tooltip_text = trim( apply_filters( 'wvs_color_variable_item_tooltip', $term_id, $term, $args ) );
					
					
					// from product attribute item
					$tooltip_type = ( isset( $term[ 'tooltip_type' ] ) && ! empty( $term[ 'tooltip_type' ] ) ) ? trim( $term[ 'tooltip_type' ] ) : $default_tooltip_type;
					$tooltip_text = ( isset( $term[ 'tooltip_text' ] ) && ! empty( $term[ 'tooltip_text' ] ) ) ? trim( $term[ 'tooltip_text' ] ) : $default_tooltip_text;
					
					if ( isset( $term[ 'tooltip_type' ] ) && empty( $term[ 'tooltip_type' ] ) ) {
						$tooltip_type = $default_tooltip_type;
						$tooltip_text = $default_tooltip_text;
					}
					
					$tooltip_image = ( isset( $term[ 'tooltip_image' ] ) && ! empty( $term[ 'tooltip_image' ] ) ) ? trim( $term[ 'tooltip_image' ] ) : false;
					
					$show_tooltip = ! empty( $tooltip_type ) || $tooltip_type !== 'no';
					
					$tooltip_html_attr = '';
					$tooltip_html_attr .= ( $show_tooltip && $tooltip_text && $tooltip_type == 'text' ) ? sprintf( 'data-wvstooltip="%s"', esc_attr( $tooltip_text ) ) : '';
					
					$tooltip_image_width = absint( woo_variation_swatches()->get_option( 'tooltip_image_width' ) );
					
					$tooltip_image_size  = apply_filters( 'wvs_tooltip_image_size', array( $tooltip_image_width, $tooltip_image_width ) );
					$tooltip_image_width = apply_filters( 'wvs_tooltip_image_width', sprintf( '%dpx', $tooltip_image_width ) );
					
					$tooltip_html_image = ( $show_tooltip && $tooltip_type == 'image' && $tooltip_image ) ? wp_get_attachment_image_url( $tooltip_image, $tooltip_image_size ) : false;
					
					if ( wp_is_mobile() ) {
						$tooltip_html_attr .= ( $show_tooltip ) ? ' tabindex="2"' : '';
					}
					
					
					// More...
					if ( $is_archive && wvs_archive_swatches_has_more( $display_count ) ) {
						$data .= wvs_archive_swatches_more( $product->get_id() );
						break;
					}
					
					
					$data .= sprintf( '<li %1$s class="variable-item %2$s-variable-item %2$s-variable-item-%3$s %4$s" title="%5$s" data-value="%5$s">', $tooltip_html_attr, esc_attr( $type ), sanitize_title( $term_id ), esc_attr( $selected_class ), esc_html( $term_id ) );
					
					if ( $tooltip_html_image ):
						$data .= '<span style="width: ' . $tooltip_image_width . '" class="image-tooltip-wrapper"><img alt="' . $term_id . '" src="' . $tooltip_html_image . '"></span>';
					endif;
					
					switch ( $type ):
						case 'color':
							$color = $term[ 'color' ];
							$data  .= sprintf( '<span class="variable-item-span variable-item-span-color" style="background-color:%s;"></span>', esc_attr( $color ) );
							break;
						
						case 'image':
							
							$attachment_id = $term[ 'image_id' ];
							
							$global_image_size = woo_variation_swatches()->get_option( 'attribute_image_size' );
							
							$image_size = ( isset( $saved_attribute[ 'image_size' ] ) && ! empty( $saved_attribute[ 'image_size' ] ) ) ? $saved_attribute[ 'image_size' ] : $global_image_size;
							
							$image_url = wp_get_attachment_image_url( $attachment_id, apply_filters( 'wvs_product_attribute_image_size', $image_size ) );
							$data      .= sprintf( '<img alt="%s" src="%s" />', esc_attr( $term_id ), esc_url( $image_url ) );
							break;
						
						case 'button':
							$data .= sprintf( '<span class="variable-item-span variable-item-span-button">%s</span>', esc_html( $term_id ) );
							break;
						
						case 'radio':
							$id   = uniqid( sanitize_title( $term_id ) );
							$data .= sprintf( '<input name="%1$s" id="%2$s" class="wvs-radio-variable-item" %3$s type="radio" value="%4$s" data-value="%4$s" /><label for="%2$s">%5$s</label>', $name, $id, checked( sanitize_title( $args[ 'selected' ] ), $term_id, true ), esc_attr( $term_id ), esc_html( $term_id ) );
							break;
						
						default:
							$data .= apply_filters( 'wvs_variable_default_item_content', '', $term_id, $args );
							break;
					endswitch;
					$data .= '</li>';
					
					$display_count ++;
				}
			}
		}
		
		return apply_filters( 'wvs_variable_item', $data, $type, $options, $args, $saved_attribute );
	}
	
	//-------------------------------------------------------------------------------
	// WooCommerce Core Function Override
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'woocommerce_variable_add_to_cart' ) ):
		function woocommerce_variable_add_to_cart() {
			global $product;
			// Enqueue variation scripts.
			wp_enqueue_script( 'wc-add-to-cart-variation' );
			
			// Get Available variations?
			$get_variations = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );
			
			// Load the template.
			//print_r($product->get_available_variations()); die;
			wc_get_template( 'single-product/add-to-cart/variable.php', apply_filters( 'wvs_woocommerce_variable_add_to_cart_template_args', array(
				'available_variations' => $get_variations ? array_values( $product->get_available_variations() ) : false,
				'attributes'           => $product->get_variation_attributes(),
				'selected_attributes'  => $product->get_default_attributes(),
			) ) );
		}
	endif;
	
	//-------------------------------------------------------------------------------
	// WooCommerce Get Attribute Taxonomies
	//-------------------------------------------------------------------------------
	
	if ( ! function_exists( 'wvs_pro_get_attribute_taxonomies_option' ) ):
		function wvs_pro_get_attribute_taxonomies_option( $empty = ' - Choose Attribute - ' ) {
			// attribute_name | attribute_id
			$lists = (array) wp_list_pluck( wc_get_attribute_taxonomies(), 'attribute_label', 'attribute_name' );
			
			$list = array();
			foreach ( $lists as $name => $label ) {
				$list[ wc_attribute_taxonomy_name( $name ) ] = $label . " ( {$name} )";
			}
			
			if ( $empty ) {
				$list = array( '' => $empty ) + $list;
			}
			
			return $list;
		}
	endif;
	
	
	if ( ! function_exists( 'wvs_pro_attribute_taxonomy_type_by_name' ) ):
		function wvs_pro_attribute_taxonomy_type_by_name( $name ) {
			$name       = str_replace( 'pa_', '', wc_sanitize_taxonomy_name( $name ) );
			$taxonomies = wp_list_pluck( wc_get_attribute_taxonomies(), 'attribute_type', 'attribute_name' );
			
			return isset( $taxonomies[ $name ] ) ? $taxonomies[ $name ] : false;
		}
	endif;