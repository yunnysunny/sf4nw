/**
 * 生成一个session对象
 * @param {object|null} values 传递给改生成对象的初始字典值
 * @constructor
 */
function Session(values) {
	this.values = values ? values : {};
	this.lastActive = new Date().getTime();
}
/**
 * 设置session属性
 * @param {string} key 属性名
 * @param {any} value 属性值
 */
Session.prototype.setAttribute = function(key, value) {
	this.values[key] = value; 
}
/**
 * 获取session属性
 * @param {string} key 属性名
 * @returns {any} value 属性值
 */
Session.prototype.getAttribute = function(key) {
	return this.values[key];
}
/**
 * 重置当前session的最后访问时间为当前时间
 */
Session.prototype.resetActive = function() {
	this.lastActive = new Date().getTime();
}
/**
 * 获取当前session的最后访问时间
 */
Session.prototype.getLastActive = function() {
	return this.lastActive;
} 

module.exports = Session;
