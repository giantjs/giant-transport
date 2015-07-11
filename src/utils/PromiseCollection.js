/*global giant, jQuery */
giant.postpone(giant, 'PromiseCollection', function (ns, className, /**jQuery*/$) {
    "use strict";

    var modelPromise = $.Deferred().promise();

    /**
     * Creates a PromiseCollection instance.
     * @name giant.PromiseCollection.create
     * @function
     * @param {object} items
     * @returns {giant.PromiseCollection}
     */

    /**
     * The PromiseCollection offers a `Collection`-based solution for joining multiple promises.
     * (The joined promise resolves when *all* promises resolve, and reject when *any* of the promises reject.)
     * TODO: Rename to JqueryPromiseCollection in 0.4.0.
     * @class
     * @extends giant.Collection
     * @extends jQuery.Promise
     */
    giant.PromiseCollection = giant.Collection.of(modelPromise)
        .addMethods(/** @lends giant.PromiseCollection# */{
            /**
             * Obtains joined promise for all promises in the collection.
             * @returns {jQuery.Promise}
             */
            getJoinedPromise: function () {
                return $.when.apply($, this.getValues());
            }
        });
}, jQuery);

giant.amendPostponed(giant, 'Hash', function () {
    "use strict";

    giant.Hash
        .addMethods(/** @lends giant.Hash */{
            /**
             * Converts `Hash` to `PromiseCollection`.
             * @returns {giant.PromiseCollection}
             */
            toPromiseCollection: function () {
                return giant.PromiseCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    giant.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `PromiseCollection`.
             * @returns {giant.PromiseCollection}
             */
            toPromiseCollection: function () {
                return giant.PromiseCollection.create(this);
            }
        },
        false, false, false
    );
}());
