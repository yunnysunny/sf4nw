var util = require('util');
var AbstractFilter = require('../lib/mvc/AbstractFilter');
var Cookie = require('../lib/Cookie');

function CookieFilter() {
	
}

util.inherits(CookieFilter,AbstractFilter);

CookieFilter.prototype.doFilter = function(request, response) {
	request.cookie = Cookie.unserialize(request.headers.cookie);
	return true;
}

module.exports = CookieFilter;