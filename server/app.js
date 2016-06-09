var app = require('koa')();
var router = require('koa-router')();
var path = require('path');
var serve = require('koa-static');
var views = require('koa-views');
var mount = require('koa-mount');

app.use(views(path.join(__dirname, './views'), { map: { html: 'swig' }}));

app.use(mount('/public', serve(path.join(__dirname, '../public'), {gzip: true})));

router.get('/', function*(){
    console.log("!11")
    yield this.render('test');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);