;(function (window, document) {

    'use strict';

    var defaultWidths, getKeys, nextTick, addEvent;

    nextTick = window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function (callback) {
                   window.setTimeout(callback, 1000 / 60);
               };

    function applyEach (collection, callbackEach) {
        var i = 0,
            length = collection.length,
            new_collection = [];

        for (; i < length; i++) {
            new_collection[i] = callbackEach(collection[i], i);
        }

        return new_collection;
    }

    function returnDirectValue (value) {
      return value;
    }

    addEvent = (function(){
        if (document.addEventListener){
            return function addStandardEventListener(el, eventName, fn){
                return el.addEventListener(eventName, fn, false);
            };
        }
        else {
            return function addIEEventListener(el, eventName, fn){
                return el.attachEvent('on'+eventName, fn);
            };
        }
    })();

    defaultWidths = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];

    getKeys = typeof Object.keys === 'function' ? Object.keys : function (object) {
        var keys = [],
            key;

        for (key in object) {
            keys.push(key);
        }

        return keys;
    };


    /*
        Construct a new Imager instance, passing an optional configuration object.

        Example usage:

            {
                // Available widths for your images
                availableWidths: [Number],

                // Selector to be used to locate your div placeholders
                selector: '',

                // Class name to give your resizable images
                className: '',

                // If set to true, Imager will update the src attribute of the relevant images
                onResize: Boolean,

                // Toggle the lazy load functionality on or off
                lazyload: Boolean,

                // Used alongside the lazyload feature (helps performance by setting a higher delay)
                scrollDelay: Number
            }

        @param {object} configuration settings
        @return {object} instance of Imager
     */
    function Imager (elements, opts) {
        var self = this,
            doc  = document;

        opts = opts || {};

        if (elements !== undefined) {
            // first argument is selector string
            if (typeof elements === 'string') {
                opts.selector = elements;
                elements = undefined;
            }

            // first argument is the `opts` object, `elements` is implicitly the `opts.selector` string
            else if (typeof elements.length === 'undefined') {
                opts = elements;
                elements = undefined;
            }
        }

        this.imagesOffScreen  = [];
        this.viewportHeight   = doc.documentElement.clientHeight;
        this.selector         = opts.selector || '.js-image-load';
        this.className        = opts.className || 'image-replace';
        this.gif              = doc.createElement('img');
        this.gif.src          = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
        this.gif.alt          = '';
        this.scrollDelay      = opts.scrollDelay || 250;
        this.onResize         = opts.hasOwnProperty('onResize') ? opts.onResize : true;
        this.lazyload         = opts.hasOwnProperty('lazyload') ? opts.lazyload : false;
        this.scrolled         = false;
        this.availablePixelRatios = opts.availablePixelRatios || [1, 2];
        this.availableWidths  = opts.availableWidths || defaultWidths;
        this.onImagesReplaced = opts.onImagesReplaced || function () {};
        this.widthsMap        = {};
        this.refreshPixelRatio();
        this.widthInterpolator = opts.widthInterpolator || returnDirectValue;

        if (typeof this.availableWidths !== 'function'){
          if (typeof this.availableWidths.length === 'number') {
            this.widthsMap = Imager.createWidthsMap(this.availableWidths, this.widthInterpolator);
          }
          else {
            this.widthsMap = this.availableWidths;
            this.availableWidths = getKeys(this.availableWidths);
          }

          this.availableWidths = this.availableWidths.sort(function (a, b) {
            return a - b;
          });
        }



        if (elements) {
            this.divs = applyEach(elements, returnDirectValue);
            this.selector = null;
        }
        else {
            this.divs = applyEach(doc.querySelectorAll(this.selector), returnDirectValue);
        }

        this.changeDivsToEmptyImages();

        nextTick(function(){
            self.init();
        });
    }

    Imager.prototype.updateDivs = function(){

        var self = this;

        applyEach(document.querySelectorAll(this.selector), function(img){

            self.divs.push(returnDirectValue(img));

        });

        this.changeDivsToEmptyImages();

        nextTick(function(){
            self.init();
        });

    };

    Imager.prototype.scrollCheck = function(){
        if (this.scrolled) {
            if (!this.imagesOffScreen.length) {
                window.clearInterval(this.interval);
            }

            this.divs = this.imagesOffScreen.slice(0); // copy by value, don't copy by reference
            this.imagesOffScreen.length = 0;
            this.changeDivsToEmptyImages();
            this.scrolled = false;
        }
    };

    Imager.prototype.init = function(){
        this.initialized = true;
        this.checkImagesNeedReplacing(this.divs);

        if (this.onResize) {
            this.registerResizeEvent();
        }

        if (this.lazyload) {
            this.registerScrollEvent();
        }
    };

    Imager.prototype.createGif = function (element) {
        // if the element is already a responsive image then we don't replace it again
        if (element.className.match(new RegExp('(^| )' + this.className + '( |$)'))) {
            return element;
        }

        var gif = this.gif.cloneNode(false);

        gif.width = element.getAttribute('data-width');
        gif.height = element.getAttribute('data-height');
        gif.className = (element.getAttribute('data-class') ? element.getAttribute('data-class')+' ':'') + this.className;
        if(element.getAttribute('data-zoom-image')){ gif.setAttribute('data-zoom-image', element.getAttribute('data-zoom-image')) };
        gif.setAttribute('data-src', element.getAttribute('data-src'));
        gif.setAttribute('alt', element.getAttribute('data-alt') || this.gif.alt);

        element.parentNode.replaceChild(gif, element);

        return gif;
    };

    Imager.prototype.changeDivsToEmptyImages = function(){
        var self = this;

        applyEach(this.divs, function(element, i){
            if (self.lazyload) {
                if (self.isThisElementOnScreen(element)) {
                    self.divs[i] = self.createGif(element);
                } else {
                    self.imagesOffScreen.push(element);
                }
            } else {
                self.divs[i] = self.createGif(element);
            }
        });

        if (this.initialized) {
            this.checkImagesNeedReplacing(this.divs);
        }
    };

    Imager.prototype.isThisElementOnScreen = function (element) {
        // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
        // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
        var offset = Imager.getPageOffset();
        var elementOffsetTop = 0;

        if (element.offsetParent) {
            do {
                elementOffsetTop += element.offsetTop;
            }
            while (element = element.offsetParent);
        }

        return (elementOffsetTop < (this.viewportHeight + offset)) ? true : false;
    };

    Imager.prototype.checkImagesNeedReplacing = function (images) {
        var self = this;

        if (!this.isResizing) {
            this.isResizing = true;
            this.refreshPixelRatio();

            applyEach(images, function(image){
                self.replaceImagesBasedOnScreenDimensions(image);
            });

            this.isResizing = false;
            this.onImagesReplaced(images);
        }
    };

    Imager.prototype.replaceImagesBasedOnScreenDimensions = function (image) {
        var computedWidth, src;

        computedWidth = typeof this.availableWidths === 'function' ? this.availableWidths(image)
                                                                   : this.determineAppropriateResolution(image); 

         if(!!window.getComputedStyle){

            if(computedWidth === 0 || window.getComputedStyle(image, null).getPropertyValue("visibility") === 'hidden'){

            src = this.gif.src;

            } else {

                src = this.changeImageSrcToUseNewImageDimensions(image.getAttribute('data-src'), computedWidth);
            }

         } else{

            src = this.changeImageSrcToUseNewImageDimensions(image.getAttribute('data-src'), computedWidth);

         }

        

        image.src = src;
    };

    Imager.prototype.determineAppropriateResolution = function (image) {
        //return Imager.getClosestValue(image.clientWidth, this.availableWidths); 

        if(image.clientWidth === 0)
            return Imager.getClosestValue(image.clientWidth, this.availableWidths);

        return Imager.getClosestValue(document.body.clientWidth, this.availableWidths);
    };

    /**
     * Updates the device pixel ratio value used by Imager
     *
     * It is performed before each replacement loop, in case a user zoomed in/out
     * and thus updated the `window.devicePixelRatio` value.
     *
     * @api
     * @since 1.0.1
     */
    Imager.prototype.refreshPixelRatio = function refreshPixelRatio(){
        this.devicePixelRatio = Imager.getClosestValue(Imager.getPixelRatio(), this.availablePixelRatios);
    };

    Imager.prototype.changeImageSrcToUseNewImageDimensions = function (src, selectedWidth) {
        return src
            .replace(/{width}/g, Imager.transforms.width(selectedWidth, this.widthsMap))
            .replace(/{pixel_ratio}/g, Imager.transforms.pixelRatio(this.devicePixelRatio));
    };

    Imager.getPixelRatio = function getPixelRatio(context){
        return (context || window)['devicePixelRatio'] || 1;
    };

    Imager.createWidthsMap = function createWidthsMap (widths, interpolator) {
        var map = {},
            i   = widths.length;

        while (i--) {
            map[widths[i]] = interpolator(widths[i]);
        }

        return map;
    };

    Imager.transforms = {
        pixelRatio: function (value) {
            return value === 1 ? '' : '-' + value + 'x';
        },
        width: function (width, map) {
            return map[width] || width;
        }
    };

    /**
     * Returns the closest upper value.
     *
     * ```js
     * var candidates = [1, 1.5, 2];
     *
     * Imager.getClosestValue(0.8, candidates); // -> 1
     * Imager.getClosestValue(1, candidates); // -> 1
     * Imager.getClosestValue(1.3, candidates); // -> 1.5
     * Imager.getClosestValue(3, candidates); // -> 2
     * ```
     *
     * @api
     * @since 1.0.1
     * @param {Number} baseValue
     * @param {Array.<Number>} candidates
     * @returns {Number}
     */
    Imager.getClosestValue = function getClosestValue(baseValue, candidates){
        var i             = candidates.length,
            selectedWidth = candidates[i - 1];

        while (i--) {
            if (baseValue <= candidates[i]) {
                selectedWidth = candidates[i];
            }
        }

        return selectedWidth;
    };

    Imager.prototype.registerResizeEvent = function(){
        var self = this;

        addEvent(window, 'resize', function(){
            self.checkImagesNeedReplacing(self.divs);
        });
    };

    Imager.prototype.registerScrollEvent = function (){
        var self = this;

        this.scrolled = false;

        this.interval = window.setInterval(function(){
            self.scrollCheck();
        }, self.scrollDelay);

        addEvent(window, 'scroll', function(){
            self.scrolled = true;
        });
    };

    Imager.getPageOffsetGenerator = function getPageVerticalOffset(testCase){
        if(testCase){
            return function(){ return window.pageYOffset; };
        }
        else {
            return function(){ return document.documentElement.scrollTop; };
        }
    };

    // This form is used because it seems impossible to stub `window.pageYOffset`
    Imager.getPageOffset = Imager.getPageOffsetGenerator(Object.prototype.hasOwnProperty.call(window, 'pageYOffset'));

    // Exporting for testing purpose
    Imager.applyEach = applyEach;

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Imager;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function () { return Imager; });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.Imager = Imager;
    }
    /* global -module, -exports, -define */

}(window, document));


