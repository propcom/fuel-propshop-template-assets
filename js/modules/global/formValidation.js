/**
 * @fileOverview JavaScript validation for Propshop 
 * @author csrcastro@gmail.com (César Castro)
 */

;(function(){

	var inputs = document.getElementsByTagName('input');

	for (var ii = 0, ll = inputs.length; ii < ll; ii++){

		if(inputs[ii].getAttribute('data-validation')){

			hadEvs(inputs[ii], function(e){


				var target = e.target || e, aRules = JSON.parse(target.getAttribute('data-validation')), isValid = false, reg = /^\s*$/;

				if(!target.getAttribute('required') && reg.test(target.value) ){  
					hideWarning(target);
					return;
				}	

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
			rule: /([^\s])/,
			message: 'This is a required field.'
		},
		'required_with':{
			rule: function(el, options){

				var original = findParentByTag(el, 'form').querySelector('input[name="'+options[0]+'"]'), rule = /([^\s])/;

				if(original.value.length > 0 && el.value === ''){
					return false;
				}

				return true

			},
			message: 'This is a required field.'
		},	
		'min_length':{
			/**
			 * Test the length of an element
			 * 
			 * @param  {Object} element
			 * @param  {Array} options
			 * @return {boolean}
			 */
			rule: function(element, options){


				if(!element.required && element.value === ''){

					return true;

				}

				if(element.value.length < options[0]){

					oRules['min_length']['message'] = 'A minimum of '+ options[0] +' characters are required.'
					return false

				}

				return true
			},
			message: ''
		},
		'max_length':{
			/**
			 * Test the length of an element
			 * 
			 * @param  {Object} element
			 * @param  {Array} options
			 * @return {boolean}
			 */
			rule: function(element, options){


				if(!element.required && element.value === ''){

					return true;

				}

				if(element.value.length > options[0]){

					oRules['max_length']['message'] = 'The maximum length has been exceeded.'
					return false

				}

				return true
			},
			message: ''
		},
		'is_email':{
			rule: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
			message: 'Please enter a valid email address.'
		},
		'valid_email':{
			rule: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
			message: 'Please enter a valid email address.'
		},
		'valid_emails':{
			rule: function(element, options){
				var separator = ',',
				    rule = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				    emails;

				if(options[0]){
					 separator = options[0];
				}

				emails = element.value.split(separator);

				for (var i = 0, l = emails.length; i < l; i++){

					if(!rule.test(emails[i])){
						return false;
					}

				}

				return true;

			},
			message: 'Please enter a valid email address.'
		},
		'valid_ip':{
			rule:/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
			message: ''
		},
		'valid_string':{
			rule: /^[a-zA-Z]+$/,
			message: 'This field is invalid. Please check the contents and try again.'
		},
		'valid_url':{
			rule: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
			message: 'Please enter a valid website address.'
		},
		'exact_lenght':{
			rule: function(element, options){

				if(element.value.length !== options[0]){
					oRules['exact_lenght']['message'] = 'This field must contain exactly ' + options[0] +' character.';
					return false;
				}

				return true;

			},
			message: 'Please enter a valid website address.'
		},
		'real_phone':{
			rule: /^(?:(\()|(\[)|)(?:(?:00|\+|)[0-9]{1,3})(?:(\))|(\])|)[0-9 \-,\.\(\)\[\]]+(?:(?:e(?:xt?)?\.?|#|x?\.?|\\|\/|\+)[ ]*([0-9]+))?$/i,
			message: 'Please enter a valid telephone number.'
		},
		'is_numeric':{
			rule: /^[0-9]+([\.][0-9]+)?$/,
			message: 'This field must be a number.'
		},
		'numeric_min':{
			rule: function(element, options){

				var label = document.querySelector('[for='+element.id+']');

				if(element.value < options[0]){
					oRules['numeric_min']['message'] = 'The minimum number value of '+label.innerText+' is '+ options[0];
					return false;
				}

				return true;

			},
			message: ''
		},
		'numeric_max':{
			rule: function(element, options){

				var label = document.querySelector('[for='+element.id+']');

				if(element.value > options[0]){
					oRules['numeric_max']['message'] = 'The maximum numeric value of '+label.innerText+' is '+ options[0];
					return false;
				}

				return true;

			},
			message: ''
		},
		'numeric_between':{
			rule: function(element, options){

				if(element.value < options[0] || element.value > options[1] ){
					oRules['numeric_between']['message'] = 'This must contain a value between '+options[0]+' and '+ options[1];
					return false;
				}

				return true;

			},
			message: ''
		},
		'match_field':{
			/**
			 * Tests if element's value matches other element
			 * 
			 * @param  {Object} element
			 * @param  {Array} options
			 * @return {Boolean}
			 */
			rule: function(el, options){

				var original = findParentByTag(el, 'form').querySelector('input[name="'+options[0]+'"]'), label = document.querySelector('[for='+el.id+']');

				if(el.value !== original.value){

					oRules['match_field']['message'] = 'The '+label.innerText+' doesn\'t match '+ options[0];
					return false 
				}

				return true

			},
			message: ''
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

	var condition = oRules[rule].rule;

	if(typeof condition !== 'function'){
		return condition.test(element.value);
	}

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

	if(parent.querySelector('.help-inline')){
			parent.querySelector('.help-inline').innerText = oRules[rule]['message'];
			return false
		}

		var newElement = document.createElement('span');

		newElement.classList ? newElement.classList.add('help-inline') : newElement.className += 'help-inline';

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

	parent.querySelector('.help-inline') && parent.removeChild(parent.querySelector('.help-inline'));

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
function hadEvs(element, handler){

	if(element.addEventListener){

		element.addEventListener('keyup', handler);
		element.addEventListener('focusin', handler);

	} else{

		element.attachEvent('onkeyup', function(){

			handler(element);

		});

		element.attachEvent('onfocusin', function(){

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

})();






