const {wx,money} = require('../config.inc.js');
const common = require('../modules/common.js');
const request = require('request');
let xml2js = require('xml2js');


//获取微信支付签名
function getPayOrder(req){
    let payObj = {
        appid:wx.appId,
        mch_id:wx.mchId,
        nonce_str:common.getRandomString(),
        body:'云量检测-服务',
        out_trade_no:common.getTrade(),
        total_fee:money,
        spbill_create_ip:common.getClientIp(req),
        notify_url:'/form',
        trade_type:'JSAPI',
        openid:req.session.openId
    }
    // console.log(payObj.openid);
    const keys = Object.keys(payObj).sort();
    const sign = common.md5String(keys,payObj);
    payObj.sign = sign;
    // console.log(sign);
    // console.log(payObj);
    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    let formDate = '<xml>';
    for(let key in payObj){
        formDate += `<${key}>${payObj[key]}</${key}>`;
    }
    formDate += '</xml>';
    // console.log(formDate);
    return new Promise((resolve,reject)=>{
        request({
            url:url,
            method:'POST',
            body:formDate
        },(err,response,body)=>{
            if(err){
                console.log(err);
            }else{
                console.log(body);
                xml2js.parseString(body,{explicitArray : false},(err,json)=>{
                    payObj.prepay_id = 'prepay_id='+json.xml.prepay_id;
                });
                let newSignObj = {
                    appId:payObj.appid,
                    timeStamp:common.getTimeStamp(),
                    nonceStr:payObj.nonce_str,
                    package:payObj.prepay_id,
                    signType:'MD5'
                }
                payObj.paySign = common.md5String(Object.keys(newSignObj).sort(),newSignObj);
                resolve({
                    prepay_id:payObj.prepay_id,
                    timestamp:newSignObj.timeStamp,
                    nonceStr:payObj.nonce_str,
                    paySign:payObj.paySign,
                    signType:newSignObj.signType
                });
            }
        })
    })

}


module.exports = (req,res,next)=>{
    if(!req.session.openId){
        res.locals.message = '用户信息过期，请重新拉起!';
        next();
    }else{
        getPayOrder(req)
            .then((result)=>{
                res.locals.status = 1;
                res.locals.datas = result;
                next();
            })
            .catch((err)=>{
                res.locals.message = '调取微信支付失败!';
                next();
            })
    }

    // res.end();
}
