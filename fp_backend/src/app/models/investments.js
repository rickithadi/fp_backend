var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//TODO: the co_info and fund_info join is not working

var investment_Schema   = new Schema({
    id: String,
    name: String,
    horizon: Number,
    rate: Number,
    initial_amt:Number,
    user_id:String
   
});

module.exports = mongoose.model('investment', investment_Schema);
