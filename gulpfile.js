var gulp = require('gulp');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var packageJson = require('./package.json');
var conn = require('gulp-connect');

/**************************************************
 *      VARIABLES AND SHORTCUTS
 **************************************************/

var paths = {
    dist: packageJson.directories.dist,
    app: packageJson.directories.app,
    version: packageJson.version + '/',
    minFile: packageJson.appFiles.compressed,
    file: packageJson.appFiles.uncompressed,
    dependencies: packageJson.appFiles.deps,
    vendor: packageJson.directories.vendor,
    application: packageJson.directories.application,
    design: packageJson.directories.design,
    src: packageJson.directories.src,
    static: packageJson.directories.static,
    root: packageJson.directories.root,
    targetFiles: packageJson.directories.targetFiles
};

var files = [
    paths.app + 'app.js',
    paths.app + 'router/app.router.js',
    paths.app + 'config/app.config.js',
    paths.static + 'temp/templates.min.js', // TODO: path into package.json
    paths.app + 'modules/**/*.module.js',
    paths.app + 'modules/**/*.js'
];

var vendor = [
];

var designVendor = [
    paths.vendor + 'bootstrap/stylesheets/bootstrap.scss',
    paths.vendor + 'toastr/toastr.scss'
];

var templates = paths.app + '**/*.html';

/**************************************************
 *      APPLICATION TASKS
 **************************************************/

gulp.task('clean:all', function (cb) {
    return gulp.src(paths.dist + paths.version)
        .pipe(clean({force: true}, cb));
});

gulp.task('clean:app', function (cb) {
    return gulp.src(paths.dist + paths.version + paths.application)
        .pipe(clean({force: true}, cb));
});

gulp.task('clean:design', function (cb) {
    return gulp.src(paths.dist + paths.version + '/design')
        .pipe(clean({force: true}, cb));
});

gulp.task('clean:vendor', function (cb) {
    return gulp.src(paths.dist + paths.version + '/vendor')
        .pipe(clean({force: true}, cb));
});

gulp.task('templates', function () {
    return gulp.src(templates)
        // .pipe(ngTemplates('templatesModule'))
        .pipe(gulp.dest(paths.static + 'temp'));
});

gulp.task('concat', ['templates'], function () {
    return gulp.src(files)
        .pipe(sourcemaps.init())
        // .pipe(ngAnnotate())
        .pipe(concat(paths.file))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.dist + paths.version + paths.application));
});

gulp.task('uglify', ['concat'], function () {
    return gulp.src(paths.dist + paths.version + paths.application + paths.file)
        // .pipe(ngAnnotate())
        .pipe(concat(paths.minFile))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + paths.version + paths.application));
});

gulp.task('uglify:deps', function () {
    return gulp.src(vendor)
       .pipe(concat(paths.dependencies))
       .pipe(uglify())
       .pipe(gulp.dest(paths.dist + paths.version + "/vendor/", {overwrite: false}));
});

/**************************************************
 *      DESIGN TASKS
 **************************************************/

gulp.task('sass:vendor', function () {
    return gulp.src(designVendor)
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(gulp.dest(paths.dist + paths.version + 'design/css'));
});

gulp.task('sass:design', function () {
    return gulp.src(paths.design + 'scss/main.scss')
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(gulp.dest(paths.dist + paths.version + 'design/css'));
});

gulp.task('copy:fonts', function () {
    return gulp.src([paths.vendor + 'bootstrap/fonts/**/*', paths.design + 'fonts/**/*'])
        .pipe(copy(paths.dist + paths.version + 'design/fonts', {prefix: 7}));
});

gulp.task('copy:images', function () {
    return gulp.src([paths.design + 'images/**/*'])
        .pipe(copy(paths.dist + paths.version + 'design/images', {prefix: 8}));
});

gulp.task('watch', function () {
    return gulp.watch(paths.src + '**', ['uglify', 'uglify:deps', 'design', 'copy:into-java']);
});

gulp.task('server', function () {
    conn.server({
        port: 9000
    });
});

/**************************************************
 *  COPY INTO JAVA PROJECT
 **************************************************/

gulp.task('copy:into-java', ['uglify', 'uglify:deps', 'design'], function () {
    return gulp.src(paths.static + '/**')
        .pipe(copy(paths.targetFiles, {prefix: 4}));
});

/**************************************************
 *      TASKS OF TASKS
 **************************************************/

gulp.task('default', ['uglify', 'uglify:deps']);
gulp.task('no-vendor', ['uglify', 'sass:design']);
gulp.task('design', ['sass:vendor', 'copy:fonts', 'copy:images', 'sass:design']);
gulp.task('dev', ['copy:into-java', 'watch']);