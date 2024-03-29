/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace-task');
var fs = require('fs');
var g = require('gulp-load-plugins')({lazy: false});
var noop = g.util.noop;
var es = require('event-stream');
var queue = require('streamqueue');
var lazypipe = require('lazypipe');
var stylish = require('jshint-stylish');
var bower = require('./bower');
var mainBowerFiles = require('main-bower-files');
var historyApiFallback = require('connect-history-api-fallback');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

var isWatching = true;

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

var settings;

// Try to read frontend configuration file, fallback to default file
try {
  settings = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
} catch (error) {
  settings = JSON.parse(fs.readFileSync('./config/config_example.json', 'utf8'));
}

/**
 * JS Hint
 */
gulp.task('jshint', function() {
  return gulp.src([
    './gulpfile.js',
    './src/app/**/*.js'
  ])
  .pipe(g.cached('jshint'))
  .pipe(jshint('./.jshintrc'))
  .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function() {
  return gulp.src('./.tmp/css').pipe(g.clean());
});

gulp.task('styles', ['clean-css'], function() {
  return gulp.src([
    './src/app/**/*.scss',
    '!./src/app/**/_*.scss'
  ])
  .pipe(g.sass())
  .pipe(gulp.dest('./.tmp/css/'))
  .pipe(g.cached('built-css'))
  .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function() {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function() {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter())
  ;
});

gulp.task('scsslint', ['styles'], function() {
  var scsslint = g.scssLint;

  return gulp.src('./src/app/**/*.scss')
    .pipe(scsslint({
      config: './scsslint.yml'
    }));
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function() {
  return appFiles().pipe(dist('js', bower.name, {ngAnnotate: true}));
});

/**
 * Templates
 */
gulp.task('templates', function() {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function() {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function() {
  var bowerStream = mainBowerFiles();

  return es.merge(
    bowerStream.pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    bowerStream.pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index() {
  var opt = {read: false};
  
//  console.log(mainBowerFiles(opt));

  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src(mainBowerFiles(opt)), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp', 'src/app']}))
    .pipe(g.embedlr())
    .pipe(replace({
      patterns: [
        {
          match: 'backendUrl',
          replacement: settings.backendUrl
        }
      ]
    }))
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload())
  ;
}

/**
 * Assets
 */
gulp.task('assets', function() {
  return gulp.src('./src/app/assets/**')
    .pipe(gulp.dest('./dist/assets'))
  ;
});

/**
 * Partials
 */
gulp.task('partials', function() {
  return gulp.src('./src/app/partials/**')
    .pipe(gulp.dest('./dist/partials'))
  ;
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
  return gulp.src('./bower_components/fontawesome/fonts/**')
    .pipe(gulp.dest('./dist/fonts'))
  ;
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'fonts', 'styles-dist', 'scripts-dist'], function() {
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {
      ignorePath: 'dist',
      starttag: '<!-- inject:vendor:{{ext}} -->'
    }))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(replace({
      patterns: [
        {
          match: 'backendUrl',
          replacement: settings.backendUrl
        }
      ]
    }))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'))
  ;
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
  port: settings.frontend.ports.development,
  root: ['./.tmp', './src/app', './bower_components'],
  middleware: historyApiFallback({})
}));

/**
 * Production file server, note remember to run 'gulp dist' first!
 */
gulp.task('production', g.serve({
  port: settings.frontend.ports.production,
  root: ['./dist'],
  middleware: historyApiFallback({})
}));

/**
 * Watch
 */
gulp.task('serve', ['watch1']);

gulp.task('watch1', ['statics', 'default'], function() {
  isWatching = true;

  // Initiate livereload server:
  g.livereload();
  
//     console.log('HERE!!!!');
//    watch('./src/app/**/*.js', { usePolling: true }, function(file) {
//     console.log(file);
//  });

  watch('./src/app/**/*.js', { usePolling: true, interval: 50 }, function() {
        return gulp.start('jshint');
    }).on('change', function(evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });

  watch('./src/app/index.html', { usePolling: true }, function() { 
      gulp.start(['index']);
  });
  watch(['./src/app/**/*.html', '!./src/app/index.html'], { usePolling: true, interval: 20 }, function() {
    gulp.start(['templates']);
  });
  
  watch(['./src/app/**/*.scss'], { usePolling: true, interval: 20 }, function() {
      return gulp.start(['csslint', 'scsslint']);
    }).on('change', function(evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
  
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint', 'scsslint']);

/**
 * Test
 */
gulp.task('test', ['templates'], function() {
  return testFiles()
    .pipe(g.karma({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }))
  ;
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function() {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function(filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'))
  ;
});

/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(gulp.src(mainBowerFiles()).pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src('./src/app/**/*_test.js'))
    .done()
  ;
}

/**
 * All CSS files as a stream
 */
function cssFiles(opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles() {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './src/app/**/*.js',
    '!./src/app/**/*_test.js'
  ];

  return gulp.src(files)
    .pipe(g.angularFilesort())
  ;
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles(opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop())
  ;
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates() {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name + '-templates',
      prefix: '/' + bower.name + '/',
      stripPrefix: '/src/app'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)()
  ;
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist(ext, name, opt) {
  opt = opt || {};

  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')()
  ;
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload() {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)()
  ;
}

/**
 * Jshint with stylish reporter
 */
function jshint(jshintfile) {
  // Read JSHint settings, for some reason jshint-stylish won't work on initial load of files
  var jshintSettings = JSON.parse(fs.readFileSync(jshintfile, 'utf8'));

  return lazypipe()
    .pipe(g.jshint, jshintSettings)
    .pipe(g.jshint.reporter, stylish)()
  ;
}
