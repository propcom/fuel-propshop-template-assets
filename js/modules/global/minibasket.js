document.getElementById('js-ps-minibasket') && (function($){ // IIFE is only ran if minibasket Element exists in the DOM  

	/**
	 * Invoking strict mode
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
	 */

	"use strict";

	/**
	 * Defines a document event Listener for the basketChange event
	 *  
	 * @return {undefined} [description]
	 */
	$(document).on('basketChanged.basket.data-api', function(){

		/**
		 * Polls the /basket/mini restful action via ajax to return the updated minibasket markup      
		 */
		$.ajax({
			url: '/basket/mini',
			type: 'GET',
			cache: false,
			success: function(data){
				/**
				 * If the ajax request response is succesfull replace the minibasket markup by the response
				 */
               $('#js-ps-minibasket').replaceWith(data);

			}
		}).fail(function(){
			alert('we need some validation here');
		}).done(function(){

			/**
			 * Adds is-hovered class to the minibasket element presenting it 
			 */
			$('#js-ps-minibasket').addClass('is-hovered');

			/**
			 * Removes is-hovered class afer a defined time interval
			 */
			setTimeout(function(){
				$('#js-ps-minibasket').removeClass('is-hovered');
			},3000);
			
		});

	});


	/**
	 * Adding hover events to minibasket
	 */
	$(document).on('mouseenter', '#js-ps-minibasket', function(){

		var self = $(this);
		self.addClass('is-hovered');

	}).on('mouseleave', '#js-ps-minibasket', function(){

		var self = $(this);
		self.removeClass('is-hovered');

	});

}(jQuery));

