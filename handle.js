var define = require('./define');

function loadController(controllerName) {
	var controller = require(controllerName);
	
	return new controller();
}


define(exports,'/',loadController('./controller/IndexController'));
define(exports,'/snapshot',loadController('./controller/SnapshotController'));
