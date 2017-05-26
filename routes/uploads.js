var upload = require('../modules/upload.js');
module.exports = function(req,res,next){
	upload(req).then(function(result){
		console.log(typeof result.upload);
		res.locals.status = 1;
		res.locals.message = "上传图片成功";
		res.locals.datas = {
			path:result.upload.path.substr(result.upload.path.match(/\//).index)
		};
		next();
	})
}