var http = require('http');
var url = require('url');

var SnapshotCmd = require('./SnapshotCmd');
var errcode = require('./errcode');
var Transfer = require('./Transfer');

var config = require('./config');
var fs = require('fs');
var reqNow = null;

function init() {
	fs.exists(config.SAVE_PATH,function(exist) {
		if (exist) {
			fs.stat(config.SAVE_PATH,function(err,stat) {
				if (err) {
					throw err;
				}
				if (!stat.isDirectory()) {
					throw new Error('the given save path must be a folder');
				}
			});
		} else {
			fs.mkdir(config.SAVE_PATH,function(err) {
				if (err) {
					throw err;
				}
			});
		}
	});
	
}

init();

http.createServer(function(req, res) {
	reqNow = req;
	if(req.url == '/favicon.ico') {
		res.writeHead(200,{'Content-type': 'image/x-icon'});
	
		res.end();
		return;
	}
	var vars = url.parse(req.url,true);
	if(vars.pathname == '/snapshot') {
		var params = vars.query;
		if(params.url) {
			var transfer = new Transfer(req,res);
			var pos = transfer.calStartPosition();
			
			var refresh = (params.refresh == '1' && pos.start == 0);

			var cmd = new SnapshotCmd(params.url,{savePath:config.SAVE_PATH});
			cmd.getImage(function(data){
				if (data.code == errcode.ERROR_SUCCESS && data.img) {					
					
					transfer.download(data.img);
				} else {
					res.writeHead(errcode.ERROR_INTER_ERROR,{'Content-type': 'text/html'});
					res.end();
				}
			},refresh);
		} else {
			res.writeHead(errcode.ERROR_HTTP_PARAM,{'Content-type': 'text/html'});
			res.end();
		}
		return;
	}
	res.writeHead(404,{'Content-type': 'text/html'});
	res.write('<h2>no page</h2>');
	res.end();
	
	
}).listen(81);


console.log('listen at port 81');

process.on('uncaughtException', function (err) { 
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);
	//process.exit(1);
	if (reqNow != null) {
		console.log(url.parse(reqNow.url,true));
	}
	
});