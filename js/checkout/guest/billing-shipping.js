$(function(){
	var copy_address_regex = /(\b|^)js-copy-address(\b|$)/g,
		delivery_regex = /^delivery_/g,
		delivery_and_billing_regex = /^(delivery|billing)_/g,
		match_regex = delivery_regex,
		shipping_options_ajax = null,
		$shipping_container = $(".js-shipping-container"),
		$no_shipping = $(".js-no-shipping"),
		redraw_shipping_options = function() {
			var copy_address_field = this.className.match(copy_address_regex),
				name = this.getAttribute("name"),
				matched = name.match(match_regex);

			if(copy_address_field) {
				match_regex = this.checked ? delivery_and_billing_regex : delivery_regex;
			}

			if(copy_address_field || matched) {
				shipping_options_ajax && shipping_options_ajax.abort();
				shipping_options_ajax = $.ajax({
					url:_u('/checkout/shipping_options/'),
					type:'POST',
					data:$(this).closest('form').serialize(),
					dataType:'JSON',
					success:function(response) {
						$shipping_container.html(response.success ? response.html : '');
						$no_shipping.toggle(!response.success);
					},
					complete:function() {
						shipping_options_ajax = null;
					}
				});
			}
		};

	if($shipping_container) {
		$('.checkout').on('change', 'input, select', redraw_shipping_options);
		redraw_shipping_options.call($('.js-copy-address')[0]);
	}
});