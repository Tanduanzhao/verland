const Post = require('../../model/post.js');
module.exports = {
	list:function(req, res, next) {
        let page = new Number(req.query.page) || 1;
        const pageSize = 2;
        const totalPost = function() {
            return Post.count().exec(function(err, result) {
                return new Promise(function(resolve, reject) {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err);
                    }
                })
            })
        }

        totalPost().then(function(count) {
            Post.find().limit(pageSize).skip((page - 1) * pageSize).populate('typeId', "_id name").exec(function(err, result) {
                if (err) {
                    res.locals.message = '查询文章失败!';
                } else {
                    res.locals.status = 1;
                    res.locals.datas = result;
                    res.locals.message = '查询文章成功';
                    res.locals.count = count;
                    res.locals.totalPage = (count / pageSize) > 1 ? Math.ceil(count / pageSize) : 1;
                    res.locals.page = page;
                }
                next();
            })
        })
    },
    single:function(req, res, next) {
        Post.findOne().where({
            _id: req.params.id
        }).populate('typeId', "_id name").exec(function(err, result) {
            if (err) {
                res.locals.message = '查询文章失败!';
            } else {
                res.locals.status = 1;
                res.locals.datas = result;
                res.locals.message = '查询文章成功';
            }
            next();
        })
    },
    add:function(req, res, next) {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            publishDate: +new Date(),
            imgUrl: req.body.imgUrl,
            publishUser: req.session.username,
            typeId: req.body.typeId == 0 ? null : req.body.typeId,
            keywords:req.body.keywords
        });
        post.save(function(err, result) {
            if (err) {
                res.locals.message = '新增文章失败!';
            } else {
                console.log(result, '新增文章成功!');
                res.locals.status = 1;
                res.locals.message = '新增文章成功!';
            }
            next();
        })
    },
    update:function(req, res, next) {
        Post.update({
            _id: req.params.id
        }, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                imgUrl: req.body.imgUrl,
                publishUser: req.session.username,
                typeId: req.body.typeId == 0 ? null : req.body.typeId,
                keywords:req.body.keywords
            }
        }, function(err, result) {
            if (err) {
                res.locals.message = '更新文档' + req.params.id + '失败!';
            } else {
                res.locals.message = '更新文档成功!'
                res.locals.status = 1;
            }
            next();
        })
    },
    delete:function(req, res, next) {
        Post.remove({
            _id: req.params.id
        }, function(err, result) {
            // console.log(result);
            if (!err) {
                res.locals.message = '删除文档成功!';
                res.locals.status = 1;
            } else {
                res.locals.message = '删除文档失败!';
            }
            next();
        })
    }
}