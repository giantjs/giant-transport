$oop.postpone($transport, 'Request', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $transport.Request.create
     * @function
     * @param {$transport.Endpoint} endpoint
     * @param {object} [params]
     * @returns {$transport.Request}
     */

    /**
     * The Request class describes a service request.
     * @class
     * @extends $oop.Base
     */
    $transport.Request = self
        .addConstants(/** @lends $transport.Request */{
            /**
             * @type {object}
             * @constant
             */
            httpMethods: {
                "OPTIONS": "OPTIONS",
                "GET"    : "GET",
                "HEAD"   : "HEAD",
                "POST"   : "POST",
                "PUT"    : "PUT",
                "PATCH"  : "PATCH",
                "DELETE" : "DELETE"
            },

            /**
             * @type {object}
             * @constant
             */
            bodyFormats: {
                'default': 'default',
                'json'   : 'json'
            }
        })
        .addMethods(/** @lends $transport.Request# */{
            /**
             * @param {$transport.Endpoint} endpoint
             * @param {object} [params]
             * @ignore
             */
            init: function (endpoint, params) {
                $assertion
                    .isLocation(endpoint, "Invalid endpoint")
                    .isObjectOptional(params, "Invalid parameters");

                /**
                 * Endpoint the request addresses.
                 * @type {$transport.Endpoint}
                 */
                this.endpoint = endpoint;

                /**
                 * HTTP method associated with the request.
                 * @type {string}
                 */
                this.httpMethod = 'GET';

                /**
                 * Collection of header key-value pairs.
                 * @type {$data.Collection}
                 */
                this.headers = $data.Collection.create();

                /**
                 * Collection of query parameter key-value pairs.
                 * @type {$data.Collection}
                 */
                this.params = $data.Collection.create(params);

                /**
                 * Request body format.
                 * @type {string}
                 */
                this.bodyFormat = 'default';
            },

            /**
             * Sets HTTP method property.
             * @param {string} httpMethod A valid HTTP method string. 'GET', 'POST', 'DELETE', etc.
             * @returns {$transport.Request}
             */
            setHttpMethod: function (httpMethod) {
                $assertion.isHttpMethod(httpMethod, "Invalid HTTP method");
                this.httpMethod = httpMethod;
                return this;
            },

            /**
             * Sets body format property.
             * @param {string} bodyFormat Either 'default' or 'json'.
             * @returns {$transport.Request}
             */
            setBodyFormat: function (bodyFormat) {
                $assertion.isBodyFormat(bodyFormat, "Invalid body format");
                this.bodyFormat = bodyFormat;
                return this;
            },

            /**
             * Sets a header key-value pair. Overwrites existing header entry by the same `headerName`.
             * @example
             * request.setHeader('Content-Type', 'application/json);
             * @param {string} headerName Name of header entry.
             * @param {string} headerValue Header entry value.
             * @returns {$transport.Request}
             */
            setHeader: function (headerName, headerValue) {
                $assertion
                    .isString(headerName, "Invalid header name")
                    .isString(headerValue, "Invalid header value");
                this.headers.setItem(headerName, headerValue);
                return this;
            },

            /**
             * Sets multiple header key-value pairs. Overwrites existing header entries having the same keys.
             * @param {object} headers
             * @returns {$transport.Request}
             */
            addHeaders: function (headers) {
                $assertion.isObject(headers, "Invalid headers");

                var that = this;

                $data.Collection.create(headers)
                    .forEachItem(function (value, key) {
                        that.headers.setItem(key, value);
                    });

                return this;
            },

            /**
             * Sets query parameter key-value pair. Overwrites existing parameter entry by the same `paramName`.
             * @param {string} paramName Name of query parameter.
             * @param {*} paramValue Query parameter value.
             * @returns {$transport.Request}
             */
            setParam: function (paramName, paramValue) {
                $assertion.isString(paramName, "Invalid param name");
                this.params.setItem(paramName, paramValue);
                return this;
            },

            /**
             * Sets multiple query parameter key-value pairs. Overwrites existing query parameter entries
             * having the same keys.
             * @param {object} params
             * @returns {$transport.Request}
             */
            addParams: function (params) {
                $assertion.isObject(params, "Invalid params");

                var that = this;

                $data.Collection.create(params)
                    .forEachItem(function (value, key) {
                        that.params.setItem(key, value);
                    });

                return this;
            },

            /**
             * Fetches the URL for the string. Same as the stringified endpoint by default.
             * @returns {string}
             */
            getUrl: function () {
                return this.endpoint.toString();
            },

            /**
             * Serializes request as a path consisting of the HTTP method, endpoint and parameters.
             * TODO: Include headers as well?
             * @returns {string}
             */
            toString: function () {
                return [
                    this.httpMethod,
                    this.endpoint,
                    JSON.stringify(this.params.items)
                ].toPath().toString();
            }
        });
});

$oop.amendPostponed($transport, 'Endpoint', function () {
    "use strict";

    $transport.Endpoint
        .addMethods(/** @lends $transport.Endpoint# */{
            /**
             * Converts endpoint to `Request`.
             * @param {object} [params]
             * @returns {$transport.Request}
             */
            toRequest: function (params) {
                return $transport.Request.create(this, params);
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $transport */{
        /** @param {string} expr */
        isHttpMethod: function (expr) {
            return expr && $transport.Request.httpMethods[expr] === expr;
        },

        /** @param {string} expr */
        isBodyFormat: function (expr) {
            return expr && $transport.Request.bodyFormats[expr] === expr;
        },

        /** @param {$transport.Request} expr */
        isRequest: function (expr) {
            return $transport.Request.isBaseOf(expr);
        },

        /** @param {$transport.Request} [expr] */
        isRequestOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $transport.Request.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Request`.
         * @param {object} [params]
         * @returns {$transport.Request}
         * @example
         * ['foo', 'bar'].toRequest()
         */
        toRequest: function (params) {
            return $transport.Request.create(this.toEndpoint(), params);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Request`.
         * @param {object} [params]
         * @returns {$transport.Request}
         * @example
         * 'foo/bar'.toRequest()
         */
        toRequest: function (params) {
            return $transport.Request.create(this.toEndpoint(), params);
        }
    });
}());
