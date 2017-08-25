// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadDocument_schema = new Schema({
    user_id: String,
    doc_type: String,
    doc_filename: String,
    submit_dt:  { type: Date, default: Date.now }
    
});

var uploadDocument = mongoose.model('uploadDocument', uploadDocument_schema);

// make this available to our Node applications
module.exports = uploadDocument;