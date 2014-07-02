

var wrapSelects = function(){ // Variable cached function in order to retain scope, avoid variable naming conflicts, allow garbage collection and easy multiple calls

		var selectsCollection;

		if( !( document.getElementsByTagName('select').length > 0 && ( selectsCollection = document.getElementsByTagName('select') ) ) ){ return; } // Condition to check the existence of select elements in the page


		var modifySelectMarkup = function(el){

			var parent = el.parentNode; // caching the select parent element

			var newElement = document.createElement('span');

			if(newElement.classList){
		      newElement.classList.add('select-wrap');
		    } else{
		      newElement.className += 'select-wrap';
		  	}

			parent.appendChild(newElement);

			newElement.appendChild(el);

			el.insertAdjacentHTML('afterend', '<span class="select__span">'+el.options[el.selectedIndex].innerHTML+'</span>');

			return el;  
		}


		var setSelectOption = function(el){
			
			var option = el.options[el.selectedIndex].innerHTML

			var parent = el.parentNode

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

			;


			setSelectEventListener(modifySelectMarkup(selectsCollection[ii]));

		}
	};



	wrapSelects();


	// var wrapRadioButtons = function(){

	// 	var radioButtonsCollection;

	// 	if( !( document.getElementsByTagName('input').length > 0 && ( selectsCollection = document.getElementsByTagName('select') ) ) ){ return; }

	// }

