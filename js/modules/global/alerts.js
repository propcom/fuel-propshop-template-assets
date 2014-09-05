;(function($){

	"use strict";

	$(document).on('click', '#js-ps-alert-close', function(){
		$('#js-ps-alert').slideUp(300, function(){
			var self = $(this);
			self.remove();
		});
	});


}(jQuery));