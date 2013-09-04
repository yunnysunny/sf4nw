function Transfer(req, resp) {
    this.req = req;
    this.resp = resp;
}

/**
 * @description 计算上次的断点信息
 * @param {string} Range 请求http头文件中的断点信息，如果没有则为undefined，格式（range: bytes=232323-）
 * @return {integer} startPos 开始的下载点
 */
var calStartPosition = function(Range) {
    var startPos = 0;
	var endPos = 0;
    if( typeof Range != 'undefined') {
        var posMatch = /^bytes=([0-9]+)-([0-9]*)$/.exec(Range);
        startPos = Number(posMatch[1]);
		endPos = Number(posMatch[2]);
    }
    return {start:startPos, end:endPos};
}
/**
 * @description 配置头文件
 * @param {object} resp 
 * @param {object} Config 头文件配置信息（包含了下载的起始位置和文件的大小）
 */
var configHeader = function(resp,Config) {
    var startPos = Config.startPos, 
		endPos = Config.endPos,
        fileSize = Config.fileSize;
    // 如果startPos为0，表示文件从0开始下载的，否则则表示是断点下载的。
    if(startPos == 0) {
        resp.setHeader('Accept-Range', 'bytes');
    } else {
        resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + endPos + '/' + fileSize);//从开始位置起，下载到结束位置
    }
    resp.writeHead(206, 'Partial Content', {
        'Content-Type' : 'application/octet-stream',
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
        var range = self.req.headers.range;//http中的range头
        var pos = calStartPosition(range);
		var start = pos.start;//获取range头的开始位置
		var end = pos.end;//结束位置
		
		config.startPos = start;
		
		config.endPos = end > 0 && end < size && end > start ? end : size;
        
        configHeader(self.resp,config);
        down(config);
    });
}
/**
 * @description 生成大文件文档流，并发送
 * @param {string} filePath 文件地址
 */
Transfer.prototype.download = function(filePath) {
    var self = this;
    path.exists(filePath, function(exist) {
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
                });
            });
        } else {
            console.log('文件不存在！');
            return;
        }
    });
}

module.exports = Transfer;