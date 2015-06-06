var crypto = require('crypto');
const DEFAULT_KEY_LEN = 16;
function AbstractStoreManage() {

}

AbstractStoreManage.prototype.genKey = function(keyLen) {//随机数操作会抛出异常
    keyLen = keyLen || DEFAULT_KEY_LEN;
    var key = crypto.randomBytes(keyLen);
    key = crypto.createHash('md5').update(key).digest('hex');

    return key;
}

AbstractStoreManage.prototype.get = function(key) {
	
}

AbstractStoreManage.prototype.update = function(key,value) {

}

AbstractStoreManage.prototype.create = function(value) {

}

AbstractStoreManage.prototype.putIfAbsent = function(key,value) {

}

AbstractStoreManage.prototype.remove = function(key) {

}

module.exports = AbstractStoreManage;
