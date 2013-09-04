var SnapshotCmd = require('../SnapshotCmd');

var cmd = new SnapshotCmd('http://www.baidu.com');
cmd.getImage(function(data) {
	console.log(data);
	console.dir(data.code);
},true);
