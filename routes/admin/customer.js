const customer = require('../../model/customer.js');
const common = require('../../modules/common.js');
let {page} = require('../../config.inc.js');
function countCustomer(conditions = {}){
    return customer
            .count()
            .where(conditions)
            .exec((err,count)=>{
                if(err){
                    throw new Error('统计客户列表数据出错!');
                }
            })
}

function findCustomer(conditions = {}){
    return customer
            .find()
            .select('cradID name payStatu statu checkStatu date address phone')
            .where(conditions)
            .sort({date:-1})
            .skip((page.pageNo-1)*page.size)
            .limit(page.size)
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
            .select('cradID name payStatu statu checkStatu address phone')
            .exec((err,result)=>{
                if(err){
                    //throw new Error(`查询${id}的客户出错!`);
                    return result = 0;
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
        page.pageNo = (function(){
                if(req.query.page && req.query.page !== 0){
                    return Number(req.query.page);
                }else{
                    return page.pageNo;
                }
        })();
        countCustomer().then((count)=>{
            page.count = count;

            page.totalPage = Math.ceil(count/page.size);
            console.log(page.totalPage);
            findCustomer().then((result)=>{
                res.locals.status = 1;
                res.locals.datas = common.dateFormat(result);
                res.locals.page = page;
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
            checkStatu:req.body.statu,
            address:req.body.address,
            phone:req.body.phone
        };
        new customer(user)
            .save((err,result)=>{
                if(err){
                    console.log(err);
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
            name:req.body.name,
            address:req.body.address,
            phone:req.body.phone
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
