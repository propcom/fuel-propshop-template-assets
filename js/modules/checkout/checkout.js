// $(document).ready(function () {
//     if ( $('#shipping_chk').is(':checked')) {
//         $('#js-shipping-form').hide();
//     }

//     $('#shipping_chk').on('click', function () {
//         if ( ! $(this).is(':checked')) {
//             $('#js-shipping-form').show();
//         } else {
//             $('#js-shipping-form').hide();
//         }
//     });
// });



(function(){

    "use strict";

    var imgr = new Imager({
        selector: '.js-ps-img', 
        className:'scale-with-grid',    
        availableWidths: [ 960, 800, 768,600, 480, 360, 320, 0], 
        lazyload: true
    });

}());

document.getElementById('propshop-checkout')&& (function($){

    var signupForm = $('#js-ps-checkout-signup-form'), loginForm = $('#js-ps-checkout-login-form'), activeForm = $('is-open');

    activeForm.css('height', function(){
         return activeForm.children('div').get(0).clientHeight + 'px';
    });

    $(document).on('click', '#js-ps-checkout-signup-btn', function(e){

        e.preventDefault();

        if(!signupForm.hasClass('is-open')){

            signupForm.css('height', function(){
                return signupForm.children('div').get(0).clientHeight + 'px';
            }).addClass('is-open');

            loginForm.css('height', '0px').removeClass('is-open');
        }
    });


    $(document).on('click', '#js-ps-checkout-login-btn', function(e){

        e.preventDefault();

        if(!loginForm.hasClass('is-open')){

            loginForm.css('height', function(){
                return loginForm.children('div').get(0).clientHeight + 'px';
            }).addClass('is-open');

            signupForm.css('height', '0px').removeClass('is-open');
        }
    });


}(jQuery));


