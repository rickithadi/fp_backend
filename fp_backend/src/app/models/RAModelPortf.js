var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RAModelPortfSchema = new Schema({

    sp_id: { type: Number },
    portf_id: { type: Number },
    risk_level_title: { type:String },
    portf_title: String,
    data: [{
            name: String,
            y: Number,
            default_weight: Number,
            id: Number
    }],
    portf_hl: String,
    updated_dt:  { type: Date, default: Date.now }

});

RAModelPortfSchema.index({ sp_id: 1, portf_id: 1}, { unique: true });

var RAModelPortf = mongoose.model('ra_model_portf', RAModelPortfSchema);
module.exports = RAModelPortf;
