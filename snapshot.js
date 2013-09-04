var errcode = require('./errcode');

var page = new WebPage(),
    address, output;
 
if (phantom.args.length < 2 || phantom.args.length > 3) {
    console.error('{"code":1,"msg":"Usage: rasterize.js URL filename"}');
    phantom.exit(errcode.ERROR_ARGC);
} else {
    address = phantom.args[0];
    output = phantom.args[1];
	
    page.viewportSize = { width: 600, height: 600 };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.error('{"code":2,"msg":"Unable to load the address"}');
            phantom.exit(errcode.ERROR_LOAD_URL);
        } else {
            window.setTimeout(function () {
                page.render(output);

                phantom.exit(errcode.ERROR_SUCCESS);
            }, 500);
        }
    });    
}

phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(errcode.ERROR_UNKNOWN);
};


