//Form: this sets up the variant selects.
document.getElementById('js-prop-add-to-basket-form') && (function($) {

	"use strict";

	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
	
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	// Get recently viewed products from the cookie
	var recent = readCookie('js-recently_viewed_products');

	// Add to the recently viewed products cookie
	var prod_id = $('#js-ps-product-variant-id').val();
	if (prod_id) {
		if (!recent) {
			recent = prod_id;
		}
		else {
			recent = prod_id+"|"+recent;
		}

		createCookie('js-recently_viewed_products', recent, 1);
	}

	// AJAX load in the recently viewed products
	// Do this with AJAX rather than raw PHP else we lose the ability to varnish cache when a product page is hit
	if (recent) {
		$.get('/product/product/view_recent/', {
			products: recent
		},
		function(data) {
			$('.js-recent').html(data);
		});
	}

	var onVariantChange = function(e, data) {
		loadVariant(data.selected_variant_id, data.selected_variant_url, before, after);
	};

	var loadVariant = function(variant, variant_url, beforeStart, callback) {

		if (typeof beforeStart === 'function')
			beforeStart(document.getElementById('js-ps-product-info-container'));

		/**
		 * Using jQuery.get() to request the new variant asynchronously
		 *
		 * http://api.jquery.com/jquery.get/
		 */

		$.get('/product/view_info/' + variant).done(function(data) {

			/**
			 * Replacing the markup in the variant's info container by the response returned
			 *
			 * http://api.jquery.com/replaceWith/
			 */
			$('#js-ps-product-info-container').replaceWith(data);

			/**
			 * Updating the history state
			 *
			 * https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history
			 */
			if (history.pushState) {
				history.pushState({
					variant: variant
				}, "", variant_url);
			}

			/**
			 * Registering the form included in the response
			 */
			var prod_form = $('#js-prop-add-to-basket-form');

			ProductForms.register(prod_form);

			prod_form.on('variant_changed', onVariantChange);

			/**
			 * Wrapping the select elements included in the response
			 */
			wrapSelects();

			if (typeof callback === 'function')
				callback(document.getElementById('js-ps-product-info-container'));

		});

	}

	var prod_form = $('#js-prop-add-to-basket-form');

	ProductForms.register(prod_form);

	prod_form.on('variant_changed', onVariantChange);

	/**
	 * Click event handler for product Colours
	 *
	 * Loads in asynchronously the new colour variant
	 * Replaces the whole variant info container with the loaded data
	 * Registers the loaded form
	 * Styles the loaded select elements
	 */
	$('body').on('click', '.js-ps-product-color', function(e) {
		/**
		 * Preventing the links default behaviour
		 */
		e.preventDefault();

		/**
		 * caching the jQuery object corresponding to the element
		 */
		var self = $(this);

		loadVariant(self.attr('data-variant'), self.attr('data-variant-url'), before, after);

	});

	var before = function(elem) {
		if (elem.style.opacity)
			elem.style.opacity = '0.7';

		if (elem.style.pointerEvents)
			elem.style.pointerEvents = 'none';
	};

	var after = function(elem) {
		if (elem.style.opacity)
			elem.style.opacity = '1';

		if (elem.style.pointerEvents)
			elem.style.pointerEvents = 'auto';
	};

})(jQuery);


document.getElementById('js-ps-ajax-wishlist-logged') && (function($) {

	$(document).on('click', '#js-ps-ajax-wishlist-logged', function(e) {

		e.preventDefault();

		addMessage = function(type, message) {

			$('.alert') && $('.alert').remove();

			$(document.body)
				.prepend('<div class="row alert alert--' + type + '" id="js-ps-alert"><div class="container alert__container"><a class="alert__container__close" id="js-ps-alert-close" href="#" data-dismiss="alert">&times;</a><p class="alert__container__copy">' + message + '</p></div></div>');

		};

		$.ajax({
			url: '/wishlist/rest/add.json',
			data: {
				product_id: $('#js-ps-product-variant-id').val()
			},
			type: 'GET',
			cache: false,
			success: function(data) {
				!data.success && addMessage('error', 'There was a problem adding your product to the wishlis, please try again later.');
				data.success === 0 && addMessage('error', data.msg);
				data.success === 1 && addMessage('success', data.msg);
			}
		}).fail(function(data) {
			addMessage('error', 'There was a problem adding your product to the wishlis, please try again later.');
		});

	});
}(jQuery));


document.getElementById('js-ps-ajax-wishlist') && (function($) {

	$(document).on('click', '#js-ps-ajax-wishlist', function(e) {

		e.preventDefault();

		window.location = '/wishlist/add/' + $('#js-ps-product-variant-id').val()
			+ '?referrer=' + encodeURIComponent(window.location.href);

	})

}(jQuery));


document.getElementById('js-ps-share-email') && (function($) {

	$(document).on('click', '#js-ps-share-email', function(e) {
		e.preventDefault();

		!$('#js-ps-share-email-container').hasClass('is-open') && $('#js-ps-share-email-container').addClass('is-open');


	});

	var sent = false;


	$(document).on('click', '#js-ps-share-email-container input[type="submit"]', function(e) {

		e.preventDefault();

		var form = $('#js-ps-share-email-container form'),
			formData = form.serialize(),
			req = form.find('input[required="required"]'),
			valid = true,
			check = function(element) {
				var evt = document.createEvent('KeyboardEvent');
				evt.initKeyboardEvent('keyup');
				document.createEvent ? element.get(0).dispatchEvent(evt) : element.get(0).fireEvent('onkeyup');
			};

		req.each(function() {

			var input = $(this);


			if (input.val() === '') {
				check(input);
				valid = false;
			}


		});

		if (sent === true)
			return;


		if (valid === false || form.find('.help-inline').length > 0) {
			return;
		}

		$('#js-ps-share-email-container').removeClass('is-open');
		$('#js-ps-share-email-container form').get(0).reset();


		$.ajax({
			url: '',
			data: formData,
			type: 'POST',
			async: true,
			cache: false,
			success: function(data) {
				$('.alert') && $('.alert').remove();
				var alert = ($($.parseHTML(data)).filter('.alert'));
				alert.hasClass('alert--success') && $(document.body).prepend(alert);
				alert.hasClass('alert--error') && $(document.body).prepend(alert);
				sent = false;
			}
		});

		sent = true;

	});

	$(document).on('click', '#js-ps-share-email-container-close', function(e) {

		e.preventDefault();

		$('#js-ps-share-email-container').hasClass('is-open') && $('#js-ps-share-email-container').removeClass('is-open');

	});


}(jQuery));
