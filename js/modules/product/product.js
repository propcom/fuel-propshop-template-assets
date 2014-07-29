//Form: this sets up the variant selects.


document.getElementById('js-prop-add-to-basket-form') && (function($){


		var loadVariant = function(variant){

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
				history.pushState({variant: variant }, "", '/product/view/'+variant );

				/**
				 * Registering the form included in the response
				 */
				ProductForms.register($('#js-prop-add-to-basket-form'));

				/**
				 * Wrapping the select elements included in the response
				 */
				wrapSelects();

			});

		}

		var prod_form = $('#js-prop-add-to-basket-form');

		ProductForms.register(prod_form);

		$('#js-prop-add-to-basket-form .variant-select').on('set_option', function (e, data) {

			var variant_id = data.product_form.selected_variant.val();

			loadVariant(variant_id)

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


			loadVariant(self.attr('data-variant'));

		});

})(jQuery);
