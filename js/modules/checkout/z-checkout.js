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

    var signupForm = $('#js-ps-checkout-signup-form'), loginForm = $('#js-ps-checkout-login-form'), activeForm = $('.js-is-open');

    $(document).on('click', '#js-ps-checkout-signup-btn', function(e){

        e.preventDefault();

        if(!signupForm.hasClass('js-is-open')){

            signupForm.slideDown().addClass('js-is-open');

            loginForm.slideUp().removeClass('js-is-open');

        }
    });


    $(document).on('click', '#js-ps-checkout-login-btn', function(e){

        e.preventDefault();

        if(!loginForm.hasClass('js-is-open')){

            loginForm.slideDown().addClass('js-is-open');

            signupForm.slideUp().removeClass('js-is-open');

        }
        
    });


}(jQuery));


document.getElementById('sage-payment-form') && (function($){

    'use strict';

    var number = $('#payment_details--card_number'), 
        $type = $('#payment_details--card_type'), 
        $highlighter = $('#js-ps-card-highlighter'),
        $submit = $('#payment_details--submit'),
        $cards = $('.js-card-type'),
        assignValue = function(payload){
             $cards.addClass('is-fade');
             typeof payload === 'object' && (function(){
                payload.removeClass('is-fade');
                $type.val(payload.attr('id'));
             }());

            $submit.attr('disabled', false);

        };

        // DOM nodes initialization
        
        $submit.attr('disabled', true);
        $('.js-type-list').addClass('hidden');
        $('.payment-methods').removeClass('hidden');



   number.validateCreditCard(function(result){

        console.log(result);

        var matches = $.parseJSON($type.attr('data-matches'));


        if(result.length_valid && result.luhn_valid){

            assignValue($('#'+result.card_type.name));

        } else if(!result.length_valid || result.luhn_valid){

            $cards.removeClass('is-fade');
            $submit.attr('disabled', true);
            
        }

    }, { accept: $.parseJSON($type.attr('data-valid')) });


   $(document).on('click', '.js-card-type', function(e){

        e.preventDefault();
        assignValue($(this));

   });

}(jQuery));


document.getElementById('js-ps-checkout-review-shipping') && (function($){

    'use strict';

function getQuote(input){

        $.ajax({
            url: _u('/checkout/rest/shipping_quote.json'),
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


