<?php
	defined( 'ABSPATH' ) or die( 'Keep Silent' );
	
	$attributes = $args[ 'options' ][ 'variations' ][ 'attributes' ];
	
	$attribute_keys       = array_keys( $attributes );
	$available_variations = $args[ 'options' ][ 'variations' ][ 'available_variations' ];
	$product              = $args[ 'product' ];
	
	if ( empty( $available_variations ) && false !== $available_variations ) {
		return;
	}
	
	$show_clear        = woo_variation_swatches()->get_option( 'show_clear_on_archive' );
	$catalog_mode      = woo_variation_swatches()->get_option( 'enable_catalog_mode' );
	$catalog_attribute = woo_variation_swatches()->get_option( 'catalog_mode_attribute' );
?>

<div class="variations_form wvs-archive-variation-wrapper" data-product_id="<?php echo absint( $product->get_id() ); ?>" data-product_variations="<?php echo htmlspecialchars( wp_json_encode( $available_variations ) ) ?>">
    <ul class="variations">
		<?php foreach ( $attributes as $attribute_name => $options ) :
			
			$selected = isset( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ? wc_clean( stripslashes( urldecode( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ) ) : $product->get_variation_default_attribute( $attribute_name );
			
			if ( $catalog_mode ) {
				$product_settings = (array) get_post_meta( $product->get_id(), '_wvs_product_attributes', true );
				if ( isset( $product_settings[ 'catalog_attribute' ] ) && ! empty( $product_settings[ 'catalog_attribute' ] ) ) {
					$catalog_attribute = trim( $product_settings[ 'catalog_attribute' ] );
				}
				if ( $catalog_attribute == $attribute_name ) {
					echo '<li>';
					wc_dropdown_variation_attribute_options( array( 'options' => $options, 'attribute' => $attribute_name, 'product' => $product, 'selected' => $selected, 'is_archive' => true ) );
					echo '</li>';
				}
			} else {
				echo '<li>';
				wc_dropdown_variation_attribute_options( array( 'options' => $options, 'attribute' => $attribute_name, 'product' => $product, 'selected' => $selected, 'is_archive' => true ) );
				echo '</li>';
			}
		endforeach;
			
			
			if ( $show_clear && ! $catalog_mode ):
				echo apply_filters( 'woocommerce_reset_variations_link', '<li class="reset_variations woo_variation_swatches_archive_reset_variations"><a href="#">' . esc_html__( 'Clear', 'woocommerce' ) . '</a></li>' );
			endif;
		?>
    </ul>
</div>

