(function () {
    "use strict";

    module("File");

    test("Instantiation", function () {
        throws(function () {
            $transport.File.create();
        }, "should raise exception on no arguments");

        throws(function () {
            $transport.File.create('foo');
        }, "should raise exception on invalid argument");

        var filePath = 'foo/bar'.toFilePath(),
            file = $transport.File.create(filePath);

        strictEqual(file.filePath, filePath, "should set filePath property");
        strictEqual(file.eventPath, filePath.eventPath, "should set eventPath property");
    });

    test("Conversion from FilePath", function () {
        var filePath = 'foo/bar'.toFilePath(),
            file = filePath.toFile();

        ok(file.isA($transport.File), "should return an File instance");
        strictEqual(file.filePath, filePath, "should set filePath property to self");
    });

    test("Successful file loading", function () {
        expect(13);

        var file = 'foo/bar'.toFilePath().toFile();

        file.addMocks({
            _readFileProxy: function (filename, options, callback) {
                equal(filename, 'foo/bar', "should pass file path to readFile()");
                strictEqual(options, null, "should pass null as options to readFile()");
                equal(typeof callback, 'function', "should pass callback to readFile()");
                callback(null, 'fileContents');
            }
        });

        'foo/bar'.toFilePath()
            .subscribeTo($transport.EVENT_FILE_READ_START, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load start event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger start event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
            })
            .subscribeTo($transport.EVENT_FILE_READ_SUCCESS, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load success event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger success event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
                strictEqual(event.fileData, 'fileContents',
                    "should set event's fileData to fetched contents");
            });

        file.readFile()
            .then(function (event) {
                ok(event.isA($transport.FileEvent), "should return promise resolved with the success event");
                strictEqual(event.filePath, file.filePath, "should pass filePath to promise");
                equal(event.fileData, 'fileContents', "should pass file contents to resolved promise");
            });

        'foo/bar'.toFilePath().unsubscribeFrom();
    });

    test("Unsuccessful file loading", function () {
        expect(10);

        var file = 'foo/bar'.toFilePath().toFile(),
            error = new Error();

        file.addMocks({
            _readFileProxy: function (filename, options, callback) {
                equal(filename, 'foo/bar', "should pass file path to readFile()");
                strictEqual(options, null, "should pass null as options to readFile()");
                equal(typeof callback, 'function', "should pass callback to readFile()");
                callback(error);
            }
        });

        'foo/bar'.toFilePath()
            .subscribeTo($transport.EVENT_FILE_READ_FAILURE, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load success event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger success event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
                strictEqual(event.fileError, error,
                    "should set event's fileError to the callback's error");
            });

        file.readFile()
            .then(null, function (event) {
                ok(event.isA($transport.FileEvent), "should return promise resolved with the failure event");
                strictEqual(event.filePath, file.filePath, "should pass filePath to promise");
                equal(event.fileError, error, "should pass error to rejected promise");
            });

        'foo/bar'.toFilePath().unsubscribeFrom();
    });

    test("Successful synchronous file read", function () {
        expect(10);

        var file = 'foo/bar'.toFilePath().toFile();

        file.addMocks({
            _readFileSyncProxy: function (filename, options) {
                equal(filename, 'foo/bar', "should pass file path to readFile()");
                strictEqual(options, null, "should pass null as options to readFile()");
                return 'HELLO';
            }
        });

        'foo/bar'.toFilePath()
            .subscribeTo($transport.EVENT_FILE_READ_START, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load start event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger start event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
            })
            .subscribeTo($transport.EVENT_FILE_READ_SUCCESS, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load success event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger success event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
                strictEqual(event.fileData, 'HELLO',
                    "should set event's fileData to fetched contents");
            });

        equal(file.readFileSync(), 'HELLO', "should return contents from fs.readFileSync");

        'foo/bar'.toFilePath().unsubscribeFrom();
    });

    test("Unsuccessful synchronous file read", function () {
        expect(7);

        var file = 'foo/bar'.toFilePath().toFile(),
            error = new Error();

        file.addMocks({
            _readFileSyncProxy: function (filename, options) {
                equal(filename, 'foo/bar', "should pass file path to readFile()");
                strictEqual(options, null, "should pass null as options to readFile()");
                throw error;
            }
        });

        'foo/bar'.toFilePath()
            .subscribeTo($transport.EVENT_FILE_READ_FAILURE, function (event) {
                ok(event.isA($transport.FileEvent), "should trigger file load success event");
                equal(event.originalPath.toString(), 'file>foo>bar', "should trigger success event on correct path");
                strictEqual(event.filePath, file.filePath,
                    "should set event's filePath to file's filePath");
                strictEqual(event.fileError, error,
                    "should set event's fileError to the callback's error");
            });

        equal(typeof file.readFileSync(), 'undefined', "should return undefined");

        'foo/bar'.toFilePath().unsubscribeFrom();
    });
}());
