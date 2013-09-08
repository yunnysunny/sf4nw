var fs = require('fs');
var http = require('http');
var path = require('path');
var error = require('./error');


var EXT_TO_CONTENT_TYPE = {
		'.html' : 'text/html',
		'.htm' : 'text/html',
		'.png' : 'imgage/png',
		'.gif' : 'image/gif',
		'.jpg' : 'image/jpeg',
		'.ico' : 'image/x-icon',
		'.css' : 'text/css',
		'.js' : 'text/javascript',
		'.txt' : 'text/plain'
};

function output(response,pathname,params,isTpl) {
	console.log('pathname:'+pathname);
	if (pathname.indexOf('..') != -1) {
		error.show(response,403);
		return;
	}
	
	if (!isTpl) {
		pathname = GLOBAL_APP_BASE + pathname;
	}
	console.log('pathname:'+pathname);
	fs.exists(pathname,existCallback);
	
	function existCallback(exist) {
		
		if (exist) {
			fs.readFile(pathname,'utf-8',function(err,data) {
				if (err) {
					throw err;
				}
				var ext = path.extname(pathname);
				
				//TODO check empty ext,in this case load the default file,such as index.html
				if (EXT_TO_CONTENT_TYPE[ext]) {
					response.writeHead(200, {"Content-Type": EXT_TO_CONTENT_TYPE[ext]});//注意这里
				} else {
					response.writeHead(200, {"Content-Type" : "application/octet-stream"});
				}
				
				if (params) {
					//TODO load templates with params
				}
		        response.write(data);
		        response.end();
		        
			});
		} else {
			console.log('not exist');
			if (pathname == '/favicon.ico') {
				response.writeHead(200,{'Content-type': 'image/x-icon'});				
				response.end();
			} else {
				error.show(response,404);
			}
		}		
	}
	
}
function loadTpl(response,viewName,params) {
	var filename = GLOBAL_VIEW_PATH + '/' + viewName + '.html';
	output(response,filename,params,true);
}
exports.output = output;
exports.loadTpl = loadTpl;