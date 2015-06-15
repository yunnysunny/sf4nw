var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var EXT_TO_CONTENT_TYPE =  require('../config/config.js').EXT_TO_CONTENT_TYPE;
var ifModifiedSince = "If-Modified-Since".toLowerCase();

var compressHandle = function (raw, ext,  request, response,callback) {
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

    stream.pipe(response);
    stream.on('error',function(err) {
        console.error('error when read file',err);
        response.endError(500,'内部错误');
        if (typeof (callback) === 'function') {
            callback(err);
        }
    });
    stream.on('end',function() {
        //response.writeHead(200, 'OK');
        if (typeof (callback) === 'function') {
            callback(false);
        }
    });
};

function checkAndOuput(request,response,filename,callback) {
	var headers = request.headers;
	
	fs.stat(filename, statCallback);
	
	function statCallback(err,stat) {
		if (err) {
            console.error('check exist failed',err);
            if (typeof (callback) === 'function') {
                callback(err);
            }
            return;
		}
		
		var lastModified = stat.mtime.toUTCString();
		
		var ext = path.extname(filename);
        var cacheConfig = EXT_TO_CONTENT_TYPE[ext];
		if (cacheConfig) {
			response.setHeader(	"Content-Type", cacheConfig.contentType);
			response.setHeader("Cache-Control" , "max-age=" + cacheConfig.maxAge);
				
		} else {
			response.setHeader("Content-Type" , "application/octet-stream");
		}
		response.setHeader("Date", new Date().toUTCString());
		response.setHeader("Last-Modified" , lastModified);	

        var ifModifiedSince = headers[ifModifiedSince];
		if (ifModifiedSince && lastModified == ifModifiedSince) {
			response.writeHead(304, "Not Modified");
			response.end();
            callback(false);
		} else {
			var raw = fs.createReadStream(filename);
			compressHandle(raw, ext, request, response,callback);
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