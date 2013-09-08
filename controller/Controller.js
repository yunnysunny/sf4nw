var error = require('../lib/error');
function Controller() {
	this.name="controller";
}

Controller.prototype.service = function(request,response) {
	if (request.method == 'POST') {
		if (typeof (this.doPost) != 'function') {
			error.show(response,405,'POST method is not supported in this page.');
		} else {
			this.doPost(request,response);
		}
		
	} else {
		if (typeof (this.doGet) != 'function') {
			error.show(response,405,'POST method is not supported in this page.');
		} else {
			this.doGet(request,response);
		}
		
	}
}
	

module.exports = Controller;
