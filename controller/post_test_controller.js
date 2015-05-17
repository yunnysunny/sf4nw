exports.doGet = function(request,response) {
	response.loadView('postshow');
}

exports.doPost = function(request,response) {
	console.log(request.post);
	//var result = {code : 0};
	response.end('{"code" : 0,"name":"'+request.getParam('name')+'"}');
}

