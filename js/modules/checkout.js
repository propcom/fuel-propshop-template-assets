$(document).ready(function () {
    if ( $('#shipping_chk').is(':checked')) {
        $('#js-shipping-form').hide();
    }

    $('#shipping_chk').on('click', function () {
        if ( ! $(this).is(':checked')) {
            $('#js-shipping-form').show();
        } else {
            $('#js-shipping-form').hide();
        }
    });
});
