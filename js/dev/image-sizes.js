window.getSizes = function(){


	"use strict";
	//alert('code');
	//
	//
 

 	console.log('fired');
	var images = document.getElementsByTagName('img');

	var create = function(elem, content){

		console.log(create);

		var div = document.createElement('div');

		div.style.height = '50px';
		div.style.width = '200px';
		div.style.textAlign = 'center';
		div.style.background = 'white';
		div.style.position = 'absolute';
		div.style.zIndex = '10000000';

		elem.parentNode.position = 'relative';


		div.classList.add('dimentions');

		elem.parentNode.appendChild(div);


	}

	var update = function(elem, content){
		elem.parentNode.querySelector('.dimentions').textContent(content);
	}


	window.onload = function(){

		for(var i = 0, l = images.length; i < l; i++){

			var content = images[i].clientWidth+' x '+images[i].clientWidth;

			 create(images[i], content);

		}

	}
	

	window.onresize = function(){

		for(var i = 0, l = images.length; i < l; i++){

			var content = images[i].clientWidth+' x '+images[i].clientWidth;

			console.log(content);

			images[i].parentNode.querySelector('.dimentions') ? create(images[i], content) : update(images[i], content) ;

		}

	}

};