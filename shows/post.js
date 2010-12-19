function(doc, req) {  
  var ddoc = this;
  var Mustache = require("lib/mustache");
  //var path = require("vendor/couchapp/lib/path").init(req);
  
  return Mustache.to_html(ddoc.templates.theme, {post:doc}, ddoc.templates.partials);
}
