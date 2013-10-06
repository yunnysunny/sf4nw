var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function IndexController() {
	
}

util.inherits(IndexController,Controller);

IndexController.prototype.doGet = function(request,response) {
	console.log('index [get]');
	this.loadView(response,'index');
}

module.exports = IndexController;
