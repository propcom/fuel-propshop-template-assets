;document.getElementById('js-ps-country-select') && (function(){

	var el = document.getElementById('js-ps-country-select'),
		hasChanged = 0,
		changeCountry = function(el){

			el.options[el.selectedIndex] ? option = el.options[el.selectedIndex].value : option = '';

			hasChanged === 1 && window.location = option;

			hasChanged = 1;

		};

	el.addEventListener ? el.addEventListener('change', changeCountry(el)) : el.attachEvent('on' + 'change', function(){
      changeCountry.call(el);
    });

}());