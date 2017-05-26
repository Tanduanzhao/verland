const crypto = require('crypto');
module.exports = {
	md5:function(string){
		let md5 = crypto.createHash('md5');
		md5.update(string);
		return md5.digest('hex');
	},
	shaencode:function(string){
		let sha = crypto.createHash('sha1');
	}
}