var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var EXT_TO_CONTENT_TYPE =  require('../config/config.js').EXT_TO_CONTENT_TYPE;
var ifModifiedSince = "If-Modified-Since".toLowerCase();

var compressHandle = function (raw, ext,  request, response) {
    var stream = raw;
    var acceptEncoding = request.headers['accept-encoding'] || "";
    var matched = EXT_TO_CONTENT_TYPE[ext] && EXT_TO_CONTENT_TYPE[ext].compress;

    if (matched && acceptEncoding.match(/\bgzip\b/)) {
        response.setHeader("Content-Encoding", "gzip");
        stream = raw.pipe(zlib.createGzip());
    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
        response.setHeader("Content-Encoding", "deflate");
        stream = raw.pipe(zlib.createDeflate());
    }
    response.writeHead(200, 'OK');
    stream.pipe(response);
};

function checkAndOuput(request,response,filename) {
	var headers = request.headers;
	
	fs.stat(filename, statCallback);
	
	function statCallback(err,stat) {
		if (err) {
			throw err;
		}
		
		var lastModified = stat.mtime.toUTCString();
		
		var ext = path.extname(filename);
		
		if (EXT_TO_CONTENT_TYPE[ext]) {
			response.setHeader(	"Content-Type", EXT_TO_CONTENT_TYPE[ext].contentType);
			response.setHeader("Cache-Control" , "max-age=" + EXT_TO_CONTENT_TYPE[ext].maxAge);
				
		} else {
			response.setHeader("Content-Type" , "application/octet-stream");
		}
		response.setHeader("Date", new Date().toUTCString());
		response.setHeader("Last-Modified" , lastModified);	
		
		if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
			response.writeHead(304, "Not Modified");
			response.end();
		} else {
			var raw = fs.createReadStream(filename);
			compressHandle(raw, ext, request, response);
//			fs.readFile(filename,'utf-8',function(err,data) {
//				if (err) {
//					throw err;
//				}
//				
////				var etag = request.headers['etag'];
////				if (etag) {
////					
////				}
//				response.writeHead(200, "OK");			
//
//		        response.write(data);
//		        response.end();
//		        
//			});
		}
		
	}	
}

exports.checkAndOuput = checkAndOuput;