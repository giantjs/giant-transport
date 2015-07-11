/*global giant, jQuery */
giant.postpone(giant, 'PromiseLoop', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = giant.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @class
     * @extends giant.Base
     */
    giant.PromiseLoop = self
        .addConstants(/** @lends giant.PromiseLoop */{
            /** @constant */
            NOTIFICATION_TYPE_RETRY: 'notification-retry'
        })
        .addMethods(/** @lends giant.PromiseLoop */{
            /**
             * Runs handler and re-tries the specified number of times if the promise fails.
             * @param {function} handler Expected to return a jQuery promise.
             * @param {number} [retryCount] Number of attempts after first failure.
             * @param {number} [retryDelay] Delay between retries in ms.
             * @return {jQuery.Promise}
             */
            retryOnFail: function (handler, retryCount, retryDelay) {
                retryDelay = retryDelay || 0;

                var deferred = $.Deferred(),
                    isRetryPrevented = false,
                    i = retryCount || 0;

                /** Prevents further retries. */
                function stop() {
                    isRetryPrevented = true;
                }

                // iterating asynchronously
                (function next() {
                    handler()
                        // resolving returned promise when callback was successful
                        .done(deferred.resolve.bind(this))

                        // processing failed callback
                        .fail(function () {
                            var args;

                            if (i) {
                                // there are retries left
                                // adding prevention callback to notification arguments
                                args = slice.call(arguments);
                                args.unshift(stop);

                                // signaling retry
                                deferred.notify.apply(deferred, args);

                                if (isRetryPrevented) {
                                    // retries are prevented
                                    // rejecting promise
                                    deferred.reject.apply(deferred, arguments);
                                } else {
                                    // retries continue
                                    // decreasing retry counter
                                    i--;

                                    // re-trying
                                    setTimeout(next, retryDelay);
                                }
                            } else {
                                // no more retries left, rejecting returned promise
                                deferred.reject.apply(deferred, arguments);
                            }
                        });
                }());

                return deferred.promise();
            }
        });
}, jQuery);
