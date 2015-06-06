exports.setAction = function(request,response) {
	request.session = {id:11};
    var value = {sessionid:request.sessionId,value:request.session};
	response.endJSON(value);
}
exports.getAction = function(req,res) {
    var value = {sessionid:req.sessionId,value:req.session};
    res.endJSON(value);
}

