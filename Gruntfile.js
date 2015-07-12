/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/utils/Deferred.js',
            'src/utils/Promise.js',
            'src/utils/PromiseCollection.js',
            'src/utils/QPromiseCollection.js',
            'src/utils/PromiseLoop.js',
            'src/utils/Location.js',
            'src/utils/Throttler.js',
            'src/service/serviceEventSpace.js',
            'src/service/Endpoint.js',
            'src/service/Request.js',
            'src/service/ServiceEvent.js',
            'src/service/Service.js',
            'src/image/imageEventSpace.js',
            'src/image/ImageUrl.js',
            'src/image/ImageEvent.js',
            'src/image/ImageLoader.js',
            'src/filesystem/fileSystemEventSpace.js',
            'src/filesystem/FilePath.js',
            'src/filesystem/FileEvent.js',
            'src/filesystem/File.js',
            'src/exports.js'
        ],

        test: [
            'src/utils/jsTestDriver.conf',
            'src/service/jsTestDriver.conf',
            'src/image/jsTestDriver.conf',
            'src/filesystem/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
