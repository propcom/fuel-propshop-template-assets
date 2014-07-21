$(function(){
    var filter_request;

    function on_filter_change() {
        // Build filter string
        var $this = $(this);
        var $form = $this.closest('form');

        // Abort the active request
        if (filter_request) {
            filter_request.abort();
        }

        filter_request = $.get('/search/index', $form.serialize(), function(response) {
            $('#search-content').replaceWith(response);
            filter_request = null;
            var state = $.param($form.serializeArray());
            if (state.length > 0) {
                state = '?' + state;
            }
            history.pushState(state, "", "/search/index"+state);
            setupFilters();
            setupSort();
        });
    }

    function setupFilters() {
        $('.js-search-filter').on('click', function(e) {
            e.preventDefault();
            var $this = $(this);

            // Abort the active request
            if (filter_request) {
                filter_request.abort();
            }

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
        })
        .on('filter-change', on_filter_change);
    }

    function setupSort() {
        $('.js-search-sort').on('change', function(e){
           $(this).trigger('filter-change');
        }).on('filter-change', on_filter_change);
    }

	$('.js-search-per-page').on('change', function() {
		this.form.submit();
	});

    setupFilters();
    setupSort();
});
