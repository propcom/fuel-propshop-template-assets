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
	"use strict";

	// Assingns a url default value just in case it's not set and removes any leading slashes
	url = (url || '').replace(/^\//, '');

	// Checks if window.url_domain exists, otherwise returns a value based on the functions logic
	window.url_domain = (window.url_domain || (function (u) {

		//Checks for the return value of the data attribute, otherwise applies base path.
		u = u || window.location.protocol + '//' + window.location.hostname;

		// Return the url domain making sure there is a trailing slash at the end
		return u;

	}(document.body.getAttribute('data-urldomain')))).replace(/\/*$/, '/');

	// window.url_domain = window.url_domain.replace(/\/*$/, '/');

	return window.url_domain + url;
}
