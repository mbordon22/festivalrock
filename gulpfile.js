const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-dart-sass');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

//Utilidades CSS
const autoprefixer = require("autoprefixer");   //Optimiza el css
const postcss = require("gulp-postcss");    //Optimiza el css
const cssnano = require("cssnano"); //Optimiza el css
const sourcemaps = require("gulp-sourcemaps");  //Nos indica en que archivo de SASS modificar el css.


//Utilidades JS
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");

const paths = {
    imagenes: "src/img/**/*",
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.js"
}



//funcion que compila SASS

function css(){
    return src(paths.scss)
        .pipe( sourcemaps.init() )
        .pipe( sass())
        .pipe( postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.') )
        .pipe( dest("./build/css") )
}

function javascript(){
    return src(paths.js)
        .pipe( sourcemaps.init() )
        .pipe( concat('bundle.js'))
        .pipe( terser())
        .pipe( sourcemaps.write('.'))
        .pipe( rename({ suffix: '.min'}))
        .pipe( dest('./build/js'))
}

function imagenes(){
    return src(paths.imagenes)
        .pipe( imagemin() )
        .pipe( dest('./build/img'))
}

function versionWebp(){
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe( dest("./build/img"))
}

//Escucho los cambios que se realicen en el archivo scss y ejecutamos la tarea css.
function watchArchivos(){
    watch(paths.scss, css); //* = carpeta actual -- ** = todos los archivos con esa extension
    watch(paths.js, javascript);
}

exports.css = css;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series( css, javascript, imagenes, versionWebp, watchArchivos);
