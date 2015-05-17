exports.doGet = function(request,response) {
	console.log('index [get]');

	response.loadView('index');
}

