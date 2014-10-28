;document.getElementById('js-ps-country-select') && (function(){

	var el = document.getElementById('js-ps-country-select'),
		changeCountry = function(el){

			el.options[el.selectedIndex] ? option = el.options[el.selectedIndex].value : option = '';

			window.location = option;

		};

	el.addEventListener ? el.addEventListener('change', changeCountry(el)) : el.attachEvent('on' + 'change', function(){
      changeCountry.call(el);
    });

}());