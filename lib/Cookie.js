function Cookie(name,value,maxAge,path,domain,httpOnly,secure) {
	this.name = name;
	this.value = value;
	if (maxAge) {
		var expires = new Date();
		expires.setTime(expires.getTime() + maxAge * 1000);
		this.expires = expires;
	}
	
	this.path = path;
	this.httpOnly = !!httpOnly;
	this.secure = !!secure;
}

Cookie.prototype.serialize = function() {
	var str = name + '=' + value + ';'
	if (this.expires) {
		str += ' expires=' + this.expires.toUTCString() + ';';
	}
	if(this.path) {
		str += ' path=' + this.path + ';';
	}
	if (this.httpOnly) {
		
	}
	if (this.secure) {
		
	}
}

function getData(cookieStr) {
	var data = null;
	if (cookieStr) {
		var tokenIndex = cookieStr.indexOf('=');
		if (tokenIndex != -1) {
			var key = cookieStr.substring(0,tokenIndex);
			var value = cookieStr.substring(tokenIndex + 1);
			data = {};
			data[key] = value;
		}		
	}
	return data;
}
/**
 * cookie反序列化函数,本函数对于cookie的数量进行限制，只支持50个cookie
 * 
 * @param {string} str 从http头部读取的cookie的字符串
 * @returns {array} cookie数组，每个数组元素都是{key:value}形式的对象
 * */
Cookie.unserialize = function(str) {
	var cookies = [];
	if (str) {
		var cookieStr = '';
		var j = 0;
		for(var i=0,len=str.length;i<len;i++) {
			var char = str[i];
			if (char == ';' && str[++i] == ' ') {
				var data = getData(cookieStr);
				if (data) {
					cookies.push(data);
					j++;
					if (j >= 50) {
						break;
					}
				}
				cookieStr = '';
			} else {
				cookieStr += char;
			}
		}
	}
	
	return cookies;
}
module.exports = Cookie;