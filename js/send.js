(function($){

    var SendForm = function( element, options) {
        this.options = $.extend({}, $.fn.sendForm.defaults, options);
        this.$element = $(element);
        this.$container = this.$element.closest(options.selector);
        this.$form = null;

        this.title = this.$container.find('[data-send-item=title]')[this.options.html ? 'html' : 'text']();
        this.content = this.$container.find('[data-send-item=content]')[this.options.html ? 'html' : 'text']();
        this.img = this.$container.find('[data-send-item=image]').attr('src');

        if (this.options.showOnClick)
        {
           this.$element.on('click', $.proxy(this.show, this));
        }
    }

    SendForm.prototype = {

        constructor: SendForm,

        show: function(e) {
            e && e.preventDefault();

            // Just show the form if there is already one.
            if (this.$form) {
                this.$form.show();
                return;
            }

            var method = this.options.method == 'data' ? showUsingData : showUsingLink;

            method.call(this);
        },

        hide: function(e) {
            this.$form && this.$form.hide();
        },

        send: function(e) {
            this.$form && this.$form.trigger('submit');
        }
    }

    /**
     *  These is outside of the prototype 'cos they're private
     */

    function handleFormSubmit(e) {
        e && e.preventDefault();
        var self = this;

        $.post(self.options.sendUrl, self.$form.find(':input').serialize())
            .done()
            .fail(function(response) {
                var data = $.parseJSON(response.responseText);

                $.each(data.error_messages, function(k, v){
                    self.$form.find('[name=' +k+ ']').after($('<span></span>').addClass('error error-inline').html(v));
                });
            });
    }

    function showUsingLink() {
        var self = this;
        var url = self.$element.attr('href');

        if ( ! url) return;

        $.get(url).done(function(data) {
                self.$form = $(data);
                self.$form.appendTo($('body')).on('submit', $.proxy(handleFormSubmit, self)).show();
            });
    }


    function showUsingData() {
        var self = this;

        $.get('/send/share', {title: self.title, content: self.content, img: self.img})
            .done(function(data) {
                self.$form = $(data);
                self.$form.appendTo($('body')).on('submit', $.proxy(handleFormSubmit, self)).show();
            });
    }

    $.fn.sendForm = function(option) {

        return this.each(function() {
            var $this = $(this),
                data = $this.data('send-form'),
                options = $.extend({}, $.fn.sendForm.defaults, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('send-form', (data = new SendForm(this, options)))

            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.sendForm.defaults = {
        'selector': '[data-action=send]',
        'html': false,
        'sendUrl': '/send/send/send',
        'showOnClick': true,
        'method': 'data'
    };


    $(function() {
        // init.
        $('.js-email-friend').sendForm({method: 'link'});
    });

})(jQuery)