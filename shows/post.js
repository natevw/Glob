function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  var postToTheme = require("lib/glob").postToTheme;
  return Mustache.to_html(ddoc.templates.theme, {post:postToTheme(doc)}, ddoc.templates.partials);
}
