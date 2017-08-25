var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//TODO: the co_info and fund_info join is not working

var debt_Schema   = new Schema({
    id: String,
    name: String,
    horizon: Number,
    rate: Number,
    user_id:String,
    initial_amt:Number
   
});

module.exports = mongoose.model('debt', debt_Schema);
