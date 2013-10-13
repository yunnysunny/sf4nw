var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function GetTestController() {
	
}

util.inherits(GetTestController,Controller);

GetTestController.prototype.doGet = function(request,response) {
	response.end('{code : 0,name:"'+request.getParam('name')+'"}'); 
}

module.exports = GetTestController;
