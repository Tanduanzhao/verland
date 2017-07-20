const customer = require('../model/customer.js');

function addCustomerByPhone(phone,req){
    return new Promise((resolve,reject)=>{
            customer
            .findOne()
            .where({$or:[{phone:phone}]})
            .exec((err,result)=>{
                if(err){
                    throw new Error('查询用户错误!');
                }else{
                    let userInfo = {
                        hosName:req.body.hosName,
                        address:req.body.address,
                        name:req.body.name
                    };
                    if(req.session.userInfo){
                        for(let key in req.session.userInfo){
                            userInfo[key] = req.session.userInfo[key]
                        }
                    }
                    if(!result){
                        userInfo.phone = phone;
                        return saveUserInfo(userInfo).then((_res)=>{
                                  resolve(_res);
                                })
                    }else{
                        if(result.phone){
                            return new Promise((resolve,reject)=>{
                                customer
                                  .update({phone:phone},{$set:userInfo},(err,_result)=>{
                                    if(err){
                                      throw new Error(err);
                                    }else{
                                      resolve(result);
                                    }
                                  })
                            }).then((_res)=>{
                              resolve(_res);
                            })
                        }

                    }
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
module.exports = (req,res,next)=>{
    if(!req.body.phone || !req.body.name || !req.body.hosName || !req.body.address){
        res.locals.message = '字段缺失!';
        next();
        return;
    }
    addCustomerByPhone(req.body.phone,req)
        .then((result)=>{
            res.locals.status = 1;
            res.locals.datas = result;
            next();
        })
        .catch((err)=>{
            res.locals.message = err;
            next();
        })
}
