const mongoose = require('../config.db.js');
const schema = new mongoose.Schema({
    code:String,
    phone:String,
    time:{
        type:Date,
        default:Date()
    },
    statu:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('sms',schema);
