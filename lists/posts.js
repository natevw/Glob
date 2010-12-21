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
        var newDate = require("lib/date").newDate;
        
        function postPath(id) {
            // after https://github.com/couchapp/couchapp/blob/master/vendor/lib/path.js
            var p = req.path, parts = ['', p[0], p[1] , p[2], '_show', 'post', id];
            return parts.map(encodeURIComponent).join('/');
        }
        
        // load the first row to find the most recent change date
        var row = getRow();
        var feedHeader = Atom.header({
            feed_id: ddoc.blog.uri,
            title: ddoc.blog.title,
            updated: (row ? newDate(row.doc.published) : new Date()),
            
            author: ddoc.blog.author,
            feed_link: path.absolute(feedPath)
        });
        send(feedHeader);
        
        while (row) {
            var feedEntry = Atom.entry({
                entry_id: row.doc.uri,
                title: row.doc.title,
                published: newDate(row.doc.published),
                updated: row.doc.updated && newDate(row.doc.updated),
                
                html_content: row.doc.html_content,
                // TODO: also use as xml:base so images and such work?
                alternate: path.absolute(path.show('post', row.id))
            });
            send(feedEntry);
            row = getRow();
        }
            
        send("</feed>");
    });
}
