var url = require('url');
function HttpRequest(req) {
	var serverReq = req.constructor;
	serverReq.prototype.getCookies = function() {
		return this.cookie;
	}
	serverReq.prototype.getCookie = function(name) {
		var value = null;

		if (this.cookie instanceof Array) {
			for (var i=0,len=this.cookie.length;i<len;i++) {
				var cookie = this.cookie[i];
				if (typeof (cookie[name]) != 'undefined') {
					value = cookie[name];
					break;
				}
			}
		}
		return value;
	}
	serverReq.prototype.getSession = function() {
		return this.session;
	}
	serverReq.prototype.destorySession = function() {
		delete this.session;
	}
	serverReq.prototype.getParam = function(name) {
		var value = null;
		console.log('method:'+this.method);
		if (this.method == 'GET') {
			value = url.parse(this.url,true).query[name];			
		} else if (this.method == 'POST') {
			value = this.post[name];
		}
		return value;		
	}
	return req;
}

module.exports = HttpRequest;
