var defSlider = defSlider || {};

defSlider = (function($) {



function Slider(selector, options) {
    if (!selector) {
      throw new Error('selector missing, eg: new defSlider(".selector")');
    }

    this.options = {
      sBtnPreviousId: 'js-slider__btn--previous',
      sBtnNextId: 'js-slider__btn--next',
      sItemClass: 'js-slider__item',
      sCurrentItemClass: 'js-slider__item--current',
      sShowPreviousClass: 'js-slider__item--show-previous',
      sShowNextClass: 'js-slider__item--show-next',
      sHidePreviousClass: 'js-slider__item--hide-previous',
      sHideNextClass: 'js-slider__item--hide-next',
      sCarousel: true,
      sInterval: 5000
    };

    this.selector = selector;
    this.$selector = document.querySelectorAll(this.selector)[0];

    this.options = extend(this.options, options);
    this.event = null;
    this.isCycling = false;
    this.interval = null;

    if(this.options.modernizr.touch){

      var _self = this;

      this.tEvents = null;
      this.tPointerType = null;
      this.start = {};
      this.delta = {};
      this.isScrolling;
      this.isTouchfired = false;

      this.tEvents = {
        START: 'touchstart',
        MOVE: 'touchmove',
        END: 'touchend'
      }

      this.tPointerType = 'touch';


      if (window.navigator.pointerEnabled) {

        this.tEvents.START = "pointerdown";
        this.tEvents.MOVE = "pointermove";
        this.tEvents.END = "pointerup";

      } else if (window.navigator.msPointerEnabled) { // hopefully this will play nice with windows mobile
        
        this.tEvents.START = "MSPointerDown";
        this.tEvents.MOVE = "MSPointerMove";
        this.tEvents.END = "MSPointerUp";
        this.tPointerType = 2;

      }

      this.touchHandler = {

        handleEvent: function(event){

          switch(event.type){

            case _self.tEvents.START: this.start(event); break; 
            case _self.tEvents.MOVE: this.move(event); break;
            case _self.tEvents.END: this.end(event); break;

          }

        },
        start: function(event){

          _self.start = {

            x: event.touches[0].pageX,
            y: event.touches[0].pageY,
            time: +new Date 

          }

          _self.isScrolling = undefined;
          _self.delta = {};
          _self.$selector.addEventListener(_self.tEvents.MOVE, this, false); 
          _self.$selector.addEventListener(_self.tEvents.END, this, false); 

        },
        move: function(event){

          _self.$selector.removeEventListener(_self.tEvents.MOVE, this, false); 

          if(event.touches.length > 1 || event.scale && event.scale !== 1 ) return;

          _self.delta = {
            x: event.touches[0].pageX - _self.start.x,
            y: event.touches[0].pageY - _self.start.y,
          };


          if(typeof _self.isScrolling === 'undefined'){
            _self.isScrolling = !!( _self.isScrolling || Math.abs(_self.delta.x) < Math.abs(_self.delta.y) )
          }

          var duration = +new Date - _self.start.time;


          if(_self.isScrolling  || Number(duration) === 0 ){ return }

          event.preventDefault();

          var direction = _self.delta.x < 0;

          if(direction){
            _self.onNextButtonClicked();
          } else {

            _self.onPreviousButtonClicked();
          }

        },
        end: function(event){

          _self.$selector.removeEventListener(_self.tEvents.END, _self.touchHandler, false); 

        }

      }

       this.$selector.addEventListener(this.tEvents.START, this.touchHandler, false);
      
    }

    // "Global vars"
    this.allItemsArray = document.querySelectorAll(this.selector + ' .' + this.options.sItemClass);
    this.allItemsArrayLength = this.allItemsArray.length;
    this.currentItemIndex = findInArray(this.allItemsArray, document.querySelector(this.selector + ' .' + this.options.sCurrentItemClass));
    this.buttonPrevious = document.getElementById(this.options.sBtnPreviousId);
    this.buttonNext = document.getElementById(this.options.sBtnNextId);

    this.bindEvents();
    this.createCustomEvent();
    this.startCycle();
    

  }

  var SliderProto = Slider.prototype; // Caching our slider prototype for faster access

  // Reset all settings by removing classes and attributes added by goTo() & updatePagination()
  SliderProto.removeAllHelperSettings = function () {
    removeClass(this.allItemsArray[this.currentItemIndex], this.options.sCurrentItemClass);
    removeClass($$(this.options.sHidePreviousClass)[0], this.options.sHidePreviousClass);
    removeClass($$(this.options.sHideNextClass)[0], this.options.sHideNextClass);
    removeClass($$(this.options.sShowPreviousClass)[0], this.options.sShowPreviousClass);
    removeClass($$(this.options.sShowNextClass)[0], this.options.sShowNextClass);
  };

  // Method to add classes to the right elements depending on the index passed
 SliderProto.goTo = function (index, direction) {


    index = Number(index - 1);
    if (index >= this.allItemsArrayLength || index < 0 || index === this.currentItemIndex) { return; }

    this.removeAllHelperSettings();

    if(direction === '<'){

      addClass(this.allItemsArray[this.currentItemIndex], this.options.sHideNextClass);
      addClass(this.allItemsArray[index], this.options.sCurrentItemClass + ' ' + (this.options.sShowPreviousClass));

    } else {

      addClass(this.allItemsArray[this.currentItemIndex], this.options.sHidePreviousClass);
      addClass(this.allItemsArray[index], this.options.sCurrentItemClass + ' ' + (this.options.sShowNextClass));
      
    }

    this.currentItemIndex = index;
    this.options.imgr.checkImagesNeedReplacing(this.$selector.getElementsByTagName('img'));

    // Update event currentItemIndex property and dispatch it
    this.event.detail.currentItemIndex = this.currentItemIndex;
    //this.$selector.dispatchEvent(this.event);
    dispatchEvent(this.$selector, this.event);

  };


  SliderProto.startCycle = function(){

     var _this = this;

     this.isCycling = true;
     this.interval = requestInterval(function(){

        _this.onNextButtonClicked();
      
     }, this.options.sInterval);

  }

  SliderProto.stopCycle = function(){

     clearRequestInterval(this.interval);
     this.isCycling = false;

  }

  SliderProto.checkForCycling = function(){

    if(this.isCycling === true){ this.stopCycle(); }  

  }


  // Callback for when previous button is clicked
  SliderProto.onPreviousButtonClicked = function () {

    if(this.currentItemIndex === 0 && this.options.sCarousel === true ){
      this.goTo((this.allItemsArrayLength + 1) - 1, '<');
    } else{
      this.goTo((this.currentItemIndex + 1) - 1, '<');
    }
    
  };

  // Callback for when next button is clicked
  SliderProto.onNextButtonClicked = function () {
    this.stopCycle()
     //alert('fired');
    if(this.currentItemIndex + 1 === this.allItemsArrayLength && this.options.sCarousel === true) {
      this.goTo(1, '>');
    } else {
      this.goTo((this.currentItemIndex + 1) + 1, '>');
    }
  };

  // Attach click handlers
  SliderProto.bindEvents = function () {
    var _this = this;
    addEvListener(this.buttonPrevious,'click', function () { _this.onPreviousButtonClicked(); });
    addEvListener(this.buttonNext,'click', function () { _this.onNextButtonClicked(); });
  };

  // Method so it is nicer for the user to use custom events
  // SliderProto.on = function (eventName, callback) {
  //   if (eventName !== 'change') {
  //     throw new Error('the only available event is "change"');
  //   }

  //   addEvListener(this.$selector, eventName, function(event) {
  //     return callback(event);
  //   }, false);
  // };



  // Create custom Event
  SliderProto.createCustomEvent = function () {

    var _this = this;

    if(window.CustomEvent){

      this.event = new CustomEvent('customChange', {
        detail: {
          parentSelector: _this.selector,
          currentItemIndex: Number(_this.currentItemIndex)
        },
        bubbles: true,
        cancelable: true

      });

      // Pollyfill for CustomEvent() Constructor - thanks to Internet Explorer
      // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
      function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
      }

      CustomEvent.prototype = window.CustomEvent.prototype;
      window.CustomEvent = CustomEvent;

    } else{

      this.event = $.Event('customChange',{
        detail: {
            parentSelector: _this.selector,
            currentItemIndex: Number(_this.currentItemIndex)
          },
          bubbles: false,
          cancelable: true
      }, false);

    }

  };

  /**
   * Helper functions
   */

  function $$(element) {
    if (!element) { return; }
    return document.querySelectorAll('.'+element);
  }

  function addClass(element, className) {
    if (!element) { return; }
    element.className = element.className.replace(/\s+$/gi, '') + ' ' + className;
  }

  function removeClass(element, className) {
    if (!element) { return; }
    element.className = element.className.replace(className, '');
  }

  function extend(origOptions, userOptions){
    var extendOptions = {}, attrname;
    for (attrname in origOptions) { extendOptions[attrname] = origOptions[attrname]; }
    for (attrname in userOptions) { extendOptions[attrname] = userOptions[attrname]; }
    return extendOptions;
  }

  function addEvListener(el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler, false);
    } else {
      $(el).on(eventName, handler);
    }
  }


  function dispatchEvent(elem, ev){

    if(elem.dispatchEvent){
      elem.dispatchEvent(ev)
    }
    else{
        $(elem).trigger(ev);
    }

  }

  function findInArray(haystack, key){

    for(var i = 0, l = haystack.length; i < l; i++){
      if(haystack[i] == key)
        return i;
    }

    return null;

  }

  var requestAnimFrame = (function() {
    return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  var requestInterval = function(fn, delay) {

    if( !window.requestAnimationFrame       && 
      !window.webkitRequestAnimationFrame && 
      !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
      !window.oRequestAnimationFrame      && 
      !window.msRequestAnimationFrame)
        return window.setInterval(fn, delay);
        
    var start = new Date().getTime(),
      handle = new Object();
      
    function loop() {
      var current = new Date().getTime(),
        delta = current - start;
        
      if(delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
   
      handle.value = requestAnimFrame(loop);
    };
    
    handle.value = requestAnimFrame(loop);
    return handle;
  }


  var clearRequestInterval = function(handle) {
      window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
      window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
      window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
      window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
      window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
      window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
      clearInterval(handle);
  };

  return Slider;

})(jQuery);