var wrapSelects = function(){ // Variable cached function in order to retain scope, avoid variable naming conflicts, allow garbage collection and easy multiple calls

		var selectsCollection;

		if( !( document.getElementsByTagName('select').length > 0 && ( selectsCollection = document.getElementsByTagName('select') ) ) ){ return; } // Condition to check the existence of select elements in the page


		var modifySelectMarkup = function(el){

			var parent = el.parentNode; // caching the select parent element

			var newElement = document.createElement('div');

			if(newElement.classList){
		      newElement.classList.add('styled-select');
		    } else{
		      newElement.className += 'styled-select';
		  	}

		

			newElement.appendChild(el);

			el.options[el.selectedIndex] ? el.insertAdjacentHTML('afterend', '<span class="styled-select__span">'+el.options[el.selectedIndex].innerHTML+'</span>') : el.insertAdjacentHTML('afterend', '<span class="styled-select__span"></span>') ;

			if(el.classList){
		      el.classList.add('styled-select__select');
		    } else{
		      el.className += ' styled-select__select';
		  	}

			parent.appendChild(newElement);

			return el;  
		}


		var setSelectOption = function(el){
			
			var option;

			el.options[el.selectedIndex] ? option = el.options[el.selectedIndex].innerHTML: option = '';

			var parent = el.parentNode;

			var span = parent.getElementsByTagName('span')[0];

			span.innerHTML = option;

		}

		var setSelectEventListener = function(el){

			if (el.addEventListener){

				el.addEventListener('change', function(ev){

					setSelectOption(el);
				})

			} else{ // IE8 Fallback

				el.attachEvent('onchange', function(){

					setSelectOption.call(el);

				})
			}
		}




		for( var ii = (selectsCollection.length - 1); ii >= 0; ii-- ){

			setSelectEventListener(modifySelectMarkup(selectsCollection[ii]));

		}
	};



	wrapSelects();


	// var wrapRadioButtons = function(){

	// 	var radioButtonsCollection;

	// 	if( !( document.getElementsByTagName('input').length > 0 && ( selectsCollection = document.getElementsByTagName('select') ) ) ){ return; }

	// }

