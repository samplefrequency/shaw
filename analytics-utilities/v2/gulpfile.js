const path = require("path");
const gulp = require("gulp");
const banner = require("gulp-banner");
const babel = require("gulp-babel");
const babelify = require("babelify");
const bro = require("gulp-bro");
const jest = require("gulp-jest").default;
var pkg = require("./package.json");
const config = require("./config");
var browserSync = require('browser-sync').create();


const comment =
  "/*\n" +
  " * <%= pkg.name %> <%= pkg.version %>\n" +
  " * <%= pkg.description %>\n" +
  " *\n" +
  " * Copyright " +
  new Date().getFullYear() +
  ", <%= pkg.author %>\n" +
  " * Released under the <%= pkg.license %> license.\n" +
  "*/\n\n";

gulp.task("jest", function() {
  return gulp.src(path.resolve(__dirname, "src/js")).pipe(
    jest({
      preprocessorIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/"
      ],
      config: "jest.config.js"
    })
  );
});

gulp.task("js", () => {
  return gulp
    .src(path.resolve(__dirname, config.analytics.src + "index.js"))
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["es2015"] }),
          ["uglifyify", { global: true }]
        ]
      })
    )
    .pipe(
      banner(comment, {
        pkg: pkg
      })
    )
    .pipe(gulp.dest(path.resolve(__dirname, config.analytics.dist)));
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: './',
          index: config.analytics.src + "browser/index.html"
      }
  });
});

gulp.task('browser-build-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});

gulp.task("build", ["js", "browser-sync", "jest"]);


gulp.task("default", ["build"], () => {
  gulp.watch(path.resolve(__dirname, "src/js/**/**.js"), ["js", "browser-build-watch", "jest"]);
  gulp.watch(path.resolve(__dirname, "src/js/**/**/*.html"), ["browser-build-watch", "jest"]);
});
