// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regFormSchema = new Schema({
    rm_id: { type:String,  index:true },
    salutation: String,
    name: { type:String, lowercase:true, index:true },
    email: { type:String, lowercase:true },
    nric: String,
    dobYear: String,
    dobMonth: String,
    dobDay: String,
    nationality:   {
        name: String,
        code: String
    },        
    passport: String,
    ocpCat: String,
    gender: String,
    aSalary:String,
    address: String,
    state: String,
    postalCode: String,
    contactNo: String,
    status: String,
    updated_dt:  { type: Date, default: Date.now }



});


// the schema is useless so far
// we need to create a model for using it
var regForms = mongoose.model('regform', regFormSchema);

// make this available to our Node applications
module.exports = regForms;
