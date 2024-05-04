const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
    return src('./src/Style/main.scss').pipe(sass()).pipe(dest('./src/css'));
}

function watchTask() {
    watch(['./src/Style'], buildStyles);
}

exports.default = series(buildStyles, watchTask);