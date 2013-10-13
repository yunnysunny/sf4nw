String.prototype.startWith = function(str) {
	var result = true;
	if (typeof(str)=='string' && str.length <= this.length) {
		for (var i=0,len=str.length;i<len;i++) {
			if (str.charAt(i) == this.charAt(i)) {
				continue;
			} else {
				result = false;
				break;
			}
		}
	} else {
		result = false;
	}
	return result;
}

String.prototype.endWith = function(str) {
	var result = true;
	if (typeof(str)=='string' && str.length <= this.length) {
		for (var i=0,len=str.length,thisLen=this.length;i<len;i++) {			
			if (str.charAt(len-1-i) == this.charAt(thisLen-1-i)) {
				continue;
			} else {
				result = false;
				break;
			}
		}
	} else {
		result = false;
	}
	return result;
}