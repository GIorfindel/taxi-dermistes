var gulp = require('gulp');
var browserSync = require('browser-sync');
var nunjucksRender = require('gulp-nunjucks-render'); // importing the plugin

gulp.task('serve', function() {
    console.log('running server');
    browserSync({
        server: {
            baseDir: 'src/resource'
        }
    });
});

// writing up the gulp nunjucks task
gulp.task('nunjucks', function() {
    console.log('nunjucking');

    // configuring the templates folder for nunjucks
    nunjucksRender.nunjucks.configure(['src/resource/templates/']);

    // get the pages files
    gulp.src('src/resource/pages/*.+(html)')
        .pipe(nunjucksRender({
            path: ['src/resource/templates/'],
            watch: false,
        }))
        .pipe(gulp.dest('src/resource/'))

    gulp.src('src/resource/pages/admin/*.+(html)')
        .pipe(nunjucksRender({
            path: ['src/resource/templates/'],
            watch: false,
        }))
        .pipe(gulp.dest('src/resource/admin'))
});

//default task to be run with gulp
gulp.task('default', ['serve']);
