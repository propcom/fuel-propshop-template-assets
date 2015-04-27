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
				'type': 'GET',
				'data': {
					id: $(this).val()
				},
				cache: false,
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
				'async': false,
				cache: false,
				'data': {
					country_code: country
				},
				'dataType': 'json',
				'success': function (data) {

					self.state_select = self.$form.find('.js-ps-state-code'); 

					self.state_select.empty();

					var options =  document.createDocumentFragment(); 

					$.each(data, function (code, name) {
						var opt = document.createElement('option');
						opt.value = code;
						opt.text = name;
						options.appendChild(opt);
					});

					self.state_select.append($(options));

					
				}
			}).done(function(){
					document.createEvent ? nativeSelectEv(self.$form.find('.js-ps-state-code').get(0)) : self.$form.find('.js-ps-state-code').get(0).fireEvent('onchange');
				});
		},
		set_values: function (values) {
			var self = this;

			// Avoid changing the thing we passed in by reference
			values = $.extend({}, values);

			if (values.country_code) {
				var state_code = values.state_code;

				self.$form.find('.js-ps-country-code').val(values.country_code);

				document.createEvent ? nativeSelectEv(self.$form.find('.js-ps-country-code').val(values.country_code).get(0)) : self.$form.find('.js-ps-country-code').val(values.country_code).get(0).fireEvent('onchange');
	                   
	            document.createEvent ? nativeSelectEv(self.$form.find('.js-ps-state-code').val(state_code).get(0)) : self.$form.find('.js-ps-state-code').val(state_code).get(0).fireEvent('onchange');
	                    
	           
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

			this._couple.$form.find(':input').on('change.address-form', this._on_couple_change(other_form));
			this.set_values(other_form.get_values());
		},
		_on_couple_change: function (other_form) {

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
	 * Setting the default behaviour
	 */

	 $('#js-ps-copy-address').is(':checked') && $delivery_form.data('address-form').couple($billing_form.data('address-form'));

	/**
	 * Adding the onchange event listener to the address same as checkbox
	 *
	 * 
	 * @param  {event} e On change event of the checkbox
	 * @return {undefined}
	 */
	$('#js-ps-copy-address').on('change', function (e){

		var $this = $(this), from = $this.data('from'), on = !!$this.is(':checked'), updateClass = function(elem, callback){

			elem.hasClass('js-is-open') ? elem.removeClass('js-is-open').slideUp() : elem.slideDown().addClass('js-is-open');

			typeof callback === 'function' && calback();

		};



		if (from === 'billing') {
			if (on === true)
				updateClass($('#js-ps-delivery-form'), $delivery_form.data('address-form').couple($billing_form.data('address-form')));
			else
				updateClass($('#js-ps-delivery-form'), $delivery_form.data('address-form').decouple());
		} else {
			if (on === true)
				updateClass($('#js-ps-billing-form'),$billing_form.data('address-form').couple($delivery_form.data('address-form')));
			else
				updateClass($('#js-ps-billing-form'), $billing_form.data('address-form').decouple());
		}

		
	});

})(jQuery);
