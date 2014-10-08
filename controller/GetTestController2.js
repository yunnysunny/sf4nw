var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function GetTestController2() {
	
}

util.inherits(GetTestController2,Controller);

GetTestController2.prototype.doGet = function(request,response) {
	response.setHeader('Content-Type','text/html; charset=utf-8');
	response.end('{"code" : 0,"name":"'+request.getParam('name')+'"}');
	
	 
}

module.exports = GetTestController2;
