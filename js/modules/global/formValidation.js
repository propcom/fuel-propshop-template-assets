/**
 * @fileOverview JavaScript validation for Propshop 
 * @author csrcastro@gmail.com (César Castro)
 */

;(function(){

	var inputs = document.getElementsByTagName('input');

	for (var ii = 0, ll = inputs.length; ii < ll; ii++){

		if(inputs[ii].getAttribute('data-validation')){

			hadEvs(inputs[ii], function(e){

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

	} else{

		element.attachEvent('onkeyup', function(){

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






