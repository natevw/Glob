function(head, req) {
    var ddoc = this;
    
    function setHTMLContent(doc) {
        if (!doc.markdown_content) return;
        
        var md = require('lib/markdown');
        
        var contentTree = md.toHTMLTree(doc.markdown_content);
        function convertRelative(node) {
            var attributes, children;
            if (!Array.isArray(node)) return;   // text node, skip
            if (typeof node[1] == "object" && !Array.isArray(node[1])) {
                attributes = node[1];
                children = node.slice(2);
            } else {
                attributes = {};
                children = node.slice(1);
            }
            Object.keys(attributes).forEach(function (key) {
                if (key == 'href' || key == 'src') {
                    var link = attributes[key];
                    if (link.indexOf("./") == 0) {
                        link = ddoc.blog.base_url + '/resource/' + doc._id + '/' + link.slice(2);
                    }
                    attributes[key] = link;
                }
            });
            children.forEach(convertRelative);
        }
        convertRelative(contentTree);
        doc.html_content = md.renderJsonML(contentTree);
    }
    
    provides("html", function () {
        var Mustache = require("lib/mustache");
        var postToTheme = require("lib/glob").postToTheme;
        var path = require("lib/path").init(req);
        var lastRow;
        var list = function () {
            var row = getRow();
            if (row) {
                lastRow = row;
                if (req.query.summary) {
                    delete row.doc.html_content;
                } else if (!row.doc.html_content) {
                    setHTMLContent(row.doc);
                }
            }
            return row && postToTheme(row.doc, ddoc.blog.base_url);
        }
        list.iterator = true;
        
        var data = ddoc.blog;
        data.summary = Boolean(req.query.summary);
        data.single = Boolean(req.query.key);    // assume only one post per view key
        data.post = (data.single) ? list() : list;
        data.lastRow = function () {
            if (lastRow) {
                lastRow.key = JSON.stringify(lastRow.key);
            }
            return lastRow;
        };
        return Mustache.to_html(ddoc.templates.theme, data, ddoc.templates.partials);
    });
    provides("atom", function () {
        // hat tip to https://github.com/jchris/sofa/blob/master/lists/index.js
        var Atom = require("lib/atom");
        var toRFC3339 = require("lib/date").toRFC3339;
        
        // load the first row to find the most recent change date
        var row = getRow();
        var blog = ddoc.blog;
        blog.updated = (row) ? (row.doc.updated || row.doc.published) : toRFC3339(new Date());
        blog.self = blog.base_url;
        send(Atom.header(blog));
        
        while (row) {
            var post = row.doc;
            if (req.query.summary) {
                delete post.html_content;
            } else if (!post.html_content) {
                setHTMLContent(post);
            }
            post.alternate = ddoc.blog.base_url + '/' + post.path;
            send(Atom.entry(post));
            row = getRow();
        }
        
        send(Atom.footer());
    });
    provides("json", function() {
        return JSON.stringify(req, null, 4) + JSON.stringify(getRow(), null, 4);
    });
}
