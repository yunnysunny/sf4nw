function AbstractFilter() {
	
}
AbstractFilter.prototype.init = function(option) {
	return this;
}

AbstractFilter.prototype.doFilter = function(request, response) {
	return true;
}

module.exports = AbstractFilter;
