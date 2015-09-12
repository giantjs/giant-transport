/*global giant, shoehine, Q, $ */
(function () {
    "use strict";

    module("Throttler", {
        setup: function () {
            giant.Throttler.promiseRegistry.clear();
        },

        teardown: function () {
            giant.Throttler.promiseRegistry.clear();
        }
    });

    test("Instantiation", function () {
        throws(function () {
            giant.Throttler.create();
        }, "should raise exception on missing argument");

        throws(function () {
            giant.Throttler.create('foo');
        }, "should raise exception on invalid argument");

        function foo() {
        }

        var throttler = giant.Throttler.create(foo);

        strictEqual(throttler.originalFunction, foo, "should set originalFunction property");
    });

    test("Conversion from function", function () {
        function foo() {
        }

        var throttler = foo.toThrottler();

        ok(throttler.isA(giant.Throttler), "should return Throttler instance");
        strictEqual(throttler.originalFunction, foo, "should set originalFunction property");
    });

    test("Throttling with jQuery promise", function () {
        expect(6);

        var deferreds = [];

        function foo(arg) {
            equal(arg, 'foo', "should pass specified argument(s) to original function"); // x3
            var deferred = $.Deferred();
            deferreds.push(deferred);
            return deferred.promise();
        }

        var throttler = foo.toThrottler(),
            promise = throttler.runThrottled('hello', 'foo');

        strictEqual(throttler.runThrottled('hello', 'foo'), promise, "should return same promise for same promise ID");
        notStrictEqual(throttler.runThrottled('world', 'foo'), promise, "should return different promise for different promise ID");

        deferreds[0]
            .resolve();

        notStrictEqual(throttler.runThrottled('hello', 'foo'), promise,
            "should return different promise for same promise ID once previous promise has been resolved");
    });

    asyncTest("Throttling with Q promise", function () {
        expect(6);

        var deferreds = [];

        function foo(arg) {
            equal(arg, 'foo', "should pass specified argument(s) to original function"); // x3
            var deferred = Q.defer();
            deferreds.push(deferred);
            return deferred.promise;
        }

        var throttler = foo.toThrottler(),
            promise = throttler.runThrottled('hello', 'foo');

        strictEqual(throttler.runThrottled('hello', 'foo'), promise, "should return same promise for same promise ID");
        notStrictEqual(throttler.runThrottled('world', 'foo'), promise, "should return different promise for different promise ID");

        promise
            .finally(function () {
                notStrictEqual(throttler.runThrottled('hello', 'foo'), promise,
                    "should return different promise for same promise ID once previous promise has been resolved");
                start();
            });

        deferreds[0]
            .resolve();
    });
}());
