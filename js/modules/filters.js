;document.getElementById('js-is-filter') && (function($){

	$('body').on('click', '.js-filter-trigger', function(e){

		var _this = $(e.target), sibling = _this.siblings('.js-filter-content');

		sibling.hasClass('is-open') ? sibling.css({'height': 0}).removeClass('is-open') : sibling.css('height', function(){
			return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
		}).addClass('is-open');

	});

	$('body').on('click','.js-filter-form-trigger', function(evt){
								
		evt.preventDefault();

		var btn = $(this);

		btn.parent().hasClass('is-open')? btn.parent().css('height', function(){
			return btn.prev('h3').height() +'px';
		}).removeClass('is-open') : btn.parent().css('height', function(){
			return (btn.next('form').height() + btn.prev('h3').height()) +'px'; 
		}).addClass('is-open');
	});
	
})(jQuery);