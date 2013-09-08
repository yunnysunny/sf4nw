function show(response,code,message) {
	response.writeHead(code,{'Content-type': 'text/html'});
	response.write('<h2>' + code + '</h2>');
	if (message) {		
		response.write('<h2>' + message + '</h2>');
	}
	response.end();
}
exports.show = show;