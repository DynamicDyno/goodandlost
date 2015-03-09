var gulp = require('gulp'),
   uglify = require('gulp-uglify');

gulp.task('minify', function () {
   gulp.src('themes/worldly/static/js/application.js')
      .pipe(uglify())
      .pipe(gulp.dest('build'))
});
