/*global giant */
giant.postpone(giant, 'Location', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend()
            .addTraitAndExtend(giant.Evented);

    /**
     * Creates a Location instance.
     * Do not instantiate Location directly unless there are a surrogate rules set up.
     * @name giant.Location.create
     * @function
     * @param {giant.Path} locationPath Path that represents the endpoints.
     * @returns {giant.Location}
     */

    /**
     * The Location is an abstract base class for URLs on which events can be triggered on and listened to.
     * Extend Location to add event space, or set specific root path as needed.
     * @class
     * @extends giant.Base
     * @extends giant.Evented
     */
    giant.Location = self
        .setEventSpace(giant.eventSpace)
        .addConstants(/** @lends giant.Location */{
            /**
             * Root path for events triggered on the location.
             * Gets prepended to the `eventPath` of the instance.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'location',

            /**
             * @constant
             * @type {string}
             */
            LOCATION_ROOT_PATH: undefined,

            /**
             * @constant
             * @type {RegExp}
             */
            LEADING_TRAILING_SLASHES: /(^\/+)|(\/+$)/g
        })
        .addMethods(/** @lends giant.Location# */{
            /**
             * @param {giant.Path} locationPath
             * @ignore
             */
            init: function (locationPath) {
                $assertion.isPath(locationPath, "Invalid path");

                /**
                 * Path associated with endpoint.
                 * @type {giant.Path}
                 */
                this.locationPath = locationPath;

                var eventPath = locationPath.clone()
                    .prependKey(this.EVENT_ROOT_PATH);

                // setting event path for Evented
                this.setEventPath(eventPath);
            },

            /**
             * Tells if the specified location is equivalent to the current one.
             * @param {giant.Location} location
             * @returns {boolean}
             */
            equals: function (location) {
                $assertion
                    .isLocationOptional(location, "Invalid location")
                    .assert(!location || this.getBase() === location.getBase(), "Invalid kind of location");

                return location && this.locationPath.equals(location.locationPath);
            },

            /**
             * Appends specified location to current location.
             * The base class of the returned instance is determined by the current instance.
             * @param {giant.Location} location
             * @returns {giant.Location}
             */
            append: function (location) {
                $assertion.isLocation(location, "Invalid location");
                return this.getBase().create(this.locationPath.append(location.locationPath));
            },

            /**
             * Prepends specified location to current location.
             * The base class of the returned instance is determined by the current instance.
             * @param {giant.Location} location
             * @returns {giant.Location}
             */
            prepend: function (location) {
                $assertion.isLocation(location, "Invalid location");
                return this.getBase().create(this.locationPath.prepend(location.locationPath));
            },

            /**
             * Serializes Location into slash-separated string. Takes root path into account.
             * @returns {string}
             */
            toString: function () {
                var LOCATION_ROOT_PATH = this.LOCATION_ROOT_PATH,
                    asArray = this.locationPath.asArray;

                if (LOCATION_ROOT_PATH === '/') {
                    asArray = [''].concat(asArray);
                } else if (LOCATION_ROOT_PATH) {
                    asArray = [LOCATION_ROOT_PATH].concat(asArray);
                }

                return asArray.join('/');
            }
        });
});
(function () {
    "use strict";

    $assertion.addTypes(/** @lends giant */{
        /** @param {giant.Location} expr */
        isLocation: function (expr) {
            return giant.Location.isBaseOf(expr);
        },

        /** @param {giant.Location} [expr] */
        isLocationOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   giant.Location.isBaseOf(expr);
        }
    });
}());