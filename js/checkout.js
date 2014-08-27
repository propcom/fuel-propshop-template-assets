$(document).ready(function () {
    if ( $('#shipping_chk').is(':checked')) {
        $('#js-shipping-form').hide();
    }

    $('#shipping_chk').on('click', function () {
        if ($(this).data('to') == undefined)
            to = 'shipping';
        else
            to = $(this).data('to');

        disable_field = '#addresses_' + to;
        if ( ! $(this).is(':checked')) {
            $(disable_field).show();
        } else {
            $(disable_field).hide();
        }
    });

    $('.js-country-code').change(function(e) {
        // which country drop down did this come from? delivery or biling?
        if ($(this).attr('name').indexOf('delivery') != -1)
            event_from = 'delivery';
        else 
            event_from = 'billing';

        // should the same address checkbox be hidden?
        $.get('/checkout/rest/enable_same_address.json', {country_code: e.target.value, event_from:event_from}, 'json')
            .success(function(data, textStatus, jqXHR) {
                if (!data.unchanged) {
                    if (data.enable) {
                        $('.js-copy-address').attr("checked", true);
                        $('.js-copy-address').trigger('click');
                        $('.js-shipping-chk').show();
                    }
                    else {
                        $('.js-copy-address').attr("checked", true);
                        $('.js-copy-address').trigger('click');
                        $('.js-shipping-chk').hide();
                    }
                }
            });
    });
});
