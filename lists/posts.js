function(head, req) {
    var ddoc = this;
    var path = path = require("lib/path").init(req);
    var indexPath = path.list('posts','by_date',{reduce:false, descending:true, limit:10, include_docs:true});
    var feedPath = path.list('posts','by_date',{reduce:false, descending:true, limit:10, include_docs:true, format:"atom"});
    
    provides("html", function () {
        var Mustache = require("lib/mustache");
        var postToTheme = require("lib/glob").postToTheme;
        var path = require("lib/path").init(req);
        var list = function () { var row = getRow(); return row && postToTheme(row.doc); }
        list.iterator = true;
        var single = Boolean(req.query.key);    // assume only one post per view key
        var post = (single) ? list() : list;
        return Mustache.to_html(ddoc.templates.theme, {single:single, post:post}, ddoc.templates.partials);
    });
    provides("atom", function () {
        // hat tip to https://github.com/jchris/sofa/blob/master/lists/index.js
        var Atom = require("lib/atom");
        var toRFC3339 = require("lib/date").toRFC3339;
        
        // load the first row to find the most recent change date
        var row = getRow();
        var blog = ddoc.blog;
        blog.updated = (row) ? (row.doc.updated || row.doc.published) : toRFC3339(new Date());
        blog.self = path.absolute(feedPath);
        send(Atom.header(blog));
        
        while (row) {
            var post = row.doc;
            post.alternate = path.absolute(path.show('post', row.id));
            send(Atom.entry(post));
            row = getRow();
        }
        
        send(Atom.footer());
    });
    provides("json", function() {
        return JSON.stringify(req, null, 4);
    });
}
