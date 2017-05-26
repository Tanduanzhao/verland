var mongoose = require('../config.db.js');
var crypto = require('../modules/crypto.js');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username : {type:String},
	password : {type:String},
	userage : {type:Number},
	loginDate : {type:Date},
	lastDate : {type:Date},
	ip:{type:String},
	email:{type:String}
});
var user = mongoose.model('User',UserSchema);
user.find(function(err,result){
	if(!result.length){
		user.create({username:'admin',password:crypto.md5('admin')},function(err,result){
			if(!err){
				console.log('初始化用户admin成功!');
			}
		});
	}
})
module.exports = user;