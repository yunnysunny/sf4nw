function define(namespace, name, value) {
	//console.log("name:"+name);
    Object.defineProperty(namespace, name, {
        value:      value,
        enumerable: true,
		writable:     false,
		configurable: false
    });
}
module.exports = define;
