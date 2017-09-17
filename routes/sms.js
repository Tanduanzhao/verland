const sms = require('../model/sms.js');
const {random4Number} = require('../modules/common.js');
const smsFn = require('../modules/sms');
function findSmsByPhone(phone){
    return sms.findOne().where({phone:phone}).exec((err,result)=>{
        if(err){
            throw new Error(err);
        }else{
            if(!!result){
                return result;
            }else{
                return false;
            }
        }
    })
}

function saveCodeAndPhone(phone){
    let code = random4Number();
    return new Promise((resolve,reject)=>{
        new sms({
            phone:phone,
            code:code
        }).save((err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(code);
            }
        })
    })
}

function updateCodeByPhone(phone){
    let code = random4Number();
    return new Promise((resolve,reject)=>{
        sms.update({phone:phone},{$set:{code:code},time:new Date()},(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(code);
            }
        })
    })
}


function checkCodeByPhoneAndCode({phone,code}){
    return sms.findOne().where({phone:phone,code:code}).exec((err,result)=>{
        if(err){
            throw new Error(err);
        }else{
            if(!!result){
                return result;
            }else{
                return false;
            }
        }
    })
}


module.exports = {
    getCode:(req,res,next)=>{
        findSmsByPhone(req.query.phone)
        .then((result)=>{
            if(!!result){
                let ms = (Date.parse(new Date())-Date.parse(new Date(result.time)))/1000/60;
                if(ms<1){
                    return false;
                }else if(ms>10){
                    return updateCodeByPhone(req.query.phone);
                }else{
                    return result.code;
                }
            }else{
                return saveCodeAndPhone(req.query.phone)
            }
        })
        .then(code=>{
            if(!!code){
                return smsFn.send({
                    ParamString:`${encodeURIComponent(JSON.stringify({'num':code}))}`,
                    RecNum:req.query.phone,
                    SignName:encodeURIComponent('云量检测'),
                    TemplateCode:'SMS_77255095'
                })
            }
        })
        .then((result)=>{
            // console.log(JSON.parse(result),'发送信息返回信息');
            if(!!result){
                if(JSON.parse(result).success){
                    res.json({
                        statu:1,
                        msg:'发送短信验证码成功!'
                    });
                }else{
                    res.json({
                        statu:0,
                        msg:'发送短信验证码失败!'
                    })
                }
            }else{
                res.json({
                    statu:0,
                    msg:'发送验证码的太频繁，间隔必须在一分钟!'
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.json({
                statu:0,
                msg:'获取验证码失败!'
            })
        })
    },
    checkCode:(req,res,next)=>{
        checkCodeByPhoneAndCode(req.query)
        .then(result=>{
            if(!!result){
                let ms = (Date.parse(new Date())-Date.parse(new Date(result.time)))/1000/60;
                console.log(ms);
                if(ms<=10){
                    res.json({
                        statu:1,
                        msg:'验证成功!'
                    })
                }else{
                    res.json({
                        statu:0,
                        msg:'验证码已过期!'
                    })
                }
            }else{
                res.json({
                    statu:0,
                    msg:'验证失败'
                })
            }
        })
        .catch(err=>{
            res.json({
                statu:0,
                msg:'代码错误!'
            })
        })
    }
}
