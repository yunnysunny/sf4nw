var util = require('util');
var Cookie = require('../lib/Cookie');
var Session = require('../lib/store/Session');
var config = require('../config/config');
var sessionOption = config.SESSION_OPTION;
var sessionManage = config.SESSION_MANAGE;


function isValidValue(result, maxAge) {
	var valid = false;
	if (result instanceof Session) {
		if (new Date().getTime() - result.getLastActive() < maxAge * 1000) {
			valid = true;
		}
	}
	return valid;
}

function addNewSession(request,response) {
	var sessionid = sessionManage.create();
	if (sessionid) {
		var cookie = new Cookie(sessionOption.cookieName,sessionid,0,'/',null,true);
		response.addCookie(cookie);
        request.sessionId = sessionid;
	} else {
        request.sessionId = '';
    }
	
}

exports.doFilter = function(request, response) {
	var sessionid = request.getCookie(sessionOption.cookieName);
	if (sessionid) {
		console.log('sessionid:' + sessionid);
		var sessionResult = sessionManage.get(sessionid);
		if (isValidValue(sessionResult, sessionOption.maxActiveTime)) {
			request.session = sessionResult.values;//得到session数据
            request.sessionId = sessionid;
		} else {
			addNewSession(request,response);
		}
	} else {
		addNewSession(request,response);
	}
    var originEnd = response.end;
    response.end = function(data,encoding) {//rewrite
        sessionManage.update(request.sessionId,request.session);
        response.end = originEnd;//recovery
        response.end(data,encoding);
    }
	return true;
}

