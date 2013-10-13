var resource = require('./resource');
function HttpResponse(res) {
	var serverRes = res.constructor;
	serverRes.prototype.loadView = function(viewName, params) {
		resource.loadTpl(res,viewName,params);
	}
	serverRes.prototype.endJSON = function(json) {
		this.end(JSON.stringify(json));
	}
	serverRes.prototype.addCookie = function(cookie) {
		this.setHeader('Set-Cookie',cookie.serialize());
	}
	return res;
}
module.exports = HttpResponse;