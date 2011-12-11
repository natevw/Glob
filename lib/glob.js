// glob-specific helper functions

var published_re = new RegExp("^(\\d+)-(\\d+)-(\\d+)T(\\d+):(\\d+)");
var months = {
    '01': "January",
    '02': "February",
    '03': "March",
    '04': "April",
    '05': "May",
    '06': "June",
    '07': "July",
    '08': "August",
    '09': "September",
    '10': "October",
    '11': "November",
    '12': "December",
};
var am_pm = function (hour) {
    hour = parseInt(hour);
    return (hour < 12) ? "am" : "pm";
};

exports.postToTheme = function (doc, base_url) {
    var d = doc.published.match(published_re);
    doc.published_human = d[1] + " " + months[d[2]] + " " + parseInt(d[3]) + ", " + parseInt(d[4]) + ":" + d[5] + am_pm(d[4]);
    doc.url = base_url + '/' + doc.path;
    doc.html_content || (doc.html_content = "");
    return doc;
};
