var SRC = 'app',
    DEST = 'build',
    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),

    imagemin = require('gulp-imagemin'), // 图片压缩
    minifyCss = require('gulp-minify-css'), // css压缩
    uglify = require('gulp-uglify'), // js压缩
    htmlmin = require('gulp-htmlmin'), // html压缩
    revReplace = require('gulp-rev-replace'),
    amdOptimize = require("amd-optimize"),
    runSequence = require('run-sequence'),
    del = require('del'),
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    pngquant = require('imagemin-pngquant'), // 深度压缩
    jshint = require('gulp-jshint'), //js检测
    runSequence = require('gulp-sequence'),
    $ = require('gulp-load-plugins')(),
    px2rem = require('postcss-px2rem');


// Help
gulp.task('help', function () {
    console.log(' gulp help           gulp参数说明');
    console.log(' gulp jshint         js语法检查');
    console.log(' gulp build          文件打包');
    console.log(' gulp build-image    压缩图片');
    console.log(' gulp build-js       压缩JS');
    console.log(' gulp build-css      压缩CSS');
    console.log(' gulp build-html     压缩HTML');
    console.log(' gulp server         测试server');
});

//清空图片、样式、js、rev 
gulp.task('clean', function () {
    return del([
        DEST + '/**/*'
    ]);
});

//压缩图片
gulp.task('build-image', function () {
    var imgSrc = SRC + '/images/**',
        imgDst = DEST + '/images';
    return gulp.src(imgSrc)
        //.pipe(imagemin({
        //    optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
        //    progressive: true, // 无损压缩JPG图片
        //    svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
        //    use: [pngquant()] // 使用pngquant插件进行深度压缩
        //}))
        .pipe(gulp.dest(imgDst));
});

//压缩JS
gulp.task('build-js', function () {
    return gulp.src([SRC + '/js/**/*.js', '!' + SRC + '/js/config.js', '!.min.js'])
        //.pipe(concat('base.min.js'))                            //合并后生成的文件名
        //.pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(uglify({
            mangle: false // 是否修改变量名
        }).on('error', function (e) {
            console.log(e);
        })) //压缩
        //.pipe(uglify())
        //.pipe(gulp.dest(DEST + '/js'))                        //输出目录
        //.pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(DEST + '/js')); //- 将 rev-manifest.json 保存到 rev/js 目录内
});

gulp.task('mv-config', function () {
    return gulp.src([SRC + '/js/config.js'])
        .pipe(gulp.dest(DEST + '/js'));
});


//压缩CSS
gulp.task('build-css', function () {
    return gulp.src([SRC + '/css/**/*.css']) //- 需要处理的css文件，放到一个字符串数组里
        //.pipe(concat('all.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss({
            "compatibility": "ie7"
        })) //- 压缩处理成一行
        //.pipe(rev())                                            //- 文件名加MD5后缀
        //.pipe(gulp.dest(DEST + '/css'))                      //- 输出文件本地
        //.pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(DEST + '/css')); //- 将 rev-manifest.json 保存到 rev 目录内
});

//压缩HTML
gulp.task('build-html', function () {
    return gulp.src(SRC + '/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }).on("error", function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(DEST));
});

//移动fonts
gulp.task('rev-fonts', function () {
    return gulp.src(SRC + '/fonts/**')
        .pipe(gulp.dest(DEST + '/fonts'));
});

gulp.task('rev-css', ['build-css'], function () {
    var manifest = gulp.src(DEST + "/css/rev-manifest.json");
    gulp.src(DEST + '/**/*.html') //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revReplace({
            manifest: manifest
        })) //- 执行文件内css名的替换
        .pipe(gulp.dest(DEST)); //- 替换后的文件输出的目录
});

gulp.task('rev-js', ['build-js'], function () {
    //读取 rev-manifest.json 文件
    var manifest = gulp.src(DEST + "/js/rev-manifest.json");
    gulp.src([DEST + '/**/*.html']) //需要进行js名替换的文件
        .pipe(revReplace({
            manifest: manifest
        })) //- js
        .pipe(gulp.dest(DEST)); //- 替换后的文件输出的目录
});

/**
 * [实时预览]
 */
gulp.task('server', function () {
    browserSync.init({
        server: SRC
    });
    gulp.watch([
        SRC + '/views/**/*.html',
        SRC + '/js/**/*.js',
        SRC + '/css/**/*.css'
    ]).on("change", browserSync.reload);
});

//预览打包后的结果
gulp.task('pre-release', function () {
    browserSync.init({
        server: DEST
    });
});


/**
 * [检查js]
 */
gulp.task('jshint', function () {
    return gulp.src([SRC + '/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['help']);
gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'build-image',
        'build-js',
        'build-css',
        'build-html',
        'rev-fonts',
        'rev-css',
        'rev-js',
        'mv-config',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('BUILD FINISHED SUCCESSFULLY');
            }
            callback(error);
        });

});