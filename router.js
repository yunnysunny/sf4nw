var path = require('path');
var url = require('url');
var resource = require('./lib/resource');

function route(request,response,handle) {
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");

	if (typeof(handle[pathname]) == 'object') {

		handle[pathname].service(request,response);
	} else {		
		resource.output(response,pathname);		
	}	
}
 
exports.route = route;