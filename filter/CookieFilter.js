var util = require('util');
var AbstractFilter = require('./AbstractFilter');
var Cookie = require('../lib/Cookie');

function CookieFilter() {
	
}

util.inherits(CookieFilter,AbstractFilter);

CookieFilter.prototype.doFilter = function(request, response) {
	request.headers.cookie = Cookie.unserialize(request.headers.cookie);
	return true;
}

module.exports = CookieFilter;