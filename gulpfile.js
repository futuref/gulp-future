var gulp = require('gulp'),
    config = require('./config.json'),
    autoprefixer =require('autoprefixer'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// function isFixed(file) {
//   return file.eslint != null && file.eslint.fixed;
// }

// development
//自动刷新
gulp.task('browserSync',function(){
  browserSync({
    server:{
      baseDir:[config.path.root],
      directory:true
    },
    // 监听以下文件的变化，如果变化就会自动刷新浏览器
    files:[
      config.path.srclintScss,
      config.path.srclintScript,
      config.path.srcHtml
    ]
  })
})

// 检查js
gulp.task('js-lint',function() {
  return gulp.src(config.path.srclintScript)
        .pipe(plugins.cached(config.path.srclintScript))
        .pipe(plugins.eslint({fix:true}))
        .pipe(plugins.eslint.format())
        // .pipe(plugins.if(isFixed, gulp.dest(config.path.distScript)))
})

// 检查 scss
gulp.task('scss-lint',function() {
  return gulp.src([config.path.srclintScss,'!' + config.path.srcExcludeScss])
         .pipe(plugins.cached(config.path.srclintScss))
         .pipe(plugins.scssLint())
})

// 编译scss
gulp.task('css',function() {
  var processors = [
    autoprefixer(config.autoprefixer),
    cssnano
  ]
  return gulp.src(config.path.srcComplieScss)
         .pipe(plugins.sass().on('error',plugins.sass.logError))
         .pipe(plugins.plumber())
         .pipe(plugins.postcss(processors))
         .pipe(gulp.dest(config.path.srcCss))
         .pipe(plugins.notify('scss编译完成'))
})

// 监听任务
gulp.task('watch',function() {
  gulp.watch(config.path.srclintScss,['css','scss-lint']);
  gulp.watch(config.path.srclintScript,['js-lint']);
  gulp.watch(config.path.srcHtml);
})

// 默认开发任务
gulp.task('default',function(callback){
  runSequence(['js-lint','scss-lint','css','browserSync','watch'],callback);
})

// production

// copy css
gulp.task('copy:css',function() {
  return gulp.src(config.path.copyCss)
         .pipe(gulp.dest(config.path.distCss))
         .pipe(plugins.size())
})

//optimize js
gulp.task('optimize:js',function() {
  return gulp.src(config.path.srcScript)
         .pipe(plugins.uglify())
         .pipe(gulp.dest(config.path.distScript))
         .pipe(plugins.size())
})

// optimize html
gulp.task('optimize:html',function() {
  return gulp.src(config.path.srcHtml)
        .pipe(plugins.htmlmin(config.optimize.htmloptions))
        .pipe(gulp.dest(config.path.distHtml))
})

// optimize images
gulp.task('optimize:images',function() {
  return gulp.src(config.path.srcImages)
         .pipe(plugins.imagemin(config.optimize.imageoptions))
         .pipe(gulp.dest(config.path.distImages))
         .pipe(plugins.size())
})
