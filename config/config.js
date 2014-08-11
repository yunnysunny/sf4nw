var define = require('./../core/define');
/**
 * 应用启动后cluster模块开启的进程数
 */
define(exports, 'WOKER_PROCESS_COUNT', 1);
/**
 * 应用开启的端口号
 */
define(exports, 'HTTP_PORT', 81);
/**
 * 静态文件的Mime-Type和缓存时间配置
 */
define(exports,'EXT_TO_CONTENT_TYPE' , {
		'.html' : {contentType : 'text/html', maxAge : 7200, compress : true},
		'.htm' : {contentType : 'text/html', maxAge : 7200, compress : true},
		'.png' : {contentType : 'imgage/png', maxAge : 7200},
		'.gif' : {contentType : 'image/gif', maxAge : 7200},
		'.jpg' : {contentType : 'image/jpeg', maxAge : 7200},
		'.jpeg' : {contentType : 'image/jpeg', maxAge : 7200},
		'.ico' : {contentType : 'image/x-icon', maxAge : 7200},
		'.css' : {contentType : 'text/css', maxAge : 7200, compress : true},
		'.js' : {contentType : 'text/javascript', maxAge : 7200, compress : true},
		'.txt' : {contentType : 'text/plain', maxAge : 7200, compress : true},
		'.svg': {contentType : 'image/svg+xml', maxAge : 7200},
		'.swf': {contentType : 'application/x-shockwave-flash', maxAge : 7200},
		'.tiff': {contentType : 'image/tiff', maxAge : 7200},		
		'.wav': {contentType : 'audio/x-wav', maxAge : 7200},
		'.wma': {contentType : 'audio/x-ms-wma', maxAge : 7200},
		'.wmv': {contentType : 'video/x-ms-wmv', maxAge : 7200},
		'.json': {contentType : 'application/json', maxAge : 7200, compress : true},
		'.pdf': {contentType : 'application/pdf', maxAge : 7200},
		'.xml': {contentType : 'text/xml', maxAge : 7200, compress : true}
});
/**
 * 应用的默认的欢迎页
 */
define(exports,'DEFAULT_WELCOME_INDEX',{});
/**
 * session的配置选项
 */
define(exports,'SESSION_OPTION', {
	cookieName : 'nsessionid',
	maxActiveTime : 7200	
});
/**
 * session处理对象
 */
define(exports,'SESSION_MANAGE',define.__L('./lib/store/MemStoreManage', exports.SESSION_OPTION));

define(exports, 'SAVE_PATH', './images/');
/**
 * 自定义的HTTP请求方法名在url中的参数名，这个参数将在控制器中读取。
 * 这个参数如果不配置，则默认'm'。
 * 
 * @example baseurl?m=show，控制器在判断当前请求为get时，会读取m参数，
 * 来获取当前需要调用的控制的函数名为showAction
 * */
define(exports, 'CUSTOM_METHOD_NAME', 'm');