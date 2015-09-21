/*global giant */
(function () {
    "use strict";

    module("FileEvent");

    test("Instantiation", function () {
        var serviceEvent = giant.FileEvent.create('foo', giant.eventSpace);

        ok(serviceEvent.hasOwnProperty('filePath'), "should initialize filePath property");
        equal(serviceEvent.filePath, undefined, "should set filePath property to undefined");
    });

    test("Event surrogate", function () {
        ok(giant.Event.create('file.foo', giant.eventSpace).isA(giant.FileEvent), "should return FileEvent instance");
    });

    test("Spawning event", function () {
        ok(giant.eventSpace.spawnEvent('file.foo').isA(giant.FileEvent), "should return FileEvent instance");
    });

    test("File path setter", function () {
        var filePath = 'foo/bar'.toFilePath(),
            fileEvent = giant.FileEvent.create('foo', giant.eventSpace);

        throws(function () {
            fileEvent.setFilePath('foo');
        }, "should raise exception on invalid argument");

        strictEqual(fileEvent.setFilePath(filePath), fileEvent, "should be chainable");
        strictEqual(fileEvent.filePath, filePath, "should set filePath property");
    });

    test("File error setter", function () {
        var fileError = new Error(),
            fileEvent = giant.FileEvent.create('foo', giant.eventSpace);

        throws(function () {
            fileEvent.setFileError('foo');
        }, "should raise exception on invalid argument");

        strictEqual(fileEvent.setFileError(fileError), fileEvent, "should be chainable");
        strictEqual(fileEvent.fileError, fileError, "should set fileError property");
    });

    test("File data setter", function () {
        var fileData = {},
            fileEvent = giant.FileEvent.create('foo', giant.eventSpace);

        strictEqual(fileEvent.setFileData(fileData), fileEvent, "should be chainable");
        strictEqual(fileEvent.fileData, fileData, "should set fileData property");
    });

    test("Cloning", function () {
        var error = new Error(),
            data = {},
            imageEvent = giant.FileEvent.create('foo', giant.eventSpace)
                .setFilePath('foo/bar'.toFilePath())
                .setFileError(error)
                .setFileData(data),
            result;

        result = imageEvent.clone('foo>bar'.toPath());

        ok(result.isA(giant.FileEvent), "should return FileEvent instance");
        notStrictEqual(result, imageEvent, "should return a different FileEvent instance");
        strictEqual(result.filePath, imageEvent.filePath, "should set filePath property on clone");
        strictEqual(result.fileError, imageEvent.fileError, "should set fileError property on clone");
        strictEqual(result.fileData, imageEvent.fileData, "should set fileError property on clone");
    });
}());
