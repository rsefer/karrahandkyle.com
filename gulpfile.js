var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
		browserSync		= require('browser-sync').create(),
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
		svgSymbols		= require('gulp-svg-symbols'),
		stylish				= require('jshint-stylish-notifier'),
    uglify        = require('gulp-uglify-es').default, // gulp-uglify
    filter        = require('gulp-filter'),
    imagemin      = require('gulp-imagemin'),
    del           = require('del'),
    cp            = require('child_process');

var paths = {
	node_modules: 'node_modules/',
  src: '',
  assets: 'assets/',
  build: 'dist/',
	includes: '_includes/',
	site: '_site/'
};

function logthis(message) {
  log.info(gutil.colors.yellow('=============='));
  log.info(gutil.colors.yellow(message));
  log.info(gutil.colors.yellow('=============='));
}

gulp.task('jekyll-build', function() {
	return cp.spawn('jekyll', ['build'], ['--incremental'], {
		stdio: 'inherit'
	});
});

gulp.task('jekyll-rebuild', function() {
	browserSync.reload();
});

function sassOpps(files, destination) {
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact'
    }).on('error', function(error) {
      return notify().write(error);
    }))
    .pipe(autoprefixer({
      errLogToConsole: true,
      sync: true
    }))
    .pipe(gcmq())
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
    .pipe(browserSync.stream());
}

gulp.task('sass', function() {
  return sassOpps(paths.assets + 'style/style.scss', paths.includes);
});

function jsOpps(files, destination, concatName) {
  return gulp.src(files)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat(concatName))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination));
}

gulp.task('js', function() {

  gulp.src(paths.assets + 'scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));

  return jsOpps([
      paths.node_modules + 'vanilla-lazyload/dist/lazyload.js',
      paths.node_modules + 'classlist.js/classList.js',
			paths.node_modules + 'smooth-scroll/dist/smooth-scroll.js',
			paths.node_modules + 'smooth-scroll/dist/smooth-scroll.polyfills.js',
      paths.assets + 'scripts/vendor/**/*.js',
      paths.assets + 'scripts/main.js'
    ],
    paths.includes,
    'scripts.min.js'
  );

});

gulp.task('images', function() {
  return gulp.src(paths.assets + 'images/**/*')
		.pipe(imagemin([
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeTitle: false },
					{ mergePaths: false },
					{ removeViewBox: false }
				]
			})
		]))
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('svgs', function() {
	return gulp.src(paths.build + 'images/svgs/**/*.svg')
		.pipe(svgSymbols({
      svgAttrs: {
        class: 'svg-dump'
      }
    }))
		.pipe(gulp.dest(paths.includes));
});

gulp.task('videos', function() {
	return gulp.src(paths.assets + 'videos/**/*')
    .pipe(gulp.dest(paths.build + 'videos'));
});

gulp.task('fonts', function() {
	return gulp.src(paths.assets + 'fonts/**/*')
    .pipe(gulp.dest(paths.build + 'fonts'));
});

gulp.task('reload', function(done) {
	browserSync.reload();
	done();
	return;
});

function watches() {
	gulp.watch([
		paths.src + '*.html',
		paths.src + '_includes/*.html',
		paths.src + '_layouts/*.html'
	], gulp.series('jekyll-build', 'reload'));
  gulp.watch(paths.assets + 'style/**/*', gulp.series('sass', 'jekyll-build', 'reload'));
  gulp.watch(paths.assets + 'scripts/**/*', gulp.series('js', 'jekyll-build', 'reload'));
  gulp.watch(paths.assets + 'images/**/*', gulp.series('images', 'svgs', 'jekyll-build', 'reload'));
	// gulp.watch(paths.assets + 'videos/**/*', gulp.series('videos', function(done) {
	// 	browserSync.reload();
	// 	done();
	// }));
  // gulp.watch(paths.assets + 'fonts/**/*', gulp.series('fonts', function(done) {
	// 	browserSync.reload();
	// 	done();
	// }));
}

gulp.task('build', gulp.series(gulp.parallel('sass', 'js', 'images', 'videos', 'fonts'), 'svgs', 'jekyll-build'));
gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: paths.site
		},
		https: {
			key: '/Users/rsefer/.localhost-ssl/server.key',
			cert: '/Users/rsefer/.localhost-ssl/server.crt'
		},
		open: false,
		injectChanges: true,
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
				borderRadius: '5px 0px 0px'
			}
		}
	});
	watches();
});
gulp.task('default', gulp.series('build', 'watch'));
