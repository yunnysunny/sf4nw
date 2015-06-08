function show(response,code,message) {
    if (isNaN(code)) {
        response.end();
    }
	response.writeHead(code,{'Content-type': 'text/html'});
	response.write('<h2>' + code + '</h2>');
	if (message) {		
		response.write('<h2>' + encodeURIComponent(message) + '</h2>');
	}
	response.end();
}
exports.show = show;