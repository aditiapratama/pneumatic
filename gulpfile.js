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

var config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  jqueryDir: './bower_components/jquery',
  publicDir: './static'
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
  .pipe(postcss(processors))
  .pipe(gulp.dest(config.publicDir));
});

gulp.task('fonts', function() {
  return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
  .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('jquery', function() {
  return gulp.src(config.jqueryDir + '/dist/jquery.min.js')
  .pipe(gulp.dest(config.publicDir + '/js'));
});


gulp.task('js',function(){
  return gulp.src(config.publicDir + '/js/*.js')
  .pipe(plumber(plumberErrorHandler))
  .pipe(jshint())
  .pipe(jshint.reporter('fail'))
  .pipe(gulp.dest(config.publicDir + '/js'));
})


gulp.task('compress',function(){
  return gulp.src(config.publicDir + '/js/main.js')
  .pipe(plumber(plumberErrorHandler))
  .pipe(jshint())
  .pipe(jshint.reporter('fail'))
  .pipe(uglify())
  .pipe(gulp.dest(config.publicDir + '/js'));
})

gulp.task('watch',function(){
  gulp.watch(config.publicDir + '/css/main.scss',['css']);
  // gulp.watch(config.publicDir + '/js/*.js',['js']);
  gulp.watch(config.publicDir + '/js/main.js',['compress']);;
})

gulp.task('serve', ['css','fonts', 'jquery', 'watch']);

gulp.task('default', ['serve']);
