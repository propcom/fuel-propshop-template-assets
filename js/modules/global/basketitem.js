;(function($){

	var BasketItem = function( element, options) {
		this.options = $.extend({}, $.fn.basketItem.defaults, options)
		this.$element = $(element)
			.delegate('[data-basket-action="increment"]', 'click.increment.basket-item', $.proxy(this.increment, this))
			.delegate('[data-basket-action="decrement"]', 'click.decrement.basket-item', $.proxy(this.decrement, this))
			.delegate('[data-basket-action="add"]', 'click.add.basket-item', $.proxy(this.add, this))
			.delegate('[data-basket-action="remove"]', 'click.add.basket-item', $.proxy(this.remove, this));
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

		$.ajax({
			url: _u(requestUrl),
			type: method || 'POST',
			dataType: 'JSON',
			data: reqData,
			cache: false,
			beforeSend: function(){

				window.ajaxOverlay.add('Updating your basket...');

			}
		}).done(function(data, status, response, callback){

			typeof callback === 'function' ? callback(data) : $.event.trigger('basketChanged', data);

		}).fail(function(response) {

			if (typeof response.responseJSON !== 'undefined') {
				window.addMessage('error', response.responseJSON.message);
			}

		}).then(function(){

			if(!document.getElementById('propshop-basket-section')){
				return true;
			}

			return $.ajax({
						url: _u('/basket/full'),
						type: 'GET',
						cache: false
					}).done(function(data){
						$('#propshop-basket-section').replaceWith(data);
						window.addMessage('success', 'Your basket has been updated');
					}).fail(function(){
						document.location.reload(true);
					})

		}).always(function(){

			window.ajaxOverlay.remove();

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
		addUrl : _u('/basket/rest/add.json'),
		removeUrl : _u('/basket/rest/delete.json'),
		incrementUrl : _u('/basket/rest/incr.json'),
		decrementUrl : _u('/basket/rest/decr.json'),
		productId : ''
	};


	var setupBasket = function() {
		$('[data-basket="item"]').each(function(){
			var $this = $(this),
			productId = $this.attr('data-product-id'),
			option = $.extend({'productId' : productId}, $this.data())
			$this.basketItem(option)
		});
	}

	setupBasket();

	$(document).ajaxComplete(function(){
		setupBasket();
	});


})(jQuery)
