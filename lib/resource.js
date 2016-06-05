var fs = require('fs');
var http = require('http');
var path = require('path');
var error = require('./error');
var cache = require('./cache');
var doT = require('dot');
var config = require('../config/config');
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

function nextTry(request, response, basePath,welcomeArray,nextIndex) {
    return function(toContinue) {
        if (toContinue && nextIndex < welcomeArray.length) {
            var path = basePath + welcomeArray[nextIndex];
            nextIndex++;
            output(request, response,path,nextTry(request,response,basePath,welcomeArray,nextIndex),true);
        }
    }

}
/**
 *
 * @param request
 * @param response
 * @param pathname
 * @param callback function(needContinue) {}
 * @param needContinue
 */
function output(request,response,pathname,callback,needContinue) {
	console.log('url pathname:'+pathname);
    if (pathname == '/favicon.ico') {
        response.writeHead(200,{'Content-Type': 'image/x-icon'});
        response.end();
        if (needContinue) {
            callback(false);
        }
    }
	if (pathname.indexOf('..') != -1) {
		response.endError(403);
        if (needContinue) {
            callback(true);
        }
	}
	var originalPathname = pathname;
    pathname = GLOBAL_APP_BASE + pathname;
	console.log('physical path:'+pathname);
	fs.exists(pathname,existCallback);
	
	function existCallback(exist) {
		
		if (exist) {
            if (!path.extname(originalPathname)) {//没有文件后缀名
                if (!(config.DEFAULT_WELCOME_INDEX instanceof Array) || (config.DEFAULT_WELCOME_INDEX.length == 0)) {
                    if (needContinue) {
                        callback(true);
                    } else {
                        response.endError(404);
                    }
                    return;
                }
                if (originalPathname.substr(originalPathname.length-1,1) != '/') {
                    originalPathname += '/';
                }
                var filename = originalPathname+config.DEFAULT_WELCOME_INDEX[0];
                output(request,response,filename,nextTry(request,response,pathname,config.DEFAULT_WELCOME_INDEX,1),true);
            } else {
                cache.checkAndOuput(request,response,pathname,function(err) {
                    if (needContinue) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback(true);
                        }
                    }
                });
            }
		} else {//文件不存在
			console.log('not exist');
            if (needContinue) {
                callback(true);
            } else {
                response.endError(404);
            }
		}
	}
}
function loadTpl(response,viewName,params) {
	var filename = GLOBAL_VIEW_PATH + '/' + viewName + '.html';

    if (typeof(doT) == 'object') {
        tplRender(response,filename,params);//解析模板文件
    } else {
        response.endError(500,'don not support dynamic page.');
    }

}
exports.output = output;
exports.loadTpl = loadTpl;