(function () {
    "use strict";

    module("Request");

    test("Instantiation", function () {
        throws(function () {
            $transport.Request.create();
        }, "should raise exception on absent arguments");

        throws(function () {
            $transport.Request.create('foo');
        }, "should raise exception on invalid endpoint argument");

        throws(function () {
            $transport.Request.create('foo/bar'.toEndpoint(), 'foo');
        }, "should raise exception on invalid parameters argument");

        var endpoint = 'foo/bar'.toEndpoint(),
            params = {},
            request = $transport.Request.create(endpoint, params);

        strictEqual(request.endpoint, endpoint, "should set endpoint property to the one specified");
        equal(request.httpMethod, 'GET', "should set HTTP method property to 'GET'");
        ok(request.headers.isA($data.Collection), "should initialize headers property as Collection instance");
        equal(request.headers.getKeyCount(), 0, "should set headers property to an empty Collection");
        ok(request.params.isA($data.Collection), "should initialize params property as Collection instance");
        strictEqual(request.params.items, params, "should set params buffer to the one specified");
    });

    test("Conversion from string", function () {
        var params = {},
            request = 'foo/bar'.toRequest(params);

        ok(request.isA($transport.Request), "should return a Request instance");
        equal(request.endpoint.toString(), 'foo/bar', "should set endpoint to one based on the string");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("Conversion from array", function () {
        var params = {},
            request = ['foo', 'bar'].toRequest(params);

        ok(request.isA($transport.Request), "should return a Request instance");
        equal(request.endpoint.toString(), 'foo/bar', "should set endpoint to one based on the array");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("Conversion from Endpoint", function () {
        var params = {},
            endpoint = 'foo/bar'.toEndpoint(),
            request = endpoint.toRequest(params);

        ok(request.isA($transport.Request), "should return a Request instance");
        strictEqual(request.endpoint, endpoint, "should set endpoint property to the endpoint converted");
        strictEqual(request.params.items, params, "should set params to the one specified");
    });

    test("HTTP method setter", function () {
        var request = 'foo/bar'.toRequest();

        throws(function () {
            request.setHttpMethod('foo');
        }, "should raise exception on invalid HTTP method name");

        strictEqual(request.setHttpMethod('OPTIONS'), request, "should be chainable");
        equal(request.httpMethod, 'OPTIONS', "should set HTTP method property to the one specified");
    });

    test("Request body format setter", function () {
        var request = 'foo/bar'.toRequest();

        throws(function () {
            request.setBodyFormat('foo');
        }, "should raise exception on invalid body format");

        strictEqual(request.setBodyFormat('json'), request, "should be chainable");
        equal(request.bodyFormat, 'json', "should set bodyFormat property to the one specified");
    });

    test("Header addition", function () {
        expect(4);

        var request = 'foo/bar'.toRequest();

        throws(function () {
            request.setHeader({});
        }, "should raise exception on invalid arguments");

        request.headers.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to header collection item setter");
                equal(value, 'world', "should pass value to header collection item setter");
            }
        });

        strictEqual(request.setHeader('hello', 'world'), request, "should be chainable");
    });

    test("Headers addition", function () {
        var request = 'foo/bar'.toRequest(),
            addedItems = [];

        request.headers.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(request.addHeaders({
            hello: 'world',
            mona : 'lisa'
        }), request, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to headers collection");
    });

    test("Parameter addition", function () {
        expect(4);

        var request = 'foo/bar'.toRequest();

        throws(function () {
            request.addParam({});
        }, "should raise exception on invalid arguments");

        request.params.addMocks({
            setItem: function (key, value) {
                equal(key, 'hello', "should pass key to param collection item setter");
                equal(value, 'world', "should pass value to param collection item setter");
            }
        });

        strictEqual(request.setParam('hello', 'world'), request, "should be chainable");
    });

    test("Parameters addition", function () {
        var request = 'foo/bar'.toRequest(),
            addedItems = [];

        request.params.addMocks({
            setItem: function (key, value) {
                addedItems.push([key, value]);
            }
        });

        strictEqual(request.addParams({
            hello: 'world',
            mona : 'lisa'
        }), request, "should be chainable");

        deepEqual(addedItems, [
            ['hello', 'world'],
            ['mona', 'lisa']
        ], "should add all key-value pairs to params collection");
    });

    test("URL getter", function () {
        var request = 'foo/bar'.toRequest();
        equal(request.getUrl(), 'foo/bar', "should return stringified endpoint");
    });
}());
