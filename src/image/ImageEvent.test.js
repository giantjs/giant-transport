(function () {
    "use strict";

    module("ImageEvent");

    test("Instantiation", function () {
        var serviceEvent = $transport.ImageEvent.create('foo', $event.eventSpace);

        ok(serviceEvent.hasOwnProperty('imageUrl'), "should initialize imageUrl property");
        equal(serviceEvent.imageUrl, undefined, "should set imageUrl property to undefined");
        ok(serviceEvent.hasOwnProperty('imageElement'), "should initialize imageElement property");
        equal(serviceEvent.imageElement, undefined, "should set imageElement property to undefined");
    });

    test("Event surrogate", function () {
        ok($event.Event.create('image.foo', $event.eventSpace).isA($transport.ImageEvent), "should return ImageEvent instance");
    });

    test("Spawning event", function () {
        ok($event.eventSpace.spawnEvent('image.foo').isA($transport.ImageEvent), "should return ImageEvent instance");
    });

    test("ImageLoader location setter", function () {
        var imageUrl = 'foo/bar'.toImageUrl(),
            imageEvent = $transport.ImageEvent.create('foo', $event.eventSpace);

        throws(function () {
            imageEvent.setImageLocation('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageLocation(imageUrl), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageUrl, imageUrl, "should set imageUrl property");
    });

    test("ImageLoader element setter", function () {
        var imageElement = document.createElement('img'),
            imageEvent = $transport.ImageEvent.create('foo', $event.eventSpace);

        throws(function () {
            imageEvent.setImageElement('foo');
        }, "should raise exception on invalid argument");

        strictEqual(imageEvent.setImageElement(imageElement), imageEvent, "should be chainable");
        strictEqual(imageEvent.imageElement, imageElement, "should set imageElement property");
    });

    test("Cloning", function () {
        var imageEvent = $transport.ImageEvent.create('foo', $event.eventSpace)
                .setImageLocation('foo/bar'.toImageUrl())
                .setImageElement(document.createElement('img')),
            result;

        result = imageEvent.clone('foo>bar'.toPath());

        ok(result.isA($transport.ImageEvent), "should return ImageEvent instance");
        notStrictEqual(result, imageEvent, "should return a different ImageEvent instance");
        strictEqual(result.imageUrl, imageEvent.imageUrl, "should set imageUrl property on clone");
        strictEqual(result.imageElement, imageEvent.imageElement, "should set imageElement property on clone");
    });
}());
