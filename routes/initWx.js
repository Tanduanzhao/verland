const request = require('request');
const {wx} = require('../config.inc.js');
const common = require('../modules/common.js');

function getAccessToken(){
    return new Promise((resolve,reject)=>{
        request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx.appId}&secret=${wx.AppSecret}`,(err,response,body)=>{

            if(!err){
                body = JSON.parse(body);
                resolve(body.access_token);
            }else{
                reject(err);
            }
        })
    })
}

function getApiTicket(){
    return new Promise((resolve,reject)=>{
        request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${wx.access_token}&type=jsapi`,(err,response,body)=>{
            body = JSON.parse(body);
            if(!err){
                resolve(body.ticket);
            }else{
                reject(body.errmsg);
            }
        })
    })
}

function getUrlString(){
    return new Promise((resolve,reject)=>{
        getAccessToken()
            .then((token)=>{
                wx.access_token = token;
                getApiTicket()
                    .then((ticket)=>{
                        wx.jsapi_ticket = ticket;
                        wx.noncestr = common.getRandomString();
                        wx.timestamp = +new Date();
                        resolve();
                    })
            })
    })
}


function getSignature(url){
    return new Promise((resolve,reject)=>{
        let result={};
        getUrlString()
            .then(()=>{
                wx.url = url;
                let keys = ['jsapi_ticket','noncestr','timestamp','url'].sort();
                wx.signature = common.shaString(keys,wx);
                resolve();
            })
            .catch((err)=>{
                console.log(err);
            })
    })
}



module.exports = (req,res,next)=>{
    if(!req.query.url){
        res.locals.message = 'url参数不能为空';
        next();
    }
    getSignature(req.query.url)
        .then(()=>{
            let datas = {
                appId:wx.appId,
                timestamp:wx.timestamp,
                noncestr:wx.noncestr,
                signature:wx.signature
            };
            res.locals.status = 1;
            res.locals.datas = datas;
            next();
        }).catch((err)=>{
            console.log(err);
            next();
    })

}
