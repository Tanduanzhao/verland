const customer = require('../model/customer.js');
function getCustomerByCradId(phone){
    return customer
                .findOne()
                .where({phone:phone})
                .select('phone checkStatu')
                .exec((err,result)=>{
                    console.log(result);
                    if(err){
                        throw new Error(`查询编号为${phone}的用户资料出错!`);
                    }else{
                        return result;
                    }
                })
}


module.exports = (req,res,next)=>{
    if(!req.params.phone){
        res.locals.message = '手机号不存在!';
        next();
        return;
    }
    getCustomerByCradId(req.params.phone)
        .then((result)=>{
            res.locals.status = 1;
            res.locals.datas = result;
            next()
        })
        .catch((err)=>{
            console.log(err);
            res.locals.message = err;
            next();
        })

}
