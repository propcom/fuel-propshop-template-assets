;document.querySelector('.js-ps-header-menu') && (function($){

	var $menuParents = $('.js-ps-header-menu'), $menuContainer = $('#js-ps-header-menu-container');

	$menuParents.each(function(index){

		var $self = $(this);

		$self.hover(function(){

			var factor = $self.children('.js-ps-header-menu-submenu').children().length

			$menuContainer.css('height', function(){
				return ((factor+1)*100)+'%';
			}).addClass('is-open');
			$self.find('.js-ps-header-menu-submenu').addClass('is-open');

			



		},function(){

			$menuContainer.css('height', '100%').removeClass('is-open');
			$self.find('.js-ps-header-menu-submenu').removeClass('is-open');

		});

	});



})(jQuery);