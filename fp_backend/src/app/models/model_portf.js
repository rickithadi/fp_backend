var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//TODO: the co_info and fund_info join is not working

var model_portf_Schema   = new Schema({
    id: String,
    name: String,
    universe_id: String,
    risk_level: Number,
    risk_level_title: String, 
    expected_return: Number,
    expected_volatility: Number,
    aa:
      [
        {
          id: String,
          parent: String,
          ac_id: String,
          ac_name: String,
          weight: Number,
          securities:
          [
            {
              ric: String,
              lipper_id: String,
              co_info:{ type: Schema.Types.ObjectId, ref: 'co_info' },
              fund_info:{ type: Schema.Types.ObjectId, ref: 'fund_info' },
              _id : false
            }
          ],
          _id : false
        }
      ]
});

model_portf_Schema.index({ universe_id: 1, risk_level: 1}, { unique: true });

module.exports = mongoose.model('model_portf', model_portf_Schema);
