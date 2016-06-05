var http = require("http");
var cluster = require('cluster');
var config = require('../config/config');
var route = require("../core/route");
require('../lib/HttpRequest');
require('../lib/HttpResponse');
/**
 * 
 * @param {array} initFuns
 */
function init(initFuns) {
	if (initFuns instanceof Array) {
		for (var i=0,len=initFuns.length;i<len;i++) {
			(initFuns[i])();
		}
	}
	
}

function createHttpServer(handle, filters,useSingle) {
    var filterLen = 0;
    if (filters instanceof Array) {
        filterLen = filters.length;
    }
    //
    // This is where we put our bugs!

    var domain = require('domain');

    // See the cluster documentation for more details about using
    // worker processes to serve requests. How it works, caveats, etc.

    var server = require('http').createServer(function(req, res) {

        var d = domain.create();
        d.on('error', function(er) {//处理异常
            console.error('出现异常', er.stack);
            if (res.headersSent) {
                return;
            }
            try {

                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain;charset=utf-8');
                res.end('矮油，出错了!\n');

                // stop taking new requests.
                server.close();
                if (!useSingle) {
                    // Let the master know we're dead. This will trigger a
                    // 'disconnect' in the cluster master, and then it will fork
                    // a new worker.
//                    cluster.worker.disconnect();
                }

                process.exit(1);

            } catch (er2) {
                // oh well, not much we can do at this point.
                console.error('Error sending 500!', er2.stack);
            }
        });

        d.add(req);
        d.add(res);

        // Now run the handler function in the domain.
        d.run(function() {
            //onRequest(req, res);
            for(var i=0;i<filterLen;i++) {
                if ((filters[i]).doFilter(req,res) == false) {
                    return;
                }
            }
            console.log('cookie:'+req.headers.cookie);
            handle(req,res);
        });
    });
    server.listen(config.HTTP_PORT);
    console.log('[%s] Server running', process.pid);
    console.log('start on port ' + config.HTTP_PORT);
}
/**
 * 
 * @param {function} route
 * @param {array} handle
 * @param {array} filters
 */
function start(options) {//route, filters
    init(options.inits);
	var useSingle = (process.env.USE_SINGLE_PROCESS == 'true') ? true : false;
    var handle = route(options.handle);

    process.on('exit', function(code) {
        // 进程退出后，其后的事件循环将会结束，计时器也不会被执行
        console.warn('进程退出码是:', code);
    });

    if (useSingle) {
        console.log('use single process');
        createHttpServer(handle, options.filters,false);
        process.on('SIGINT', function () {
            console.warn('============kill master process============');
            process.exit();//杀死主进程
        });
        return;
    }
    console.log('use child process');
	if (cluster.isMaster) {

		for(var i=0;i<config.WOKER_PROCESS_COUNT;i++) {
			cluster.fork();
		}		

        cluster.on('exit',function(code, signal) {
            console.log('process exit');
            if( signal ) {
                console.error("worker was killed by signal: "+signal);
            } else if( code !== 0 ) {
                console.error("worker exited with error code: "+code);
            } else {
                console.error("worker exit!");
            }
            cluster.fork();//进程重启
        });
        process.on('SIGINT', function () {
            console.warn('============kill master process============');
            process.exit();//杀死主进程
        });
        console.log('[%s] master process running', process.pid);
	} else {
		// the worker

        createHttpServer(handle, options.filters,useSingle);
	}

}

exports.start = start;
