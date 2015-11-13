(function () {
    "use strict";

    module("Image");

    test("Instantiation", function () {
        throws(function () {
            $transport.ImageLoader.create();
        }, "should raise exception on no arguments");

        throws(function () {
            $transport.ImageLoader.create('foo');
        }, "should raise exception on invalid argument");

        var imageUrl = 'foo/bar'.toImageUrl(),
            image = $transport.ImageLoader.create(imageUrl);

        strictEqual(image.imageUrl, imageUrl, "should set imageUrl property");
        strictEqual(image.eventPath, imageUrl.eventPath, "should set eventPath property");
    });

    test("Conversion from ImageUrl", function () {
        var imageUrl = 'foo/bar'.toImageUrl(),
            image = imageUrl.toImageLoader();

        ok(image.isA($transport.ImageLoader), "should return an ImageLoader instance");
        strictEqual(image.imageUrl, imageUrl, "should set imageUrl property to self");
    });

    test("Successful image loading", function () {
        expect(14);

        var image = 'foo/bar'.toImageUrl().toImageLoader(),
            imageElement = document.createElement('img'),
            deferred = $utils.Deferred.create();

        image.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, image.imageUrl.toString(),
                    "should set image src attribute to serialized image URL");
                return deferred.promise;
            }
        });

        'foo/bar'.toImageUrl()
            .subscribeTo($transport.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA($transport.ImageEvent), "should trigger image load start event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger start event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo($transport.EVENT_IMAGE_LOAD_SUCCESS, function (event) {
                ok(event.isA($transport.ImageEvent), "should trigger image load success event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger success event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        image.loadImage()
            .then(function (location, element) {
                ok(true, "should resolve returned promise");
                strictEqual(location, image.imageUrl,
                    "should set promise's  to imagimageLocatione loader's imageUrl");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.resolve();

        'foo/bar'.toImageUrl().unsubscribeFrom();
    });

    test("Failed image loading", function () {
        expect(14);

        var image = 'foo/bar'.toImageUrl().toImageLoader(),
            imageElement = document.createElement('img'),
            deferred = $utils.Deferred.create();

        image.addMocks({
            _createImageElementProxy: function () {
                ok(true, "should create image element");
                return imageElement;
            },

            _loadImage: function (element, srcAttribute) {
                strictEqual(element, imageElement, "should load image into created image element");
                equal(srcAttribute, image.imageUrl.toString(),
                    "should set image src attribute to serialized image URL");
                return deferred.promise;
            }
        });

        'foo/bar'.toImageUrl()
            .subscribeTo($transport.EVENT_IMAGE_LOAD_START, function (event) {
                ok(event.isA($transport.ImageEvent), "should trigger image load start event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger start event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            })
            .subscribeTo($transport.EVENT_IMAGE_LOAD_FAILURE, function (event) {
                ok(event.isA($transport.ImageEvent), "should trigger image load failure event");
                equal(event.originalPath.toString(), 'image>foo>bar', "should trigger failure event on correct path");
                strictEqual(event.imageUrl, image.imageUrl,
                    "should set event's imageUrl to image's imageUrl");
                strictEqual(event.imageElement, imageElement,
                    "should set event's imageElement to created image element");
            });

        image.loadImage()
            .then(null, function (location, element) {
                ok(true, "should reject returned promise");
                strictEqual(location, image.imageUrl,
                    "should set promise's  to imagimageLocatione loader's imageUrl");
                strictEqual(element, imageElement,
                    "should set promise's imageElement to created image element");
            });

        deferred.reject();

        'foo/bar'.toImageUrl().unsubscribeFrom();
    });
}());
