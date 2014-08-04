

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

			for (i = 0, l = el.options.length; i < l ; i++ ){
				
				if(el.options[i].selected === true){
					option = el.options[i].innerHTML; 
					break;
				} 
					
			}
			

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

			setSelectEventListener(modifySelectMarkup(selectsCollection[ii]));

		}
	};



	wrapSelects();


	// var wrapRadioButtons = function(){

	// 	var radioButtonsCollection;

	// 	if( !( document.getElementsByTagName('input').length > 0 && ( selectsCollection = document.getElementsByTagName('select') ) ) ){ return; }

	// }

