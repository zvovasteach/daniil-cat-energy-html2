import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from "gulp-libsquoosh";
import webp from "gulp-webp";
import svgSprite from "gulp-svg-sprite";
import {deleteAsync} from 'del';
import browser from 'browser-sync';

// Styles
export const styles = () => {
  return gulp.src('source/sass/style.scss', {sourcemaps: true})
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("styles.min.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
}

// Scripts

export const scripts = () => {
  return gulp.src('source/js/map.js')
    .pipe(terser())
    .pipe(rename('map.min.js'))
    .pipe(gulp.dest('build/js'));

}

//Images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'))
}

// SVG
export const spriteConfig = {
  shape: {
    id: {
      separator: false
    },
  },
  mode: {
    view: {
      bust: false,
      dest: 'img',
    },
    symbol: false,
  }
};

export const sprite = () => {
  return gulp.src('source/**/*.svg')
    .pipe(svgSprite(spriteConfig))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
}

//Copy

export const copy = (done) => {
  gulp.src([
      'source/fonts/*.{woff,woff2}',
      'source/img/favicon/*.ico',
      'source/manifest.webmanifest',
    ], {
      base: 'source'
    }
  )
    .pipe(gulp.dest('build'));
  done();
}

//Clean
export const clean = () => {
  return deleteAsync('build');
}
// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}
// Watcher

export const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/map.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}
//Build

export const build =
  gulp.series(
    clean,
    copy,
    optimizeImages,
    gulp.parallel(
      styles,
      html,
      scripts,
      sprite,
      createWebp
    ),
  );

//

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
