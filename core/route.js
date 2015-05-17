var path = require('path');
var url = require('url');
var resource = require('../lib/resource');
require('../lib/string');
var AbstractController = require('../lib/mvc/AbstractController');

function route(handle) {
	return function(request,response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		

		if (typeof(handle[pathname]) == 'object') {
            var handleNow = handle[pathname];
            if (typeof (handleNow.init) === 'function') {
                AbstractController.prototype.init.call(handleNow.init);
            }
            AbstractController.prototype.service.call(handleNow,request,response);
			//handle[pathname].service(request,response);
		} else {
			if (request.url == '/favicon.ico' || request.url.startWith(GLOBAL_STATIC_PATH)) {
				resource.output(request,response,pathname);
			} else {
				response.endError(403);
			}
			
		}
	}
	
}
 
module.exports = route;