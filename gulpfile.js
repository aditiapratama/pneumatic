require('es6-promise').polyfill()

var gulp          = require('gulp');
var postcss       = require('gulp-postcss');
var sass          = require('gulp-sass');
var csswring      = require('csswring');
var autoprefixer  = require('autoprefixer');
var notify        = require('gulp-notify');
var plumber       = require('gulp-plumber');
var uglify        = require('gulp-uglify');
var jshint        = require('gulp-jshint');
var rename        = require('gulp-rename');
var minify        = require('gulp-cssnano');
var concat        = require('gulp-concat');

var config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  jqueryDir: './bower_components/jquery',
  publicDir: './static',
  momentDir: './bower_components/moment',
  octiconsDir: './bower_components/octicons/'
};

var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

gulp.task('css', function() {
  var processors = [
    csswring,
    autoprefixer({browsers:['last 2 version']})
  ];
  return gulp.src('./static/css/*.scss')
  .pipe(plumber(plumberErrorHandler))
  .pipe(sass({
      includePaths: [config.bootstrapDir + '/assets/stylesheets'],
  }))
  // .pipe(postcss(processors))
  .pipe(gulp.dest(config.publicDir));
});

gulp.task('pygments', function () {
  return gulp.src([config.publicDir + '/pygments/*.css', '!' + config
  .publicDir + '/pygments/*min.css'])
    .pipe(minify())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(config.publicDir + '/pygments'));
});

gulp.task('copy', function() {
  gulp.src([config.jqueryDir + '/dist/jquery.min.js', config.bootstrapDir+'/assets/javascripts/bootstrap.min.js', config.momentDir + '/min/moment.min.js'])
  .pipe(gulp.dest(config.publicDir + '/js'))
  gulp.src(config.octiconsDir + '/build/font/*.{min.css,otf,eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(config.publicDir + '/fonts/octicons'))
  gulp.src(config.octiconsDir + '/build/font/_octicons.scss')
  .pipe(gulp.dest(config.publicDir + '/css'))
  gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
  .pipe(gulp.dest(config.publicDir + '/fonts'));
});


gulp.task('js',function(){
  return gulp.src(config.publicDir + '/js-dev/*.js')
  .pipe(plumber(plumberErrorHandler))
  .pipe(jshint())
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(jshint.reporter('fail'))
  .pipe(gulp.dest(config.publicDir + '/js'));
})

gulp.task('watch',function(){
  gulp.watch(config.publicDir + '/css/main.scss',['css']);
  gulp.watch(config.publicDir + '/js-dev/*.js',['js']);
})

gulp.task('serve', ['css','js','copy','pygments','watch']);

gulp.task('default', ['serve']);
