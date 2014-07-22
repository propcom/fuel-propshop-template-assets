;document.getElementById('js-is-filter') && (function($){

	$('body').on('click', '.js-filter-trigger', function(e){

		var _this = $(e.target), sibling = _this.siblings('.js-filter-content');

		sibling.hasClass('is-open') ? sibling.css({'height': 0}).removeClass('is-open') : sibling.css('height', function(){
			return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
		}).addClass('is-open');

	});
	
})(jQuery);