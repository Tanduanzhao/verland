const customer = require('../../model/customer.js');
const common = require('../../modules/common.js');
function countCustomer(conditions = {}){
    return customer
            .count()
            .where(conditions)
            .exec((err,count)=>{
                if(err){
                    throw new Error('统计客户列表数据出错!');
                }else{
                    return count;
                }
            })
}

function findCustomer(conditions = {},page=1,size=20){
    return customer
            .find()
            .select('cradID name payStatu statu checkStatu date')
            .where(conditions)
            .skip((page-1)*size)
            .limit(size)
            .exec((err,result)=>{
                if(err){
                    console.log(err);
                    throw new Error('查询客户列表数据出错!',err)
                }else{
                    return result;
                }
            })
}

function findOneCustomer(id){
    return customer
            .findById(id)
            .select('cradID name payStatu statu checkStatu')
            .exec((err,result)=>{
                if(err){
                    throw new Error(`查询${id}的客户出错!`);
                }else{
                    return result;
                }
            })
}

function editCustomer(id,obj){
    return new Promise((resolve,reject)=>{
        customer
            .update({_id:id},obj,(err,result)=>{
                if(err){
                    reject(`更新${id}的客户出错!`);
                }else{
                    resolve();
                }
            })
    })
}


module.exports = {
    list:(req,res,next)=>{
        countCustomer().then((count)=>{
                res.locals.page = {};
            findCustomer().then((result)=>{
                res.locals.page.total = count;
                res.locals.status = 1;
                res.locals.datas = common.dateFormat(result);
                next();
            }).catch((err)=>{
                console.log(err);
                res.locals.message = '查询客户列表数据出错!';
                next();
            })
        }).catch((err)=>{
            res.locals.message = '统计客户列表数据出错!';
            next()
        })
    },
    add:(req,res,next)=>{
        let user = {
            cradID:req.body.cradID,
            name:req.body.name,
            payStatu:req.body.payStatu,
            statu:req.body.statu,
            checkStatu:req.body.statu
        };
        new customer(user)
            .save((err,result)=>{
                if(err){
                    throw new Error('添加用户出错!');
                }else{
                    res.locals.status = 1;
                }
                next();
            }).catch((err)=>{
                res.locals.message = err.message;
                next();
            })
    },
    info:(req,res,next)=>{
        findOneCustomer(req.params.id)
            .then((result)=>{
                res.locals.datas = result;
                res.locals.status = 1;
                next();
            }).catch((err)=>{
                res.locals.message = err.message;
                next();
            })
    },
    edit:(req,res,next)=>{
        let obj = {
            cradID:req.body.cradID,
            payStatu:req.body.payStatu,
            checkStatu:req.body.checkStatu,
            statu:req.body.statu,
            editDate:req.body.editDate,
            name:req.body.name
        };
        editCustomer(req.params.id,obj)
            .then(()=>{
                res.locals.status = 1;
                next();
            }).catch((err)=>{
                res.locals.message = err;
                next();
            })
    }
}
