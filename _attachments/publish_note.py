#! /usr/bin/python
# coding: utf-8

'''Publish a note from "It was a dark and…" <https://github.com/natevw/twas> to this glob of nerdishness'''

import re
import sys
import mimetypes
import subprocess

import logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def _transport(method, url, data=None):
    import json
    from urlparse import urlsplit
    from httplib import HTTPConnection
    logging.debug("%s to %s", method, url)
    
    _url = urlsplit(url)
    conn = HTTPConnection(_url.hostname, _url.port)
    body = None
    if data is not None:
        body = json.dumps(data)
    path = "%s?%s" % (_url.path, _url.query)
    if path.endswith('?'): path = path[:-1]
    conn.request(method, path, body, {'Content-Type':"application/json", 'Accept':"application/json"})
    resp = conn.getresponse()
    return json.loads(resp.read())



NOTES_DB = "http://localhost:5984/dev"
GLOBS_DB = "http://localhost:5984/public"

NOTE_ID = sys.argv[1]
POST_SLUG = sys.argv[2]


time = subprocess.check_output(['date', "+%Y-%m-%dT%H:%M:%S%z"]).strip()
PUBLISH_TIME = time[:-2] + ':' + time[-2:]      # insert colon into timezone offset
POST_PATH = time[:7].replace('-', '/') + '/' + POST_SLUG       # prepend year and month to path


note = _transport('GET', NOTES_DB + "/%s?attachments=true" % NOTE_ID)

note['_id'] = note['_id'].replace("note", "post")
note['type'] = "http://stemstorage.net/glob/post"
del note['_rev']
del note['last_modified']
post = note

post['path'] = POST_PATH
post['published'] = PUBLISH_TIME
post['markdown_content'] = re.sub('#.*?\n\n', '', note['content'])      # remove heading from body
post['title'] = re.search('#\s*(.*?)\n\n', note['content']).group(1)    # extract heading for title
del post['content']

for name, file in post['_attachments'].iteritems():
    del file['revpos']
    if file['content_type'] == "application/octet-stream":
        type = mimetypes.guess_type(name)
        if type[0]:
            file['content_type'] = type[0]

print _transport('POST', GLOBS_DB, post)
