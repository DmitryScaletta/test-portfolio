const gulp         = require('gulp')

const sass         = require('gulp-sass')
const csso         = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const babel        = require('gulp-babel')
const uglify       = require('gulp-uglifyjs')
const inlinesource = require('gulp-inline-source')
const minifyMarkup = require('gulp-htmlmin')
const imagemin     = require('gulp-imagemin')
const cache        = require('gulp-cache')

const browserSync  = require('browser-sync').create()
const pngquant     = require('imagemin-pngquant')

const http         = require('http')
const st           = require('st')
const del          = require('del')


const SOURCE_FOLDER = './src'
const OUTPUT_FOLDER = './dist'

gulp.task('styles', () => {
	return gulp
		.src(`${SOURCE_FOLDER}/sass/**/*.scss`)
		.pipe(sass({
			// outputStyle: 'compressed',
			// indentedSyntax: true,
			includePaths: [
				'node_modules/flexboxgrid-sass',
				'node_modules/normalize-scss/sass',
			],
		}).on('error', sass.logError))
		.pipe(autoprefixer('last 4 versions', 'ie 11'))
		.pipe(csso())
		.pipe(gulp.dest(`${OUTPUT_FOLDER}/css`))
		.pipe(browserSync.stream())
})

gulp.task('scripts', function() {
	return gulp
		.src(`${SOURCE_FOLDER}/js/**/*.js`)
		.pipe(babel({
			presets: ['es2015']
		}))
		// .pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest(`${OUTPUT_FOLDER}/js`))
})

gulp.task('markup', () => {
	return gulp
		.src(`${SOURCE_FOLDER}/*.html`)
		.pipe(gulp.dest(OUTPUT_FOLDER))
})

gulp.task('images', () => {
	return gulp
		.src(`${SOURCE_FOLDER}/img/**/*`)
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(`${OUTPUT_FOLDER}/img/`))
})

gulp.task('fonts', () => {
	return gulp
		.src(`${SOURCE_FOLDER}/fonts/**/*`)
		.pipe(gulp.dest(`${OUTPUT_FOLDER}/fonts/`))
})

gulp.task('clean', function() {
	return del.sync('dist');
})

gulp.task('build', ['clean', 'scripts', 'styles', 'images', 'fonts'], () => {
	return gulp
		.src(`${SOURCE_FOLDER}/*.html`)
		.pipe(inlinesource({
			compress: false,
			rootpath: OUTPUT_FOLDER
		}))
		.pipe(minifyMarkup({
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeComments: true,
			removeRedundantAttributes: true,
		}))
		.pipe(gulp.dest(OUTPUT_FOLDER))
})

gulp.task('default', ['build'])

gulp.task('browser-sync', function() {
	browserSync.init({
		server: OUTPUT_FOLDER,
		notify: false
	})
})

gulp.task('watch', ['browser-sync', 'markup', 'styles', 'scripts'], function() {
	gulp.watch(`${SOURCE_FOLDER}/sass/**/*.scss`, ['styles'])
	gulp.watch(`${SOURCE_FOLDER}/*.html`,         ['markup',  browserSync.reload])
	gulp.watch(`${SOURCE_FOLDER}/js/**/*.js`,     ['scripts', browserSync.reload])
})