function define(namespace, name, value) {
	//console.log("name:"+name);
    Object.defineProperty(namespace, name, {
        value:      value,
        enumerable: true,
		writable:     false,
		configurable: false
    });
}
define.__L = function(path,params) {
	return new (require(path))(params);
}
module.exports = define;
