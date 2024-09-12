"use strict";
const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const jsdoc = require("gulp-jsdoc3");
const through2 = require('through2');
const fs = require('fs');
const path = require('path'); 
const fontAwesomePath = require("@fortawesome/fontawesome-free");
// const dist = "/Applications/MAMP/htdocs/test"; // Ссылка на вашу папку на локальном сервере
const dist = "./dist";
// Шлях до Font Awesome

gulp.task("copy-html", () => {
  return gulp.src("./src/index.html").pipe(gulp.dest(dist)).pipe(browsersync.stream());
});

// Завдання для копіювання шрифтів Font Awesome
gulp.task("copy-fa-fonts", function () {
  return gulp.src(`${fontAwesomePath}/webfonts/*`).pipe(gulp.dest(`${dist}/fontawesome/webfonts`));
});

// Оновлене завдання build-sass
gulp.task("build-sass", () => {
  return gulp
    .src("./src/sass/style.scss")
    .pipe(
      sass({
        includePaths: [fontAwesomePath],
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
  return gulp
    .src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.js",
        },
        watch: false,
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        debug: true,
                        corejs: 3,
                        useBuiltIns: "usage",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist))
    .on("end", browsersync.reload);
});

gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true,
  });

  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
  gulp.watch("./src/sass/**/*.scss", gulp.parallel("build-sass"));
  gulp.watch(`${fontAwesomePath}/webfonts/*`, gulp.parallel("copy-fa-fonts"));
});

gulp.task("build", gulp.parallel("copy-html", "build-js", "build-sass", "copy-fa-fonts"));

gulp.task("prod", () => {
  gulp
    .src("./src/sass/style.scss")
    .pipe(
      through2.obj(function(file, enc, cb) {
        const content = file.contents.toString();
        const imports = content.match(/@import ['"](.*?)['"];/g);
        if (imports) {
          imports.forEach(imp => {
            const fileName = imp.match(/@import ['"](.*)['"];/)[1];
            const fullPath = path.resolve(path.dirname(file.path), fileName);
            if (!fs.existsSync(fullPath)) {
              console.error(`File not found: ${fullPath}`);
            }
          });
        }
        this.push(file);
        cb();
      })
    )
    .pipe(
      sass({
        includePaths: [fontAwesomePath, "node_modules"],
      }).on("error", function (err) {
        console.error("Sass error:", err);
        console.error("Sass error:", err.message);
        console.error("In file:", err.file);
        console.error("On line:", err.line);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist));
  gulp.src(`${fontAwesomePath}/webfonts/*`).pipe(gulp.dest(`${dist}/fontawesome/webfonts`));

  return gulp
    .src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "production",
        output: {
          filename: "script.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        corejs: 3,
                        useBuiltIns: "usage",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.series("build", "watch"));

gulp.task("doc", function (cb) {
  const config = {
    opts: {
      destination: "./docs",
    },
  };

  return gulp.src(["./src/js/**/*.js"], { read: false }).pipe(jsdoc(config, cb));
  //gulp.src(["README.md", "./src/**/*.js"], { read: false }).pipe(jsdoc(cb));
});

gulp.task("default", gulp.parallel("watch", "build"));
