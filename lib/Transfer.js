var fs = require('fs');
var path = require('path');

function Transfer(req, resp) {
    this.req = req;
    this.resp = resp;
    this.startPos = 0;
    this.endPos = 0;
}

Transfer.prototype.getStartPos = function() {
	return this.startPos;
}
/**
 * @description 计算上次的断点信息
 * 
 * @return {object} {start,end} 开始的下载点,结束的下载点
 */
Transfer.prototype.calStartPosition = function() {
	//请求http头文件中的断点信息，如果没有则为undefined，格式（range: bytes=开始位置-结束位置）
	
	var Range = this.req.headers.range;
    
    if( typeof Range != 'undefined') {
    	
        var posMatch = /^bytes=([0-9]+)-([0-9]*)$/.exec(Range);
        this.startPos = Number(posMatch[1]);
		this.endPos = Number(posMatch[2]);
    } else {
    	console.log('no range');
    }
    
    return {start:this.startPos, end:this.endPos};
}
/**
 * @description 配置头文件
 * @param {object} resp 
 * @param {object} Config 头文件配置信息（包含了下载的起始位置和文件的大小）
 */
var configHeader = function(resp,Config) {
    var startPos = Config.startPos, 
		endPos = Config.endPos,
		filename = Config.filename,
        fileSize = Config.fileSize;
    // 如果startPos为0，表示文件从0开始下载的，否则则表示是断点下载的。
    console.log(filename+'start:'+startPos+'end:'+endPos);
    if(startPos == 0) {
        resp.setHeader('Accept-Range', 'bytes');
    } else {
        resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + endPos + '/' + fileSize);//从开始位置起，下载到结束位置
    }
    resp.writeHead(200,  {
        'Content-Type' : 'application/force-download',
        'Content-Length' : (endPos-startPos+1),
        'Content-Disposition' : 'attachment;filename=' + filename
    });
}

/**
 * @description 初始化配置信息
 * @param {object} self Transfer对象
 * @param {string} filePath
 * @param {function} down 下载开始的回调函数
 */
var init = function(self, filePath, down) {
    var config = {};
    
    fs.stat(filePath, function(error, state) {
        if(error)
            throw error;
		
		var size = state.size;//文件大小
        config.fileSize = size;
        
		var start = self.startPos;//获取range头的开始位置
		var end = self.endPos;//结束位置
				
		config.startPos = start;		
		config.endPos = end > 0 && end < size && end > start ? end : (size-1);
		config.filename = path.basename(filePath);
        
        configHeader(self.resp,config);
        down(config);
    });
}
/**
 * @description 生成大文件文档流，并发送
 * @param {string} filePath 文件地址
 */
Transfer.prototype.download = function(filePath,callback) {
    var self = this;
    fs.exists(filePath, function(exist) {
        if(exist) {
            init(self, filePath, function(config) {
                var  resp = self.resp;
                fReadStream = fs.createReadStream(filePath, {
                    encoding : 'binary',
                    bufferSize : 1024 * 1024,
                    start : config.startPos,
                    end : config.endPos
                });
                fReadStream.on('data', function(chunk) {
                    resp.write(chunk, 'binary');
                });
                fReadStream.on('end', function() {
                    resp.end();
                    typeof (callback) == 'function' && callback(false);
                });
            });
        } else {
            console.log('文件不存在！');
            var  resp = self.resp;
            resp.writeHead(404,{'Content-type': 'text/html'});
            resp.end();
            typeof (callback) == 'function' && callback(new Error('file ['+filePath+'] does not exist.'));
            return;
        }
    });
}

module.exports = Transfer;