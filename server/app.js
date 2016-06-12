var app = require('koa')();
var router = require('koa-router')();
var path = require('path');
var serve = require('koa-static');
var views = require('koa-views');
var mount = require('koa-mount');
var fs = require('fs');
var readFile = require('bluebird').promisify(fs.readFile);

app.use(views(path.join(__dirname, './views'), { map: { html: 'swig' }}));

app.use(mount('/public', serve(path.join(__dirname, '../public'), {gzip: true})));

router.get('*', function*(){
    this.body = yield readFile('../public/index.html', {'encoding': 'utf8'});
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);