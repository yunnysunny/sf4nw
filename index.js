var server = require("./server");
var route = require("./route");
var handle = require('./handle');
var filters = require('./filters');
var inits = require('./inits');
var define = require('./define');

define(global, 'GLOBAL_APP_BASE', __dirname);
define(global, 'GLOBAL_VIEW_PATH', GLOBAL_APP_BASE + '/view');

server.init(inits.AUTOLOAD_FUNS); 
server.start(route,handle,filters.FILTER_MAP);

