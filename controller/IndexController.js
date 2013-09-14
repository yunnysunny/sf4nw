var Controller = require('./Controller');
var util = require('util');

function IndexController() {
	
}

util.inherits(IndexController,Controller);

IndexController.prototype.doGet = function(request,response) {
	console.log('index [get]');
	this.loadView(request,response,'index');
}

module.exports = IndexController;
