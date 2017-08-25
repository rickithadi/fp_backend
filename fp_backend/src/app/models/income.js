var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//TODO: the co_info and fund_info join is not working

var income_Schema   = new Schema({
    id: String,
    name: String,
    horizon: Number,
    user_id:String,
    monthly_amt:Number
   
});

module.exports = mongoose.model('investment', investment_Schema);
