var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function IndexController() {
	
}

util.inherits(IndexController,Controller);

IndexController.prototype.doGet = function(request,response) {
	console.log('index [get]');
/* 	var now = new Date().getTime();
	while(new Date().getTime() < now + 1000*3600) {
	   // do nothing
	} */
	response.loadView('index');
}

module.exports = IndexController;
