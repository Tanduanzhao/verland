const Setting = require('../../model/setting.js');
module.exports = {
	info:function(req,res,next){
		Setting.findOne().exec(function(err,result){
			if(!err){
				console.log(result);
				res.locals.status = 1;
				res.locals.datas = result;
				res.locals.message = "查询Setting集成功!";
			}else{
				res.locals.messages = '查询Setting集错误!';
			}
			next()
		})
	},
	update:function(req,res,next){
		Setting.update({$set:{
			webSite:req.body.webSite,
			keywords:req.body.keywords,
			discription:req.body.discription
		}},function(err,result){
			if(!err){
				res.locals.status = 1;
				res.locals.message = "更新网站设置成功!";

			}else{
				res.locals.message = "更新网站设置失败!";
				console.log(err);
			}
			next()
		})
	}	
}