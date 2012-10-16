(function($){
	$('select[name="country"]').live('change',function(e){
		e.preventDefault();
		$.getJSON('/shipping/rest/states.json', {'country_id' : $(this).val()}, function(data){
			var html;
			// there was no error, but
			// we dont have any states
			if($.isEmptyObject(data) || data.error) {
				html = '<input name="state" type="text" class="input-medium" value="" />';
			}
			else {
				html = '<select name="state" class="input-medium">';
				$.each(data, function(key, val){
					html += '<option value="'+key+'">'+val+'</option>';
				});
				html += '</select>';
			}
			$('select[name="state"], input[name="state"]').replaceWith($(html));
		});
	});

	$('.estimate-shipping').live('click', function(e) {
		e.preventDefault();
		var formData = $('form#estimate-shipping').serialize();
		console.log(formData);
		$.post('/shipping/estimate', formData, function(data){
			$('.shipping-estimator-wrap').html(data);
		});
	});
})(jQuery);
