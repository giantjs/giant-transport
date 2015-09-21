/*global giant */
giant.postpone(giant, 'Endpoint', function () {
    "use strict";

    var base = giant.Location,
        self = base.extend();

    /**
     * Creates an Endpoint instance.
     * @name giant.Endpoint.create
     * @function
     * @param {giant.Path} endpointPath
     * @returns {giant.Endpoint}
     */

    /**
     * The Endpoint is a Location that represents a service endpoint.
     * @class
     * @extends giant.Location
     */
    giant.Endpoint = self
        .addConstants(/** @lends giant.Endpoint */{
            /**
             * Event root path specifically for endpoints.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'endpoint'
        });
});

giant.amendPostponed(giant, 'Path', function () {
    "use strict";

    giant.Path.addMethods(/** @lends giant.Path# */{
        /**
         * Converts `Path` instance to `Endpoint`
         * @returns {giant.Endpoint}
         */
        toEndpoint: function () {
            return giant.Endpoint.create(this);
        }
    });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Endpoint`
         * @returns {giant.Endpoint}
         */
        toEndpoint: function () {
            return giant.Endpoint.create(this
                .replace(giant.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    giant.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Endpoint`
         * @returns {giant.Endpoint}
         */
        toEndpoint: function () {
            return giant.Endpoint.create(this.toPath());
        }
    });
}());