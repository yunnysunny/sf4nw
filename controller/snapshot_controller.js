var url = require('url');
var SnapshotCmd = require('../lib/snapshot/SnapshotCmd');
var Transfer = require('../lib/Transfer');
var errcode = require('../lib/snapshot/errcode');
var error = require('../lib/error');
var config = require('../config/config');

exports.showPageAction = function(request, response) {
	response.loadView('snap');
}

exports.doGet = function(request,response) {
	var vars = url.parse(request.url,true);
	
	var params = vars.query;
	if(params.url) {
		var transfer = new Transfer(request,response);
		var pos = transfer.calStartPosition();
		
		var refresh = (params.refresh == '1' && pos.start == 0);

		var cmd = new SnapshotCmd(params.url,{savePath:config.SAVE_PATH});
		cmd.getImage(function(data){
			if (data.code == errcode.ERROR_SUCCESS && data.img) {					
				
				transfer.download(data.img,function(err) {
                    if (err) {
                        return;
                    }
                    cmd.clear();
                });
			} else {
				error.show(response,errcode.ERROR_INTER_ERROR);
				
			}
		},refresh);
	} else {
		error.show(response,errcode.ERROR_HTTP_PARAM);
		
	}	
}
