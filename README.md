# gulp-start
A gulp.js starter template with basic tasks for development,production and deployment.
- Source: https://github.com/futuref/gulp-start

##目录结构
```
  src                    ----- 存放开发环境所需要的资源文件                       
  .eslintrc.js           ----- eslint js检测规则
  .scss-lint.yml         ----- eslint scss检测规则
  config.json            ----- 所有gulp里面的变量配置json
  gulpfile.js            ----- 所有的gulp任务
```

## 功能
### Development
1. browserSync
2. eslint-js
3. eslint-scss
4. SCSS compiling and CSS minifying

### Production
1. optimize js
2. optimize html
3. optimize images
4. revCollector

### Deployment
1. Rsync

## 安装
```
 git clone https://github.com/futuref/gulp-start.git
 cd gulp-start
 npm install
```

## 使用
### Development Server
```
  gulp
```

在default任务中，主要的功能是js检查，scss检查，编译scss，浏览器自动刷新。

### Building
```
  gulp build
```

在build任务中，主要的功能是复制css，压缩js，html，images，添加版本号

### Deploy
```
  gulp deploy
```

在deploy任务中，就一个功能，就是将文件部署到服务器上。
使用这个功能你需要根据你自己的服务器来配置，需要修改的地方就是在config.json这个文件中rsync配置信息。具体的可以参考 https://www.npmjs.com/package/gulp-rsync
