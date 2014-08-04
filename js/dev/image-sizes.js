;(function($){

	//alert('code');

	var images = document.getElementsByTagName('img');


	for(i = 0, l = images.length; i < l; i++){

		document.addEventListener('resize', function(e){

			console.log(e.target);

		})

	}




})(jQuery);