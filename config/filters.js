var define = require('./../core/define');

var FILTER_MAP = [
    define.__L('./filter/CookieFilter'),
    define.__L('./filter/SessionFilter')
];
define(exports, 'FILTER_MAP', FILTER_MAP);
