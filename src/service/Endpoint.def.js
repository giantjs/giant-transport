$oop.postpone($transport, 'Endpoint', function () {
    "use strict";

    var base = $transport.Location,
        self = base.extend();

    /**
     * Creates an Endpoint instance.
     * @name $transport.Endpoint.create
     * @function
     * @param {$data.Path} endpointPath
     * @returns {$transport.Endpoint}
     */

    /**
     * The Endpoint is a Location that represents a service endpoint.
     * @class
     * @extends $transport.Location
     */
    $transport.Endpoint = self
        .addConstants(/** @lends $transport.Endpoint */{
            /**
             * Event root path specifically for endpoints.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'endpoint'
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path.addMethods(/** @lends $data.Path# */{
        /**
         * Converts `Path` instance to `Endpoint`
         * @returns {$transport.Endpoint}
         */
        toEndpoint: function () {
            return $transport.Endpoint.create(this);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Endpoint`
         * @returns {$transport.Endpoint}
         */
        toEndpoint: function () {
            return $transport.Endpoint.create(this
                .replace($transport.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Endpoint`
         * @returns {$transport.Endpoint}
         */
        toEndpoint: function () {
            return $transport.Endpoint.create(this.toPath());
        }
    });
}());