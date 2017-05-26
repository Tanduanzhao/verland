var crypto = require('./crypto.js');
module.exports = function(req, res, next) {
    let string = 'abcdefghijklmnopqrstuvwxyz';
    let k = [];
    while (k.length < 5) {
        k.push(string[Math.ceil(Math.random() * string.length)]);
    }
    k = k.join('');
    k = crypto.md5(k);
    res.locals.string = k;
    res.locals.message = '获取加密字符串成功!';
    res.json(res.locals);
}