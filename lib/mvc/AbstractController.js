var qs = require('querystring');
var resource = require('../resource');
const VALID_METHOD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZzabcefghijklmnopqrstuvwxyz_1234567890'.split('');

function isValidMethod(name) {
    if (!isNaN(name.charAt(0))) {
        return false;
    }
    for(var i= 0,len=name.length;i<len;i++) {
        if (VALID_METHOD_CHARS.indexOf(name.charAt(i)) === -1) {
            return false;
        }
    }
    return true;
}

function AbstractController(name) {
    this.name = name || 'unset';
	this.init();
}

AbstractController.prototype.init = function() {
	return this;
}

AbstractController.prototype.service = function(request,response) {
	var method = request.getCustomMethod();
		
	if (method) {//自定义函数目前仅支持get请求使用
        if (!isValidMethod(method)) {
            return response.endError(400,'invalid method name.');
        }
		var methodName = method + 'Action';

		if (typeof(this[methodName]) != 'function') {
			
			response.endError(405,'method ' + methodName + ' is not supported in this controller.');
		} else {
			(this[methodName])(request,response);
		}
	} else if (request.method == 'POST') {
		if (typeof (this.doPost) != 'function') {
			response.endError(405,'POST method is not supported in this url.');
		} else {
			var self = this;
			var postStr = '';
			request.on('data',function(data) {				
				postStr += data;
			});
			request.on('end', function() {
				request.post = qs.parse(postStr);
				self.doPost(request,response);
			});			
		}
		
	} else {
		if (typeof (this.doGet) != 'function'){			
			response.endError(405,'GET method is not supported in this url.');
		} else {
			this.doGet(request,response);
		}
		
	}
}

module.exports = AbstractController;
