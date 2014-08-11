window.GetSizes = function(imgr, width){

	"use strict";

	var images = document.getElementsByTagName('img');

	var create = function(elem, content){

		var div = document.createElement('div');

		div.style.height = '30px';
		div.style.lineHeight = '30px';
		div.style.width = '100%';
		div.style.textAlign = 'center';


	div.style.background = 'white';
		
		div.style.color = 'black';
		div.style.position = 'absolute';
		div.style.left = 0;
		div.style.bottom = 0;
		div.style.zIndex = '10000000';
		div.style.opacity = '0.4';

		elem.parentNode.position = 'relative';


		div.classList.add('dimentions');

		div.innerHTML = content;

		elem.parentNode.appendChild(div);


	}

	var update = function(elem, content){


		elem.parentNode.querySelector('.dimentions').innerHTML = content;
	}

	var isSize = function(){

		for(var i = 0, l = imgr.availableWidths.length; i < l; i++){
			console.log( width);
			if(imgr.availableWidths[i] === width){
				return true;
				break;
			} else{
				return false;
			}

		}



	}


	for(var i = 0, l = images.length; i < l; i++){

		var content = images[i].clientWidth+' x '+images[i].clientHeight;

		!images[i].parentNode.querySelector('.dimentions') ? create(images[i], content) : update(images[i], content) ;

	}


};