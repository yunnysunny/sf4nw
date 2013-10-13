var qs = require('querystring');
var error = require('../error');
var resource = require('../resource');

function AbstractController() {
	this.name="controller";
}

AbstractController.prototype.init = function() {
	return this;
}

AbstractController.prototype.service = function(request,response) {
	if (request.method == 'POST') {
		if (typeof (this.doPost) != 'function') {
			error.show(response,405,'POST method is not supported in this page.');
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
		if (typeof (this.doGet) != 'function') {
			error.show(response,405,'GET method is not supported in this page.');
		} else {
			this.doGet(request,response);
		}
		
	}
}

module.exports = AbstractController;
