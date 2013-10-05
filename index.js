var server = require("./server");
var router = require("./router");
var handle = require('./handle');
var filters = require('./filters');
var define = require('./define');

define(global, 'GLOBAL_APP_BASE', __dirname);
define(global, 'GLOBAL_VIEW_PATH', GLOBAL_APP_BASE + '/view');

server.init(); 
server.start(router.route,handle,filters.FILTER_MAP);

