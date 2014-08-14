//Form: this sets up the variant selects.


document.getElementById('js-prop-add-to-basket-form') && (function($){

	"use strict";


	var loadVariant = function(variant, beforeStart, callback){

		if(typeof beforeStart === 'function')
			beforeStart(document.getElementById('js-ps-product-info-container'));

			/**
			 * Using jQuery.get() to request the new variant asynchronously
			 *
			 * http://api.jquery.com/jquery.get/
			 */

			 $.get('/product/view_info/'+variant).done(function(data){

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
				 if(history.pushState)
				 {
				 	history.pushState({variant: variant }, "", '/product/view/'+variant );
				 }

				/**
				 * Registering the form included in the response
				 */
				 ProductForms.register($('#js-prop-add-to-basket-form'));

				/**
				 * Wrapping the select elements included in the response
				 */
				 wrapSelects();

				 if(typeof callback === 'function')
				 	callback(document.getElementById('js-ps-product-info-container'));

				});

			}

			var prod_form = $('#js-prop-add-to-basket-form');

			ProductForms.register(prod_form, function(){

				$(document).on('set_option', '#js-prop-add-to-basket-form .variant-select', function (e, data) {

					var variant_id = data.product_form.selected_variant.val();

					loadVariant(variant_id, before, after)

				});

			});



		/**
		 * Click event handler for product Colours
		 *
		 * Loads in asynchronously the new colour variant
		 * Replaces the whole variant info container with the loaded data
		 * Registers the loaded form 
		 * Styles the loaded select elements
		 */
		 $('body').on('click', '.js-ps-product-color', function(e){
			/**
			 * Preventing the links default behaviour
			 */
			 e.preventDefault();

			/**
			 * caching the jQuery object corresponding to the element
			 */
			 var self = $(this);


			 loadVariant(self.attr('data-variant'), before, after);

			});

		 var before = function(elem){
		 	if(elem.style.opacity)
		 		elem.style.opacity = '0.7';

		 	if(elem.style.pointerEvents)
		 		elem.style.pointerEvents = 'none';


		 };

		 var after = function(elem){
		 	if(elem.style.opacity)
		 		elem.style.opacity = '1';

		 	if(elem.style.pointerEvents)
		 		elem.style.pointerEvents = 'auto';

		 }

		})(jQuery);

		document.getElementById('js-ps-ajax-wishlist-logged') && (function($){

			$(document).on('click', '#js-ps-ajax-wishlist-logged', function(e){

				e.preventDefault();

				addMessage = function(type, message){

					$('.alert') && $('.alert').remove();

					$(document.body)
					.prepend('<div class="row alert alert--'+type+'" id="js-ps-alert"><div class="container alert__container"><a class="alert__container__close" id="js-ps-alert-close" href="#" data-dismiss="alert">&times;</a><p class="alert__container__copy">'+message+'</p></div></div>');

				};

				$.ajax({
					url: '/wishlist/rest/add.json',
					data: {product_id: $('#js-ps-product-variant-id').val()},
					type: 'GET',
					cache: false,
					success: function(data) {
						!data.success && addMessage('error', 'There was a problem adding your product to the wishlis, please try again later.');
						data.success === 0 && addMessage('error', data.msg); 
						data.success === 1 && addMessage('success', data.msg);
					}
				}).fail(function(data){
					addMessage('error', 'There was a problem adding your product to the wishlis, please try again later.');
				});

			})

}(jQuery));
document.getElementById('js-ps-ajax-wishlist') && (function($){

	$(document).on('click', '#js-ps-ajax-wishlist', function(e){

		e.preventDefault();

		window.location = '/wishlist/add/'+$('#js-ps-product-variant-id').val();


	})

}(jQuery));


document.getElementById('js-ps-share-email') && (function($){

	$(document).on('click', '#js-ps-share-email', function(e){
		e.preventDefault();

		!$('#js-ps-share-email-container').hasClass('is-open') && $('#js-ps-share-email-container').addClass('is-open');


	});


	$(document).on('click', '#js-ps-share-email-container input[type="submit"]', function(e){

		e.preventDefault();

		var form = $('#js-ps-share-email-container form'), formData = form.serialize(), req = form.find('input[required="required"]'), valid = true, check = function(element){
			var evt = document.createEvent('KeyboardEvent');
			evt.initKeyboardEvent('keyup');
			document.createEvent ? element.get(0).dispatchEvent(evt) : element.get(0).fireEvent('onkeyup');
		};

		req.each(function(){

			var input = $(this);


			if(input.val() === ''){
				check(input);
				valid = false;
			}	


		});


		if(valid === false || form.find('.help-inline').length > 0){ return; }


		$.ajax({
			url: '',
			data: formData,
			type: 'POST',
			cache: false,
			success: function(data) {
				$('.alert') && $('.alert').remove();
				var alert = ($($.parseHTML(data)).filter('.alert'));
				alert.hasClass('alert--success') && $(document.body).prepend(alert), $('#js-ps-share-email-container form').get(0).reset(), $('#js-ps-share-email-container').removeClass('is-open');
				alert.hasClass('alert--error') && $(document.body).prepend(alert);
			}
		});

		


	});

$(document).on('click', '#js-ps-share-email-container-close', function(e){

	e.preventDefault();

	$('#js-ps-share-email-container').hasClass('is-open') && $('#js-ps-share-email-container').removeClass('is-open');

});


}(jQuery));
