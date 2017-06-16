var gulp = require('gulp'),
    config = require('./config.json'),
    autoprefixer =require('autoprefixer'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    del         = require('del'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// function isFixed(file) {
//   return file.eslint != null && file.eslint.fixed;
// }

// development //
//browserSync
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

// eslint-js
gulp.task('js-lint',function() {
  return gulp.src(config.path.srclintScript)
        .pipe(plugins.cached(config.path.srclintScript))
        .pipe(plugins.eslint({fix:true}))
        .pipe(plugins.eslint.format())
        // .pipe(plugins.if(isFixed, gulp.dest(config.path.distScript)))
})

// eslint scss
gulp.task('scss-lint',function() {
  return gulp.src([config.path.srclintScss,'!' + config.path.srcExcludeScss])
         .pipe(plugins.cached(config.path.srclintScss))
         .pipe(plugins.scssLint())
})

// complie scss
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

// watch
gulp.task('watch',function() {
  gulp.watch(config.path.srclintScss,['css','scss-lint']);
  gulp.watch(config.path.srclintScript,['js-lint']);
  gulp.watch(config.path.srcHtml);
})

// default
gulp.task('default',function(callback){
  runSequence(['js-lint','scss-lint','css','browserSync','watch'],callback);
})


// production //
// copy css
gulp.task('copy:css',function() {
  return gulp.src(config.path.copyCss)
         .pipe(plugins.rev())
         .pipe(gulp.dest(config.path.distCss))
         .pipe(plugins.rev.manifest())
         .pipe(gulp.dest('.rev/css'))
         .pipe(plugins.size())
})

//optimize js
gulp.task('optimize:js',function() {
  return gulp.src(config.path.srcScript)
         .pipe(plugins.uglify())
         .pipe(plugins.rev())
         .pipe(gulp.dest(config.path.distScript))
         .pipe(plugins.rev.manifest())
         .pipe(gulp.dest('.rev/js'))
         .pipe(plugins.size())
})

// optimize html
gulp.task('optimize:html',function() {
  return gulp.src(config.path.srcHtml)
        // .pipe(plugins.htmlmin(config.optimize.htmloptions))
        .pipe(gulp.dest(config.path.distHtml))
})

// optimize images
gulp.task('optimize:images',function() {
  return gulp.src(config.path.srcImages)
         .pipe(plugins.imagemin(config.optimize.imageoptions))
         .pipe(gulp.dest(config.path.distImages))
         .pipe(plugins.size())
})

// del
gulp.task('del',function(){
   del.sync(['dist/**/*', '!dist/images','!dist/images/**/*.{png,jpg,gif,jpeg}']);
})
// 替换所有的link
gulp.task('rev:collect',function(){
  return gulp.src([config.collect.src,config.collect.html])
        .pipe(plugins.revCollector({
          replaceReved:true
        }))
        .pipe(gulp.dest('dist'))
})

// 默认生产任务
gulp.task('build',function(){
  runSequence('del',['copy:css','optimize:js','optimize:html','optimize:images'],'rev:collect')
})

// deploy //
// copy files and folders to server via rsync
gulp.task('rsync',function(){
  return gulp.src(config.rsync.src)
         .pipe(plugins.rsync(config.rsync.options))
})
gulp.task('deploy',['rsync'])
