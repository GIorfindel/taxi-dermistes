'use strict'

let gulp = require('gulp')
let nunjucksRender = require('gulp-nunjucks-render') // importing the plugin

gulp.task('serve', () => {
    console.log('running server')
})

// writing up the gulp nunjucks task
gulp.task('nunjucks', () => {
    console.log('nunjucking')

    // configuring the templates folder for nunjucks
    nunjucksRender.nunjucks.configure(['src/resource/templates/'])

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
})

//default task to be run with gulp
gulp.task('default', ['serve'])
