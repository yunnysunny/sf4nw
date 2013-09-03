var page = new WebPage(),
    address, output, size;
 
if (phantom.args.length < 2 || phantom.args.length > 3) {
    console.error('Usage: rasterize.js URL filename');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.viewportSize = { width: 600, height: 600 };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.error('Unable to load the address!');
            phantom.exit();
        } else {
            window.setTimeout(function () {
                page.render(output);
                console.log('{code:0}');
                phantom.exit();
            }, 500);
        }
    });
    
}
