
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Minify CSS
gulp.task('minicss', function() {
    gulp.src('./src/style/main.css')
      .pipe(minifyCss())
      .pipe(gulp.dest('./dist/style'));
});

gulp.task('copylib',[], function(){
    return gulp.src(['src/js/lib/**/*.js'])
        .pipe(gulp.dest('dist/js/lib'));
});

// Minify HTML
gulp.task('minihtml', function() {
    gulp.src('./src/index.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('./dist'));
});

// COpy images
gulp.task('copyImg', function() {
    gulp.src('./src/img/**/**')
      .pipe(gulp.dest('./dist/img'));
});

gulp.task('build', function(){
    return browserify({
        entries: ['./src/js/main.js']
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/js'))
    ;
});

gulp.task('watch', () => {
    gulp.watch('src/js/**/*.js', ['copylib', 'build']);
    gulp.watch('src/style/*.css', ['minicss']);
});

// Default
gulp.task('default', ['watch','minicss', 'build', 'minihtml', 'copylib', 'copyImg'], function() {
    // watch for HTML changes
    gulp.watch('./src/index.html', function() {
        gulp.run('minihtml');
    });
});