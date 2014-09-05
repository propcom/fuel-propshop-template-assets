document.getElementById('js-ps-category-page') && (function($){


    $('#js-ps-category-page').css('min-height', function(){
        return ( $('#js-ps-filters').get(0).clientHeight + $('#search-filter-filters').get(0).clientHeight )+'px';
    });


    var filter_request;

    function on_filter_change() {
        // Build filter string
        var $this = $(this), reqData = $('#search-filter-filters, #search-filter-sort, #search-filter-per-page').serialize();

        // Abort the active request
        filter_request && filter_request.abort();
    
        filter_request = $.ajax({
            url: '/search/index',
            type: 'GET',
            data: reqData,
            cache: false,
            success: function(data) {

                $('#js-ps-category-page').replaceWith(data);
                filter_request = null;
                var state = reqData;
                if (state.length > 0) {
                    state = '?' + state;
                }

                if(history.pushState){ history.pushState(state, "", "/search/index"+state)};

                $('.js-ps-filter-content.is-open').css('height', function(){
                    return ($(this).children().length * $(this).children()['0'].clientHeight) +'px';
                });

                $('#js-ps-category-page').css('min-height', function(){
                    return ( $('#js-ps-filters').get(0).clientHeight + $('#search-filter-filters').get(0).clientHeight )+'px';
                });

                wrapSelects();

                    
            }
        });
    }

    (function() {
        $(document).on('click', '.js-search-filter', function(e) {
            e.preventDefault();
            var $this = $(this);

            // Abort the active request
            filter_request && filter_request.abort();

            if ($this.is('a')) {
                var $input = $this.prev();

                if ($input.is(':checked')) {
                    $input.attr('checked', false);
                }
                else {
                    $input.attr('checked', true);
                }
            }

            $this.trigger('filter-change');

            return false;
        }).on('filter-change', on_filter_change);
    


        $(document).on('change','.js-search-sort', function(e){
            e.preventDefault();
            on_filter_change();
        
        });


    	$(document).on('change', '.js-search-per-page', function(e) {
            e.preventDefault();
    		 on_filter_change();
    	});

    })();

})(jQuery);
