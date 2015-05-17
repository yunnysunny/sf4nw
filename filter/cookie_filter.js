var Cookie = require('../lib/Cookie');
exports.doFilter = function(request, response) {
	request.cookie = Cookie.unserialize(request.headers.cookie);
	return true;
}

