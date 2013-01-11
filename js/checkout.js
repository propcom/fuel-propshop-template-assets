$(document).ready(function () {

    // Handle copying field values over from billing to shipping.
    $('.billing-address :input').change(function () {
        copyFieldValues();
    });

    $('#shipping_chk').on('click', function () {
        copyFieldValues();
        if ( ! $(this).is(':checked')) {
            $('#addresses_shipping').css({'visibility':'visible'});
        } else {
            $('#addresses_shipping').css({'visibility':'hidden'});
        }
    });

// Copy field values from one to another.
    function copyFieldValues() {
        if (!$('#shipping_chk').is(':checked')) {
            return;
        }

        $('.billing-address :input').each(function () {
            var value = $(this).val();
            var name = $(this).attr('name').replace('billing', 'delivery');
            $('.shipping-address :input[name="' + name + '"]').val(value);
        });
    }

    $("#addresses_shipping").css({'visibility':'hidden'});

// AJAX previously used addresses in..
    $('#addresses_billing, #addresses_shipping').change(function () {
        var id = $(this).val();
        var $fieldset = $(this).next('fieldset');
        var type = $fieldset.data('address-type');

        // Set the address shipping ID
        $("#addresses_shipping").val($(this).val());

        $.ajax({
            data:{'id':id},
            dataType:'json',
            url:'/customer/rest/address.json',
            success:function (data) {
                $.each(data, function (k, v) {
                    $fieldset.find(':input[name="' + type + '_' + k + '"]').val(v);
                    if (type == 'billing' && $('#shipping_chk').is(':checked')) {
                        copyFieldValues();
                    }
                });
            }
        });
    });
});
