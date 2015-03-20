var Controller = require('../lib/mvc/AbstractController');
var util = require('util');

function JsonpTestController() {
    Controller.call(this,'JsonpTestController');
}

util.inherits(JsonpTestController,Controller);

JsonpTestController.prototype.doGet = function(request,response) {
    response.endJSONP(request,{code:0,msg:''});
}

module.exports = JsonpTestController;