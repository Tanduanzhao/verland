/*
    payResult:
        0-支付失败
        1-支付成功
    cradID
    name
*/

const smsFn = require('../modules/sms');


function updateCustomerByPhone(phone,obj,openId){
  return new Promise((resolve,reject)=>{
    // customer
    //  .update({openId:openId},{$set:obj},(err,result)=>{
    //    if(err){
    //      throw new Error(err);
    //    }else{
    //      resolve();
    //    }
    //  })
    customer
      .findOne()
      .where({phone:phone})
      .exec((err,result)=>{
        if(err){
          throw new Error('查询错误!');
        }else{
          if(result == null){
            saveUserInfo(obj);
            resolve();
          }else{
            customer
              .update({phone:phone},{$set:obj},(err,result)=>{
                if(err){
                  throw new Error(err);
                }else{
                  resolve();
                }
              })
          }
        }
      });
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

const customer = require('../model/customer.js');
module.exports = (req,res,next)=>{
    if(!req.body.payResult){
        res.locals.message = '传递支付结果错误!';
        next();
        return;
    }
    if(!req.session.openId){
        res.locals.message = '用户信息过期，请重新拉起!';
        next();
        return;
    }
    if(!req.body.phone){
        res.locals.message = '用户手机号必须存在!';
        next();
        return;
    }
    let updateData = {
        phone:req.body.phone
    }
    if(req.body.name){
        updateData.name = req.body.name
    }
    if(req.body.hosName){
        updateData.hosName = req.body.hosName
    }
    if(req.body.address){
        updateData.address = req.body.address
    }
    if(req.body.payResult == 1){
        updateData.payStatu = 1;
    }
    updateCustomerByPhone(req.body.phone,updateData,req.session.openId)
        .then(()=>{
            return smsFn.send({
                ParamString:`${encodeURIComponent(JSON.stringify({'user':req.query.phone}))}`,
                RecNum:'18805712071',
                SignName:encodeURIComponent('云量检测'),
                TemplateCode:'SMS_77335074'
            })
        })
        .then(()=>{
            res.locals.status = 1;
            res.locals.message = '支付成功!';
            next();
        })
        .catch((err)=>{
            console.log(err);
            res.locals.message = err;
            next();
        })


}
