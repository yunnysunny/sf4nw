var util = require('util');
var AbstractFilter = require('../lib/mvc/AbstractFilter');
var Cookie = require('../lib/Cookie');
var Session = require('../lib/store/Session');
var config = require('../config/config');
var sessionOption = config.SESSION_OPTION;
var sessionManage = config.SESSION_MANAGE;

function SessionFilter() {
	
}

util.inherits(SessionFilter, AbstractFilter);

function isValidValue(result, maxAge) {
	var valid = false;
	if (result instanceof Session) {
		if (new Date().getTime() - result.getLastActive() < maxAge * 1000) {
			valid = true;
		}
	}
	return valid;
}

function addNewSession(response) {
	var sessionid = sessionManage.create();
	if (sessionid) {
		var cookie = new Cookie(sessionOption.cookieName,sessionid,0,'/',null,true);
		response.addCookie(cookie);
	}
	
}

SessionFilter.prototype.doFilter = function(request, response) {
	var sessionid = request.getCookie(sessionOption.cookieName);
	if (sessionid) {
		console.log('sessionid:' + sessionid);
		var sessionResult = sessionManage.get(sessionid);
		if (isValidValue(sessionResult, sessionOption.maxActiveTime)) {
			request.session = sessionResult;
		} else {
			addNewSession(response);
		}
	} else {
		addNewSession(response);
	}
	return true;
}

module.exports = SessionFilter;