var util = require('util');

var AbstractStoreManage = require('./AbstractStoreManage');
var Session = require('./Session');
/**
 * 内存存储管理,注意在cluster中启动多个进程，则此类将不能支持数据正确获取到
 * 
 * @constructor
 */
function MemStoreManage(option) {
	this.store = {};	
	
}

util.inherits(MemStoreManage, AbstractStoreManage);
/**
 * 查找当前的key值是否存在，不存在返回null
 * @param {string} key
 * @returns {Session|null} 如果存在key所指向的Session对象
 */
MemStoreManage.prototype.get = function(key) {
	console.dir(this.store);
	return typeof (this.store[key]) != 'undefined' && this.store[key] ?
			this.store[key] : null; 
}


/**
 * @param {object|null} value 要保存到store中的内容，可以为空
 * @returns {string} 生成的key值
 */
MemStoreManage.prototype.create = function(value) {
	if (!value) {
		value = {};
	}
	
	var key = this.genKey();
	if (this.get(key)) {
		key = this.genKey();
		if (this.get(key)) {
			throw new Error('create random error');
			return null;
		}
	}

	this.store[key] = new Session({values:value});
	console.log('key ' + key + ' was set');
	return key;
}
/**
 * 
 */
MemStoreManage.prototype.update = function(key, values) {
	if (this.get(key)) {
        this.store[key] = this.store[key].resetValues(values).resetActive();
    } else {

    }
}

MemStoreManage.prototype.remove = function(key) {
	if (typeof (this.store[key]) != 'undefined') {
		delete this.store[key];
	}	
}

module.exports = MemStoreManage;
