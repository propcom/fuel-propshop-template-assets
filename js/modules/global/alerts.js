;(function($){

	"use strict";

	var AjaxOverlay = function(){

		this.overlay = document.createElement('div'), this.box = document.createElement('p');

        	this.overlay.id = 'js-ps-ajax-overlay';
        	this.box.style.position = 'absolute';
        	this.box.style.top = '50%';
        	this.box.style.left = '50%';
        	this.box.style.backgroundColor = '#000000';
        	this.box.style.opacity = 0.7;
        	this.box.style.width = '300px';
        	this.box.style.height = '50px';
        	this.box.style.marginLeft = '-150px';
        	this.box.style.marginright = '-25px';
        	this.box.style.borderRadius = '5px';
        	this.box.style.border = '1px solid white';
        	this.box.style.textAlign = 'center';
        	this.box.style.lineHeight = '50px';
        	this.box.style.color = 'white';
        	this.overlay.style.position = 'fixed';
        	this.overlay.style.top = 0;
        	this.overlay.style.left = 0;
        	this.overlay.style.backgroundColor = '#222222';
        	this.overlay.style.opacity = 0.5;
        	this.overlay.style.width = '100%';
        	this.overlay.style.height = '100%';
        	this.overlay.style.zIndex = '1000000';
        	this.overlay.appendChild(this.box);
	}

	AjaxOverlay.prototype = {
		constructor: AjaxOverlay,
		add: function(message){

			this.box.innerText = message;
			document.body.style.height = '100%';
        	document.body.style.overflow = 'hidden';
        	document.body.appendChild(this.overlay);
		},
		remove: function(){

			document.body.removeChild(this.overlay);

		}
	}

	window.ajaxOverlay = new AjaxOverlay();

	$(document).on('click', '#js-ps-alert-close', function(){
		$('#js-ps-alert').slideUp(300, function(){
			var self = $(this);
			self.remove();
		});
	});



	window.addMessage = function(type, message) {

		$('#js-ps-alert') && $('#js-ps-alert').remove();

		var msg = $('#js-ps-alert-template').clone();
		msg.attr('id', 'js-ps-alert')
		.addClass('alert--' + type);
		msg.find('.js-ps-alert-close').attr('id', 'js-ps-alert-close');
		msg.find('.js-ps-alert-copy').html(message);
		msg.removeClass('visuallyhidden');

		$(document.body).prepend(msg);
	};



}(jQuery));

