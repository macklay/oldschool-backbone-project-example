var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var url = require('url');

var config = {
  buildDir: './build',
  defaultFile: 'index.html'
};

gulp.task('default', [
  'browser-sync',
  'vendors:js',
  'vendors:css',
  'app:html',
  'app:js',
  'app:css',
  'watcher'
], function() {

});

gulp.task('watcher', function() {
  gulp.watch('./app/client/**/*.css', ['app:css']);
  gulp.watch('./app/client/**/*.js', ['app:js']);
  gulp.watch('./app/client/**/*.html', ['app:html']);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: config.buildDir,
      middleware: function(req, res, next) {
        var fileName = url.parse(req.url);
        var fileNames = fileName.href.split(fileName.search).join("");
        if (!~fileName.href.indexOf('.') && fileNames.indexOf("browser-sync-client") < 0) {
          req.url = "/" + config.defaultFile;
        }
        return next();
      }
    }
  });
});

gulp.task('app:html', function () {
  return gulp.src('./app/client/**/*.html')
    .pipe(gulp.dest(config.buildDir))
    .pipe(browserSync.stream());
});

gulp.task('app:js', function() {
  return gulp.src([
      './app/client/App.js',
      './app/client/config.js',
      './app/client/modules/site/core/sync.js',
      './app/client/modules/site/core/WidgetView.js',
      './app/client/modules/site/core/**/*.js',
      './app/client/modules/**/models/**/*.js',
      './app/client/modules/**/collections/**/*.js',
      './app/client/modules/**/layouts/**/*.js',
      './app/client/modules/site/layouts/default/DefaultLayout.js',
      './app/client/**/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.buildDir + '/js'))
    .pipe(browserSync.stream());
});

gulp.task('app:css', function() {
  return gulp.src('./app/client/**/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest(config.buildDir + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('vendors:js', function() {
  return gulp.src(mainBowerFiles({
    filter:'**/*.js',
    paths: {
      bowerDirectory: './bower_components',
      bowerrc: './.bowerrc',
      bowerJson: './bower.json'
    }
  }))
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(config.buildDir + '/js'));
});

gulp.task('vendors:css', function() {
  return gulp.src(mainBowerFiles({
    filter:'**/*.css',
    paths: {
      bowerDirectory: './bower_components',
      bowerrc: './.bowerrc',
      bowerJson: './bower.json'
    }
  }))
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest(config.buildDir + '/css'));
});