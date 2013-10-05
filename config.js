var define = require('./define');

define(exports, 'SAVE_PATH', './images/');
define(exports, 'HTTP_PORT', 81);

define(exports,'EXT_TO_CONTENT_TYPE' , {
		'.html' : {contentType : 'text/html', maxAge : 7200},
		'.htm' : {contentType : 'text/html', maxAge : 7200},
		'.png' : {contentType : 'imgage/png', maxAge : 7200},
		'.gif' : {contentType : 'image/gif', maxAge : 7200},
		'.jpg' : {contentType : 'image/jpeg', maxAge : 7200},
		'.jpeg' : {contentType : 'image/jpeg', maxAge : 7200},
		'.ico' : {contentType : 'image/x-icon', maxAge : 7200},
		'.css' : {contentType : 'text/css', maxAge : 7200},
		'.js' : {contentType : 'text/javascript', maxAge : 7200},
		'.txt' : {contentType : 'text/plain', maxAge : 7200},
		'.svg': {contentType : 'image/svg+xml', maxAge : 7200},
		'.swf': {contentType : 'application/x-shockwave-flash', maxAge : 7200},
		'.tiff': {contentType : 'image/tiff', maxAge : 7200},		
		'.wav': {contentType : 'audio/x-wav', maxAge : 7200},
		'.wma': {contentType : 'audio/x-ms-wma', maxAge : 7200},
		'.wmv': {contentType : 'video/x-ms-wmv', maxAge : 7200},
		'.json': {contentType : 'application/json', maxAge : 7200},
		'.pdf': {contentType : 'application/pdf', maxAge : 7200},
		'.xml': {contentType : 'text/xml', maxAge : 7200}
});

define(exports,'DEFAULT_WELCOME_INDEX',{});

