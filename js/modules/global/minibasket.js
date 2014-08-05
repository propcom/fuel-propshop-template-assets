document.getElementById('minibasket') && (function($){



	$(document).on('basketChanged.basket.data-api', function(e){

		$.get('/basket/mini', function(data){
			$('#minibasket').replaceWith(data);
		});

	});

	$(document).on('mouseenter', '#minibasket', function(e){

		var self = $(this);
		self.addClass('is-hovered');

	}).on('mouseleave', '#minibasket', function(e){

		var self = $(this);
		self.removeClass('is-hovered');

	});

})(jQuery);

