// modules
const admin = require('./routes/admin/index.js');
const login = require('./routes/admin/login.js');
const user = require('./routes/admin/user.js');
const post = require('./routes/admin/post.js');
const category = require('./routes/admin/category.js');
const setting = require('./routes/admin/setting.js');
const md5 = require('./modules/md5.js');
const uploads = require('./routes/uploads.js');
const customer = require('./routes/admin/customer.js');
const issue = require('./routes/admin/issue.js');
const path = require('path');
const index = require('./routes/index.js');
const initWx = require('./routes/initWx.js');
const pay = require('./routes/pay.js');



/* GET home page. */
module.exports = function(app) {
    app
        .get('/MP_verify_TulMgRcUBXaRi7hY.txt',(req,res)=>{
            res.sendFile(path.join(__dirname,'./MP_verify_TulMgRcUBXaRi7hY.txt'));
        })
    	.get('*', function(req, res, next) {
            res.locals.title = '全局挂载的标题';
            next();
        })
        .get('/', index)

        //生成密码
        .get('/getMd5', md5)

    	.get('/admin', admin)
        .all('*', function(req, res, next) {
            res.locals.status = 0;
            next();
        })
        .get('/initWx',initWx)
        .get('/pay',pay)
        //登录
        .post('/admin/login', login.in)
        //注销
        .post('/admin/loginOut', login.out)
        //验证用户是否已经登录
        .post('/admin/logined', login.has)
        .get('/admin/userInfo', user.info)
        //获取文章列表
        .get('/admin/post', post.list)
        .get('/admin/post/:id', post.single)
        //添加文章
        .put('/admin/post', post.add)
        //更新文章
        .post('/admin/post/:id', post.update)
        .delete('/admin/post/:id', post.delete)
        //获取分类列表-category
        .get('/admin/category', category.list)
        //获取单个分类
        .get('/admin/category/:id', category.single)
        //新增分类
        .put('/admin/category', category.add)
        //更新分类
        .post('/admin/category/:id', category.update)
        //删除分类
        .delete('/admin/category/:id', category.delete)
        //获取用户列表
        .get('/admin/users', user.list)
        .get('/admin/user/:id', user.single)
        //添加用户
        .post('/admin/user', user.add)
        //更新用户
        .post('/admin/user/:id', user.update)
        //网站设置
        .get('/admin/setting',setting.info)
        .put('/admin/setting',setting.update)
        //--客户管理
        .get('/admin/customer',customer.list)
        .put('/admin/customer',customer.add)
        .get('/admin/customer/:id',customer.info)
        .post('/admin/customer/:id',customer.edit)
        //--问题管理
        .get('/admin/issue',issue.list)
        .get('/admin/issue/:id',issue.info)
        .put('/admin/issue',issue.add)
        .post('/admin/issue/:id',issue.edit)
        //获取幻灯片列表
        // .get('/admin/slider',slider.group)
        //获取单幻灯片列表:id
        // .get('/admin/slider/:id',slider.single)
        //新增幻灯片
        // .post('/admin/slider',slider.add)
        //更新幻灯片:id
        // .put('/admin/slider/:id',slider.update)
        //上传图片
        .post('/uploads',uploads)
        .all('*', function(req, res) {
            res.status(200);
            res.json(res.locals);
        })
}
