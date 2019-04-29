<?php
	/**
	 * Plugin Name: WooCommerce Variation Swatches - Pro
	 * Plugin URI: https://getwooplugins.com/plugins/woocommerce-variation-swatches/
	 * Description: WooCommerce Product Variation Swatches Pro
	 * Author: Emran Ahmed
	 * Version: 1.0.31
	 * Domain Path: /languages
	 * Requires at least: 4.8
	 * Tested up to: 5.0
	 * WC requires at least: 3.2
	 * WC tested up to: 3.5
	 * Text Domain: woo-variation-swatches-pro
	 * Author URI: https://getwooplugins.com/
	 */
	
	defined( 'ABSPATH' ) or die( 'Keep Silent' );
	
	if ( ! class_exists( 'Woo_Variation_Swatches_Pro' ) ):
		
		final class Woo_Variation_Swatches_Pro {
			
			protected        $_version  = '1.0.31';
			protected static $_instance = null;
			
			public static function instance() {
				if ( is_null( self::$_instance ) ) {
					self::$_instance = new self();
				}
				
				return self::$_instance;
			}
			
			public function __construct() {
				$this->constants();
				$this->includes();
				$this->hooks();
				do_action( 'woo_variation_swatches_pro_loaded', $this );
			}
			
			public function constants() {
				$this->define( 'WVS_PRO_PLUGIN_VERSION', esc_attr( $this->_version ) );
				$this->define( 'WVS_PRO_PLUGIN_URI', plugin_dir_url( __FILE__ ) );
				$this->define( 'WVS_PRO_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
				
				$this->define( 'WVS_PRO_PLUGIN_INCLUDE_PATH', trailingslashit( plugin_dir_path( __FILE__ ) . 'includes' ) );
				$this->define( 'WVS_PRO_PLUGIN_TEMPLATES_PATH', trailingslashit( plugin_dir_path( __FILE__ ) . 'templates' ) );
				$this->define( 'WVS_PRO_PLUGIN_TEMPLATES_URI', trailingslashit( plugin_dir_url( __FILE__ ) . 'templates' ) );
				
				$this->define( 'WVS_PRO_PLUGIN_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );
				$this->define( 'WVS_PRO_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
				$this->define( 'WVS_PRO_PLUGIN_FILE', __FILE__ );
				$this->define( 'WVS_PRO_IMAGES_URI', trailingslashit( plugin_dir_url( __FILE__ ) . 'images' ) );
				$this->define( 'WVS_PRO_ASSETS_URI', trailingslashit( plugin_dir_url( __FILE__ ) . 'assets' ) );
			}
			
			public function includes() {
				if ( $this->is_wvs_active() ) {
					require_once $this->include_path( 'gwp-functions.php' );
					require_once $this->include_path( 'hooks.php' );
					require_once $this->include_path( 'functions.php' );
					require_once $this->include_path( 'themes-support.php' );
					require_once $this->include_path( 'class-woo-variation-swatches-pro-product-meta.php' );
				}
			}
			
			public function define( $name, $value, $case_insensitive = false ) {
				if ( ! defined( $name ) ) {
					define( $name, $value, $case_insensitive );
				}
			}
			
			public function include_path( $file ) {
				$file = ltrim( $file, '/' );
				
				return WVS_PRO_PLUGIN_INCLUDE_PATH . $file;
			}
			
			public function hooks() {
				add_action( 'init', array( $this, 'language' ) );
				
				if ( $this->is_wvs_active() ) {
					add_action( 'admin_notices', array( $this, 'add_license_notice' ) );
					add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 20 );
					add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
					add_filter( 'body_class', array( $this, 'body_class' ), 11 );
					add_action( 'admin_init', array( $this, 'updater' ) );
				} else {
					add_action( 'admin_notices', array( $this, 'wvs_requirement_notice' ) );
				}
			}
			
			public function body_class( $classes ) {
				$old_classes = $classes;
				
				if ( apply_filters( 'disable_wvs_pro_body_class', false ) ) {
					return $classes;
				}
				
				$align     = sprintf( 'woo-variation-swatches-archive-align-%s', woo_variation_swatches()->get_option( 'archive_align' ) );
				$classes[] = $align;
				
				return apply_filters( 'wvs_pro_body_class', array_unique( $classes ), $old_classes );
			}
			
			public function updater() {
				if ( class_exists( 'GetWooPlugins_Updater' ) ) {
					if ( woo_variation_swatches()->get_option( 'license_key' ) ) {
						new GetWooPlugins_Updater( __FILE__, woo_variation_swatches()->get_option( 'license_key' ) );
					}
				}
			}
			
			public function enqueue_scripts() {
				
				$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
				
				// Filter for disable loading scripts
				if ( apply_filters( 'disable_wvs_pro_enqueue_scripts', false ) ) {
					return;
				}
				
				// add-to-cart-variation override
				if ( woo_variation_swatches()->get_option( 'enable_single_variation_preview' ) || woo_variation_swatches()->get_option( 'disable_threshold' ) ):
					wp_deregister_script( 'wc-add-to-cart-variation' );
					wp_register_script( 'wc-add-to-cart-variation', $this->assets_uri( "/js/add-to-cart-variation{$suffix}.js" ), array( 'jquery', 'wp-util' ), $this->version() );
				endif;
				
				wp_enqueue_script( 'woo-variation-swatches-pro', $this->assets_uri( "/js/frontend-pro{$suffix}.js" ), array( 'wc-add-to-cart-variation', 'jquery' ), $this->version(), true );
				wp_enqueue_style( 'woo-variation-swatches-pro', $this->assets_uri( "/css/frontend-pro{$suffix}.css" ), array(), $this->version() );
				wp_enqueue_style( 'woo-variation-swatches-pro-theme-override', $this->assets_uri( "/css/wvs-pro-theme-override{$suffix}.css" ), array(), $this->version() );
				
				$this->add_tooltip_inline_style();
				$this->add_inline_style();
			}
			
			public function add_tooltip_inline_style() {
				
				if ( apply_filters( 'disable_wvs_pro_tooltip_inline_style', false ) ) {
					return;
				}
				
				$tooltip_background = woo_variation_swatches()->get_option( 'tooltip_background_color' );
				$tooltip_color      = woo_variation_swatches()->get_option( 'tooltip_text_color' );
				$css                = sprintf( '
				
				.variable-items-wrapper .image-tooltip-wrapper{
				 border-color: %1$s !important;
                 background-color: %1$s !important;
				}
				.variable-items-wrapper .image-tooltip-wrapper:after{
                 border-top-color: %1$s !important;
				}
				
				.variable-items-wrapper [data-wvstooltip]:before {
				 background-color: %1$s !important;
				 color: %2$s !important;;
				 }
				.variable-items-wrapper [data-wvstooltip]:after {
				border-top-color: %1$s !important;
				}
               ', $tooltip_background, $tooltip_color );
				
				$css = apply_filters( 'wvs_pro_tooltip_inline_style', $css );
				wp_add_inline_style( 'woo-variation-swatches-tooltip', $css );
			}
			
			public function add_inline_style() {
				
				if ( apply_filters( 'disable_wvs_pro_inline_style', false ) ) {
					return;
				}
				
				$width     = absint( woo_variation_swatches()->get_option( 'archive_width' ) );
				$height    = absint( woo_variation_swatches()->get_option( 'archive_height' ) );
				$font_size = absint( woo_variation_swatches()->get_option( 'archive_font_size' ) );
				
				$border_color     = woo_variation_swatches()->get_option( 'border_color' );
				$border_size      = absint( woo_variation_swatches()->get_option( 'border_size' ) );
				$text_color       = woo_variation_swatches()->get_option( 'text_color' );
				$background_color = woo_variation_swatches()->get_option( 'background_color' );
				
				$hover_border_color     = woo_variation_swatches()->get_option( 'hover_border_color' );
				$hover_border_size      = absint( woo_variation_swatches()->get_option( 'hover_border_size' ) );
				$hover_text_color       = woo_variation_swatches()->get_option( 'hover_text_color' );
				$hover_background_color = woo_variation_swatches()->get_option( 'hover_background_color' );
				
				$selected_border_size      = absint( woo_variation_swatches()->get_option( 'selected_border_size' ) );
				$selected_border_color     = woo_variation_swatches()->get_option( 'selected_border_color' );
				$selected_text_color       = woo_variation_swatches()->get_option( 'selected_text_color' );
				$selected_background_color = woo_variation_swatches()->get_option( 'selected_background_color' );
				
				$large_size_width     = absint( woo_variation_swatches()->get_option( 'large_size_width' ) );
				$large_size_height    = absint( woo_variation_swatches()->get_option( 'large_size_height' ) );
				$large_size_font_size = absint( woo_variation_swatches()->get_option( 'large_size_font_size' ) );
				
				ob_start();
				include_once $this->include_path( 'stylesheet.php' );
				$css = ob_get_clean();
				$css = str_ireplace( array( '<style type="text/css">', '</style>' ), '', $css );
				$css = apply_filters( 'wvs_pro_inline_style', $css );
				wp_add_inline_style( 'woo-variation-swatches-pro', $css );
			}
			
			public function admin_enqueue_scripts() {
				//add_thickbox();
				
				$screen    = get_current_screen();
				$screen_id = $screen ? $screen->id : '';
				$suffix    = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
				
				// echo $screen_id; die;
				
				// edit-product is product list page
				// product is product edit page
				
				if ( in_array( $screen_id, array( 'product' ) ) ) {
					global $post, $thepostid;
					wp_enqueue_script( 'woo-variation-swatches-pro-admin', $this->assets_uri( "/js/admin-pro{$suffix}.js" ), array( 'jquery' ), $this->version(), true );
					wp_enqueue_style( 'woo-variation-swatches-pro-admin', $this->assets_uri( "/css/admin-pro{$suffix}.css" ), array(), $this->version() );
					
					wp_localize_script( 'woo-variation-swatches-pro-admin', 'wvs_pro_product_variation_data', apply_filters( 'wvs_pro_product_variation_data', array(
						'attribute_types' => wc_get_attribute_types(),
						'post_id'         => isset( $post->ID ) ? $post->ID : '',
						'ajax_url'        => admin_url( 'admin-ajax.php' ),
						'nonce'           => wp_create_nonce(),
						'reset_notice'    => esc_html__( 'Are you sure you want to reset it to default setting?', 'woo-variation-swatches-pro' )
					) ) );
				}
			}
			
			public function version() {
				return esc_attr( $this->_version );
			}
			
			public function language() {
				load_plugin_textdomain( 'woo-variation-swatches-pro', false, trailingslashit( WVS_PRO_PLUGIN_DIRNAME ) . 'languages' );
			}
			
			public function add_license_notice() {
				if ( ! woo_variation_swatches()->get_option( 'license_key' ) ):
					$license_link = esc_url( add_query_arg( array(
						                                        'tab'  => 'license',
						                                        'page' => 'woo-variation-swatches-settings',
					                                        ), admin_url( 'admin.php' ) ) );
					
					$download_link = esc_url( 'https://getwooplugins.com/my-account/downloads/' );
					
					echo '<div class="notice notice-error"><p><strong>Warning!</strong> you didn\'t add license key for <strong>WooCommerce Variation Swatches - Pro</strong> which means you\'re missing automatic updates.</p> <p>Please <a href="' . $license_link . '"><strong>Add License Key</strong></a> and don\'t forget to add your domain on <a target="_blank" href="' . $download_link . '"><strong>My Downloads</strong></a> page</p></div>';
				endif;
			}
			
			public function wvs_requirement_notice() {
				
				$class = 'notice notice-error';
				
				$text    = esc_html__( 'WooCommerce Variation Swatches', 'woo-variation-swatches-pro' );
				$link    = esc_url( add_query_arg( array(
					                                   'tab'       => 'plugin-information',
					                                   'plugin'    => 'woo-variation-swatches',
					                                   'TB_iframe' => 'true',
					                                   'width'     => '640',
					                                   'height'    => '500',
				                                   ), admin_url( 'plugin-install.php' ) ) );
				$message = wp_kses( __( "<strong>WooCommerce Variation Swatches - Pro</strong> is an add-on of ", 'woo-variation-swatches-pro' ), array( 'strong' => array() ) );
				
				printf( '<div class="%1$s"><p>%2$s <a class="thickbox open-plugin-details-modal" href="%3$s"><strong>%4$s</strong></a></p></div>', $class, $message, $link, $text );
				
			}
			
			public function is_wvs_active() {
				return class_exists( 'Woo_Variation_Swatches' );
			}
			
			public function images_uri( $file ) {
				$file = ltrim( $file, '/' );
				
				return WVS_PRO_IMAGES_URI . $file;
			}
			
			public function assets_uri( $file ) {
				$file = ltrim( $file, '/' );
				
				return WVS_PRO_ASSETS_URI . $file;
			}
			
			public function plugin_path() {
				return untrailingslashit( plugin_dir_path( __FILE__ ) );
			}
			
			public function template_path() {
				return apply_filters( 'wvs_pro_template_path', untrailingslashit( $this->plugin_path() ) . '/templates' );
			}
		}
		
		function woo_variation_swatches_pro() {
			return Woo_Variation_Swatches_Pro::instance();
		}
		
		add_action( 'plugins_loaded', 'woo_variation_swatches_pro', 20 );
	endif;