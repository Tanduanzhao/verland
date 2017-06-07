const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
module.exports = {
	session:{
		secret:'cashely',
		resave:false,
		key:'cashely',
		saveUninitialized: true,
  		cookie: {expires: 60*1000*60,secure: false},
  		expires:60*1000*60,
  		store:new MongoStore({
  			url:'mongodb://localhost:3010/verland'
  		})
	},
	url:'http://www.verland.cn',
	page:{
		size:20,
		pageNo:1
	},
	wx:{
		appId:'wx9753ba7c20ea36b2',
		AppSecret:'b4106dd7d0a8d1b02c80be7321d5f7f3',
		mchId:'1472079802'
	}
}
