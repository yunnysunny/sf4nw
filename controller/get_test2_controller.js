exports.doGet = function(request,response) {
	response.setHeader('Content-Type','text/html; charset=utf-8');
    console.log(new Buffer(undefined));
	response.end('{"code" : 0,"name":"'+request.getParam('name')+'"}');
	
	 
}

