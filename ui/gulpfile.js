'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify-es').default;
var inlinesource = require('gulp-inline-source');
var gzip = require('gulp-gzip');
const urlPrefixer = require('gulp-url-prefixer');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var replace = require('gulp-string-replace');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src(['./src/styles.css'])
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      // Minify the file
      .pipe(csso())
      .pipe(gzip())
      // Output
      .pipe(gulp.dest('./build'))
  });

  gulp.task('styles_ext', function () {
    return gulp.src(['./src/bulma.min.css'])
      .pipe(gzip())
      .pipe(gulp.dest('./build'));
  });

  gulp.task('scripts', function () {
    return gulp.src('./webpack/*.js')
      .pipe(gzip())
      .pipe(gulp.dest('./build'))
  });

  gulp.task('pages', function() {
    return gulp.src(['./src/index.htm'])
      .pipe(rename('index.dev.htm'))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gzip())
      .pipe(gulp.dest('./build'));
  });

gulp.task('pagesinline', function() {
    return gulp.src(['./src/index.htm'])
      .pipe(replace('http://localhost:8080/src/styles.css', '/styles.css.gz'))
      .pipe(replace('http://localhost:8080/webpack/app.js', '/app.js.gz'))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gzip())
      .pipe(gulp.dest('./build'));
  });

gulp.task('copytospiffs', function () {
  gulp.src(['./build/index.htm.gz', './build/index.dev.htm.gz', './build/app.js.gz', './build/styles.css.gz', './build/bulma.min.css.gz', './build/iconpicker.js.gz']).pipe(gulp.dest('../data/'))
});

// Gulp task to minify all files
gulp.task('default', function () {
  runSequence(
    'styles',
    'styles_ext',
    'scripts',
    'pages',
    'pagesinline',
    'copytospiffs'
  );
});