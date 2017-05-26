const mongoose = require('../config.db.js');
const Post = new mongoose.Schema({
	title:String,
	content:String,
	publishUser:String,
	publishDate:Date,
	typeName:String,
	imgUrl:String,
	typeId:{type:mongoose.Schema.Types.ObjectId,ref:"type"},
	keywords:String
})

module.exports = mongoose.model('post',Post);