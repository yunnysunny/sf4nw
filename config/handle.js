
module.exports = {
    '/' : require('../controller/index_controller'),
    '/snapshot' : require('../controller/snapshot_controller'),
    '/posttest':require('../controller/post_test_controller'),
    '/gettest' : require('../controller/get_test_controller'),
    '/gettest2' : require('../controller/get_test2_controller'),
    '/jsonp' : require('../controller/jsonp_test_controller'),
    '/session':require('../controller/session_controller')
};