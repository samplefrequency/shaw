const path = require("path");
const gulp = require("gulp");
const banner = require("gulp-banner");
const babel = require("gulp-babel");
const babelify = require("babelify");
const bro = require("gulp-bro");
const jest = require("gulp-jest").default;
var pkg = require("./package.json");
const config = require("./config");

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
  return gulp.src(path.resolve(__dirname, "src/js/**/*.test.js")).pipe(
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

gulp.task("move-fonts", () => {
  gulp
    .src(path.resolve(__dirname, "src/fonts/**/*"))
    .pipe(gulp.dest(path.resolve(__dirname, "dist/fonts")));
});
gulp.task("copy-to-http", () => {
  gulp
    .src(path.resolve(__dirname, "dist/js/analytics/index.js"))
    .pipe(gulp.dest(path.resolve(__dirname, "/Applications/XAMPP/xamppfiles/htdocs/analytics/")));
});

gulp.task("build", ["move-fonts", "jest", "js", "copy-to-http"]);

gulp.task("default", ["build"], () => {
  gulp.watch(path.resolve(__dirname, "src/js/**/*.js"), ["jest", "js", "copy-to-http"]);
});

