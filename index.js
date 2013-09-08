var server = require("./server");
var router = require("./router");
var handle = require('./handle');

server.init(); 
server.start(router.route,handle);

