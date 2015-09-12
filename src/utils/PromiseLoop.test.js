/*global giant, shoehine, $ */
(function () {
    "use strict";

    module("PromiseLoop");

    test("Successful call", function () {
        expect(2);

        giant.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().resolve('foo');
            })
            .done(function (arg) {
                equal(arg, 'foo', "should return a resolved promise");
            });
    });

    test("Failure with no retries", function () {
        expect(2);

        giant.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().reject('foo');
            })
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    asyncTest("Failure with one retry", function () {
        expect(3);

        giant.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler"); // will be hit 2x
                return $.Deferred().reject('foo');
            }, 1)
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
                start();
            });
    });

    asyncTest("Failure with retries and notifications", function () {
        expect(3);

        var promises = [
                $.Deferred().reject('foo'),
                $.Deferred().resolve('bar')
            ],
            i = 0;

        giant.PromiseLoop
            .retryOnFail(function () {
                return promises[i++];
            }, 2)
            .progress(function (stop, arg) {
                equal(typeof stop, 'function', "should indicate progress");
                equal(arg, 'foo', "should pass rejection arguments to progress handler");
            })
            .done(function (arg) {
                equal(arg, 'bar', "should return first resolved promise");
                start();
            });
    });
}());
