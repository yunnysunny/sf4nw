/**
 * 生成一个session对象
 * @param {object|null} values 传递给改生成对象的初始字典值
 * @constructor
 */
function Session(options) {
	this.values = options.values || {};
	this.lastActive = options.lastActive || new Date().getTime();
}
Session.prototype.resetValues = function(values) {
    this.values = values;
    return this;
}
/**
 * 重置当前session的最后访问时间为当前时间
 */
Session.prototype.resetActive = function() {
	this.lastActive = new Date().getTime();
    return this;
}
/**
 * 获取当前session的最后访问时间
 */
Session.prototype.getLastActive = function() {
	return this.lastActive;
} 

module.exports = Session;
