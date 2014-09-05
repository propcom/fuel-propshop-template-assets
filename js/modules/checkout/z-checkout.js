;(function(){

    "use strict";

    var imgr = new Imager({
        selector: '.js-ps-img', 
        className:'scale-with-grid',    
        availableWidths: [ 960, 800, 768,600, 480, 360, 320, 0], 
        lazyload: true
    });

}());

document.getElementById('propshop-checkout')&& (function($){

    'use strict';

    var signupForm = $('#js-ps-checkout-signup-form'), loginForm = $('#js-ps-checkout-login-form'), activeForm = $('.is-open');
    activeForm.css('height', function(){
         return (activeForm.children('div').get(0).clientHeight + parseInt(activeForm.css('padding-top')) + parseInt(activeForm.css('padding-bottom')) ) + 'px';
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


document.getElementById('sage-payment-form') && (function($){

    'use strict';

    var number = $('#payment_details--card_number'), type = $('#payment_details--card_type'), template = type.attr('data-template');

   number.validateCreditCard(function(result){

        var matches = $.parseJSON(type.attr('data-matches'));

        if(result.length_valid && result.luhn_valid){

            type.val(matches[result.card_type.name]);

           number.parent().css('position', 'relative').append('<span class="input__card-image" id="card-helper"><img src="'+template+result.card_type.name+'.svg" onerror="this.onerror=null; this.src=\''+template+result.card_type.name+'.png\'" /></span>')



        } else if(!result.length_valid || result.luhn_valid){

            number.parent().find('#card-helper').remove();
            //trigger validation
        }

    }, { accept: $.parseJSON(type.attr('data-valid')) });

}(jQuery));


document.getElementById('js-ps-checkout-review-shipping') && (function($){

    'use strict';

function getQuote(input){

        $.ajax({
            url: '/checkout/rest/shipping_quote.json',
            type: 'GET',
            data: { id : input.val()},
            success: function(data) {

                $('#js-ps-checkout-review-shipping-quote').removeClass('op0').find('span').text(data.amount);
                $('#js-ps-checkout-review-total').find('span').text(data.total);
               
            }
        }).fail(function(data){
                $('#js-ps-checkout-review-shipping-quote').removeClass('op0').addClass('error').find('span').text('Not available');
        });

    }

        if($('.estimate-shipping').length === 1){

            getQuote($('.estimate-shipping'));

            return null;
            
        }

    $(document).on('click', '.estimate-shipping', function(){
        getQuote($(this));
    });

}(jQuery));


