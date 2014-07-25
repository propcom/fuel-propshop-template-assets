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


							

							$(function () {
								$(':input[data-behaviour="auto-submit"]').change(function (e) {
									$(this).parents('form').trigger('submit');
								});
							});
