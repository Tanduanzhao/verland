const mongoose = require('../config.db.js');
let File = new mongoose.Schema({
	paths:[String],
	name:String
})
module.exports = mongoose.model('file',File);