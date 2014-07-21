(function(){
	$(document).ready(function(){
		$('body').delegate('.mini-basket-dropdown').on('basketChanged.basket.data-api', function(e){
			$.get('/basket/mini', function(data){
				$('.mini-basket-wrap').replaceWith(data);
			});
		});
	});
})(jQuery)
