const issue = require('../../model/issue.js');
const common = require('../../modules/common.js');
let {page} = require('../../config.inc.js');
function findIssue(conditions = {}){
    return issue
            .find()
            .where(conditions)
            .limit(page.size)
            .skip((page.pageNo-1)*page.size)
            .select('_id title date statu')
            .sort({date:-1})
            .exec((err,result)=>{
                if(err){
                    throw new Error('查询问题列表出错!');
                }
            })
}

function countIssue(conditions = {}){
    return issue
            .count()
            .where(conditions)
            .exec((err,count)=>{
                if(err){
                    throw new Error('统计问题列表出错');
                }
            })
}

function findOneIssue(id){
    return issue
            .findById(id)
            .select('_id title content date statu')
            .exec((err,result)=>{
                if(err){
                    throw new Error(`查询${id}问题出错`);
                }
            })
}

function addIssue(obj){
    console.log(obj);
    return (new issue(obj)
                .save((err,result)=>{
                    if(err){
                        throw new Error('添加问题出错!')
                    }
                }))
}

function editIssue(id,obj){
    return new Promise((resolve,reject)=>{
        issue
            .update({_id:id},obj,(err,result)=>{
                if(err){
                    console.log(err);
                    reject(`更新${id}的问题出错!`);
                }else{
                    resolve(result);
                }

            })
    })
}
module.exports = {
    list:(req,res,next)=>{
        page.pageNo = (function(){
                if(req.query.page && req.query.page !== 0){
                    return req.query.page*1;
                }else{
                    return page.pageNo;
                }
        })();
        countIssue()
            .then((count)=>{
                page.count = count;
                page.totalPage = Math.ceil(count/page.size);
                findIssue()
                    .then((result)=>{
                        res.locals.status = 1;
                        res.locals.datas = common.dateFormat(result);
                        res.locals.page = page;
                        next();
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.locals.message = err;
                        next();
                    })
            })
            .catch((err)=>{
                console.log(err);
                res.locals.message = err;
                next();
            })
    },
    info:(req,res,next)=>{
        findOneIssue(req.params.id)
            .then((result)=>{
                res.locals.status = 1;
                res.locals.datas = result;
                next();
            })
            .catch((err)=>{
                res.locals.message = err;
                console.log(err);
                next();
            })
    },
    add:(req,res,next)=>{
        let obj = {
            title : req.body.title,
            content: req.body.content,
            statu: req.body.statu
        };
        addIssue(obj)
            .then((result)=>{
                res.locals.status = 1;
                next()
            })
            .catch((err)=>{
                res.locals.message(err);
                console.log(err);
                next();
            })
    },
    edit:(req,res,next)=>{
        let obj = {
            title:req.body.title,
            content:req.body.content,
            statu:req.body.statu,
            editDate:new Date()
        };
        editIssue(req.params.id,obj)
            .then((result)=>{
                res.locals.status = 1;
                res.locals.datas = result;
                next();
            })
            .catch((err)=>{
                console.log(err);
                res.locals.message = err;
                next()
            })
    }
}
