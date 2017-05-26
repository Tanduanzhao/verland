const mongoose = require('../config.db.js');
const Type = new mongoose.Schema({
	name:String,
	user:String,
	date:Date,
	parentId:{type:mongoose.Schema.Types.ObjectId,ref:'type'},
	discription:String,
	imgUrl:String
});
module.exports = mongoose.model('type',Type);