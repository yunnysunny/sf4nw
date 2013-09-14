var fs = require('fs');
var path = require('path');
var EXT_TO_CONTENT_TYPE =  require('../config.js').EXT_TO_CONTENT_TYPE;

function checkAndOuput(request,response,filename) {
	var headers = request.headers;
	
	fs.stat(filename, statCallback);
	
	function statCallback(err,stat) {
		if (err) {
			throw err;
		}
		
		var lastModified = stat.mtime.toUTCString();
		var ifModifiedSince = "If-Modified-Since".toLowerCase();
		var ext = path.extname(filename);
		
		if (EXT_TO_CONTENT_TYPE[ext]) {
			response.setHeader(	"Content-Type", EXT_TO_CONTENT_TYPE[ext].contentType);
			response.setHeader("Cache-Control" , "max-age=" + EXT_TO_CONTENT_TYPE[ext].maxAge);
				
		} else {
			response.setHeader("Content-Type" , "application/octet-stream");
		}
		
		response.setHeader("Last-Modified" , lastModified);	
		
		if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
			response.writeHead(304, "Not Modified");
			response.end();
		} else {
			
			fs.readFile(filename,'utf-8',function(err,data) {
				if (err) {
					throw err;
				}
				
				var etag = request.headers['etag'];
				if (etag) {
					
				}
				response.writeHead(200, "OK");			

		        response.write(data);
		        response.end();
		        
			});
		}
		
	}	
}

exports.checkAndOuput = checkAndOuput;