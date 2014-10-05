var spawn = require('child_process').spawn;
var fs = require("fs");
var errcode = require('./errcode');
var phantomjsNode = null;
var config = require('../../config/config');

try {
    phantomjsNode = require('phantomjs');
} catch (e) {
    console.warn('not found phantomjs in node',e);
}


function SnapshotCmd(url,option) {
    this.url = url;
	this.savePath = '';
    if (process.env.PHANTOMJS_PATH) {
        this.phantomjsPath = process.env.PHANTOMJS_PATH;
    } else {
        this.phantomjsPath = phantomjsNode ?  phantomjsNode.path : 'phantomjs';
    }

	
    if (typeof(option) == 'object') {
    	if (option.savePath) {
    		this.savePath = option.savePath;
    	}
        if (option.phantomjsPath) {
        	this.phantomjsPath = option.phantomjsPath;
        }        
    } else {        
        
    }
    console.log('phantomjsPath:'+this.phantomjsPath);
}
module.exports = SnapshotCmd;


SnapshotCmd.prototype = {
    getImage : function(callback, isRefresh) {
        var imageName = this.savePath 
        	+ require('crypto').createHash('md5').update(this.url).digest('hex') + '.png';
		var phantomjsPath = this.phantomjsPath;
		var url = this.url;
        this.imageName = imageName;
		
        fs.exists(imageName, function(exist) {
			if (!exist || isRefresh) {
				
				var phantomjs  = spawn(phantomjsPath, [__dirname + '/snapshot.js', url , imageName],{stdio:['ipc']});        
				
				// 注册子进程关闭事件
				phantomjs.on('exit', function (code, signal) {
					console.log('子进程已退出，代码：' + code);
					callback({code:code,img:imageName,exist:exist});
				});
				
				phantomjs.on('error',function(err) {
					console.error('error###', err);
					callback({code:errcode.ERROR_UNKNOWN});
				});
				
			} else {
				console.log('use cache');
				callback({code:errcode.ERROR_SUCCESS,img:imageName,exist:exist});
			}
		});
        
    },
    clear : function() {
        fs.stat(config.SAVE_PATH,function(err,stat) {
            if (err) {
                console.error(err);
                return;
            }
            if (stat.size > config.SAVE_PAHT_MAX_SIZE && this.imageName) {
                fs.unlink(this.imageName,function(err) {
                    if (err) {
                        console.error('delete ['+this.imageName+'] failed',err);
                    }
                });
            }
        });
    }
};



