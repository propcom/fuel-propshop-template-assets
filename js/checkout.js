/**
 * checkout-addresses.js provides default behaviour for the checkout address
 * page.
 *
 * Looks for an element with class js-billing-form and creates an AddressForm for it.
 *
 * Looks for an element with class js-delivery-form and creates another AddressForm for that.
 *
 * Looks for a checkbox of class .js-copy-address and listens to its change event.
 * If checked, copies address from one form to the other, and updates the other 
 * form when the first one changes
 * If off, decouples these.
 *
 * Use data-from="billing" or data-from="delivery" to specify which form is the
 * source. This is "delivery" by default, implying a "Same as delivery address"
 * checkbox on the billing form.
 *
 * Use data-hide-other="true" to have it hide the destination form automatically.
 * You can also handle the 'change' event on this checkbox to do that yourself.
 */
$(function() {
    var $billing_form = $('.js-billing-form'),
        $delivery_form = $('.js-delivery-form');

    AddressForms.register($billing_form, 'billing_');
    AddressForms.register($delivery_form, 'delivery_');

    $('.js-copy-address').on('change', function() {
        var $this = $(this),
        	from = $this.data('from'),
			hide_other = $this.data('hideOther');

        var on = !!$this.is(':checked');

        if (from == 'billing') {
            if (on) {
                $delivery_form.data('address-form').couple($billing_form.data('address-form'));
				if (hide_other) {
					$delivery_form.hide();
				}
			}
            else {
                $delivery_form.data('address-form').decouple();
				if (hide_other) {
					$delivery_form.show();
				}
			}
        }
        else {
            if (on) {
                $billing_form.data('address-form').couple($delivery_form.data('address-form'));
				if (hide_other) {
					$billing_form.hide();
				}
			}
            else {
                $billing_form.data('address-form').decouple();
				if (hide_other) {
					$billing_form.show();
				}
			}
        }
    }).trigger('change');
});
