/*jslint node: true */
/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    zip = require('gulp-zip'),
    yarn = require('gulp-yarn'),
    copy = require('gulp-copy'),
    del = require('del'),
    awspublish = require('gulp-awspublish'),
    gulpSequence = require('gulp-sequence'),

    BUILD_DIR = 'build',
    DIST_DIR = 'dist';

gulp.task('default', gulpSequence('clean', 'copyToBuild', 'installDeps', 'zip', 'publish'));

gulp.task('publish', function() {
    // load credentials for Bucket
    require('dotenv-safe').load({ path: '.env.devel', sample: '.env.devel.sample' });

    // create a new publisher using S3 options
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    var publisher = awspublish.create({
        params: {
            Bucket: 'portaldrazeb-cz-scraper',
        },
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    });

    // define custom headers
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
        // ...
    };

    return gulp.src('*.zip', { cwd: DIST_DIR })
        // publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))

        // create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())

        // print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('zip', function () {
    return gulp.src([ '**/*', '.*' ], { cwd: BUILD_DIR })
        .pipe(zip('portaldrazeb-cz-scraper.zip'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('installDeps', function () {
    return gulp.src(['./package.json', './yarn.lock'], { cwd: BUILD_DIR })
        .pipe(yarn({ production: true }));
});

gulp.task('copyToBuild', function () {
    var sources = [
        'lib/**/*',
        '.env',
        '.env.example',
        'lambdaparse.js',
        'lambdaupdateurls.js',
        'LICENSE',
        'package.json',
        'yarn.lock',
        'README.md'
    ];

    return gulp.src(sources)
        .pipe(copy(BUILD_DIR));
});

gulp.task('clean', function () {
    return del([
        DIST_DIR,
        BUILD_DIR
    ]);
});
