$(function(){
    var filter_request;

    function on_filter_change() {
        // Build filter string
        var $this = $(this);
        var filterStr = '';

       $('.filters :input.filter').each(function(i, elm){

           if ($(elm).is(':checkbox') && ! $(elm).is(':checked'))
               return;

           var filterName = $(elm).attr('name');
           var filterVal = $(elm).val();
           filterStr += filterName + '[]=' + filterVal + '&';
       });

        console.log(filterStr);
        // Ajax
        var url = '/search/index/?' + filterStr + window.location.search.slice(1);

        window.history.pushState("", "", url);

        filter_request = $.get(url, function(response) {
            $('#main-content').html(response);

            //init_slider();
        });
    }

    $('.filters :input.filter').live('click', function() {
        var $this = $(this);

        // Abort the active request
        if (filter_request) {
            filter_request.abort();
        }

        /* if (! $this.hasClass('show-all')) {
            $this.toggleClass('checked');

            // Not the same as .siblings() - .siblings() doesn't include $this.
            if (! $this.parent().children('a.checked').length) {
                $this.closest('.filter').find('a.show-all').addClass('checked');
            }
            else {
                $this.closest('.filter').find('a.show-all').removeClass('checked');
            }
        }
        else {
            if (!$this.hasClass('checked')) {
                $this.toggleClass('checked');
                $this.parent().find('nav a').removeClass('checked');
            }
            else {
                return false;
            }
        }
         */
        $this.trigger('filter-change');

        return false;
    })
    .on('filter-change', on_filter_change);


});