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
;(function($) {
    function ProductForm(form, options) {
        var self = this;

        this.options = $.extend({}, ProductForm.defaults, options);
        this.form = form;
        this.product_id = form.data('productId');
        this.fields = form.find('.variant-select');
        this.selected_variant = form.find('input[name^=id]');

        // In the change handler we need to know what it used to be.
        this.selection = {};

        // map variant IDs to the option values that refer to them.
        this.variants_inverse = {};

        // Other metadata
        this.variant_meta = {};

        // Change handler for the select fields
        this.fields.change(function() {
            self.set_option($(this).attr('name'), $(this).val());
        });

        // Change handler for the last select field - changing of this signifies a variant has changed
        // note that whenever another field changes, set_option causes a cascade of sets and results in the last field being changed
        this.fields.last().change(function() {
            self.change_variant();
        });

        // Grab variant data with Ajax
        $.get('/product/rest_variants/variant_options/'+this.product_id+'.json').done(function(data) {

            self.variants = data;
            self.init(); 

        });

    }

    ProductForm.prototype = {
        constructor: ProductForm,
        init: function() {
            var self = this;

            // Set up the submit handler
            self.form.on('submit', $.proxy(self.options.onSubmit, self));

            // I can't think of a better way of doing this without outputting pre-computed data
            $.each(this.variants, function(name, config) {
                // Underscore denotes metadata. Hacky but will work for now.
                if(name.indexOf('_') == 0)
                    return;

                $.each(config.options, function(value, options) {
                    $.each(options.variant_ids, function(i, id) {
                        var v = self.variants_inverse[id] || {};
                        v[name] = value;
                        self.variants_inverse[id] = v;
                    });
                });
            });

            $.extend(true, self.variant_meta, this.variants._variant_meta);
        },

        /*
         * This is called whenever a .variant-select field is changed
         * It is passed the name of the field and id of the selected value in the option and value params respectively
         *
         * The logic here is such that we update all selects below, in terms of the DOM, the one that has just changed
         */
        set_option: function(option, value) {
            // Could probably avoid re-selecting the field, but that restricts
            // the API by not allowing simple string values.
            var self = this;
            var field = this.fields.filter('[name=' + option + ']');

            this.populate_next_field(field);

            field.trigger('set_option', { product_form: this });
        },

        change_variant: function() {
            this.selected_variant.val(this.get_selected_variant());

            this.form.trigger('variant_changed', { selected_variant_id: this.selected_variant.val(), product_form: this });
        },

        get_selected_variant: function() {
            // Build an object of all the field values to compare with variants_inverse
            var compare = {};

            $.each(this.fields, function (key, f) {
                var f_name = $(f).attr('name');
                var f_val = $(f).val();

                compare[f_name] = f_val;
            });

            // Do the comparison by means of a utility function
            var id = null;

            $.each(this.variants_inverse, function (key, val) {
                if (Utils.compareObjs(compare, val)) {
                    return id = key;
                }
            });

            return id;
        },

        populate_next_field: function(field) {
            var self = this;

            // Get the field below, in terms of the DOM, the one that was changed
            var next_field = $(this.get_next_field(field));

            if (next_field.length) {
                // Name of the field we're populating
                var next_field_name = next_field.attr('name');

                // Get all the fields above and including, in terms of the DOM, the one that was changed
                var prev_fields = this.get_prev_fields(field);

                // This stores the variant IDs that are still applicable at this stage 
                var intersect = false;

                $.each(prev_fields, function (key, f) {
                    var f_val = $(f).val();
                    var f_name = $(f).attr('name');
                    var variants = self.variants[f_name].options[f_val].variant_ids;

                    // Init intersect on the first iteration
                    if (intersect == false) {
                        intersect = variants;
                        return true; // akin to continue
                    }
                    // Intersect the previous intersect on further iterations
                    else {
                        intersect = $(intersect).filter(variants);
                    }
                });

                var next_field_options = {};

                // Here, intersect is all of the available variants for next_field
                $.each(intersect, function (key, variant_id) {
                    // Get the option of this variant for the field we're populating
                    var variant_option = self.variants_inverse[variant_id][next_field_name];

                    // Get the name of the option
                    var variant_option_name = self.variants[next_field_name].options[variant_option].name;

                    // Add to the options for the field we're populating
                    next_field_options[variant_option] = variant_option_name;
                });

                // Clear and populate the field
                next_field.find('option').remove();

                $.each(next_field_options, function (key, val) {
                    next_field
                        .append($("<option></option>")
                            .attr("value", key)
                            .text(val)
                        )                        
                });

                // Trigger a change on the next_field to kick off the whole process all over again
                next_field.trigger('change');
            }
        },

        get_prev_fields: function(field) {
            // Field is a jQuery object
            field = field[0];

            var prev_fields = [];

            $.each(this.fields, function(key, val) {
                prev_fields.push(val);

                if (val == field) {
                    return false; // Break the each loop
                }
            });

            return prev_fields;
        },

        get_next_field: function(field) {
            var index = this.fields.index(field);

            // field not in this.fields
            if (index == -1) {
                return;
            }

            // field at the end of this.fields
            if (index >= this.fields.length - 1) {
                return;
            }

            return this.fields[index + 1];
        }

    };

    ProductForm.defaults = {
        'onSubmit': function(e) {
            var unfilled = this.unfilled_fields();
            if (unfilled.length)
            {
                e.preventDefault();

                var fields = [];

                unfilled.each(function(i,o) {
                    fields.push($(this).attr('title'))
                });
                fields = fields.join(", ");

                this.form.find('.alert').remove();

                this.form.prepend($('<div />')
                    .addClass('alert alert-error')
                    .text('Please select the following fields to add this product to your basket: '+fields)
                    .append($('<a />').addClass('close').attr('data-dismiss', 'alert').text('×')));
            }
        }
    };

    window.ProductForm = ProductForm;

    var productForms = [];

    window.ProductForms = {
        register: function(form, options) {
            if (! (form instanceof ProductForm)) {
                form.each(function() {
                    productForms.push(new ProductForm($(this), $.extend({}, $(this).data())));
                });
            }
            else {
                productForms.push(form)
            }
        }
    };

    var Utils = {
        // http://stackoverflow.com/a/5859028/1610539
        compareObjs: function(o1, o2) {
            for(var p in o1) {
                if(o1.hasOwnProperty(p)) {
                    if(o1[p] !== o2[p]) {
                        return false;
                    }
                }
            }

            for(var p in o2) {
               if(o2.hasOwnProperty(p)) {
                   if(o1[p] !== o2[p]) {
                       return false;
                   }
               }
            }

            return true;
        }
    };

})(jQuery);
