/*global giant, Q */
giant.postpone(giant, 'QPromiseCollection', function () {
    "use strict";

    var modelPromise = Q.defer().promise;

    /**
     * Creates a QPromiseCollection instance.
     * @name QPromiseCollection.create
     * @function
     * @param {object} items
     * @returns {QPromiseCollection}
     */

    /**
     * The QPromiseCollection offers a `Collection`-based solution for joining multiple promises.
     * (The joined promise resolves when *all* promises resolve, and reject when *any* of the promises reject.)
     * @class
     * @extends giant.Collection
     * @extends Q.Promise
     */
    giant.QPromiseCollection = giant.Collection.of(modelPromise)
        .addMethods(/** @lends QPromiseCollection# */{
            /**
             * Obtains joined promise for all promises in the collection.
             * Be aware that the returned promise is asynchronous!
             * @returns {Q.Promise}
             */
            getJoinedPromise: function () {
                return Q.all(this.getValues());
            }
        });
});

giant.amendPostponed(giant, 'Hash', function () {
    "use strict";

    giant.Hash
        .addMethods(/** @lends giant.Hash */{
            /**
             * Converts `Hash` to `QPromiseCollection`.
             * @returns {giant.QPromiseCollection}
             */
            toQPromiseCollection: function () {
                return giant.QPromiseCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `QPromiseCollection`.
         * @returns {giant.QPromiseCollection}
         */
        toQPromiseCollection: function () {
            return giant.QPromiseCollection.create(this);
        }
    });
}());
