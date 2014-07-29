//Form: this sets up the variant selects.


document.getElementById('js-prop-add-to-basket-form') && (function($){

		var prod_form = $('#js-prop-add-to-basket-form');

		ProductForms.register(prod_form);

 		prod_form.on('variant_changed', function (e, data) {
			alert('Variant changed: ' + data.selected_variant_id);
		});

		$('#js-prop-add-to-basket-form .variant-select').on('set_option', function (e, data) {

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


		$('body').on('click', '.js-ps-product-color', function(e){

			e.preventDefault();

			var self = $(this), variant = self.attr('data-variant'), url = '/product/view_info/'+variant;

			$.get(url)
				.done(function(data){

					$('#js-ps-product-info-container').replaceWith(data);
					history.pushState({variant: variant }, "", '/product/view/'+variant );
					
				});

		});

})(jQuery);
