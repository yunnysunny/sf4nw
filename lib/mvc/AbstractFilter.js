function AbstractFilter() {
	
}

AbstractFilter.prototype.init = function(option) {
	return this;
}
/**
 * 拦截器处理函数，如果处理完成后需要立即输出结果到浏览器，则返回false；
 * 如果还要将请求交给下一个拦截器或者路由处理，则返回true。
 * 
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @returns {boolean}
 */
AbstractFilter.prototype.doFilter = function(request, response) {
	return true;
}

module.exports = AbstractFilter;
