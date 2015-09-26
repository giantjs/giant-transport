$oop.postpone($transport, 'QPromiseCollection', function () {
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
     * @extends $data.Collection
     * @extends Q.Promise
     */
    $transport.QPromiseCollection = $data.Collection.of(modelPromise)
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

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash
        .addMethods(/** @lends $data.Hash */{
            /**
             * Converts `Hash` to `QPromiseCollection`.
             * @returns {$transport.QPromiseCollection}
             */
            toQPromiseCollection: function () {
                return $transport.QPromiseCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `QPromiseCollection`.
         * @returns {$transport.QPromiseCollection}
         */
        toQPromiseCollection: function () {
            return $transport.QPromiseCollection.create(this);
        }
    });
}());
