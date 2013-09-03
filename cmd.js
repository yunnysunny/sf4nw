var spawn = require('child_process').spawn;
var hash = require('crypto').createHash('md5');

function SnapShotCmd(url,option) {
    this.url = url;
    if (typeof(option) == 'object') {
        option.savePath && this.savePath = option.savePath;
        option.phantomjsPath && this.phantomjsPath = option.phantomjsPath;
    } else {
        this.savePath = '';
        this.phantomjsPath = '';
        
    }
    
}
SnapShotCmd.prototype = {
    getImage : function(isRefresh) {
        var imageName = this.savePath + hash.update(this.url).digest('hex') + '.png';
        
        var phantomjs  = spawn('phantomjs', ['snapshot.js',url, imageName]);
        
        // 捕获标准输出并将其打印到控制台
        phantomjs.stdout.on('data', function (data) {
            console.log('标准输出：\n' + data);
        });
        
        // 捕获标准错误输出并将其打印到控制台
        phantomjs.stderr.on('data', function (data) {
            console.log('标准错误输出：\n' + data);
        });
        
        // 注册子进程关闭事件
        phantomjs.on('exit', function (code, signal) {
            console.log('子进程已退出，代码：' + code);
        });
        
        phantomjs.on('error',function(err) {
        	console.log('error', err);
        });
    }
};
