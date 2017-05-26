var User = require('../../model/user.js')
var sendMail = require('../../modules/email.js');
var crypto = require('../../modules/crypto.js');
module.exports = {
    in:function(req, res, next) {
        console.log('in');
        User.findOne({
            username: req.body.username
        }, function(err, result) {
            if (!err) {
                console.log(result, crypto.md5(req.body.password));
                if (result) {
                    if (result.password == crypto.md5(req.body.password)) {
                        if(result.email && (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/).test(result.mail)){
                            sendMail({
                                to: result.email,
                                subject: '登录提醒',
                                html: '<p>您已经登录了后台管理系统</p>'
                            }).then((res) => {
                                console.log('发送邮件成功!');
                            });
                        }
                        User.update({
                            username: req.body.username
                        }, {
                            $set: {
                                lastDate: new Date(),
                                ip: req.ip
                            }
                        }, function(err, result) {
                            if (!err) {

                                req.session.username = req.body.username;
                                res.locals.status = 1;
                                res.locals.message = "用户登录成功!";
                            } else {
                                res.locals.message = '更新用户登录时间错误!';
                            }
                            next();
                        })
                    } else {
                        res.locals.message = "用户密码错误!";
                        next();
                    }

                } else {
                    res.locals.message = "查询不到此用户!";
                    next();
                }
            } else {
                res.locals.message = "查询数据库出错!";
                next();
            }

        });

    },
    out:function(req, res, next) {
        req.session.destroy();
        res.locals.message = '注销成功!';
        res.locals.status = 1;
        next();
    },
    has:function(req, res, next) {
        console.log('enter');
        if (!req.session.username) {
            console.log('no');
            res.locals.message = '用户没登录!';
        } else {
            res.locals.status = 1;
            res.locals.message = '用户已经登录!';
        }
        next();
    }
}
