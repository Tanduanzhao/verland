const mongoose = require('../config.db.js');
const Setting = new mongoose.Schema({
	webSite:String,
	keywords:String,
	discription:String
})

const setting = mongoose.model('setting',Setting)
setting.find().exec(function(err,result){
	if(!result){
		const _s = new setting({
			webSite:'127.0.0.1:3000'
		});
		_s.save(function(err,result){
			if(!err){
				console.log('初始化设置表成功!');
			}else{
				console.log('初始化设置表失败!: %d',err);
			}
		})
	}
})


module.exports = setting;