/**
 * data = {
 *   colour: {
 *     label: "Colour",
 *     options: {
 *       1: {
 *         name: "Green",
 *         variant_ids: [372, 377]
 *       },
 *       2: {
 *         name: "White",
 *         variant_ids: [376, 378]
 *       }
 *     }
 *   },
 *   size: {
 *     label: "Size",
 *     options: {
 *       6: {
 *         name: "Large",
 *         variant_ids: [372, 376]
 *       },
 *       7: {
 *         name: "Small",
 *         variant_ids: [377, 378]
 *       }
 *     }
 *   }
 * }
 */

/**
 * Usage:
 *
 *  var f = new ProductForm($('form-selector'));
 *  ProductForms.register(f);
 *
 *  ProductForms.register($('form-selector'));
 *
 * Creating a new ProductForm finds the variant <select>s and has them interact
 * with one another based on the values in the window.variant_data object,
 * which will need to somehow be updated if new products appear on the page.
 */
(function($) {
	function ProductForm(form) {
		var self = this;
		this.product_id = form.data('productId');
		this.fields = form.find('.variant-select');
		this.selected_variant = form.find('input[name=id]');

		// In the change handler we need to know what it used to be.
		this.selection = {};

		// variant_data is injected in a <script> tag - not ideal but works for now.
		// If products turn up via AJAX the handlers should add stuff to it.
		this.variants = variant_data[this.product_id];

		// map variant IDs to the option values that refer to them.
		this.variants_inverse = {};

		// Variants with the same value as the number of filled fields are unmasked.
		this.variants_masked = {};

		// Other metadata
		this.variant_meta = {};

		// I can't think of a better way of doing this without outputting pre-computed data
		$.each(this.variants, function(name, config) {
			// Underscore denotes metadata. Hacky but will work for now.
			if(name.indexOf('_') == 0)
				return;

			$.each(config.options, function(value, options) {
				$.each(options.variant_ids, function(i, id) {
					self.variants_masked[id] = 0;

					var v = self.variants_inverse[id] || [];
					v.push(value);
					self.variants_inverse[id] = v;
				});
			});
		});

		$.extend(true, self.variant_meta, this.variants._variant_meta);

		this.fields.change(function() {
			self.set_option($(this).attr('name'), $(this).val());
		});
	}

	ProductForm.prototype = {
		constructor: ProductForm,
		set_option: function(option, value) {
			// Could probably avoid re-selecting the field, but that restricts
			// the API by not allowing simple string values.
			var self = this,
				field = this.fields.filter('[name=' + option + ']');

			if (this.selection[option]) {
				// re-mask variants
				$.each(
					this.variants[option].options[this.selection[option]].variant_ids,
					function(i, id) {
						self.variants_masked[id]--;
					});
			}
			this.selection[option] = value;

			if (value) {
				$.each(
					this.variants[option].options[this.selection[option]].variant_ids,
					function(i, id) {
						self.variants_masked[id]++;
					});
			}

			this.mask_fields();
			this.hobsons_choice();

			// this field's options are not masked, as a rule.
			field.find('option').removeAttr('disabled').end().val(value);
			field.trigger('set_option', { product_form: this });
		},
		mask_fields: function() {
			var self = this,
				v = this.unmasked_variants(),
				conf_ids = {};

			$.each(v, function(variant_id) {
				for(c_id in self.variants_inverse[variant_id]) {
					conf_ids[self.variants_inverse[variant_id][c_id]] = 1;
				}
			});

			this.filled_fields().each(function (i, o) {
				// if the current selection is not in the unmasked lot,
				// unset the value. Then it'll be picked up in the next loop
				if (! conf_ids[$(this).val()]) {
					$(this).val('');
				}
			});

			// recalculate options based on what's left
			v = this.unmasked_variants();
			var v_count = 0, last_vid;
			$.each(v, function(variant_id) {
				v_count++;
				last_vid = variant_id;

				for(c_id in self.variants_inverse[variant_id]) {
					conf_ids[self.variants_inverse[variant_id][c_id]] = 1;
				}
			});

			this.unfilled_fields().each(function(i,o) {
				var field = $(this);

				field.find('option').each(function() {
					var $this = $(this);

					if ($this.val() == '') return;

					if ( conf_ids[ $this.val() ] ) {
						$this.removeAttr('disabled');
					}
					else {
						$this.attr('disabled', true);
					}
				});
			});

			if (v_count == 1) {
				this.selected_variant.val(last_vid);
			}
			else {
				this.selected_variant.val('');
			}
		},
		hobsons_choice: function() {
			this.unfilled_fields().each(function() {
				var $this = $(this);

				var opts = $this.find('option').filter(function() {
					return !$(this).is('[disabled]') && !! $(this).val();
				});
				if (opts.length == 1) {
					$this.val(opts.first().val());
				}
			});
		},
		unmasked_variants: function() {
			var v = {},
				f = this.filled_fields().length;

			// I don't think I can filter() or grep() a normal object
			$.each(this.variants_masked, function(variant, count) {
				if (count == f) v[variant] = 1;
			});

			return v;
		},
		filled_fields: function() {
			return this.fields.filter(function() {
				return !!$.trim($(this).val());
			});
		},
		unfilled_fields: function() {
			return this.fields.filter(function() {
				return !$.trim($(this).val());
			});
		}
	};

	window.ProductForm = ProductForm;

	var productForms = [];

	window.ProductForms = {
		register: function(form) {
			if (! (form instanceof ProductForm)) {
				form.each(function() {
					productForms.push(new ProductForm($(this)));
				});
			}

		}
	};
})(jQuery);
