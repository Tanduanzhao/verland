var Type = require('../../model/type.js');
module.exports = {
	list:function(req, res, next) {
        Type.find().populate('parentId', "_id name").exec(function(err, result) {
            if (err) {
                res.locals.message = '查询分类列表失败';
            } else {
                res.locals.message = '查询分类列表成功!';
                res.locals.datas = result;
                res.locals.status = 1;
            }
            next();
        })
    },
    single:function(req, res, next) {
        Type.findOne().where({
            _id: req.params.id
        }).exec(function(err, result) {
            if (!err) {
                res.locals.datas = result;
                res.locals.status = 1
                res.locals.message = `查询单个分类${req.params.id}成功!`
            } else {
                res.locals.message = `查询单个分类${req.params.id}失败!`;
            }
            next();
        })
    },
    add:function(req, res, next) {
        const type = new Type({
            name: req.body.title,
            discription: req.body.discription,
            user: req.session.username,
            date: +new Date(),
            parentId: req.body.parentId == 0 ? null : req.body.parentId,
            imgUrl: req.body.imgUrl
        });
        type.save(function(err, result) {
            if (err) {
                res.locals.message = '新增分类错误!';
            } else {
                res.locals.status = 1;
                res.locals.message = '新增分类成功!';
            };
            next();
        })
    },
    update:function(req, res, next) {
        Type.update({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.title,
                discription: req.body.discription,
                parentId: req.body.parentId == 0 ? null : req.body.parentId,
                imgUrl: req.body.imgUrl
            }
        }, function(err, result) {
            if (!err) {
                res.locals.status = 1;
                res.locals.message = '更新分类成功!';
            } else {
                res.locals.message = '更新分类失败!';
            }
            next();
        })
    },
    delete:function(req, res, next) {
        const delType = function() {
            return Type.remove().where({
                _id: req.params.id
            }).exec(function(err, result) {
                return new Promise(function(resolve, reject) {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
            })
        };
        delType().then(function() {
            Post.update({
                typeId: req.params.id
            }, {
                $set: {
                    typeId: null
                }
            }, function(err, result) {
                if (!err) {
                    res.locals.status = 1;
                    res.locals.message = '删除分类成功,并且更新本分类下面的文章为未分类';
                } else {
                    res.locals.message = '删除分类失败!';
                }
                next();
            })
        })
    }
}