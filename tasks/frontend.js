var gulp = require('gulp');
var path = require('path');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var rename = require("gulp-rename");
var config = require('../webpack.config');
var fs = require('fs');
var entry = './web/**';

gulp.task("watchfe", function(){
    gulp.watch([path.join(entry, '/*.js'), path.join(entry, '/*.html')], ['webpack']);
});

gulp.task("webpack", function() {
    gulp.src('web/main.js')
        .pipe(webpack(config))
        .pipe(uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(gzip())
        .pipe(gulp.dest('public/js'))
});