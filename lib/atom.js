// modified from https://github.com/couchapp/couchapp/blob/master/vendor/lib/atom.js
// atom feed generator
// requries E4X support.

function f(n) {    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

function rfc3339(date) {
  return date.getUTCFullYear()   + '-' +
    f(date.getUTCMonth() + 1) + '-' +
    f(date.getUTCDate())      + 'T' +
    f(date.getUTCHours())     + ':' +
    f(date.getUTCMinutes())   + ':' +
    f(date.getUTCSeconds())   + 'Z';
}

exports.header = function(data) {
  var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
  f.title = data.title;
  f.id = data.feed_id;
  f.link.@href = data.feed_link;
  f.link.@rel = "self";
  f.generator = "CouchApp on CouchDB";
  f.updated = rfc3339(data.updated);
  f.author = <author><name>{data.author}</name></author>;
  return f.toXMLString().replace(/\<\/feed\>/,'');
};

exports.entry = function(data) {
  //var entry = <entry xml:base={data.alternate-lastcomponent}/>;
  var entry = <entry/>;
  entry.id = data.entry_id;
  entry.title = data.title;
  entry.content = data.html_content;
  entry.content.@type = 'html';
  if (data.updated) {
      entry.updated = rfc3339(data.updated);
      entry.published = rfc3339(data.published);
  } else {
      entry.updated = rfc3339(data.published);
  }
  entry.link.@href = data.alternate;
  entry.link.@rel = "alternate";
  return entry;
}
