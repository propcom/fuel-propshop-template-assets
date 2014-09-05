;(function($){
	
	var BasketItem = function( element, options) {
		this.options = $.extend({}, $.fn.basketItem.defaults, options)
		this.$element = $(element)
			.delegate('[data-basket-action="increment"]', 'click.increment.basket-item', $.proxy(this.increment, this))
			.delegate('[data-basket-action="decrement"]', 'click.decrement.basket-item', $.proxy(this.decrement, this))
			.delegate('[data-basket-action="add"]', 'click.add.basket-item', $.proxy(this.add, this))
			.delegate('[data-basket-action="remove"]', 'click.add.basket-item', $.proxy(this.remove, this))
    }

    /**
     * Public API that does the work
     */

    BasketItem.add = function(productId, qty,  requestUrl, method, callback) {
        qty = qty || 1;
        requestUrl = requestUrl || $.fn.basketItem.defaults.addUrl;
        method = method || $.fn.basketItem.defaults.method;
        makeRequest({'id' : productId, 'qty' : qty}, requestUrl, method, callback);
    }

    BasketItem.remove = function(productId, requestUrl, method, callback) {
        requestUrl = requestUrl || $.fn.basketItem.defaults.removeUrl;
        method = method || $.fn.basketItem.defaults.method;
        makeRequest({'id' : productId}, requestUrl, method, callback);
    }

    BasketItem.increment = function(productId, requestUrl, method, callback) {
        requestUrl = requestUrl || $.fn.basketItem.defaults.incrementUrl;
        method = method || $.fn.basketItem.defaults.method;
        makeRequest({'id' : productId}, requestUrl, method, callback);
    }

    BasketItem.decrement = function(productId, requestUrl, method, callback) {
        requestUrl = requestUrl || $.fn.basketItem.defaults.decrementUrl;
        method = method || $.fn.basketItem.defaults.method;
        makeRequest({'id' : productId}, requestUrl, method, callback);
    }

    window.Basket = BasketItem;

	BasketItem.prototype = {

		constructor: BasketItem,
		
		add: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest({'id' : this.options.productId}, this.options.addUrl, this.options.method)
			}
		},
		
		remove: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest({'id' : this.options.productId}, this.options.removeUrl, this.options.method)
			}
		},
		
		increment: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest({'id' : this.options.productId }, this.options.incrementUrl, this.options.method)
			}
		},
		
		decrement: function(e) {
			e && e.preventDefault()
			if (this.options.productId) {
				makeRequest({'id' : this.options.productId}, this.options.decrementUrl, this.options.method)
			}
		}
	}
	
	
	function makeRequest(reqData, requestUrl, method, callback) {
		var that = this;
        method = method || 'POST';
		
		$.ajax({
			url: requestUrl,
			type: method,
			dataType: 'JSON',
			data: reqData,
			success: function(data) {
                if(callback != null)
                {
                    callback(data);
                }
                else
                {
                    $.event.trigger('basketChanged', data);
                }
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