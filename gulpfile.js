'use strict';
/*
    npm install --save-dev gulp browserify tsify gulp-sourcemaps vinyl-buffer vinyl-source-stream node-notifier gulp-livereload gulp-notify gulp-sass del
*/
var gulp       = require('gulp'),
    browserify = require('browserify'),
    tsify      = require('tsify'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer     = require('vinyl-buffer'),
    source     = require('vinyl-source-stream'),
    notifier   = require('node-notifier'),
    livereload = require('gulp-livereload'),
    notify     = require('gulp-notify'),
    sass       = require('gulp-sass'),
    del        = require('del');

var config = {
    ts: {
        src: './src/ts/**/*.ts',
        outDir: './resource/js',
        out: 'main.js',
        options: {
            browserify: {
                entries: './src/ts/main.ts',
                extensions: ['.ts'],
                debug: true
            },
            tsify: {
                target: 'ES5',
                removeComments: true,
                debug: true
            }
        }
    },
    sass : {
        src: './src/scss/**/*.scss',
        dest: './resource/css'
    }
};

gulp.task('ts', function () {
    return browserify(config.ts.options.browserify)
        .plugin(tsify, config.ts.options.tsify)
        .bundle()
        .on('error', function (err) {
            notifier.notify({ message: err.message});
            console.log(err.message);
        })
        .pipe(source(config.ts.out))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./', {includeContent: true, sourceRoot: '../../'}))
        .pipe(gulp.dest(config.ts.outDir))
        .pipe(notify({ message: 'ts task complete' }));
});

gulp.task('sass', function(){
    gulp.src(config.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./', {sourceRoot: '../../'}))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(notify({ message: 'sass task complete' }));
});

gulp.task('clear', function(cb) {
    del('./resource', cb);
});

gulp.task('watch', function() {
    gulp.watch(config.ts.src, ['ts']);
    gulp.watch(config.sass.src, ['sass']);
    livereload.listen();
    gulp.watch(['./resource/*']).on('change', livereload.changed);
});