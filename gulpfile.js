var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ngAnnotate = require('browserify-ngannotate'),
    concat = require("gulp-concat"),
    sftp = require('gulp-sftp'),
    zip = require('gulp-zip'),
    imagemin = require('gulp-imagemin'),
    uploadConfig = require('./upload.json');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

var gulpNgConfig = require('gulp-ng-config');
var minimist = require('minimist');
var mockServer = require('gulp-mock-server');


var knownOptions = {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'dev'}
};

var options = minimist(process.argv.slice(2), knownOptions);


/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('bower', function () {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function () {
    return gulp.src('./styles/*')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// creates config source
//
/////////////////////////////////////////////////////////////////////////////////////
gulp.task('config', ['clean'], function () {
    return gulp.src('./config.json')
        .pipe(gulpNgConfig('app.config', {
            environment: options.env  // or maybe use process.env.NODE_ENV here
        }))
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function () {

    var ngHtml2Js = require("gulp-ng-html2js");
    return gulp.src("./partials/*.html")
        .pipe(ngHtml2Js({
            moduleName: "demoPartials",
            prefix: "/partials/"
        }))
        .pipe(concat("templateCachePartials.js"))
        .pipe(gulp.dest("./dist"));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function () {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('copy',['clean'], function () {
    gulp.src('./pluins/*')
        .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs image
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('image', function () {
    gulp.src('./images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/images'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs karma tests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('test', ['build-js'], function () {
    var testFiles = [
        './test/unit/*.js'
    ];

    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            console.log('karma tests failed: ' + err);
            throw err;
        });
});
/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle - the order of the js files is determined
// by browserify
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean', 'build-template-cache', 'config', 'copy'], function () {

    var b = browserify({
        entries: './js/app.js',
        debug: true,
        paths: ['./js/controllers', './js/services'],
        transform: [ngAnnotate]
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', ['clean', 'bower', 'build-template-cache', 'config', 'build-css', 'jshint', 'build-js', 'image'], function () {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function () {
    return gulp.watch(['./index.html', './partials/*.html', './styles/*.*css', './js/**/*.js'], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch', 'build'], function () {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: "http://localhost:8000/index.html"
        }));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// generates a sprite png and the corresponding sass sprite map.
// This is not included in the recurring development build and needs to be run separately
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('sprite', function () {

    var spriteData = gulp.src('./images/*.png')
        .pipe(spritesmith({
            imgName: 'todo-sprite.png',
            cssName: '_todo-sprite.scss',
            algorithm: 'top-down',
            padding: 5
        }));

    spriteData.css.pipe(gulp.dest('./dist'));
    spriteData.img.pipe(gulp.dest('./dist'));
});

//打包主体build 文件夹并按照时间重命名
gulp.task('zip', function () {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    return gulp.src('./dist/**')
        .pipe(zip(uploadConfig[options.env].project + '-' + year + month + day + hour + minute + '.zip'))
        .pipe(gulp.dest('./'));
});

//上传到远程服务器任务
gulp.task('upload', ['default'], function () {
    return gulp.src('./dist/**')
        .pipe(sftp({
            host: "54.223.201.156",
            user: "ec2-user",
            port: "22",
            pass: "BjLWi1T0247FBFx6",
            remotePath: "/home/ec2-user/demo"
        }));
});


gulp.task('mock', function () {
    gulp.src('.')
        .pipe(mockServer({
            port: 8001,
            allowCrossOrigin: true,
            livereload: true
        }));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// installs and builds everything, including sprites
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['sprite', 'build']);


/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('dev', ['watch', 'webserver', 'mock']);
