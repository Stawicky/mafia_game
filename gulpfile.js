const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");
const kit = require('gulp-kit');
const browserSync = require("browser-sync").create();

const paths = {
  sass: "./src/sass/**/*.scss",
  js: "./src/js/**/*.js",
  img: "./src/img/*",
  dist: "./dist",
  sassDest: "./dist/css",
  jsDest: "./dist/js",
  imgDest: "./dist/img",
  html: './html/**/*.kit'
};

function buildStyles(done) {
  src(paths.sass)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(dest("./src"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cssnano())
    .pipe(dest(paths.sassDest));
  done();
}

function buildJS(done) {
  src(paths.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(paths.jsDest));
  done();
}

function minifyImage(done) {
  src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest));
  done();
}

function handleKits(done) {
  src(paths.html)
  .pipe(kit())
  .pipe(dest('./'))
    done()
}

function cleanStuff(done) {
  src(path.disc, { read: false }).pipe(clean());
  done();
}

function startBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

function watchForChanges(done) {
  watch("./*html").on("change", browserSync.reload);
  watch([paths.html, paths.js, paths.sass], parallel(handleKits, buildStyles, buildJS)).on(
    "change",
    browserSync.reload
  );
  watch(paths.img, minifyImage).on("change", browserSync.reload);
  done();
}

const mainFunctions = parallel(handleKits ,buildStyles, buildJS, minifyImage);
exports.cleanStuff = cleanStuff
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
