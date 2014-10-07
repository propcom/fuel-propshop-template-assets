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

    var number = $('#payment_details--card_number'), 
        type = $('#payment_details--card_type'), 
        $highlighter = $('#js-ps-card-highlighter'),
        $submit = $('#payment_details--submit');

   number.validateCreditCard(function(result){

        var matches = $.parseJSON(type.attr('data-matches'));


        if(result.length_valid && result.luhn_valid){

            type.val(matches[result.card_type.name]);

            $('.help-card').length &&  $highlighter.find('.help-card').remove();

            $highlighter.attr('class', result.card_type.name.toLowerCase().replace(' ', '_')+' is-card');
            $submit.removeClass('hidden');

        } else if(!result.length_valid || result.luhn_valid){
            $submit.addClass('hidden');
            $highlighter.attr('class', '');

            !$('.help-card').length &&  $highlighter.append('<span class="help-card">please review your card number.</span>');
            type.val('');
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


