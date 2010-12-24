function(doc) {
    if (doc.type != "http://stemstorage.net/glob/post") return;
    if (!doc.published) return;
    
    var exports = {};
    // !code lib/date.js
    var date = exports;
    
    emit(date.toUTCComponents(date.newDate(doc.published)));
}
