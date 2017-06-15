const customer = require('../model/customer.js');
function getCustomerByCradId(cId){
    return customer
                .findOne()
                .where({cradID:cId})
                .select('cradID checkStatu')
                .exec((err,result)=>{
                    console.log(result);
                    if(err){
                        throw new Error(`查询编号为${cId}的用户资料出错!`);
                    }else{
                        return result;
                    }
                })
}


module.exports = (req,res,next)=>{
    if(!req.params.id){
        res.locals.message = '查询编号不存在!';
        next();
        return;
    }
    getCustomerByCradId(req.params.id)
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
