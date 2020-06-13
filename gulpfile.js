//引入gulp
const {
  series,
  src,
  dest,
  watch
} = require("gulp");

//html插件
const htmlclean = require("gulp-htmlclean"); //压缩HTML

//css插件
const lesstocss = require("gulp-less"); //把less转化为css
const cleancss = require("gulp-clean-css"); //压缩css

//js插件
const uglify = require("gulp-uglify"); //压缩js
const stripdebug = require("gulp-strip-debug"); //去掉调试代码

//图片插件
const imagemin = require('gulp-imagemin'); //图片压缩

//网络环境搭建
const connect = require('gulp-connect');


const file = {
  src: "src/",
  dist: "dist/",
};

function html() {
  return src(file.src + "html/*")
    .pipe(htmlclean())
    .pipe(dest(file.dist + "html/"))
    .pipe(connect.reload()); //热更新
}

function css() {
  return src(file.src + "css/*")
    .pipe(lesstocss())
    .pipe(cleancss())
    .pipe(dest(file.dist + "css/"))
    .pipe(connect.reload());
}

function js() {
  return src(file.src + "js/*")
    .pipe(stripdebug())
    .pipe(dest(file.dist + "js/"))
    .pipe(connect.reload());
}

function images() {
  return src(file.src + "images/*")
    .pipe(dest(file.dist + "images/"));
}

//这个server需要配合着watch才能实现监听的效果
function server(cb) {
  connect.server({
    port: 5500,
    livereload: true //自动刷新
  })
  cb();
}

watch('src/html/*', function (cb) {
  html();
  cb();
})

watch('src/css/*', function (cb) {
  css();
  cb();
})

watch('src/js/*', function (cb) {
  js();
  cb();
})

exports.default = series(html, css, js, images, server);