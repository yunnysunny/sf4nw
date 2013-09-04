var http = require('http');
var url = require('url');


http.createServer(function(req, res) {
	if(req.url == '/favicon.ico') {
		res.writeHead(200,{'Content-type': 'image/x-icon'});
	
		res.end();
		return;
	}
	var vars = url.parse(req.url,true);
	if(vars.pathname == '/snapshot') {
		
		return;
	}
	res.writeHead(404,{'Content-type': 'text/html'});
	res.write('<h2>no page</h2>');
	res.end();
}).listen(81);
console.log('listen at port 81');