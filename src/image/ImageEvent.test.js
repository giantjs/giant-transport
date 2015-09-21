/*global giant */
(function () {
    "use strict";

    module("ImageEvent");

    test("Instantiation", function () {
        var serviceEvent = giant.ImageEvent.create('foo', giant.eventSpace);

        ok(serviceEvent.hasOwnProperty('imageUrl'), "should initialize imageUrl property");
        equal(serviceEvent.imageUrl, undefined, "should set imageUrl property to undefined");
        ok(serviceEvent.hasOwnProperty('imageElement'), "should initialize imageElement property");
        equal(serviceEvent.imageElement, undefined, "should set imageElement property to undefined");
    });

    test("Event surrogate", function () {
        ok(giant.Event.create('image.foo', giant.eventSpace).isA(giant.ImageEvent), "should return ImageEvent instance");
    });

    test("Spawning event", function () {
        ok(giant.eventSpace.spawnEvent('image.foo').isA(giant.ImageEvent), "should return ImageEvent instance");
    });

    test("ImageLoader location setter", function () {
        var imageUrl = 'foo/bar'.toImageUrl(),
            imageEvent = giant.ImageEvent.create('foo', giant.eventSpace);

        throws(function () {
            imageEvent.setImageLocation('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageLocation(imageUrl), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageUrl, imageUrl, "should set imageUrl property");
    });

    test("ImageLoader element setter", function () {
        var imageElement = document.createElement('img'),
            imageEvent = giant.ImageEvent.create('foo', giant.eventSpace);

        throws(function () {
            imageEvent.setImageElement('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageElement(imageElement), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageElement, imageElement, "should set imageElement property");
    });

    test("Cloning", function () {
        var imageEvent = giant.ImageEvent.create('foo', giant.eventSpace)
                .setImageLocation('foo/bar'.toImageUrl())
                .setImageElement(document.createElement('img')),
            result;

        result = imageEvent.clone('foo>bar'.toPath());

        ok(result.isA(giant.ImageEvent), "should return ImageEvent instance");
        notStrictEqual(result, imageEvent, "should return a different ImageEvent instance");
        strictEqual(result.imageUrl, imageEvent.imageUrl, "should set imageUrl property on clone");
        strictEqual(result.imageElement, imageEvent.imageElement, "should set imageElement property on clone");
    });
}());
