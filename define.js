function define(namespace, name, value) {
	//console.log("name:"+name);
    Object.defineProperty(namespace, name, {
        value:      value,
        enumerable: true,
		writable:     false,
		configurable: false
    });
}
define.__L = function(path) {
	return new (require(path))();
}
module.exports = define;
