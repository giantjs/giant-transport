/*global giant */
(function () {
    "use strict";

    module("Service Event");

    test("Instantiation", function () {
        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace);

        ok(serviceEvent.hasOwnProperty('request'), "should initialize request property");
        equal(serviceEvent.request, undefined, "should set request property to undefined");
        ok(serviceEvent.hasOwnProperty('responseNode'), "should initialize responseNode property");
        equal(serviceEvent.responseNode, undefined, "should set responseNode property to undefined");
        ok(serviceEvent.hasOwnProperty('jqXhr'), "should initialize jqXhr property");
        equal(serviceEvent.jqXhr, undefined, "should set jqXhr property to undefined");
    });

    test("Event surrogate", function () {
        ok(giant.Event.create('service.foo', giant.eventSpace).isA(giant.ServiceEvent), "should return ServiceEvent instance");
    });

    test("Spawning event", function () {
        ok(giant.eventSpace.spawnEvent('service.foo').isA(giant.ServiceEvent), "should return ServiceEvent instance");
    });

    test("Request setter", function () {
        var request = 'foo/bar'.toRequest(),
            serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace);

        throws(function () {
            serviceEvent.setRequest('foo');
        }, "should raise exception on invalid argument");

        strictEqual(serviceEvent.setRequest(request), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.request, request, "should set request property");
    });

    test("Request parameter getter", function () {
        expect(3);

        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace),
            requestParam = {};

        equal(serviceEvent.getRequestParam('bar'), undefined,
            "should return undefined when there is no request set");

        serviceEvent.setRequest('foo/bar'.toRequest());

        serviceEvent.request.params.addMocks({
            getItem: function (key) {
                equal(key, 'bar', "should fetch specified item from request params");
                return requestParam;
            }
        });

        var result = serviceEvent.getRequestParam('bar');

        strictEqual(result, requestParam, "should return value taken from request params collection");
    });

    test("Response node setter", function () {
        var responseNode = {},
            serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace);

        strictEqual(serviceEvent.setResponseNode(responseNode), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.responseNode, responseNode, "should set responseNode property");
    });

    test("Response node getter", function () {
        expect(5);

        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace)
                .setResponseNode({}),
            responseNode = {};

        throws(function () {
            serviceEvent.getResponseNode('foo');
        }, "should raise exception on invalid argument");

        strictEqual(serviceEvent.getResponseNode(), serviceEvent.responseNode,
            "should return responseNode property when no path is specified");

        $data.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this.items, serviceEvent.responseNode, "should fetch node from responseNode");
                equal(path.toString(), 'foo>bar', "should fetch node from specified path");
                return responseNode;
            }
        });

        strictEqual(serviceEvent.getResponseNode('foo>bar'.toPath()), responseNode,
            "should return node fetched from within tha responseNode property");

        $data.Tree.removeMocks();
    });

    test("Response hash getter", function () {
        expect(7);

        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace)
                .setResponseNode({}),
            responseNode = {},
            result;

        throws(function () {
            serviceEvent.getResponseNode('foo');
        }, "should raise exception on invalid argument");

        result = serviceEvent.getResponseNodeAsHash();
        ok(result.isA($data.Hash), "should return a Hash instance");
        strictEqual(result.items, serviceEvent.responseNode,
            "should return responseNode property when no path is specified");

        $data.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this.items, serviceEvent.responseNode, "should fetch node from responseNode");
                equal(path.toString(), 'foo>bar', "should fetch node from specified path");
                return responseNode;
            }
        });

        result = serviceEvent.getResponseNodeAsHash('foo>bar'.toPath());

        $data.Tree.removeMocks();

        ok(result.isA($data.Hash), "should return a Hash instance");
        strictEqual(result.items, responseNode,
            "should return node fetched from within the responseNode property");
    });

    test("Response field getter", function () {
        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace);

        equal(serviceEvent.getResponseField('hello'), undefined,
            "should return undefined when no responseNode is set");

        serviceEvent.setResponseNode({
            hello: 'world',
            mona : 'lisa'
        });

        equal(serviceEvent.getResponseField('mona'), 'lisa',
            "should return specified property of responseNode");
    });

    test("XHR setter", function () {
        var jqXhr = {},
            serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace);

        strictEqual(serviceEvent.setJqXhr(jqXhr), serviceEvent, "should be chainable");
        strictEqual(serviceEvent.jqXhr, jqXhr, "should set jqZhr property");
    });

    test("HTTP status getter", function () {
        var jqXhr = {status: 1},
            serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace)
                .setJqXhr(jqXhr);

        equal(serviceEvent.getHttpStatus(), 1, "should return jqXHR object's status property");
    });

    test("Cloning", function () {
        var serviceEvent = giant.ServiceEvent.create('foo', giant.eventSpace)
                .setRequest('foo/bar'.toRequest())
                .setResponseNode({})
                .setJqXhr({}),
            result;

        result = serviceEvent.clone('foo>bar'.toPath());

        ok(result.isA(giant.ServiceEvent), "should return ServiceEvent instance");
        notStrictEqual(result, serviceEvent, "should return a different ServiceEvent instance");
        strictEqual(result.request, serviceEvent.request, "should set request property on clone");
        strictEqual(result.responseNode, serviceEvent.responseNode, "should set responseNode property on clone");
        strictEqual(result.jqXhr, serviceEvent.jqXhr, "should set jqXhr property on clone");
    });
}());
