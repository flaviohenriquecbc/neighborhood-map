var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');

// Minify CSS
gulp.task('minicss', function() {
    gulp.src('./src/style/main.css')
      .pipe(minifyCss())
      .pipe(gulp.dest('./dist/style'));
});

// Minify JavaScript
gulp.task('minijs', function() {
    gulp.src('./src/js/main.js')
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'));
});

// Minify HTML
gulp.task('minihtml', function() {
    gulp.src('./src/index.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('./dist'));
});


// Default
gulp.task('default', ['minicss', 'minijs', 'minihtml'], function() {
    // watch for HTML changes
    gulp.watch('./src/index.html', function() {
        gulp.run('minihtml');
    });
});