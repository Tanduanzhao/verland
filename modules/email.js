const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	service:'qq',
	auth:{
		user:'290119516@qq.com',
		pass:'HONGLOVEMING@129'
	}
});
let mailOptions = {
	from: '"cashely.shi" <290119516@qq.com>',
	to:'cashely.shi@immortalshealth.com',
	subject:'测试邮件'
}

module.exports = function(options){
	mailOptions.to = options.to;
	mailOptions.subject = options.subject;
	mailOptions.html = options.html || options.text;
	return new Promise((resolve,reject)=>{
		transporter.sendMail(mailOptions,(error,info)=>{
			if(!error){
				resolve(info);
			}else{
				console.log(error);
			}
		});
	})
}