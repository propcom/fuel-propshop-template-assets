/**
 * This function will prefix any url with the current domain and url prefix
 *
 * Please note that this function does not (currently) work with relative urls
 * and all urls will be treated as absolute and prefixed with the domain and
 * url prefix.
 *
 * This function should not be used for any URL that includes a domain
 *
 * @param {string} url
 * @return {string}
 */
function _u(url) {
	if ( ! window.url_domain) {
		var url_domain = document.querySelector('body').dataset['urldomain'];
		if ( ! url_domain) {
			url_domain = window.location.protocol + '//' + window.location.host;
		}

		// Make sure there is always a trailing slash
		url_domain = url_domain.replace(/\/*$/, '/');

		window.url_domain = url_domain;
	}

	// Remove any leading slash
	url = url.replace(/^\//, '');

	return window.url_domain + url;
}
