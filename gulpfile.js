var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
		notify				= require('gulp-notify'),
    log           = require('fancy-log'),
		fs						= require('fs'),
    replace       = require('gulp-replace'),
		copy					= require('gulp-copy'),
		rename				= require('gulp-rename'),
    renameRegex   = require('gulp-regex-rename'),
    sourcemaps    = require('gulp-sourcemaps'),
    sass          = require('gulp-sass'),
    scsslint      = require('gulp-scss-lint'),
		gcmq					= require('gulp-group-css-media-queries'),
		minifycss			= require('gulp-uglifycss'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    jshint        = require('gulp-jshint'),
		stylish				= require('jshint-stylish-notifier'),
    uglify        = require('gulp-uglify'),
    filter        = require('gulp-filter'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    del           = require('del'),
    browserSync   = require('browser-sync'),
    cp            = require('child_process');

var paths = {
  node_modules: 'node_modules/',
  includes: '_includes/',
  src: 'assets/',
  build: 'dist/',
  site: '_site/',
  jekyllDestinationPrefix: ''
};

function logthis(message) {
  log.info(gutil.colors.yellow('=============='));
  log.info(gutil.colors.yellow(message));
  log.info(gutil.colors.yellow('=============='));
}

gulp.task('jekyll-build', function(done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function(cb) {
  browserSync.reload();
  cb();
}));

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: paths.site
    },
    open: false
  });
});

function sassOpps(files, destination) {
  return gulp.src(files)
    // .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact'
    }).on('error', function(error) {
      return notify().write(error);
    }))
    .pipe(autoprefixer({
      browsers: ['last 10 versions', 'ie 9'],
      errLogToConsole: true,
      sync: true
    }))
    .pipe(gcmq())
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
    .pipe(browserSync.reload({
      stream: true
    }));
}

gulp.task('sass', function() {
  return sassOpps(paths.src + 'style/style.scss', paths.includes);
});

function jsOpps(files, destination, concatName) {
  return gulp.src(files)
    // .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat(concatName))
    .pipe(uglify())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
    .pipe(browserSync.reload({
      stream: true
    }));
}

gulp.task('js', function() {
  return jsOpps([
      paths.src + 'scripts/vendor/**/*.js',
      paths.src + 'scripts/main.js'
    ],
    paths.includes,
    'scripts.min.js'
  );
});

gulp.task('images', function() {
  return gulp.src(paths.src + 'images/**/*.{png,gif,jpg,jpeg,svg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('assets', gulp.parallel('sass', 'js', 'images'));
gulp.task('watch', function() {
  gulp.watch(paths.src + 'style/**/*', gulp.series('sass', 'jekyll-rebuild'));
  gulp.watch(paths.src + 'scripts/**/*', gulp.series('js', 'jekyll-rebuild'));
  gulp.watch(paths.src + 'images/**/*', gulp.series('images', 'jekyll-rebuild'));
  gulp.watch(['index.html', '_includes/**/*.html', '**/*.yml'], gulp.series('jekyll-rebuild'));
});
gulp.task('build', gulp.series('assets', 'jekyll-build', 'browser-sync'));
gulp.task('dev', gulp.parallel('build', 'watch'));
gulp.task('default', gulp.series('dev'));
