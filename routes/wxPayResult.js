/*
    payResult:
        0-支付失败
        1-支付成功
    cradID
    name
*/


function updateCustomerByOpenId(cradID,obj,openId){
  return new Promise((resolve,reject)=>{
    //customer
    //  .update({openId:openId},{$set:obj},(err,result)=>{
    //    if(err){
    //      throw new Error(err);
    //    }else{
    //      resolve();
    //    }
    //  })
    customer
      .findOne()
      .where({cradID:cradID})
      .exec((err,result)=>{
        console.log(result,result == null,"cc");
        if(err){
          throw new Error('查询错误!');
        }else{
          if(result == null){
            console.log(obj,"csdcdsc")
            saveUserInfo(obj);
            resolve();
          }else{
            customer
              .update({cradID:cradID},{$set:obj},(err,result)=>{
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
    if(!req.body.cradID){
        res.locals.message = '用户编号必须存在!';
        next();
        return;
    }
    let updateData = {
        cradID:req.body.cradID
    }
    if(req.body.name){
        updateData.name = req.body.name
    }
    if(req.body.payResult == 1){
        updateData.payStatu = 1;
    }
    updateCustomerByOpenId(req.body.cradID,updateData,req.session.openId)
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
