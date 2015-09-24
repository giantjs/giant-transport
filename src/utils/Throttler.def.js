/*global giant */
giant.postpone(giant, 'Throttler', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name giant.Throttler.create
     * @function
     * @param {function} originalFunction
     * @returns {giant.Throttler}
     */

    /**
     * Throttles a function call. The original function is expected to return a promise. (Q or jQuery).
     * TODO: Eliminate jQuery promises (0.4.0).
     * @class
     * @extends giant.Base
     */
    giant.Throttler = self
        .addConstants(/** @lends giant.Throttler */{
            /**
             * @type {giant.Collection}
             * @constant
             */
            promiseRegistry: giant.Collection.create()
        })
        .addMethods(/** @lends giant.Throttler# */{
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
             * @returns {Q.Promise|jQuery.Promise}
             */
            runThrottled: function (promiseId) {
                var that = this,
                    promise = this.promiseRegistry.getItem(promiseId),
                    args;

                if (!promise) {
                    args = slice.call(arguments, 1);
                    promise = this.originalFunction.apply(this, args);

                    this.promiseRegistry.setItem(promiseId, promise);

                    // TODO: Remove jQuery version (0.4.0).
                    if (promise.always) {
                        promise.always(function () {
                            that.promiseRegistry.deleteItem(promiseId);
                        });
                    } else if (promise['finally']) {
                        promise['finally'](function () {
                            that.promiseRegistry.deleteItem(promiseId);
                        });
                    }
                }

                return promise;
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * Converts `Function` to `Throttler`.
         * @returns {giant.Throttler}
         */
        toThrottler: function () {
            return giant.Throttler.create(this);
        }
    });
}());
