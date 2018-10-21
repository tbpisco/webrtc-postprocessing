var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var copy = require('gulp-copy');
var removeHtmlComments = require('gulp-remove-html-comments');
 

gulp.task('copy-html', function() {
    gulp.src('./src/index.html')
        .pipe(removeHtmlComments())
        .pipe(gulp.dest('./client/'));
});

gulp.task('copy-js', function() {
    return gulp.src(['node_modules/babel-polyfill/dist/polyfill.js','./src/js/**/*.js'])
        .pipe(babel({
            presets: ['babel-preset-env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('client/js'));
});

gulp.task('image', function () {
    return gulp.src('./src/images/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('./client/images/'));
});

gulp.task('copy-css', function () {
    gulp.src('./src/css/*.css')
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build', ['copy-css','image','copy-js','copy-html']);