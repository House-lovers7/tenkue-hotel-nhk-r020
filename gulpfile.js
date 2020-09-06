const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const ejs = require('gulp-ejs');
const cleanCSS = require('gulp-clean-css');
const rimraf = require('rimraf');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const prettify = require('gulp-prettify');
// const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
// const path = require('path');

var paths = {
    srcDir: './src',
    dstDir: './dist',
};

// ブラウザの立ち上げ
function sync(done) {
    browserSync.init({
        server: {
            baseDir: paths.dstDir,
            index: 'index.html',
        },
        open: 'external',
        reloadOnRestart: true,
    });
    done();
}

// ブラウザをリロード
function browserReload(done) {
    browserSync.reload();
    done();
}

// 立ち上げた際にdistを一旦クリーンにする
function clean(cb) {
    return rimraf(paths.dstDir, cb);
}

// HTMLをMinifyしてdistディレクトリに吐き出す
function htmlMin() {
    return gulp
        .src(paths.srcDir + '/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dstDir));
}

// PugをHTMLにコンパイルしてdistに吐き出し
function pugCompile() {
    return (
        gulp
            .src([paths.srcDir + '/pug/**/*.pug', '!' + paths.srcDir + '/pug/**/_*.pug'])
            .pipe(plumber())
            .pipe(
                pug({
                    pretty: true,
                })
            )
            // .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest(paths.dstDir))
    );
}

// EJSをHTMLにコンパイルしてdistに吐き出し
function ejsCompile() {
    return gulp
        .src([paths.srcDir + '/ejs/**/*.ejs', '!' + paths.srcDir + '/ejs/**/_*.ejs'])
        .pipe(plumber())
        .pipe(ejs({}, { rmWhitespace: true }, {}))
        .pipe(
            prettify({
                indent_size: 4,
                indent_with_tabs: true,
            })
        )
        .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest(paths.dstDir));
}

// SassをCSSにコンパイル・Minifyしてdistに吐き出し
function sassCompile() {
    return (
        gulp
            .src(paths.srcDir + '/asset/sass/**/*.{scss,sass}')
            .pipe(plumber(notify.onError('Error: <%= error.message %>')))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle: 'expanded',
                })
            )
            .on('error', sass.logError)
            .pipe(
                autoprefixer({
                    cascade: false,
                })
            )
            .pipe(sourcemaps.write())
            .pipe(gcmq())
            // .pipe(cleanCSS())
            .pipe(
                rename({
                    extname: '.min.css',
                })
            )
            .pipe(gulp.dest(paths.dstDir + '/asset/css'))
    );
}

// imageをMinifyしてdistに吐き出し
function imageMin() {
    return gulp
        .src(paths.srcDir + '/asset/image/*.{jpg,jpeg,png,gif,svg}')
        .pipe(changed(paths.dstDir + '/asset/image'))
        .pipe(
            imagemin([
                pngquant({
                    quality: [0.7, 0.85],
                    speed: 1,
                }),
                mozjpeg({
                    quality: 85,
                    progressive: true,
                }),
                imagemin.svgo(),
                imagemin.optipng(),
                imagemin.gifsicle(),
            ])
        )
        .pipe(gulp.dest(paths.dstDir + '/asset/image'));
}

// videoをそのまま吐き出す
function movie() {
    return gulp.src(paths.srcDir + '/asset/movie/*.*').pipe(gulp.dest(paths.dstDir + '/asset/movie'));
}

// faviconをそのまま吐き出す
function favicon() {
    return gulp.src(paths.srcDir + '/asset/image/*.ico').pipe(gulp.dest(paths.dstDir + '/asset/image'));
}

// PDFをそのまま吐き出す
function pdf() {
    return gulp.src(paths.srcDir + '/asset/pdf/*.*').pipe(gulp.dest(paths.dstDir + '/asset/pdf'));
}

// JSファイルを圧縮
// function jsMin(done) {
//     gulp.watch('./src/js/*.js', function() {
//         return gulp
//             .src('./src/js/*.js')
//             .pipe(gulp.dest('./dist/js'))
//             .pipe(uglify())
//             .pipe(rename({ suffix: '.min' }))
//             .pipe(gulp.dest('./dist/js'));
//     });
// done();
// }

// webpackでjsをbundleしてdistに吐き出し
function jsBundle(done) {
    return webpackStream(webpackConfig, webpack).pipe(gulp.dest(paths.dstDir + '/asset/js'));
}

// srcのファイルに変更があれば自動でリロード
function watchFile(done) {
    gulp.watch(paths.srcDir + '/**/*.html', htmlMin).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/pug/**/*.pug', pugCompile).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/ejs/**/*.ejs', ejsCompile).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/sass/**/*.{scss,sass}', sassCompile).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/js/**/*.js', jsBundle).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/image/*.{jpg,jpeg,png,gif,svg}', imageMin).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/movie/*.*', movie).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/favicon/*.*', favicon).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/pdf/*.*', pdf).on('change', gulp.series(browserReload));
    gulp.series(browserReload);
    done();
}

// タスクの実行
exports.default = gulp.series(
    clean,
    gulp.parallel(htmlMin, pugCompile, ejsCompile, sassCompile, imageMin, movie, favicon, pdf, jsBundle),
    sync,
    watchFile
);
