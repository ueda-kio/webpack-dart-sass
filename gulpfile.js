
const gulp = require('gulp');
const {ejsCompile} = require('./gulp.tasks');
const {pathDevRoot, pathResourceRoot} = require('./gulp.config');

const buildTasks = gulp.series(ejsCompile);
const watch = () => {
  gulp.watch([`${pathDevRoot}/**/*.ejs`, `${pathResourceRoot}/**/*.ejs`], gulp.parallel(ejsCompile));
};

exports.default = gulp.series(buildTasks, watch);