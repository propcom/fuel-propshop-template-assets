document.getElementById('js-ps-billing-form') && document.getElementById('js-ps-delivery-form') && (function($){


	/**
	 * Fires a native browser change event because jQuery does not
	 *
	 * 
	 * @param  {HTMLElement} elem Html element that should fire the event
	 * @return {undefined} 
	 */
	var nativeSelectEv = function(elem){

		var event = document.createEvent('HTMLEvents');
		event.initEvent('change', true, false);
		elem.dispatchEvent(event);

	};

	function AddressForm(form, prefix) {
		var self = this;
		this.$form = $(form);
		this.prefix = prefix;

		this.$form.find('.js-ps-country-code').on('change', function () {
			self.update_states($(this).val());
		});

		this.$form.find('.js-ps-address-select').on('change', function () {
			var $selected = $(this).find('option:selected'), data;
			if (data = $selected.data('address')) {
				self.set_values(data);
				return;
			}

			$.ajax('/customer/rest/address.json', {
				'type': 'get',
				'data': {
					id: $(this).val()
				},
				'dataType': 'json',
				'success': function(data){
					$selected.data('address', data);
					self.set_values(data);
				}
			});
		});

		this.$form.data('address-form', self);
	}

	AddressForm.prototype = {
		constructor: AddressForm,
		update_states: function (country, callback) {
			var self = this;

			$.ajax('/customer/rest/address_states.json', {
				'type': 'get',
				'async': true,
				'data': {
					country_code: country
				},
				'dataType': 'json',
				'success': function (data) {


					self.state_select = self.$form.find('.js-ps-state-code'); 

					self.state_select.empty();

					$.each(data, function (code, name) {
						var $opt = $('<option/>');

						$opt.attr('value', code);
						$opt.html(name);

						self.state_select.append($opt);
					});

					if(self.state_select){

						document.createEvent ? nativeSelectEv(self.state_select.get(0)) : self.state_select.get(0).fireEvent('onchange');

						typeof callback === 'function' && callback(self.state_select);


					}

					

					
				}
			});
		},
		set_values: function (values) {
			var self = this;

			// Avoid changing the thing we passed in by reference
			values = $.extend({}, values);

			if (values.country_code) {
				var state_code = values.state_code;

				self.$form.find('.js-ps-country-code').val(values.country_code).trigger('change');

				self.update_states(values.country_code, function ($state_select) {

					if (state_code) {

						$state_select.val(state_code);
						document.createEvent ? nativeSelectEv($state_select.get(0)) : $state_select.get(0).fireEvent('onchange');

					}

				});
			} else if (values.state_code) {

				document.createEvent ? nativeSelectEv(self.$form.find('.js-ps-state-code').val(values.state_code).get(0)) : self.$form.find('.js-ps-state-code').val(values.state_code).get(0).fireEvent('onchange');
			
			}

			delete values['country_code'];
			delete values['state_code'];

			$.each(values, function (field, val) {
				var input = self.$form.find('[name="' + self.prefix + field + '"]')
				input.val(val);
				input.trigger('change.address-form');
			});
		},
		get_values: function () {
			var self = this;
			var values = {};

			self.$form.find(':input').each(function (_, input) {
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
		_on_couple_change: function () {

			var self = this;

			this._couple_handler = this._couple_handler || function (event) {
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
		decouple: function () {

			if (this._couple) {

				this._couple.$form.find(':input').off('change.address-form', this._on_couple_change());
				this._couple = null;

			}

		}

	};

	window.AddressForm = AddressForm;

	var addressForms = [];

	window.AddressForms = {

		register: function ($form, prefix) {

			if (!($form instanceof AddressForm)) {

				$form.each(function () {

					addressForms.push(new AddressForm($(this), prefix));

				});

			} else {

				addressForms.push($form, prefix);

			}

		}

	};

	var $billing_form = $('#js-ps-billing-form'),
		$delivery_form = $('#js-ps-delivery-form');

	AddressForms.register($billing_form, 'billing_');
	AddressForms.register($delivery_form, 'delivery_');


	/**
	 * Adding the onchange event listener to the address same as checkbox
	 *
	 * 
	 * @param  {event} e On change event of the checkbox
	 * @return {undefined}
	 */
	$('#js-ps-copy-address').on('change', function (e){
		var $this = $(this), from = $this.data('from'), on = !!$this.is(':checked'), updateClass = function(elem, callback){

			elem.hasClass('is-hidden') ? elem.removeClass('is-hidden') : elem.addClass('is-hidden');

			typeof callback === 'function' && calback();

		};


		if (from === 'billing') {
			if (on)
				updateClass($('#js-ps-hidden-address'), $delivery_form.data('address-form').couple($billing_form.data('address-form')));
			else
				updateClass($('#js-ps-hidden-address'), $delivery_form.data('address-form').decouple());
		} else {
			if (on)
				updateClass($('#js-ps-hidden-address'),$billing_form.data('address-form').couple($delivery_form.data('address-form')));
			else
				updateClass($('#js-ps-hidden-address'), $billing_form.data('address-form').decouple());
		}

		
	}).trigger('change');

})(jQuery);
