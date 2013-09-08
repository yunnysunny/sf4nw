var Controller = require('./Controller');
var util = require('util');
var resource = require('../lib/resource');
function IndexController() {
	
}

util.inherits(IndexController,Controller);

IndexController.prototype.doGet = function(request,response) {
	console.log('index [get]');
	resource.loadTpl(response,'index');
}

module.exports = IndexController;
