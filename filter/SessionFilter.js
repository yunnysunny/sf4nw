var util = require('util');
var AbstractFilter = require('../lib/mvc/AbstractFilter');
var Cookie = require('../lib/Cookie');
var config = require('../config');
var sessionOption = config.SESSION_OPTION;
var sessionManage = config.SESSION_MANAGE;

function SessionFilter() {
	
}

util.inherits(SessionFilter, AbstractFilter);

function isValidValue(result, maxAge) {
	var valid = false;
	if (result) {
		if (new Date().getTime() - result.getLastActive() < maxAge * 1000) {
			valid = true;
		}
	}
	return valid;
}

SessionFilter.prototype.doFilter = function(request, response) {
	var sessionid = request.getCookie(sessionOption.cookieName);
	if (sessionid) {
		
		var sessionResult = sessionManage.get(sessionid);
		if (isValidValue(sessionResult, sessionOption.maxActiveTime)) {
			request.session = sessionResult;
		}
	} else {
		var sessionid = sessionManage.create();
		var cookie = new Cookie(sessionOption.cookieName,sessionid,0,'/',null,true);
		response.addCookie(cookie);
	}
	return true;
}

module.exports = SessionFilter;