/**
 * @fileOverview JavaScript validation for Propshop 
 * @author csrcastro@gmail.com (César Castro)
 */

;(function(){

	var inputs = document.getElementsByTagName('input');

	for (var ii = 0, ll = inputs.length; ii < ll; ii++){

		if(inputs[ii].getAttribute('data-validation')){

			hadBlur(inputs[ii], function(e){

				var target = e.target || e, aRules = JSON.parse(target.getAttribute('data-validation')), isValid = false;

				for (var iii = 0, lll = aRules.length; iii < lll; iii++){

					if(oRules[aRules[iii][0]] && validate(target, aRules[iii][0], aRules[iii][1]) === false ){
					
						showWarning(target, aRules[iii][0]);
						break;
						
					} else{

						hideWarning(target);

					}
						
				}
				
			});

		}
	}


	/**
	 * Contains several 
	 * @type {Object}
	 */
	var oRules ={	
		'required':{
			'rule': /([^\s])/,
			'message': 'This field is required'
		},	
		'min_length':{
			/**
			 * Test the length of an element
			 * 
			 * @param  {Object} element
			 * @param  {Array} options
			 * @return {boolean}
			 */
			'rule': function(element, options){


				if(!element.required && element.value === ''){

					return true;

				}

				if(element.value.length < options[0]){

					oRules['min_length']['message'] = 'This field must contain at least '+ options[0] +' characters.'
					return false

				}

				return true
			},
			'message': 'Surname must contain at least 2 characters.'
		},
		'is_email':{
			'rule': /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
			'message': 'Please type in a valid email address.'
		},
		'real_phone':{
			'rule': /^(?:(\()|(\[)|)(?:(?:00|\+|)[0-9]{1,3})(?:(\))|(\])|)[0-9 \-,\.\(\)\[\]]+(?:(?:e(?:xt?)?\.?|#|x?\.?|\\|\/|\+)[ ]*([0-9]+))?$/i,
			'message': 'Please double check the format of the phone number provided'
		},
		'match_field':{
			/**
			 * Tests if element's value matches other element
			 * 
			 * @param  {Object} element
			 * @param  {Array} options
			 * @return {Boolean}
			 */
			'rule': function(el, options){

				var original = findParentByTag(el, 'form').querySelector('input[name="'+options[0]+'"]');

				if(el.value !== original.value){

					oRules['match_field']['message'] = 'This field doesn\'t match your previous '+ options[0]
					return false 
				}

				return true

			},
			'message': 'Please type in a valid email address.'
		} 


	}

/**
 * Validate the provided input object against the provided rule
 * 
 * @param  {Object} element
 * @param  {string} rule
 * @param  {Array} options
 * @return {boolean}
 */
function validate(element, rule, options){
	var condition = oRules[rule]['rule'];

	if(typeof condition !== 'function')
		return condition.test(element.value);

	return condition(element, options)
}	

/**
 * Render warning markup next to the invallid element
 * 
 * @param  {Object} element
 * @param  {string} rule
 * @return {undefined}
 */
function showWarning(element, rule){

	var parent = element.parentNode;

	if(parent.querySelector('.form__validation')){
			parent.querySelector('.form__validation').innerText = oRules[rule]['message'];
			return false
		}

		var newElement = document.createElement('span');

		if(newElement.classList){

	      newElement.classList.add('form__validation');

	    } else{

	      newElement.className += 'form__validation';

	  	}

	  	newElement.innerText = oRules[rule]['message'];

		element.parentNode.appendChild(newElement);

}

/**
 * Remove warning markup next to the element
 * 
 * @param  {Object} element
 * @return {undefined}
 */
function hideWarning(element){

	var parent = element.parentNode;

	if(parent.querySelector('.form__validation')){

		parent.removeChild(parent.querySelector('.form__validation'));

	}

}

/**
 * Helpers
 */


/**
 * Adds Blur Event Listener to the provide element (including ie8 fallback)
 * 
 * @param  {Object} element
 * @param  {Function} handler
 * @return {undefined}
 */
function hadBlur(element, handler){

	if(element.addEventListener){

		element.addEventListener('blur', handler);

	} else{

		element.attachEvent('onfocusout', function(){

			handler(element);

		});

	}
		
}


/**
 * Returns the first ocurrence in the DOM tree for the provided tag
 *  
 * @param  {Object} element
 * @param  {string} tag
 * @return {Object}
 */
var findParentByTag = function(element, tag){	

	if( tag.toUpperCase() === element.parentNode.nodeName ) 
		return element.parentNode;

	// recursive functions have to return themselves to the scope
	return findParentByTag(element.parentNode, tag);

}

})()







	

document.getElementById('js-ps-billing-form') && document.getElementById('js-ps-delivery-form') && (function($){


	//helpers
	//
	//

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
				//self.$form.find('.js-ps-state-code').val(values.state_code).trigger('change');

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
