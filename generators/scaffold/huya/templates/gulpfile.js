var gulp = require('gulp'),
    sass = require('gulp-sass'),
    changed = require('gulp-changed'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    htmlMin = require('gulp-htmlmin'),
    minifyCSS = require('gulp-clean-css'), // 压缩css
    uglify = require('gulp-uglify'),//压缩
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'), // css前缀
    connect = require('gulp-connect'),
    del = require('del'),
    path = require('path'),
    copy = require('copy'),
    imageMin = require('gulp-imagemin'),
    rev = require('gulp-rev'),//更改版本名
    rename = require('gulp-rename'),//重新命名
    revCollector = require('gulp-rev-collector'),// gulp-rev的插件，用于html模板更改
    plumber = require('gulp-plumber'),//用于错误处理
    clean = require('gulp-clean'),//删除文件
    publishPath = 'G:/root/huya_assets/a_dwstatic_huya/hd.huya.com/test';


// 文件目录路径
var paths={
    src: {
        sass:'./src/sass/**/*.scss',
        js:'./src/js/**/*.js',
        css:'./src/css',
        imgs:'./src/imgs/**/*.{JPG,jpg,png,gif}',
        html:'./src/*.html'
    },
    dev: {
       dir: './dev',
       css: './dev/css',
       js:  './dev/js',
       html: './dev'
    },
    dist:{
       css: publishPath+'/dist/css',
       imgs: publishPath + '/dist/imgs',
       js: publishPath + '/dist/js',
       html: publishPath + '/dist/'
    }
};

gulp.task('devSass',function(){
       /**
        *  一个坑 https://github.com/floatdrop/gulp-plumber/issues/32
        *  编译sass的时候写错了进程会中断，watch任务失效，使用plumber也不行，把return去掉就行了
        */
          gulp.src(paths.src.sass)               
               .pipe(plumber())
               .pipe(sourcemaps.init())
               .pipe(sass())
               .pipe(autoprefixer('last 4 version'))
               .pipe(sourcemaps.write())
               .on('error', sass.logError)
               .pipe(gulp.dest(paths.src.css))
               .pipe(reload({stream: true}));
});

gulp.task('devJS',function(){
       return gulp.src(paths.src.js)
              .pipe(changed(paths.dev.js))
              .pipe(gulp.dest(paths.dev.js))
              .pipe(reload({stream: true}));
});

gulp.task('devCSS',['devSass'],function(){
     var cssPath  = paths.src.css+'/*.css';
     return gulp.src(cssPath)
            .pipe(plumber())
            .pipe(gulp.dest(paths.dev.css))
            .pipe(reload({stream: true}));
});

gulp.task('devImgs',function(){
     return gulp.src(paths.src.imgs)
            .pipe(changed(paths.dev.imgs))
            .pipe(copy(paths.src.imgs,paths.dev.imgs))
            .pipe(reload({stream: true}));
});

gulp.task('devHtml',function(){
     return gulp.src(paths.src.html)
            .pipe(changed(paths.dev.html))
            .pipe(gulp.dest(paths.dev.html))
            .pipe(reload({stream: true}));
});

gulp.task('webServer',['devSass','devCSS','devHtml','devJS','devImgs'],function(){
        browserSync.init({
             server: {
                  baseDir: './src'
             }
        });

        var cssPath  = paths.src.css+'/*.css';

        gulp.watch(paths.src.sass,['devSass']);
        gulp.watch(cssPath,['devCSS'])
        gulp.watch(paths.src.html,['devHtml']);
        gulp.watch(paths.src.js,['devJS']);
        gulp.watch(paths.src.imgs,['devImgs']);

});


gulp.task('pubCSS',function(){
     var options={
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
     }
     
     var cssSourcePath  = paths.src.css+'/*.css';
     return gulp.src(cssSourcePath)
                .pipe(sourcemaps.init())
                .pipe(minifyCSS(options))
                .pipe(sourcemaps.write())
                .pipe(rev())//文件名添加md5后缀                 
                .pipe(gulp.dest(paths.dist.css))
                .pipe(rev.manifest())                     //- 生成一个rev-manifest.json
                .pipe(gulp.dest('./rev/css'))   //- 将 rev-manifest.json 保存到 rev目录              
});

gulp.task('pubImgs',function(){
     return gulp.src(paths.src.imgs)
           //.pipe(changed(paths.dist.imgs))
           .pipe(imageMin())
           .pipe(rev())//文件名添加md5后缀   
           .pipe(gulp.dest(paths.dist.imgs))
           .pipe(rev.manifest())                     //- 生成一个rev-manifest.json
           .pipe(gulp.dest('./rev/imgs'))   //- 将 rev-manifest.json 保存到 rev目录   
});

gulp.task('pubJS',function(){
     return gulp.src(paths.src.js)
           .pipe(sourcemaps.init({loadMaps: true}))
           .pipe(uglify({
                compress:true,//是否完全压缩
                preserveComments:'license' // 只保留部分注释
           }))
           .pipe(sourcemaps.write())
           .pipe(rev())
           .pipe(gulp.dest(paths.dist.js))
           .pipe(rev.manifest())
           .pipe(gulp.dest('./rev/js'))   //- 将 rev-manifest.json 保存到 rev目录     
});

gulp.task('pubHtml',['pubCSS','pubJS'],function(){
     var options={
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
     }; 
     var mainfestPath = './rev/**/*.json';
     return gulp.src([mainfestPath,paths.src.html])
           .pipe(htmlMin(options))
           .pipe(revCollector({
                replaceReved: true
           }))
           .pipe(gulp.dest(paths.dist.html))
});

gulp.task('dev',['devSass','devJS','devHtml','devCSS','webServer'],function(){
    console.log('本地任务已完成');
})
gulp.task('dist',['pubHtml','pubCSS','pubJS','pubImgs'],function(){
    console.log('上线任务已完成');
    var cmd = 'start'+" "+publishPath;
    require('child_process').exec(cmd);
});



