(function($){
    function AddressForm(form, prefix) {
        var self = this;
        this.$form = $(form);
        this.prefix = prefix;

        this.$form.find('.js-country-code').on('change', function() {
            self.update_states($(this).val());
        });

        this.$form.find('.js-address-select').on('change', function() {
            var $selected = $(this).find('option:selected');
            var data;
            if (data = $selected.data('address')) {
                self.set_values(data);
                return;
            }

            $.getJSON('/customer/rest/address.json', {
                    id: $(this).val()
                })
                .success(function(data){
                    $selected.data('address', data);
                    self.set_values(data);
                });
        });

        this.$form.data('address-form', self);
    }

    AddressForm.prototype = {
        constructor: AddressForm,
        update_states: function(country, andthen) {
            var self = this;

            $.get('/customer/rest/address_states.json', {
                country_code: country
            }, function(data) {
                var $state_select = self.$form.find('.js-state-code').empty();

                $.each(data, function(code, name) {
                    var $opt = $('<option/>');

                    $opt.attr('value', code);
                    $opt.html(name);

                    $state_select.append($opt);
                });
                
                $state_select.trigger('change.address-form');

                if (andthen) andthen($state_select);
            })
        },
        set_values: function(values) {
            var self = this;

            // Avoid changing the thing we passed in by reference
            values = $.extend({}, values);

            if (values.country_code) {
                var state_code = values.state_code;

                self.$form.find('.js-country-code').val(values.country_code).trigger('change.address-form');

                this.update_states(values.country_code, function($state_select) {
                    if (state_code) {
                        $state_select.val(state_code);
                        $state_select.trigger('change.address-form');
                    }
                });
            }
            else if (values.state_code) {
                self.$form.find('.js-state-code').val(values.state_code).trigger('change.address-form');
            }

            delete values['country_code'];
            delete values['state_code'];

            $.each(values, function(field,val) {
                var input = self.$form.find('[name="' +  self.prefix + field + '"]')
                input.val(val);
                input.trigger('change.address-form');
            });
        },
        get_values: function() {
            var self = this;
            var values = {};

            self.$form.find(':input').each(function(_, input) {
                var $this = $(this);
                values[$this.attr('name').replace(self.prefix, '')] = $this.val();
            });

            return values;
        },
        couple: function (other_form) {
            if (this._couple)
                return;

            this._couple = other_form;

            this._couple.$form.find(':input').on('change.address-form', this._on_couple_change());
            this.set_values(other_form.get_values());
        },
        _on_couple_change: function() {
            var self = this;

            this._couple_handler = this._couple_handler || function(event) {
                // If we're changing country_code, then the update handler on state_code will trigger its own change
                // event, so that'll be magically handled when the AJAX completes.
                var name = $(this).attr('name').replace(self._couple.prefix, ''),
                    val = $(this).val();

                var values = {};
                values[name] = val;
                self.set_values(values);
            }; 

            return this._couple_handler;
        },
        decouple: function() {
            if (this._couple) {
                this._couple.$form.find(':input').off('change.address-form');
                this._couple = null;
            }
        }
    };

    window.AddressForm = AddressForm;

    var addressForms = [];

    window.AddressForms = {
        register: function($form, prefix) {
            if (! ($form instanceof AddressForm)) {
                $form.each(function(){
                    addressForms.push(new AddressForm($(this), prefix));
                });
            }
            else {
                addressForms.push($form, prefix);
            }
        }
    };
})(jQuery);

$(function() {
    var $billing_form = $('.js-billing-form'),
        $delivery_form = $('.js-delivery-form');

    AddressForms.register($billing_form, 'billing_');
    AddressForms.register($delivery_form, 'delivery_');

    $('.js-copy-address').on('change', function() {
        var $this = $(this);
        var from = $this.data('from');

        var on = !!$this.is(':checked');

        if (from == 'billing') {
            if (on)
                $delivery_form.data('address-form').couple($billing_form.data('address-form'));
            else
                $delivery_form.data('address-form').decouple();
        }
        else {
            if (on)
                $billing_form.data('address-form').couple($delivery_form.data('address-form'));
            else
                $billing_form.data('address-form').decouple();
        }
    });

});
