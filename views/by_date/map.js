function(doc) {
    if (doc.type != "http://stemstorage.net/glob/post") return;
    if (!doc.published) return;
    
    var date = require("views/lib/date");
    emit(date.toUTCComponents(date.newDate(doc.published)));
}
