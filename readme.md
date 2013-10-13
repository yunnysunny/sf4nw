# SF4NW #
SF4NW 是simple framework for node web的缩写，旨在构建一个简单易用的node web开发框架。  
SF4NW在设计的时候借鉴了java中j2ee的思想。比如说控制器基类AbstractController中的doService、doGet、doPost方法，是仿照servlet设计的；拦截器基类AbstractFilter中的doFilter也是仿照j2ee中拦截器设计的。此外一些api的命名方式也有仿照的痕迹。  
## 1.架构 ##
现在框架的大体流程是这个样子，http请求产生后首先经过各个拦截器处理。如果在处理过程中任何一个拦截器在调用doFilter方法的时候返回false，则结束当前请求处理，返回结果给用户浏览器；否则，在所有拦截器处理结束后，交到路由器进行处理。这里的路由器，其实是指各个url和其对应的处理代码，系统内部首先判断当前url有没有对应的控制器类，如果存在，则调用控制类的doGet或者doPost方法，否则则将当前url当前静态资源处理。
## 2.使用 ##
一般node在调用第三方代码的时候都是使用npm安装某一个指定模块，SF4NW和这种传统模式不同，它需要将整个框架的代码下载到你本地，比如你可以选择git工具通过`git clone https://github.com/yunnysunny/sf4nw.git`来将所有要用到的代码下载到本地。
### 2.1 入口代码  
框架的入口文件是index.js文件，直接看一下index.js的源代码： 
 
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
这里指出server.init函数的作用是指定应用启动前需要自动运行的函数列表，这个功能可以理解成j2ee中自启动的servlet。server.start函数指定系统运行所需要的路由器和拦截器，其中拦截器可以不指定，但是路由器一定要指定。
### 2.2 拦截器配置    
接着看拦截器部分的配置代码filters.js： 
	var define = require('./define');
	
	var FILTER_MAP = [
	    define.__L('./filter/CookieFilter'),
	    define.__L('./filter/SessionFilter')
	];
	define(exports, 'FILTER_MAP', FILTER_MAP);
FILTER_MAP是一个数组，里面必须是AbstractFilter的子类对象，且该对象必须实现了其doFilter函数，该函数中如果return false则表示当前请求处理结束，返回处理结果到浏览器端，否则将请求的处理权转交给下一个拦截器。  
**注意，这里默认开启了两个拦截器，以实现对于cookie和session的支持。**
### 2.3 路由器配置
在2.1中server.start函数的第一个参数是路由器，使用路由器时需要指定一个handle文件，这里的handle可以理解为j2ee中的web.xml，里面放置的是url和controller对象之间的映射关系。controller也就我们常说的控制器，所有控制器类中都必须至少包含一个doPost或者doGet方法（这个地方也是仿照了j2ee中servlet的做法）。将handle.js中一行配置项拿出来作说明：

	define(exports,'/',define.__L('./controller/IndexController'));

这里将url '/'映射到IndexController这个类所对应的对象上，接着看IndexController的代码：

	var Controller = require('../lib/mvc/AbstractController');
	var util = require('util');
	
	function IndexController() {
		
	}
	
	util.inherits(IndexController,Controller);
	
	IndexController.prototype.doGet = function(request,response) {
		console.log('index [get]');
		response.loadView('index');
	}
	
	module.exports = IndexController; 
可以看到里面含有一个doGet方法，这样请求应用首页的时候，将会加载一个试图（关于视图的处理下面会讲到）。
## 3.核心对象 ##
在j2ee中，我们最常操作的对象有HttpServletRequest、HttpServletResponse、HttpSession、Cookie等，以上提到的四个类，在SF4NW中也有对应的实现。  
node中提供了对于http请求（类http.IncomingMessage）和响应（类http.ServerResponse）的简单支持，SF4NW在其基础上进行了继承，所以说在SF4NW中既可以原生的方法，也可以调用扩展的方法。  
限于时间原因，大家可以分别查看./lib/HttpRequest.js ./lib/HttpResonpse.js ./lib/Cookie ./lib/store/Session.js四个文件的jsdoc注释。
## 4.配置文件 ##
SF4NW支持你在使用配置一些全局信息，比如cluster模块启动的进程数、http服务用到的端口号、静态文件的Mime-Type和缓存时间配置等，这里说一下session的配置信息：

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

SESSION_OPTION中的cookieName很好理解，类似于jsp使用jsessionid作为sessionid在浏览器端的cookie名称，这里默认使用nsessionid作为SF4NW的cookie名称；然后maxActiveTime是session的最大生存时间。最好还需要指定一个session数据的处理类，这里的MemStoreManage是将session数据直接存储到了内存中。注意由于node中各个进程中的变量是相互独立，如果将各个进程共享session数据的话需要牵扯到复杂的进程间通信。所以这里MemStoreManage并没有支持多进程，如果想支持多进程或者分布式session，请使用nosql之类的数据库来存储session，并实现一个继承自AbstractStoreManage的子类来对session进程管理。