const mongoose = require('../config.db.js');
let Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:String,
    date:{
        type:Date,
        default:new Date()
    },
    editDate:{
        type:Date,
        default:new Date()
    },
    statu:{
        type:Number,
        default:1//0->关闭,1->开启
    }
})
module.exports = mongoose.model('issue',Schema);
