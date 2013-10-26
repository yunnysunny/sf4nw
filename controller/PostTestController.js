var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function PostTestController() {
	
}

util.inherits(PostTestController,Controller);

PostTestController.prototype.doGet = function(request,response) {	
	response.loadView('postshow');
}

PostTestController.prototype.doPost = function(request,response) {
	console.log(request.post);
	//var result = {code : 0};
	response.end('{"code" : 0,"name":"'+request.getParam('name')+'"}');
}

module.exports = PostTestController;
