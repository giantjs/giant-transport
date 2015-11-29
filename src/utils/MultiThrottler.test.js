(function () {
    "use strict";

    module("Throttler", {
        setup: function () {
            $transport.MultiThrottler.promiseRegistry.clear();
        },

        teardown: function () {
            $transport.MultiThrottler.promiseRegistry.clear();
        }
    });

    test("Instantiation", function () {
        throws(function () {
            $transport.MultiThrottler.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $transport.MultiThrottler.create('foo');
        }, "should raise exception on invalid argument");

        function foo() {
        }

        var throttler = $transport.MultiThrottler.create(foo);

        strictEqual(throttler.originalFunction, foo, "should set originalFunction property");
    });

    test("Conversion from function", function () {
        function foo() {
        }

        var throttler = foo.toMultiThrottler();

        ok(throttler.isA($transport.MultiThrottler), "should return Throttler instance");
        strictEqual(throttler.originalFunction, foo, "should set originalFunction property");
    });

    test("Throttling with jQuery promise", function () {
        expect(6);

        var deferreds = [];

        function foo(arg) {
            equal(arg, 'foo', "should pass specified argument(s) to original function"); // x3
            var deferred = $utils.Deferred.create();
            deferreds.push(deferred);
            return deferred.promise;
        }

        var throttler = foo.toMultiThrottler(),
            promise = throttler.runThrottled('hello', 'foo');

        strictEqual(throttler.runThrottled('hello', 'foo'), promise, "should return same promise for same promise ID");
        notStrictEqual(throttler.runThrottled('world', 'foo'), promise, "should return different promise for different promise ID");

        deferreds[0]
            .resolve();

        notStrictEqual(throttler.runThrottled('hello', 'foo'), promise,
            "should return different promise for same promise ID once previous promise has been resolved");
    });

    test("Throttling with promise", function () {
        expect(6);

        var deferreds = [];

        function foo(arg) {
            equal(arg, 'foo', "should pass specified argument(s) to original function"); // x3
            var deferred = $utils.Deferred.create();
            deferreds.push(deferred);
            return deferred.promise;
        }

        var throttler = foo.toMultiThrottler(),
            promise = throttler.runThrottled('hello', 'foo');

        strictEqual(throttler.runThrottled('hello', 'foo'), promise, "should return same promise for same promise ID");
        notStrictEqual(throttler.runThrottled('world', 'foo'), promise, "should return different promise for different promise ID");

        promise
            .then(function () {
                notStrictEqual(throttler.runThrottled('hello', 'foo'), promise,
                    "should return different promise for same promise ID once previous promise has been resolved");
            }, function () {
                notStrictEqual(throttler.runThrottled('hello', 'foo'), promise,
                    "should return different promise for same promise ID once previous promise has been resolved");
            });

        deferreds[0]
            .resolve();
    });
}());
