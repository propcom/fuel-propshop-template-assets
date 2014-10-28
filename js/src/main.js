
(typeof window.imager === 'object') && (function(){

	window.imager.onImagesReplaced =  function(){

		//window.GetSizes && 'addEventListener' in window && window.GetSizes(this, document.body.clientWidth);


		/**
		* Checks the DOM for zoom wrapper element via and id, if the element exists instanciates elevateZoom
		*
		*/
		document.getElementById('js-ps-zoom-wrapper') && (function(){

			$.removeData($(".js-ps-zoom").get(0));

			document.querySelector('.zoomContainer') && document.body.removeChild(document.querySelector('.zoomContainer'));

			$(".js-ps-zoom").elevateZoom({
				zoomType	: "inner",
				cursor      : "crosshair",
				easing : true,
				responsive: true,
				preloading: 0,
				zoomWindowFadeIn: 681,
				zoomWindowFadeOut: 681
			});

		}());

	};
}());



/**
 * Checks the Dom for the presence of a slider class and initiazes it
 */
document.querySelector('.js-ps-slider') && (function(){

	new Slider('.js-ps-slider', {
		imgr: window.imager,
		modernizr : window.Modernizr
	});

}());


/**
 * Checks for the presence of images to be loaded on hover and appends the event listener
 */
document.querySelector('.js-ps-img-hover') && $('body').on('mouseover', '.js-ps-img-hover',{imager: window.imager},function(evt){

	evt.preventDefault();
	evt.data.imager.checkImagesNeedReplacing(evt.target.parentNode.getElementsByTagName('img'));

});

document.getElementById('js-ps-zoom-additional') && document.getElementById('js-ps-zoom-wrapper') && $('body').on('click', '#js-ps-zoom-additional a',{imager: window.imager}, function(evt){

	evt.preventDefault(); // prevent events default behaviour


	var $this = $(this);

	$('.js-ps-zoom').attr('data-src', $this.attr('data-img'));

	$('.js-ps-zoom').attr('data-zoom-image', $this.attr('data-zoom'));

	evt.data.imager.replaceImagesBasedOnScreenDimensions(document.querySelector('.js-ps-zoom'));
	evt.data.imager.onImagesReplaced();


});





/**
 * Checks if in one of the customer account pages
 */

document.getElementById('propshop-customer')&& (function($){

	var nativeSelectEv = function(elem){

		var event = document.createEvent('HTMLEvents');
		event.initEvent('change', true, false);
		elem.dispatchEvent(event);

	};

    var signupForm = $('#js-ps-account-signup-form'), loginForm = $('#js-ps-account-login-form'),  activeForm = $('.is-open');

    activeForm.css('height', function(){
          return (activeForm.children('div').get(0).clientHeight + parseInt(activeForm.css('padding-top')) + parseInt(activeForm.css('padding-bottom')) ) + 'px';
    });


    $(document).on('click', '#js-ps-account-signup-btn', function(e){

        e.preventDefault();

        if(!signupForm.hasClass('is-open')){

            signupForm.css('height', function(){
                return signupForm.children('div').get(0).clientHeight + 'px';
            }).addClass('is-open');

            loginForm.css('height', '0px').removeClass('is-open');
        }
    });


    $(document).on('click', '#js-ps-account-login-btn', function(e){

        e.preventDefault();

        if(!loginForm.hasClass('is-open')){

            loginForm.css('height', function(){
                return loginForm.children('div').get(0).clientHeight + 'px';
            }).addClass('is-open');

            signupForm.css('height', '0px').removeClass('is-open');
        }
    });


    $(document).on('change','select[name="country_code"]',function(e){

    	$this = $(this);

        $.ajax('/customer/rest/address_states.json', {
				'type': 'get',
				'async': true,
				cache: false,
				'data': {country_code: $this.val()},
				'dataType': 'json',
				'success': function (data) {

					var state_select = $('.js-state-code');

					state_select.empty();

					$.each(data, function (code, name) {
						var $opt = $('<option/>');

						$opt.attr('value', code);
						$opt.html(name);

						state_select.append($opt);
					});

					if(state_select){

						document.createEvent ? nativeSelectEv(state_select.get(0)) : state_select.get(0).fireEvent('onchange');

					}

				}

		});

   });

}(jQuery));


/**
 * Checks if on wishlist page and appends the click eventListeners
 */

document.getElementById('js-ps-wishlist-grid') && (function($){

	$(document).on('click', '.js-ps-wishlist-trigger', function(e){

		e.preventDefault();

		var $this = $(this);

		$this.parents('li').find('.js-ps-wishlist-info').addClass('is-active');

	});

	$(document).on('click', '.js-ps-wishlist-close-trigger', function(e){

		e.preventDefault();

		var $this = $(this);

		$this.parents('.js-ps-wishlist-info').removeClass('is-active');

	})

}(jQuery));



document.getElementById('js-ps-newsletter') && (function($){

	$(document).on('submit', '#js-ps-newsletter form', function(e){
		e.preventDefault();
		var action = $('#js-ps-newsletter form').attr('action');
		var data = $('#js-ps-newsletter form').serialize();
		$.ajax({
			url: action,
			type: 'POST',
			cache: false,
			data: data,
			success: function(data) {
				$('#js-ps-newsletter').replaceWith(data);
			}
		}).done(function(){
			document.getElementById('js-ps-ajax-overlay') && document.body.removeChild(document.getElementById('js-ps-ajax-overlay'));
		}).fail(function(){
			alert('newsletter sign up failed');
		});
	});

}(jQuery));



/**
 * Using ajaxComplete to trigger an elements update on imager after an ajax request
 * @return {void}
 */
$(document).ajaxComplete(function(){
	window.imager.updateDivs();
});
