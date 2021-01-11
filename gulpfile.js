const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require("gulp-clean-css");
const ejs = require('gulp-ejs');
const rimraf = require('rimraf');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const prettify = require('gulp-prettify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const mode = require("gulp-mode")({
    modes: ["production", "development"],
    default: "development",
    verbose: false,
});

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

// SassをCSSにコンパイルしてdistに吐き出し
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
            .pipe(mode.production(cleanCSS()))
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

// JSをdistに吐き出し
function js() {
    return gulp
        .src(paths.srcDir + '/asset/js/**/*.js')
        .pipe(changed(paths.dstDir + '/asset/js'))
        .pipe(mode.production(uglify()))
        .pipe(gulp.dest(paths.dstDir + '/asset/js'));
}

// srcのファイルに変更があれば自動でリロード
function watchFile(done) {
    gulp.watch(paths.srcDir + '/ejs/**/*.ejs', ejsCompile).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/sass/**/*.{scss,sass}', sassCompile).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/js/**/*.js', js).on('change', gulp.series(browserReload));
    gulp.watch(paths.srcDir + '/asset/image/*.{jpg,jpeg,png,gif,svg}', imageMin).on('change', gulp.series(browserReload));
    gulp.series(browserReload);
    done();
}

// タスクの実行
exports.default = gulp.series(
    clean,
    gulp.parallel(ejsCompile, sassCompile, imageMin, js),
    sync,
    watchFile
);

exports.build = gulp.series(
    clean,
    gulp.parallel(ejsCompile, sassCompile, imageMin, js),
);