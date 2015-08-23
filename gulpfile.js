var gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    sass         = require('gulp-sass'),
    scsslint     = require('gulp-scss-lint'),
    minifycss    = require('gulp-minify-css'),
    imagemin     = require('gulp-imagemin'),
    imageResize  = require('gulp-image-resize');
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    cache        = require('gulp-cache'),
    cssGlobbing  = require('gulp-css-globbing'),
    gzip         = require('gulp-gzip'),
    runSequence  = require('run-sequence'),
    replace      = require('gulp-replace'),
    fs           = require('fs'),
    rev          = require('gulp-rev'),
    revReplace   = require('gulp-rev-replace'),
    fingerprint  = require('gulp-fingerprint'),
    reload       = browserSync.reload;

// scripts
gulp.task('scripts', function () {
  return gulp.src(['themes/worldly/assets/js/vendor/*.js', 'themes/worldly/assets/js/components/*.js', 'themes/worldly/assets/js/*.js'])
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('public/assets/js'))
});

// styles
gulp.task('styles', function() {
  return gulp.src('themes/worldly/assets/css/application.scss')
    .pipe(cssGlobbing({ extensions: ['.scss']   }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
});

// images
gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/assets/images'))
});

// image resizing
gulp.task('images-resize', function () {
  gulp.src('images/**/*')
    .pipe(imageResize({
      width : 720,
      upscale : false
    }))
    .pipe(gulp.dest('images/720'));
});

// html
gulp.task('html', function() {
  return gulp.src('public/**/*.html')
    .pipe(reload({stream: true}));
});

// fonts
gulp.task('fonts', function() {
  return gulp.src('themes/worldly/assets/fonts/**/*')
    .pipe(gulp.dest('public/assets/fonts'))
});

// lint css
gulp.task('lint-css', function() {
  return gulp.src(['themes/worldly/assets/css/**/*.scss', '!themes/worldly/assets/css/vendor/**'])
    .pipe(scsslint({
      'config': 'scss-lint.yml'
    }))
});

// lint js
gulp.task('lint-js', function() {
  return gulp.src(['themes/worldly/assets/js/**/*.js', '!themes/worldly/assets/js/vendor/**'])
    .pipe(jshint())
});

// lint all
gulp.task('lint', function() {
  runSequence(['lint-css', 'lint-js']);
});

// inline css
gulp.task('inline-css', function() {
  return gulp.src('public/**/*.html')
    .pipe(replace(/<link (rel="stylesheet" )?href="\/assets\/css\/application.css"[^>]*>/, function(s) {
      var style = fs.readFileSync('public/assets/css/application.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(gulp.dest('public/'));
});

// version assets
gulp.task('revision', function() {
  return gulp.src('public/assets/**/*')
    .pipe(rev())
    .pipe(gulp.dest('public/assets/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./'));
});

// fingerprint assets
gulp.task('fingerprint', ['revision'], function() {
  var manifest = gulp.src('./rev-manifest.json');

  return gulp.src('public/**/*.html')
    .pipe(revReplace({manifest: manifest}))
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
  return gulp.src(['public/assets/css', 'public/assets/js', 'public/assets/images', 'public/assets/fonts'], {read: false})
    .pipe(clean());
});

// clear cache
gulp.task('clear', function (done) {
  return cache.clearAll(done);
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
  gulp.watch("themes/worldly/assets/js/**/*", ['scripts']);
  gulp.watch("themes/worldly/assets/images/**/*", ['images']);
  gulp.watch("public/**/*.html", ['html']);
});

// default task
gulp.task('default', ['clean'], function() {
  runSequence('lint', ['styles', 'scripts', 'images-resize', 'fonts'], 'images', 'browser-sync', 'watch');
});

gulp.task('build', ['clean'], function() {
  runSequence(['styles', 'scripts', 'images-resize', 'fonts'], 'images', 'inline-css', 'fingerprint', 'gzip');
});
