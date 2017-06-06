var express = require('express');
const {wx,url}  = require('../config.inc.js');
const request = require('request');
const customer = require('../model/customer.js');
var router = express.Router();

function getUserInfo(code){
    return getUserInfoFromCode(code)
            .then((userInfo)=>{
                if(!userInfo){
                    console.log('通过微信获取用户openId');
                    return getOpenIdFromCode(code)
                            .then((result)=>{
                                console.log('通过opendId获取用户信息');
                                return getUserInfoFromOpenId(result.openid)
                                        .then((oUserInfo)=>{
                                            if(!oUserInfo){
                                                return getUserInfoFormWx(result.access_token,result.openid)
                                                        .then((_userInfo)=>{
                                                            return saveUserInfo({
                                                                    openId:result.openid,
                                                                    wxUsername:_userInfo.nickname,
                                                                    wxImgUrl:_userInfo.headimgurl,
                                                                    wxCode:code
                                                                })
                                                                .then((saveResult)=>{
                                                                    console.log('保存了的用户信息:',saveResult);
                                                                    return saveResult;
                                                                })
                                                        })
                                            }else{
                                                return updateCodeByOpenId(code,result.openid)
                                                    .then((uUserInfo)=>{
                                                        oUserInfo.wxCode = code;
                                                        return oUserInfo;
                                                    })
                                            }
                                        })

                            })
                }else{
                    console.log('数据库里获取用户信息');
                    return userInfo;
                }
    })
}


function getOpenIdFromCode(code){
    return new Promise((resolve,reject)=>{
        request(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wx.appId}&secret=${wx.AppSecret}&code=${code}&grant_type=authorization_code`,(err,response,body)=>{
            if(!err){
                body = JSON.parse(body);
                console.log('通过code获取的opendId:',body);
                resolve(body)
            }else{
                reject(err)
            }
        })
    })
}

function getUserInfoFormWx(accessToken,openId){
    return new Promise((resolve,reject)=>{
        request(`https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`,(err,response,body)=>{
            if(!err){
                body = JSON.parse(body);
                resolve(body);
            }else{
                reject(err);
            }
        })
    })
}

function saveUserInfo(user){
    return new Promise((resolve,reject)=>{
        new customer(user)
            .save((err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
    })
}

function getUserInfoFromDb(openId){
    return customer
            .find()
            .where({openId:openId})
            .exec((err,result)=>{
                if(err){
                    throw new Error('根据openId读取用户信息失败:',openId);
                }else{
                    return result;
                }
            })
}

function getUserInfoFromCode(code){
    return customer
            .findOne()
            .where({wxCode:code})
            .exec((err,result)=>{
                if(err){
                    throw new Error('根据code查询数据库里面用户信息失败');
                }else{
                    return result
                }
            })
}

function getUserInfoFromOpenId(openId){
    return customer
            .findOne()
            .where({openId:openId})
            .select('_id wxUsername openId wxImgUrl wxCode checkStatu statu payStatu')
            .exec((err,result)=>{
                if(err){
                    throw new Error('根据openId查询数据库里面用户信息失败');
                }else{
                    console.log(openId,'openId');
                    console.log(result,'resultaaaa');
                    return result;
                }
            })
}

function updateCodeByOpenId(code,openId){
    return new Promise((resolve,reject)=>{
        customer.update({openId:openId},{$set:{wxCode:code}},(err,result)=>{
            if(err){
                reject('根据openId更新code错误!');
            }else{
                return resolve(result);
            }
        })
    })
}


/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.query.code){
        res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
    }else{
        getUserInfo(req.query.code)
            .then((userInfo)=>{
                console.log('获取到的最后的用户信息',userInfo);
                req.session.openId = userInfo.openId;
                res.render('index',{title:' '})
            })
    }

});

module.exports = router;
