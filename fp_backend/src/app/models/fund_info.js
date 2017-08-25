var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var fund_info_Schema   = new Schema({
    _id: String,
    lipper_id: String,
    full_name: String,
    short_name: String,
    description: String,
    currency: String

});

module.exports = mongoose.model('fund_info', fund_info_Schema);

//
// fund_info:{
//   "lipper_id": "40061133",
//   "full_name": "SPDR S&P 500 ETF Trust",
//   "short_name": "SPDR S&P 500 ETF",
//   "description": "The SPDR S&P 500 ETF Trust seeks to provide investment results that, before expenses, correspond generally to the price and yield performance of the S&P 500 Index.",
//   "currency": "USD"
// }
