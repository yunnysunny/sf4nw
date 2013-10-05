var resource = require('./resource');
function HttpResponse(res) {
	var serverRes = res.constructor;
	serverRes.prototype.loadView = function(viewName, params) {
		resource.loadTpl(res,viewName,params);
	}
	return res;
}
module.exports = HttpResponse;