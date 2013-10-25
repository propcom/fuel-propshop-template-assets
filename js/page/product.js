$(function(){
    $('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();

	ProductForms.register($('.js-product-form'));

	$('.js-product-form .variant-select').on('set_option', function(e, data){
		var variant_id = data.product_form.selected_variant.val(),
			product_price = $('.price strong').text();

		if(variant_id)
		{
			$('.price strong').html(data.product_form.variant_meta[variant_id]['price']);
			if (data.product_form.variant_meta[variant_id]['saleable'] == 1)
			{
				$('.out-of-stock-form').hide();
				$('.basket-buy-now').show();
			}
			else
			{
				$('.out-of-stock-form').show();
				$('.basket-buy-now').hide();
			}
		}
		else
		{
			$('.price strong').html(product_price);
		}
	});
});

