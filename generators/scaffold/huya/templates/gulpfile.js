const gulp = require('gulp');
var webserver = require('gulp-webserver');
const fem = require('gulp-fed-fem');

gulp.task('default', function () {
    gulp.src('*.html', { base: './' })
        .pipe(fem({ pro: 'huya' }))
        .pipe(gulp.dest('build'));
});

gulp.task('server', function () {
    gulp.src('assets')
        .pipe(webserver({
            liveload: true,
            directoryListing: true,
            open: true
        }));
});