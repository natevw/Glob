// modified from https://github.com/couchapp/couchapp/blob/master/vendor/lib/atom.js
// atom feed generator
// requries E4X support.

exports.header = function(data) {
  var f = <feed xmlns="http://www.w3.org/2005/Atom"/>;
  f.title = data.title;
  f.id = data.uri;
  f.link.@href = data.self;
  f.link.@rel = "self";
  f.generator = "CouchApp on CouchDB";
  f.updated = data.updated;
  f.author = <author><name>{data.author}</name></author>;
  return f.toXMLString().replace(/\<\/feed\>/,'');
};

exports.entry = function(data) {
  //var entry = <entry xml:base={data.alternate-lastcomponent}/>;
  var entry = <entry/>;
  entry.id = data.uri;
  entry.title = data.title;
  if (data.updated) {
      entry.updated = data.updated;
      entry.published = data.published;
  } else {
      entry.updated = data.published;
  }
  if (data.html_content) {
      entry.content = data.html_content;
      entry.content.@type = 'html';
  }
  entry.link.@href = data.alternate;
  entry.link.@rel = "alternate";
  return entry;
}

exports.footer = function () {
    return "</feed>\n";
}
