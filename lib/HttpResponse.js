var resource = require('./resource');
function HttpResponse(res) {
	/**
	 * @class
	 * @name HttpResponse
	 */
	var serverRes = res.constructor;
	/**
	 * 加载视图
	 * @param {string} viewName 视图名称，
	 * 比如要加载视图根文件夹下的index.html这个视图，则为'index'；
	 * 如果加载视图文件夹下的子文件夹fun下的some.html，则为'fun/some'。
	 * 假设视图文件夹为view，则以上目录结构：<pre>
	 * view
	 * |----index.html
	 * |----fun
	 *        |----some.html
	 * </pre>
	 * @param {object|null} params 要传递给视图模板引擎的参数，现在支持的模板引擎为doT。
	 */
	serverRes.prototype.loadView = function(viewName, params) {
		resource.loadTpl(res,viewName,params);
	}
	
	/**
	 * 输出json对象到浏览器
	 * @param {object|string} json 要输出的json对象
	 */
	serverRes.prototype.endJSON = function(json) {
		this.setHeader("Content-Type", "application/json");
		this.end(typeof(json) == 'object' ? JSON.stringify(json) : json);
	}

    serverRes.prototype.endJSONP = function(request, json) {
        var callbackFun = request.getParam('callback') || 'callback';
        var str = 'typeof (' + callbackFun + ') == "function" && ' + callbackFun + '(' + JSON.stringify(json) + ');';
        this.setHeader("Content-Type", "application/javascript");
        this.end(str);
    }
	
	/**
	 * 输出错误页到浏览器
	 * @param {number} code http的返回码
	 * @param {string} message 错误提示信息
	 */
	serverRes.prototype.endError = function(code,message) {
		this.writeHead(code,{'Content-type': 'text/html'});
		this.write('<h2>' + code + '</h2>');
		if (message) {		
			this.write('<h2>' + message + '</h2>');
		}
		this.end();
	}
	
	/**
	 * 往浏览器写入cookie
	 * @param {Cookie} cookie 要写入的cookie对象
	 * @ses {@link ./Cookie.js} 
	 */
	serverRes.prototype.addCookie = function(cookie) {
		this.setHeader('Set-Cookie',cookie.serialize());
	}
	return res;
}
module.exports = HttpResponse;