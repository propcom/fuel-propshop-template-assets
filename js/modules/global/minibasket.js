document.getElementById('minibasket') && (function($){



	$(document).on('basketChanged.basket.data-api', function(e){

		$.ajax({
			url: '/basket/mini',
			type: 'GET',
			cache: false,
			success: function(data) {

               $('#minibasket').replaceWith(data);

			}
		}).done(function(){
			$('#minibasket').addClass('is-hovered');

			setTimeout(function(){
				$('#minibasket').removeClass('is-hovered');
			},3000);
			
		}).fail(function(){
			alert('we need some validation here');
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

