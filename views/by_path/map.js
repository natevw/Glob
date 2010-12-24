function (doc) {
    if (doc.type != "http://stemstorage.net/glob/post") return;
    if (doc.path) emit(doc.path);
}
