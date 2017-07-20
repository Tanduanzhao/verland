const {sms} = require('../config.inc.js');
const request = require('request');

function sendSms(params){
    let url = [];
    console.log(params);
    Object.keys(params).forEach((key)=>{
        url.push(`${key}=${params[key]}`);
    })
    return new Promise((resolve,reject)=>{
        request.get({
            url:`${sms.url}?${url.join('&')}`,
            headers:{
                'Authorization':`APPCODE ${sms.appcode}`,
                'Content-type':'application/json;charset=utf-8'
            }
        },(err,res,body)=>{
            // console.log(res);
            if(err){
                reject(err)
            }else{
                resolve(body);
            }
        })
    })
}


module.exports = {
    send:(params)=>{
        return sendSms(params)
    }
}
