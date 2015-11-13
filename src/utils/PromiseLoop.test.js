(function () {
    "use strict";

    module("PromiseLoop");

    test("Successful call", function () {
        expect(2);

        $transport.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $utils.Deferred.create().resolve('foo').promise;
            })
            .then(function (arg) {
                equal(arg, 'foo', "should return a resolved promise");
            });
    });

    test("Failure with no retries", function () {
        expect(2);

        $transport.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $utils.Deferred.create().reject('foo').promise;
            })
            .then(null, function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    asyncTest("Failure with one retry", function () {
        expect(3);

        $transport.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler"); // will be hit 2x
                return $utils.Deferred.create().reject('foo').promise;
            }, 1)
            .then(null, function (arg) {
                equal(arg, 'foo', "should return a failed promise");
                start();
            });
    });

    asyncTest("Failure with retries and notifications", function () {
        expect(3);

        var promises = [
                $utils.Deferred.create().reject('foo').promise,
                $utils.Deferred.create().resolve('bar').promise
            ],
            i = 0;

        $transport.PromiseLoop
            .retryOnFail(function () {
                return promises[i++];
            }, 2)
            .then(function (arg) {
                equal(arg, 'bar', "should return first resolved promise");
                start();
            }, null, function (stop, arg) {
                equal(typeof stop, 'function', "should indicate progress");
                equal(arg, 'foo', "should pass rejection arguments to progress handler");
            });
    });
}());
