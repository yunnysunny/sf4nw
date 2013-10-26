var fs = require('fs');
var http = require('http');
var path = require('path');
var error = require('./error');
var cache = require('./cache');
var doT = require('dot');
//doT.templateSettings = {
//  evaluate:    /\{\{([\s\S]+?)\}\}/g,
//  interpolate: /\{\{=([\s\S]+?)\}\}/g,
//  encode:      /\{\{!([\s\S]+?)\}\}/g,
//  use:         /\{\{#([\s\S]+?)\}\}/g,
//  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
//  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
//  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
//  varname: 'it',
//  strip: true,
//  append: true,
//  selfcontained: false
//};
doT.templateSettings['strip'] = false;

function tplRender(response,pathname,params) {
	fs.readFile(pathname,'utf-8',function(err,data) {
		if (err) {
			throw err;
		}
		var tempFn = doT.template(data);
		var resultText = tempFn(params);
		response.writeHead(200,{'Content-Type': 'text/html'});				
		
		response.write(resultText);
		response.end();
	});
}

function output(request,response,pathname,params,isTpl) {
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
			if (isTpl) {//解析动态页
				if (typeof(doT) == 'object') {
					tplRender(response,pathname,params);//解析模板文件
				} else {
					error.show(response,500,'don not support dynamic page.');
				}
			} else {//解析静态页
				cache.checkAndOuput(request,response,pathname);
			}
			return true;
		} else {//文件不存在
			console.log('not exist');
			if (pathname == '/favicon.ico') {
				response.writeHead(200,{'Content-Type': 'image/x-icon'});				
				response.end();
				return true;
			} else {
				if (!path.extname(pathname)//没有文件后缀名
						&& config.DEFAULT_WELCOME_INDEX && config.DEFAULT_WELCOME_INDEX.length > 0) {
					if (pathname.substr(pathname.length-1,1) != '/') {
						pathname += '/';
					}
					var i=0,len = config.DEFAULT_WELCOME_INDEX.length;
					while(i<len) {//尝试加载欢迎页
						if (output(request,response,pathname+config.DEFAULT_WELCOME_INDEX[i])) {
							return true;
						}
						i++;
					}
				}
				error.show(response,404);
				return false;
			}
		}		
	}
	
}
function loadTpl(response,viewName,params) {
	var filename = GLOBAL_VIEW_PATH + '/' + viewName + '.html';
	output(null, response,filename,params,true);
}
exports.output = output;
exports.loadTpl = loadTpl;