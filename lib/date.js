/* Simple workaround for older JavaScript engines that
 * do not understand the One True Date Format.
 * This doesn't totally mimic new Date(), just string parsing.
 */
exports.newDate = function (rfc3339) {
    var temp = Date.parse(rfc3339);
    if (isNaN(temp)) {
      // this technique is borrowed from jquery.couch.app.util's $.prettyDate
      temp = rfc3339.replace(/-/g,"/").replace("T", " ").replace("Z", " +0000").replace(/(\d*\:\d*:\d*)\.\d*/g,"$1");
    }
    return new Date(temp);
};

exports.toUTCComponents = function (date) {
	return [
		date.getUTCFullYear(),      // 0
		date.getUTCMonth() + 1,     // 1
		date.getUTCDate(),          // 2
		date.getUTCHours(),         // 3
		date.getUTCMinutes(),       // 4
		date.getUTCSeconds() + (date.getUTCMilliseconds() / 1000)
    ];
};

exports.toRFC3339 = function (date) {
    // after https://github.com/couchapp/couchapp/blob/master/vendor/lib/atom.js
    
    function f(n) {    // Format integers to have at least two digits.
        return n < 10 ? '0' + n : '' + n;
    }
    var d = exports.toUTCComponents(date);
    return d[0] + '-' + f(d[1]) + '-' + f(d[2]) + 'T' + f(d[3]) + ':' + f(d[4]) + ':' + f(d[5]) + 'Z'
};
