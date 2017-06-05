const mongoose = require('mongoose');
mongoose.Promise = Promise;
const mongoUrl = 'mongodb://localhost:3010/verland';

mongoose.connect(mongoUrl);
mongoose.connection.on('open',function(){
	console.log('链接数据库成功!');
});
mongoose.connection.on('error',function(error){
	console.log('链接数据库失败:'+error);
});


module.exports = mongoose;
