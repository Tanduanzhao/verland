var User = require('../../model/user.js');
var crypto = require('../../modules/crypto.js');
module.exports = {
	info:function(req, res, next) {
		console.log(req.session,'session');
        if (!req.session.username) {
            res.locals.message = '用户没登录!';
        } else {
            res.locals.status = 1;
            res.locals.login = true;
            res.locals.username = req.session.username;
            res.locals.message = '用户已经登录!';
        }
        next();
    },
    list:function(req, res, next) {
        let page = new Number(req.query.page) || 1;
        const pageSize = 2;
        const userCount = function() {
            return User.count().exec(function(err, result) {
                return new Promise(function(resolve, reject) {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
            })
        }
        userCount().then(function(count) {
            User.find().limit(pageSize).skip((page - 1) * pageSize).exec(function(err, result) {
                if (!err) {
                    res.locals.status = 1;
                    res.locals.datas = result,
                        res.locals.page = page,
                        res.locals.message = '查询用户成功!';
                    console.log(req.ip, 'IP');
                    res.locals.totalPage = (count / pageSize) > 1 ? Math.ceil(count / pageSize) : 1;
                } else {
                    res.locals.message = '查询用户失败!';
                }
                next();
            })
        })
    },
    single:function(req, res, next) {
        User.findOne().where({
            _id: req.params.id
        }).exec(function(err, result) {
            console.log(err);
            if (!err) {
                res.locals.datas = result;
                res.locals.status = 1;
                res.locals.message = '查询用户信息成功!';
            } else {
                res.locals.message = '查询用户信息失败!';
            }
            next()
        })
    },
    add:function(req, res, next) {
        User.find().where({
            username: req.body.username
        }).exec(function(err, result) {
            if (!err) {
                if (result.length != 0) {
                    res.locals.message = '用户名重复!';
                    next();
                } else {
                    const user = new User({
                        username: req.body.username,
                        password: crypto.md5(req.body.password),
                        loginDate: new Date(),
                        email: req.body.email
                    });
                    user.save(function(e, r) {
                        if (!e) {
                            res.locals.status = 1;
                            res.locals.message = '添加用户成功!';
                        } else {
                            res.locals.message = '添加用户失败!';
                        }
                        next();
                    })
                }
            } else {
                res.locals.message = '查询用户失败!';
                next();
            }
        })
    },
    update:function(req, res, next) {

        let updateInfo = {
            username: req.body.username,
            email: req.body.email
        };
        if (req.body.password != '') {
            updateInfo.password = crypto.md5(req.body.password)
        }
        User.update({
            _id: req.params.id
        }, {
            $set: updateInfo
        }, function(err, result) {
            console.log(err, result);
            if (!err) {
                res.locals.status = 1;
                res.locals.message = '更新用户成功!';
            } else {
                res.locals.message = '更新用户失败!';
            };
            next();
        })
    }
}
