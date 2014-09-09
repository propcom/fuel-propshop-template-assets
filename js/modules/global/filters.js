;document.getElementById('js-ps-filters') && (function($){ // Basic short circuit checking for the presence of serach ad category filters in phe page - If true triggers IIFE adding the event listeners and handle logic
	
	"use strict";

	// $('.js-ps-filter-content.is-open').css('height', function(){
	// 	return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
	// });


	/**
	 * Body's delegated event targeting the filters trigger
	 * 
	 * @param  {event} evt Filter trigger click event listener
	 * @return {void}
	 */
	$(document).on('click touchend', '.js-ps-filter-trigger', function(evt){

		evt.preventDefault();



		/**
		 * Caching trigger sibling where handler logic is to be applied
		 *
		 * @type {JQuery} Event target sibling
		 */
		var sibling = $(this).parents('.filter-collection').find('.js-ps-filter-content');


		/**
		 * Handler logic: if open remove height and close, if closed add height and open
		 *  
		 * @return {void}
		 */
		sibling.hasClass('is-open') ? sibling.slideUp(382).removeClass('is-open') : sibling.slideDown(382).addClass('is-open');

	});

	
	 /**
	  * Body's delegated event targeting the form (trigger) containing the filters
	  * @param  {event} evt Form trigger click event listener
	  * @return {[type]}     [description]
	  */
	$(document).on('click touchend','.js-filter-form-trigger', function(evt){
								
		evt.preventDefault();

		/**
		 * Caching the form trigger jQuery object
		 * 
		 * @type {JQuery}
		 */
		var btn = $(this);



		/**
		 * Handler logic: if open remove height and close, if closed add height and open  
		 * @return {void}
		 */
		btn.parent().find('#search-filter-filters').hasClass('is-open')? btn.parent().find('#search-filter-filters').slideUp(382).removeClass('is-open') : btn.parent().find('#search-filter-filters').slideDown(382).addClass('is-open');
	});


	$(document).on('click touchend', '.js-ps-filter-dropdown', function(evt){

		evt.preventDefault();

		var $this = $(this), list = $this.parent('dd').find('dl');

		list.hasClass('is-open') ? (function(){

			$this.removeClass('is-active');
			list.slideUp(382).removeClass('is-open');

		}()) : (function(){

			$this.addClass('is-active');
			list.slideDown(382).addClass('is-open')

		}());

	});
	
})(jQuery);