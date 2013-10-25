/**
 * This handles the default behaviour for the main basket.
 * See also minibasket.js
 *
 * This script finds basket items and creates BasketItem objects for them.
 * It also finds controls for the basket items and hooks them up to the AJAX
 * functions on BasketItem.
 *
 * As usual, js- classes are used to identify elements:
 *
 * * A basket item js-basket-item
 * * The + and - buttons are js-basket-item-inc and js-basket-item-dec, respectively
 * * The quantity input is js-basket-item-qty
 * * The remove button is js-basket-item-rm
 * * The price (digits and currency symbol) is js-basket-item-price
 * * The subtotal is js-basket-subtotal
 * * The shipping price is js-basket-shipping-price
 * * The shipping method selector is js-basket-shipping
 * * The total is js-basket-total
 */
$(function(){
	
	function setupBasket() {
		$('.js-basket-row').each(function(){
			var $this = $(this),
			productId = $this.attr('data-product-id'),
			option = $.extend({'productId' : productId}, $this.data())				
			$this.basketItem(option)
		});
	}
	
	setupBasket();
	
	$('body').ajaxComplete(setupBasket);
})
