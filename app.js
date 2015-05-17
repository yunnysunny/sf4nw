var server = require("./core/server");
var handle = require('./config/handle');
var filters = require('./config/filters');
var define = require('./core/define');
var inits = require('./config/inits');
/**
 * 应用所在的根目录
 */
define(global, 'GLOBAL_APP_BASE', __dirname);

define(global,'VIEW_TPL_NAME','dot');
/**
 * 视图所在文件夹
 */
define(global, 'GLOBAL_VIEW_PATH', GLOBAL_APP_BASE + '/view');
/**
 * 指定静态资源所能够访问的文件夹
 */
define(global, 'GLOBAL_STATIC_PATH', '/assets/');

/**
 * 指定当前应用的初始化函数列表、路由器和拦截器
 * */
var options = {
    inits:inits.AUTOLOAD_FUNS,
    handle:handle,
    filters:filters.FILTER_MAP
};
server.start(options);

process.on('uncaughtException', function(err) {
    console.log('uncaught exception occurred.',err);
});

