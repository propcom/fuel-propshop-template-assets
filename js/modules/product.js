//Form: this sets up the variant selects.


document.getElementById('js-prop-add-to-basket-form') && (function($){

		ProductForms.register($('#js-prop-add-to-basket-form'));

		$('#js-prop-add-to-basket-form .variant-select').on('set_option', function (e, data) {

			console.log(data);
			console.log(data.product_form.selected_variant.val());
			var variant_id = data.product_form.selected_variant.val();
			if (variant_id) {
				$('.product-info__price').html(data.product_form.variant_meta[variant_id]['price']);
				if (data.product_form.variant_meta[variant_id]['saleable'] === 1) {
					$('.out-of-stock-form').hide();
					$('.basket-buy-now').show();
				}
				else {
					$('.out-of-stock-form').show();
					$('.basket-buy-now').hide();
				}
			}
			else {
				$('.product-info__price').html('running');
			}
		});

})(jQuery);
