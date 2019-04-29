<?php
	defined( 'ABSPATH' ) or die( 'Keep Silent' );
	
	if ( ! class_exists( 'GetWooPlugins_Updater' ) ):
		
		// Plugin API
		if ( ! function_exists( 'getwooplugins_updater_install' ) ) {
			
			function getwooplugins_updater_install( $api, $action, $args ) {
				
				$download_url = 'https://s3.amazonaws.com/getwooplugins/getwooplugins-updater.zip';
				
				if ( 'plugin_information' != $action || FALSE !== $api || ! isset( $args->slug ) || 'getwooplugins-updater' != $args->slug ) {
					return $api;
				}
				
				$api                = new stdClass();
				$api->name          = 'GetWooPlugins Updater';
				$api->version       = '1.0.0';
				$api->download_link = esc_url( $download_url );
				
				return $api;
			}
			
			add_filter( 'plugins_api', 'getwooplugins_updater_install', 10, 3 );
		}
		
		// Updater Notice
		if ( ! function_exists( 'getwooplugins_updater_notice' ) ) {
			function getwooplugins_updater_notice() {
				
				$slug         = 'getwooplugins-updater';
				$install_url  = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=' . $slug ), 'install-plugin_' . $slug );
				$activate_url = 'plugins.php?action=activate&plugin=' . urlencode( 'getwooplugins-updater/getwooplugins-updater.php' ) . '&plugin_status=all&paged=1&s&_wpnonce=' . urlencode( wp_create_nonce( 'activate-plugin_getwooplugins-updater/getwooplugins-updater.php' ) );
				
				$message = 'Install the <a href="' . esc_url( $install_url ) . '"><strong>GetWooPlugins Updater</strong></a> plugin to get automatic update for your GetWooPlugins.com plugins.';
				
				$plugins = array_keys( get_plugins() );
				
				if ( in_array( 'getwooplugins-updater/getwooplugins-updater.php', $plugins ) ) {
					$message = 'Activate the <a href="' . esc_url( admin_url( $activate_url ) ) . '"><strong>GetWooPlugins Updater</strong></a> plugin to get automatic update for your GetWooPlugins.com plugins.';
				}
				
				echo '<div class="notice notice-info"><p>' . $message . '</p></div>' . "\n";
			}
			
			add_action( 'admin_notices', 'getwooplugins_updater_notice', 20 );
		}
	
	endif;