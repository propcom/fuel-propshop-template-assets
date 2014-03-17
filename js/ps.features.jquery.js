// https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js#L58-L172
if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = slice.call(arguments, 1); // for normal call
        var bound = function () {

            if (this instanceof bound) {
                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return self;

            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );
            }
        };
        return bound;
    };
}

(function() {
	// I reckon this flag describes the page rather than the instance.
	var admin = false,
		oid = 0;

	// All the data can be public I guess
	function Marker(data) {
		var elem = $('<div class="feature-marker"></div>'),
			self = this;
		this.elem = elem;
		this.img = data.image;

		$.extend(this, data);
		this.oid = oid++;

		elem.css({
			left : parseInt(this.x),
			top : parseInt(this.y),
			position: 'absolute'
		});

		if (admin) {
			elem.dblclick(function(){
				self.edit();
			});

			elem.draggable({
				drag: function(event, ui){
					if (self.editor) self.editor.hide();
				},
				stop: function(event, ui){
					//this.check_placement();
					self.validate();
					data.image.data('feature-api').validate();
				},
				containment: data.image
			});
		}
		else {
			elem.click(function() {
				self.toggle();
			});
		}
	}

	Marker.prototype = {
		constructor: Marker,
		edit: function() {
			this.editor = this.editor || new Editor(this);
			this.editor.show();
		},
		display: function() {
			this.popup = this.popup || new Popup(this);
			this.popup.show();
			this.visible = true;
		},
		toggle: function() {
			if (this.visible) {
				this.hide();
			}
			else {
				this.display();
			}
		},
		hide: function() {
			if (this.popup) this.popup.hide();
			this.visible = false;
		},
		validate: function() {
			// mark as valid if we're going to delete it
			if ((! $.trim(this.title) || ! $.trim(this.content))
			&&   ! this.for_deletion) {
				var i = this.image.data('invalid') || {};
				i[this.oid] = 1;
				this.image.data('invalid', i);

				this.valid = false;
				this.elem.addClass('feature-invalid');
				this.image.data('feature-api').validate();
			}
			else {
				var i = this.image.data('invalid') || {};
				delete i[this.oid];
				this.image.data('invalid', i);

				this.valid = true;
				this.elem.removeClass('feature-invalid');
				this.image.data('feature-api').validate();
			}
		},
		remove: function() {
			this.elem.remove();
			this.for_deletion = true;
		}
	};

	function Editor(marker) {
		this.marker = marker;
		var self = this;

		var popup = $('<div class="span3 feature-popup well"></div>'),
			title = $('<input type="text" name="marker-title[' + marker.oid + ']" placeholder="Feature Title" />'),
			content = $('<textarea cols="30" rows="4" name="marker-content[' + marker.oid + ']" placeholder="Feature Description"></textarea>'),
			close_button = $('<a href="#" class="close-feature-popup">&times;</a>'),
			done_button = $('<a href="#" class="btn btn-primary feature-done">Done</a>'),
			delete_button = $('<a href="#" class="btn btn-danger delete-feature">Delete Feature</a>');

		title.val(marker.title || '');
		content.val(marker.content || '');

		popup.append(title);
		popup.append(content);
		popup.append(close_button);
		popup.append(done_button);
		popup.append(delete_button);

		popup.css({
			position: 'absolute',
			'z-index': 2000,
			display: 'none'
		});

		close_button.click(function(e){
			e.preventDefault();
			title.val(marker.title || '');
			content.val(marker.content || '');

			self.marker.validate();
			self.hide();
		});

		delete_button.click(function(e){
			e.preventDefault();
			self.marker.remove();
			self.marker.validate();
			self.hide();
		});

		done_button.click(function(e){
			e.preventDefault();
			self.marker.title = title.val();
			self.marker.content = content.val();
			self.marker.validate();
			self.hide();
		});

		popup.insertAfter(marker.elem);
		this.elem = popup;
		this.reposition();
	}

	Editor.prototype = {
		constructor: Editor,
		reposition: function() {
			this.elem.css({
			});
		},
		show: function() {
			this.elem.show();
		},
		hide: function() {
			this.elem.hide();
		}
	};

	function Popup(marker) {
		this.marker = marker;
		var self = this;

		var popup = $('<div class="feature-popup"></div>'),
			title = $('<h4 />'),
			content = $('<p />'),
			close_button = $('<a href="#" class="close-feature-popup">&times;</a>');

		popup.append(title);
		popup.append(content);
		popup.append(close_button);

		title.html(marker.title);
		content.html(marker.content);

		close_button.click(function() {
			self.hide();
		});

		popup.css({
			position: 'absolute',
			'z-index': 2000,
			display: 'none',
			left : parseInt(this.marker.x) + this.marker.elem.width(),
			top : parseInt(this.marker.y)
		});

		popup.insertAfter(marker.elem);
		this.elem = popup;
	}

	Popup.prototype = {
		constructor: Popup,
		show: function() {
			var img = this.marker.img,
				pos = this.marker.elem.position();
			this.elem.show();

			if (pos.left > img.width() / 2) {
				this.elem.css({
					left: parseInt(this.marker.x) - this.marker.elem.width() - this.elem.width()
				});
			}
		},
		hide: function() {
			this.elem.hide();
		}
	};

	$.fn.productfeatures = function(opts){
		var settings;

		settings = $.extend({
			'popup_width' : 220,
			'popup_height' : 120,
			'marker_width' : 50,
			'marker_height' : 33,
			'popup_fallback' : 'right',
			'update_feature' : function(marker){
				console.log('Update existing feature');
			},
			'insert_feature' : function(marker){
				console.log('Insert new feature');
			},
			'remove_feature' : function(marker){
				console.log('Remove feature');
			}
		},opts);

		admin = !!settings.admin;

		var image = $(this),
			save_button,
			position = image.position(),
			image_id = image.data('p-image-id');

		var markers = [];

		var api = {
			validate: function() {
				if (image.data('invalid') && $.param(image.data('invalid'))) {
					save_button.addClass('disabled');
				}
				else {
					save_button.removeClass('disabled');
				}
			},
			save: function() {
				$.each(markers,function(index,obj){
					if (obj.for_deletion && obj.is_new)
						return;

					if (obj.for_deletion){
						settings.remove_feature(obj);
					} else if(obj.is_new){
							settings.insert_feature(obj);
					} else {
							settings.update_feature(obj);
					}
				});

				image.trigger('save.productfeatures');
			}
		};

		image.data('feature-api', api);

		image.wrap('<div style="position: relative;"></div>');
		image.parent().width(image.width());

		if (admin) {
			image.click(function(e){
				var data = {};
				data.x = e.offsetX;
				data.y = e.offsetY;
				data.image = image;
				data.is_new = true;

				var m = new Marker(data);
				markers.push(m);
				image.after(m.elem);
				m.edit();
			});

			var save_area = $('<div class="feature-save"><a href="#" class="feature-save-btn btn btn-primary">Save Changes</a></div>');
			save_button = save_area.find('a');
			image.parent().append(save_area);

			save_button.click(function(e){
				e.preventDefault();
				api.save();
			});
		}

		var existing = image.data('features') || [];

		$.each(existing, function(i, data) {
			data.image = image;

			var m = new Marker(data);
			markers.push(m);
			image.after(m.elem);
		});

		$.each(markers, function(i, marker) {
			marker.elem.click(function() {
				$.each(markers, function(i, m) {
					if (m == marker) return;
					m.hide();
				});
			});
		});
	};
})();
