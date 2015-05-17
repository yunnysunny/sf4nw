var fs = require('fs');
var define = require('../core/define');
var config = require('./config');

/**
 * 检查截图文件夹是否存在
 */
function initSnapshot() {
	fs.exists(config.SAVE_PATH, function(exist) {
		if (exist) {
			fs.stat(config.SAVE_PATH, function(err, stat) {
				if (err) {
					throw err;
				}
				if (!stat.isDirectory()) {
					throw new Error('the given save path must be a folder');
				}
			});
		} else {
			fs.mkdir(config.SAVE_PATH, function(err) {
				if (err) {
					throw err;
				}
			});
		}
	});
}

exports.AUTOLOAD_FUNS = [ initSnapshot ];