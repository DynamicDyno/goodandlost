var gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    sass         = require('gulp-sass'),
    scsslint     = require('gulp-scss-lint'),
    minifycss    = require('gulp-minify-css'),
    imagemin     = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload   = require('gulp-livereload'),
    cache        = require('gulp-cache'),
    notify       = require('gulp-notify');

gulp.task('scripts', function () {
  return gulp.src('themes/worldly/static/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('public/assets/js'));
});

gulp.task('styles', function() {
  return gulp.src('themes/worldly/static/scss/*.scss')
    .pipe(scsslint())
    .pipe(sass())
    .pipe(gulp.dest('public/assets/css'));
});

// clean
gulp.task('clean', function() {
  return gulp.src(['public/assets/css', 'public/assets/js', 'public/assets/img'], {read: false})
    .pipe(clean());
});

// default task
gulp.task('default', ['clean'], function() {
  gulp.run('styles', 'scripts');
});

gulp.task('watch', function () {
  gulp.watch('templates/*.tmpl.html', ['build']);
});
