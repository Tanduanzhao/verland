const mongoose = require('../config.db.js');
let Schema = new mongoose.Schema({
    cradID:{
        type: String
    },
    name:{
        type: String
    },
    date:{
        type: Date,
        default: new Date()
    },
    editDate:{
        type:Date,
        default: new Date()
    },
    payStatu:{
        type:Number,
        default:0//0-未支付；1-已支付
    },
    statu:{
        type:Number,
        default:1//0->冻结；1->正常；2->正常
    },
    checkStatu:{
        type:Number,
        default:0//0->未开始；1->未送检；2->送检中；3->样本检验中;4->报告已送出；
    },
    report:String,
    address:String,
    phone:String,
    openId:String,
    wxUsername:String,
    wxImgUrl:String,
    wxCode:String
})
module.exports = mongoose.model('cutomer',Schema);
