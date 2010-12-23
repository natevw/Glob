function(head, req) {
    var ddoc = this;
    var path = path = require("lib/path").init(req);
    var indexPath = path.list('posts','by_date',{reduce:false, descending:true, limit:10, include_docs:true});
    var feedPath = path.list('posts','by_date',{reduce:false, descending:true, limit:10, include_docs:true, format:"atom"});
    
    provides("html", function () {
        var Mustache = require("lib/mustache");
        
        var list = function () { var row = getRow(); return row && row.doc; }
        list.iterator = true;
        return Mustache.to_html(ddoc.templates.theme, {multiple:true, post:list}, ddoc.templates.partials);
    });
    provides("atom", function() {
        // copied liberally from https://github.com/jchris/sofa/blob/master/lists/index.js
        var Atom = require("lib/atom");
        var toRFC3339 = require("lib/date").toRFC3339;
        
        function postPath(id) {
            // after https://github.com/couchapp/couchapp/blob/master/vendor/lib/path.js
            var p = req.path, parts = ['', p[0], p[1] , p[2], '_show', 'post', id];
            return parts.map(encodeURIComponent).join('/');
        }
        
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
}
