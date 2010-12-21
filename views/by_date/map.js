function(doc) {
    if (!doc.published) return;
    
    var exports = {};
    // !code lib/date.js
    var date = exports;
    
    emit(date.toUTCComponents(date.newDate(doc.published)));
}
