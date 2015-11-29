$oop.postpone($transport, 'MultiThrottler', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name $transport.MultiThrottler.create
     * @function
     * @param {function} originalFunction
     * @returns {$transport.MultiThrottler}
     */

    /**
     * Throttles a function call. The original function is expected to return a promise.
     * @class
     * @extends $oop.Base
     */
    $transport.MultiThrottler = self
        .addConstants(/** @lends $transport.MultiThrottler */{
            /**
             * @type {$data.Collection}
             * @constant
             */
            promiseRegistry: $data.Collection.create()
        })
        .addMethods(/** @lends $transport.MultiThrottler# */{
            /**
             * @param {function} originalFunction
             * @ignore
             */
            init: function (originalFunction) {
                $assertion.isFunction(originalFunction, "Invalid original function");

                /** @type {Function} */
                this.originalFunction = originalFunction;
            },

            /**
             * Runs the original function unless there is already a returned promise registered for it.
             * When there is, it just returns the promise from the previous call to the function.
             * @param {string} promiseId Identifies promise.
             * @returns {$utils.Promise}
             */
            runThrottled: function (promiseId) {
                var that = this,
                    promise = this.promiseRegistry.getItem(promiseId),
                    args;

                if (!promise) {
                    args = slice.call(arguments, 1);
                    promise = this.originalFunction.apply(this, args);

                    this.promiseRegistry.setItem(promiseId, promise);

                    promise.then(function () {
                        that.promiseRegistry.deleteItem(promiseId);
                    }, function () {
                        that.promiseRegistry.deleteItem(promiseId);
                    });
                }

                return promise;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * Converts `Function` to `Throttler`.
         * @returns {$transport.MultiThrottler}
         */
        toMultiThrottler: function () {
            return $transport.MultiThrottler.create(this);
        }
    });
}());
