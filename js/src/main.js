								var imgr = new Imager({
								selector: '.js-ps-img',	
								className:'scale-with-grid',	
								availableWidths: [ 960, 800, 768,600, 480, 360, 320, 0], 
								lazyload: true,
								onImagesReplaced: function(){

									/**
									 * Checks the DOM for zoom wrapper element via and id, if the element exists instanciates elevateZoom
									 * 
									 */
									document.getElementById('js-ps-zoom-wrapper') && (function(){

										$.removeData($(".js-ps-zoom").get(0));
										document.querySelector('.zoomContainer') && document.body.removeChild(document.querySelector('.zoomContainer')); 
																			
										$(".js-ps-zoom").elevateZoom({ 
											zoomType	: "inner", 
											cursor      : "crosshair",
											easing : true,
											responsive: true,
											preloading: 0,
								            zoomWindowFadeIn: 681,
								            zoomWindowFadeOut: 681,
								            onZoomedImageLoaded: function(){
								            	
								            }
										});

									})();

								}
							});

							var slider = new defSlider('.js-slider', {
								imgr: imgr,
								modernizr : window.Modernizr
							});

							//var variant_data = <?= json_encode(\Product\Api::get_variant_options_cache()) ?>;



							document.querySelector('.js-ps-img-hover') && $('body').on('mouseover', '.js-ps-img-hover',{imager: imgr},function(evt){
									
									evt.preventDefault();
									evt.data.imager.checkImagesNeedReplacing(evt.target.parentNode.getElementsByTagName('img'));

							});

							document.getElementById('js-ps-zoom-additional') && document.getElementById('js-ps-zoom-wrapper') && $('body').on('click', '#js-ps-zoom-additional a',{imager: imgr}, function(evt){
								evt.preventDefault(); // prevent events default behaviour


								var _this = $(this);

								$('.js-ps-zoom').attr('data-src', _this.attr('data-img'));

								$('.js-ps-zoom').attr('data-zoom-image', _this.attr('data-zoom'));

								evt.data.imager.replaceImagesBasedOnScreenDimensions(document.querySelector('.js-ps-zoom'));
								evt.data.imager.onImagesReplaced();


							});

							/**
							 * Using ajaxComplete to trigger an elements update on imager after an ajax request
							 * @return {void}
							 */
							$(document).ajaxComplete(function(){
								imgr.updateDivs();

								// var selects = document.getElementsByTagName('select'), nativeSelectEv = function(elem){
									
								// 	var event = document.createEvent('HTMLEvents');
								// 	event.initEvent('change', true, false);
								// 	elem.dispatchEvent(event);

								// };

								// for(i = 0, l = selects.length; i < l; i++){
									
								// 	document.createEvent ? nativeSelectEv(selects[i]) : selects[i].fireEvent('onchange');

								// }


							});


							

							$(function () {
								$(':input[data-behaviour="auto-submit"]').change(function (e) {
									$(this).parents('form').trigger('submit');
								});
							});




							document.getElementById('propshop-basket') && (function () {
									$(document).on('basketChanged', function () {

										var $basketSection = $('#propshop-basket-section'), overlay = document.createElement('div'), box = document.createElement('p');


										box.innerText = 'Updating Basket...';
										box.style.position = 'absolute';
										box.style.top = '50%';
										box.style.left = '50%';
										box.style.backgroundColor = '#000000iter';
										box.style.opacity = 0.7;
										box.style.width = '300px';
										box.style.height = '50px';
										box.style.marginLeft = '-150px';
										box.style.marginright = '-25px';
										box.style.borderRadius = '5px';
										box.style.border = '1px solid white';
										box.style.textAlign = 'center';
										box.style.lineHeight = '50px';
										box.style.color = 'white';



										overlay.style.position = 'absolute';
										overlay.style.top = 0;
										overlay.style.left = 0;
										overlay.style.backgroundColor = '#222222';
										overlay.style.opacity = 0.5;
										overlay.style.width = '100%';
										overlay.style.height = '100%';

										overlay.appendChild(box);

										$basketSection.get(0).appendChild(overlay);


										$.get('/basket/full', function (data) {
											$('#propshop-basket-section').replaceWith(data);
										});
									});
							})(jQuery);
