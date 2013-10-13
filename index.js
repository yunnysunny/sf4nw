var server = require("./server");
var route = require("./route");
var handle = require('./handle');
var filters = require('./filters');
var inits = require('./inits');
var define = require('./define');
/**
 * 应用所在的根目录
 */
define(global, 'GLOBAL_APP_BASE', __dirname);
/**
 * 视图所在文件夹
 */
define(global, 'GLOBAL_VIEW_PATH', GLOBAL_APP_BASE + '/view');
/**
 * 指定静态资源所能够访问的文件夹
 */
define(global, 'GLOBAL_STATIC_PATH', '/assets/')
/**
 * 指定初始化运行的函数列表
 */
server.init(inits.AUTOLOAD_FUNS); 
/**
 * 指定当前应用的路由器和拦截器
 * */
server.start(route(handle),filters.FILTER_MAP);

