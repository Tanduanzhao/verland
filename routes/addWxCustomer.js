const customer = require('../model/customer.js');

function addCustomerByPhone(phone,req){
    return customer
            .findOne()
            .where({$or:[{phone:phone}]})
            .exec((err,result)=>{
                if(err){
                    throw new Error('查询用户错误!');
                }else{
                    if(!result){
                        let userInfo = {
                            phone:phone,
                            hosName:req.body.hosName,
                            address:req.body.address,
                            name:req.body.name
                        };
                        if(req.session.userInfo){
                            for(let key in req.session.userInfo){
                                userInfo[key] = req.session.userInfo[key]
                            }
                        }
                        return saveUserInfo(userInfo)
                    }else{
                        if(!result.openId){
                            return new Promise((resolve,reject)=>{
                                customer
                                  .update({phone:phone},{$set:req.session.userInfo},(err,result)=>{
                                    if(err){
                                      throw new Error(err);
                                    }else{
                                      resolve();
                                    }
                                  })
                            })
                        }

                    }
                }
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
module.exports = (req,res,next)=>{
    if(!req.body.phone || !req.body.name || !req.body.hosName || !req.body.address){
        res.locals.message = '字段缺失!';
        next();
        return;
    }
    addCustomerByPhone(req.body.phone,req)
        .then((result)=>{
            res.locals.status = 1;
            next();
        })
        .catch((err)=>{
            res.locals.message = err;
            next();
        })
}
