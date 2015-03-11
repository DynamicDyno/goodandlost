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
    browserSync  = require('browser-sync'),
    cache        = require('gulp-cache'),
    cssGlobbing  = require('gulp-css-globbing'),
    gzip         = require('gulp-gzip'),
    runSequence  = require('run-sequence'),
    replace      = require('gulp-replace'),
    fs           = require('fs'),
    reload       = browserSync.reload;

// scripts
gulp.task('scripts', function () {
  return gulp.src('themes/worldly/static/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('public/assets/js'));
});

// styles
gulp.task('styles', function() {
  return gulp.src('themes/worldly/assets/css/application.scss')
    .pipe(scsslint())
    .pipe(cssGlobbing({ extensions: ['.scss']   }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(reload({stream: true}));
});

// images
gulp.task('images', function() {
  return gulp.src('themes/worldly/assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/assets/images'))
    .pipe(reload({stream: true}));
});

// inline css
gulp.task('inline-css', function() {
  return gulp.src('public/**/*.html')
    .pipe(replace(/<link .*? href="\/assets\/css\/application.css"[^>]*>/, function(s) {
      var style = fs.readFileSync('public/assets/css/application.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(gulp.dest('public/'));
});

// gzip
gulp.task('gzip', function() {
  return gulp.src(['public/**/*.css', 'public/**/*.js', 'public/**/*.html'])
    .pipe(gulp.dest('public/'))
    .pipe(gzip({ gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('public/'));
});

// clean
gulp.task('clean', function() {
  return gulp.src(['public/assets/css', 'public/assets/js', 'public/assets/img'], {read: false})
    .pipe(clean());
});

// static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./public"
    }
  });
});

// watch
gulp.task('watch', function () {
  gulp.watch("themes/worldly/assets/css/**/*.scss", ['styles']);
  gulp.watch("themes/worldly/assets/images/**/*", ['images']);
  // gulp.watch("./**/*.html", ['html']);
});

// default task
gulp.task('default', ['clean'], function() {
  runSequence(['styles', 'scripts', 'images'], 'browser-sync', 'watch');
});

gulp.task('build', ['clean'], function() {
  runSequence(['styles', 'scripts', 'images'], 'inline-css', 'gzip');
});
