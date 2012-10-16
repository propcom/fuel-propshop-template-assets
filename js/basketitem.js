(function($){
	
	var BasketItem = function( element, options) {
		this.options = $.extend({}, $.fn.basketItem.defaults, options)
		this.$element = $(element)
			.delegate('[data-basket-action="increment"]', 'click.increment.basket-item', $.proxy(this.increment, this))
			.delegate('[data-basket-action="decrement"]', 'click.decrement.basket-item', $.proxy(this.decrement, this))
			.delegate('[data-basket-action="add"]', 'click.add.basket-item', $.proxy(this.add, this))
			.delegate('[data-basket-action="remove"]', 'click.add.basket-item', $.proxy(this.remove, this))
	}
	
	BasketItem.prototype = {

		constructor: BasketItem,
		
		add: function() {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest.call(this, this.options.addUrl)					
			}
		},
		
		remove: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest.call(this, this.options.removeUrl)					
			}
		},
		
		increment: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest.call(this, this.options.incrementUrl)					
			}
		},
		
		decrement: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest.call(this, this.options.decrementUrl)					
			}
		}
	}
	
	
	function makeRequest(requestUrl) {
		var that = this;
		
		$.ajax({
			url: requestUrl,
			type: this.options.method,
			dataType: 'JSON',
			data: {'id' : this.options.productId},
			success: function(data) {
				$.event.trigger('basketChanged', data);
			}
		});
	}
	
	$.fn.basketItem = function(option) {
		
		return this.each(function() {
			var $this = $(this),
			data = $this.data('basketitem')
			options = $.extend({}, $.fn.basketItem.defaults, $this.data(), typeof option == 'object' && option)
			
			if(!data) $this.data('basketitem', (data = new BasketItem(this, options)))
			
			if(typeof option == 'string') data[option]()
		})
	}
	
	$.fn.basketItem.defaults = {
		method : 'POST',
		addUrl : '/basket/rest/add.json',
		removeUrl : '/basket/rest/delete.json',
		incrementUrl : '/basket/rest/incr.json',
		decrementUrl : '/basket/rest/decr.json',
		productId : ''
	};
	
	$('document').ready(function(){
		
		function setupBasket() {
			$('[data-basket="item"]').each(function(){
				var $this = $(this),
				productId = $this.attr('data-product-id'),
				option = $.extend({'productId' : productId}, $this.data())				
				$this.basketItem(option)
			});
		}
		
		setupBasket();
		
		$('body').ajaxComplete(setupBasket);
	})
	

})(jQuery)