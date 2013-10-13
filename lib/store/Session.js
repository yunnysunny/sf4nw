function Session(values) {
	this.values = values ? values : {};
	this.lastActive = new Date().getTime();
}

Session.prototype.setAttribute = function(key, value) {
	this.values[key] = value; 
}

Session.prototype.getAttribute = function(key) {
	return this.values[key];
}

Session.prototype.resetActive = function() {
	this.lastActive = new Date().getTime();
}

Session.prototype.getLastActive = function() {
	return this.lastActive;
} 

module.exports = Session;
