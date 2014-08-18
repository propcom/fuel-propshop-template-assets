;document.getElementById('js-ps-filters') && (function($){ // Basic short circuit checking for the presence of serach ad category filters in phe page - If true triggers IIFE adding the event listeners and handle logic
	
	"use strict";

	$('.js-ps-filter-content.is-open').css('height', function(){
		return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
	});


	/**
	 * Body's delegated event targeting the filters trigger
	 * 
	 * @param  {event} evt Filter trigger click event listener
	 * @return {void}
	 */
	$(document).on('click', '.js-ps-filter-trigger', function(evt){





		/**
		 * Caching trigger sibling where handler logic is to be applied
		 *
		 * @type {JQuery} Event target sibling
		 */
		var sibling = $(evt.target).siblings('.js-ps-filter-content');


		/**
		 * Handler logic: if open remove height and close, if closed add height and open
		 *  
		 * @return {void}
		 */
		sibling.hasClass('is-open') ? sibling.css({'height': 0}).removeClass('is-open') : sibling.css('height', function(){
			return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
		}).addClass('is-open');

		sibling.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){

			$('#js-ps-category-page').css('min-height', function(){
		        return ( $('#js-ps-filters').height() + $('#search-filter-filters').height() )+'px';
		    });
		})


		


	});

	
	 /**
	  * Body's delegated event targeting the form (trigger) containing the filters
	  * @param  {event} evt Form trigger click event listener
	  * @return {[type]}     [description]
	  */
	$(document).on('click','.js-filter-form-trigger', function(evt){
								
		evt.preventDefault();

		/**
		 * Caching the form trigger jQuery object
		 * 
		 * @type {JQuery}
		 */
		var btn = $(this), 

		/**
		 * Caching filter's header height; 
		 * 
		 * @type {number}
		 */
		headerHeight = document.getElementById('js-ps-filters-header').clientHeight;


		/**
		 * Handler logic: if open remove height and close, if closed add height and open  
		 * @return {void}
		 */
		btn.parent().hasClass('is-open')? btn.parent().css('height', function(){
			return headerHeight+'px';
		}).removeClass('is-open') : btn.parent().css('height', function(){
			return (btn.parent().children('form').height() + headerHeight)+'px'; 
		}).addClass('is-open');
	});
	
})(jQuery);