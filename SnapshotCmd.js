var spawn = require('child_process').spawn;
var fs = require("fs");
var errcode = require('./errcode');

function SnapshotCmd(url,option) {
    this.url = url;
	this.savePath = '';
    this.phantomjsPath = 'phantomjs';
	
    if (typeof(option) == 'object') {
    	if (option.savePath) {
    		this.savePath = option.savePath;
    	}
        if (option.phantomjsPath) {
        	this.phantomjsPath = option.phantomjsPath;
        }        
    } else {        
        
    }
    
}
SnapshotCmd.prototype = {
    getImage : function(callback, isRefresh) {
        var imageName = this.savePath 
        	+ require('crypto').createHash('md5').update(this.url).digest('hex') + '.png';
		var phantomjsPath = this.phantomjsPath;
		var url = this.url;
		
        fs.exists(imageName, function(exist) {
			if (!exist || isRefresh) {
				
				var phantomjs  = spawn(phantomjsPath, [__dirname + '/snapshot.js', url , imageName],{stdio:['ipc']});        
				
				// 注册子进程关闭事件
				phantomjs.on('exit', function (code, signal) {
					console.log('子进程已退出，代码：' + code);
					callback({code:code,img:imageName});
				});
				
				phantomjs.on('error',function(err) {
					console.error('error###', err);
					callback({code:errcode.ERROR_UNKNOWN});
				});
				
			} else {
				console.log('use cache');
				callback({code:errcode.ERROR_SUCCESS,img:imageName});
			}
		});
        
    }
};

module.exports = SnapshotCmd;
