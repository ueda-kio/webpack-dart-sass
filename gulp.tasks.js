
const gulp = require('gulp');
const {pathDevRoot, pathRoot, project} = require('./gulp.config');

// EJS
const gulpEjs = require('gulp-ejs');

// Utility
const del = require('del');
const gulpPlumber = require('gulp-plumber');
// const browserSync = require('browser-sync').create();
const gulpRename = require('gulp-rename');
const gulpLineEndingCorrector = require('gulp-line-ending-corrector');
const gulpData = require('gulp-data');
const gulpCache = require('gulp-cached');
const path = require('path');

module.exports = {
  ejsCompile() {
      return gulp.src([
          `${pathDevRoot}/**/*.ejs`,
          `src/**/*.ejs`,
          `!${pathDevRoot}/**/_*.ejs`,
          `!src/**/_*.ejs`,
      ])
          .pipe(gulpPlumber())
          .pipe(gulpCache('ejs-cache'))
          .pipe(gulpData(file => { // eslint-disable-line
              return {
                  dirname: path.dirname(file.path),
              };
          }))
          .pipe(gulpEjs({}, {}, {ext: '.html'}))
          .pipe(gulpRename({extname: '.html'}))
          .pipe(gulpLineEndingCorrector(project))
          .pipe(gulp.dest(pathRoot));
  },

  async clean(done) {
      await del(pathRoot);

      done();
  },

  copy() {
      return gulp.src(`static/**/*`)
          .pipe(gulp.dest(pathRoot));
  },
};