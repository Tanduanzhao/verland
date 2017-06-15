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
	money:1,
	url:'http://www.verland.cn',
	page:{
		size:20,
		pageNo:1
	},
	wx:{
		appId:'wx9753ba7c20ea36b2',
		AppSecret:'b4106dd7d0a8d1b02c80be7321d5f7f3',
		mchId:'1472079802'
	},
	aliPay:{
		payUrl:'https://openapi.alipay.com/gateway.do',
		appId:'2017051007187123',
		md5Key:'44ipadkt2l9gkoop0yztpydm6p7qz0xf',
		sha1Key:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0EzbDDJfaL6oKEkd4zEe47vMQEh1vklO60JuV3WyEHbETWPGkWoaQeojfsRnGzU/HHHvjCvmeFE/yHCsAAsI0ZVIUZnABNc5UidjqK2wzN7GTlQunjuzsVi4EkeNq8QOO3YGa2nHKVvIxjDg1gCosr3L9qFxYrLGYdCVTXXMKDQIDAQAB',
		aliKey:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB'
	}
}
