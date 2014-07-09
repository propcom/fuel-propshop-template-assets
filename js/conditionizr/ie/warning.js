// FONT
WebFontConfig = {
	google: {families: ['Fjalla+One::latin']}
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();

//render this via backend
window.legacyIEwarningMessage = {
	msg1: "You are using an outdated browser!",
	msg2: "Please upgrade to a modern browser for a better, safer, faster & more beautiful web experience.",
	br: {
		ie: "Explorer",
		ff: "Firefox",
		chrome: "Chrome"
	},
	url: {
		ie: "http://www.microsoft.com/windows/Internet-explorer/default.aspx",
		ff: "http://www.mozilla.com/firefox/",
		chrome: "http://www.google.com/chrome"
	},
	msg3: "Continue to Website"
};


(function(window, undefined) {

	var ieWarning = function(cb) {

		// if no cookie...
		if (document.cookie.indexOf('gs_cookie=firstme') == -1) {

			var exdate = new Date();
			exdate.setDate(exdate.getDate() + 1);
			document.cookie = "gs_cookie=firstme;expires=" + exdate.toUTCString();

			var configObj = (typeof(cb) == 'function') ? cb() : {},
					//configObj[message] = window.legacyIEwarningMessage

					l10n = window.legacyIEwarningMessage,
					imagesStyle = {
				bg: 'transparent url(' + configObj.imgPath + '/images.gif) no-repeat scroll ',
				background: {
					bgPos: '-185px -93px',
					w: '120px',
					h: '122px'
				},
				ie: {
					bgPos: '0px -90px',
					w: '100px',
					h: '110px'
				},
				ff: {
					bgPos: '-88px -90px',
					w: '100px',
					h: '110px'
				},
				chrome: {
					bgPos: '-177px 3px',
					w: '100px',
					h: '110px'
				}
			},
			_html = {
				d: document.createElement('div'),
				l: document.createElement('div'),
				c: document.createElement('a'),
				h: document.createElement('h1'),
				p1: document.createElement('p'),
				ul: document.createElement('ul'),
				li: {
					ie: document.createElement('li'),
					ff: document.createElement('li'),
					chrome: document.createElement('li')
				},
				ico: {
					ie: document.createElement('div'),
					ff: document.createElement('div'),
					chrome: document.createElement('div')
				},
				lit: {
					ie: document.createElement('div'),
					ff: document.createElement('div'),
					chrome: document.createElement('div')
				}
			},
			_width = document.documentElement.clientWidth,
					_height = document.documentElement.clientHeight;

			//setup document
			(function() {
				document.body.appendChild(_html.l);
				document.body.appendChild(_html.d);
				//left these attributes so someone can target the rest of the message with custom CSS
				_html.d.appendChild(_html.h);
				_html.d.appendChild(_html.p1);
				_html.d.appendChild(_html.ul);
				for (var key in _html.li) {
					if (_html.li.hasOwnProperty(key)) {
						_html.ul.appendChild(_html.li[key]);
						_html.li[key].appendChild(_html.ico[key]);
						_html.li[key].appendChild(_html.lit[key]);
					}
				}
				;
				_html.d.appendChild(_html.c)
			})();

			//set up lights out effect
			(function() {
				_html.l.setAttribute('id', 'lightsOut');
				_html.l.style.zIndex = 99998;
				_html.l.style.width = _width + "px";
				_html.l.style.height = _height + "px";
				_html.l.style.position = "absolute";
				_html.l.style.top = "0px";
				_html.l.style.left = "0px";
				_html.l.style.filter = "alpha(opacity=50)";
				_html.l.style.background = "#fff";
			})();

			//setup legacyIEwarning box
			(function() {
				var _ddw = 550,
				      _ddh = 500;
				_html.d.setAttribute('id', 'legacyIEwarning');
				_html.d.style.zIndex = 99999;
				_html.d.style.width = _ddw + "px";
				_html.d.style.height = _ddh + "px";
				_html.d.style.position = "absolute";
				_html.d.style.top = ((_height - _ddh) / 2) + "px";
				_html.d.style.left = ((_width - _ddw) / 2) + "px";
				_html.d.style.padding = "20px";
				_html.d.style.background = "#fff";
				_html.d.style.border = "3px solid #817f58";
				_html.d.style.fontFamily = "'Fjalla One',Helvetica,Arial,sans-serif";
				_html.d.style.listStyleType = "none";
				_html.d.style.color = "#acacac";
				_html.d.style.fontSize = "25px";
			})();

			//setup header messaging
			(function() {
				_html.h.appendChild(document.createTextNode(l10n.msg1));
				_html.h.style.display = "block";
				_html.h.style.fontSize = "34px";
				_html.h.style.borderBottom = "4px dotted #817f58";
				_html.h.style.marginBottom = "30px";
				_html.h.style.paddingBottom = "25px";
				_html.h.style.color = "#000";
				_html.h.style.fontFamily = "'Fjalla One',Helvetica,Arial,sans-serif";
				_html.h.style.fontWeight = "BOLD";
				_html.h.style.textTransform = "uppercase";

				_html.p1.appendChild(document.createTextNode(l10n.msg2));
				_html.p1.style.marginBottom = "1em";
				_html.p1.style.fontFamily = "'Fjalla One',Helvetica,Arial,sans-serif";
				_html.p1.style.fontSize = "28px";
				_html.p1.style.lineHeight = "1.2em";
				_html.p1.style.color = "#6a6868";

				_html.c.appendChild(document.createTextNode(l10n.msg3));
				_html.c.setAttribute('class', 'closebrowserWarning');
				_html.c.style.zIndex = 99998;
				_html.c.style.display = "block";
				_html.c.style.fontSize = "14px";
				_html.c.style.width = "100%";
				_html.c.style.height = "30px";
				_html.c.style.textAlign = "right";
				_html.c.style.cursor = "pointer";
				_html.c.onclick = function() {
					_html.d.parentNode.removeChild(_html.d);
					_html.l.parentNode.removeChild(_html.l);
				}
			})();


			//setup of browser list
			(function() {
				_html.ul.style.listStyleImage = "none";
				_html.ul.style.listStylePosition = "outside";
				_html.ul.style.listStyleType = "none";
				_html.ul.style.margin = "0px auto";
				_html.ul.style.padding = "5px";
				_html.ul.style.height = "175px";
				_html.ul.style.width = "400px";

				for (var key in _html.li) {
					var keyS;
					if (_html.li.hasOwnProperty(key)) {
						keyS = _html.li[key].style;
						keyS.background = imagesStyle.bg + imagesStyle.background.bgPos;
						keyS.width = imagesStyle.background.w;
						keyS.height = imagesStyle.background.h;
						keyS.cursor = "pointer";
						keyS.styleFloat = keyS.cssFloat = "left";
						keyS.margin = "0 20px 10px 0";
						//wrapping with a closure to emulate a real local var
						_html.li[key].onclick = (function() {
							var akey = key;
							return function() {
								window.location = l10n.url[akey]
							}
						})();
					}

					if (_html.ico.hasOwnProperty(key)) {
						keyS = _html.ico[key].style;
						keyS.width = "95px";
						keyS.height = "90px";
						keyS.margin = "15px auto 20px";
						keyS.background = imagesStyle.bg + imagesStyle[key].bgPos;
					}

					if (_html.lit.hasOwnProperty(key)) {
						keyS = _html.lit[key].style;
						keyS.color = "#acacac";
						keyS.fontSize = "25px";
						keyS.width = "118px";
						keyS.height = "18px";
						keyS.lineHeight = "30px";
						keyS.margin = "1px auto";
						keyS.textAlign = "center";
						_html.lit[key].appendChild(document.createTextNode(l10n.br[key]));
					}
				}
				//removing left margin on last element
				_html.li.chrome.style.margin = "0 0 10px";
			})();
		}

	};

	//set it to global namesapce
	window.legacyIEwarning = ieWarning;
})(window);
