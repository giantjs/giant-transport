/*global giant */
giant.postpone(giant, 'Request', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.Request.create
     * @function
     * @param {giant.Endpoint} endpoint
     * @param {object} [params]
     * @returns {giant.Request}
     */

    /**
     * The Request class describes a service request.
     * @class
     * @extends giant.Base
     */
    giant.Request = self
        .addConstants(/** @lends giant.Request */{
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
        .addMethods(/** @lends giant.Request# */{
            /**
             * @param {giant.Endpoint} endpoint
             * @param {object} [params]
             * @ignore
             */
            init: function (endpoint, params) {
                giant
                    .isLocation(endpoint, "Invalid endpoint")
                    .isObjectOptional(params, "Invalid parameters");

                /**
                 * Endpoint the request addresses.
                 * @type {giant.Endpoint}
                 */
                this.endpoint = endpoint;

                /**
                 * HTTP method associated with the request.
                 * @type {string}
                 */
                this.httpMethod = 'GET';

                /**
                 * Collection of header key-value pairs.
                 * @type {giant.Collection}
                 */
                this.headers = giant.Collection.create();

                /**
                 * Collection of query parameter key-value pairs.
                 * @type {giant.Collection}
                 */
                this.params = giant.Collection.create(params);

                /**
                 * Request body format.
                 * @type {string}
                 */
                this.bodyFormat = 'default';
            },

            /**
             * Sets HTTP method property.
             * @param {string} httpMethod A valid HTTP method string. 'GET', 'POST', 'DELETE', etc.
             * @returns {giant.Request}
             */
            setHttpMethod: function (httpMethod) {
                giant.isHttpMethod(httpMethod, "Invalid HTTP method");
                this.httpMethod = httpMethod;
                return this;
            },

            /**
             * Sets body format property.
             * @param {string} bodyFormat Either 'default' or 'json'.
             * @returns {giant.Request}
             */
            setBodyFormat: function (bodyFormat) {
                giant.isBodyFormat(bodyFormat, "Invalid body format");
                this.bodyFormat = bodyFormat;
                return this;
            },

            /**
             * Sets a header key-value pair. Overwrites existing header entry by the same `headerName`.
             * @example
             * request.setHeader('Content-Type', 'application/json);
             * @param {string} headerName Name of header entry.
             * @param {string} headerValue Header entry value.
             * @returns {giant.Request}
             */
            setHeader: function (headerName, headerValue) {
                giant
                    .isString(headerName, "Invalid header name")
                    .isString(headerValue, "Invalid header value");
                this.headers.setItem(headerName, headerValue);
                return this;
            },

            /**
             * Sets multiple header key-value pairs. Overwrites existing header entries having the same keys.
             * @param {object} headers
             * @returns {giant.Request}
             */
            addHeaders: function (headers) {
                giant.isObject(headers, "Invalid headers");

                var that = this;

                giant.Collection.create(headers)
                    .forEachItem(function (value, key) {
                        that.headers.setItem(key, value);
                    });

                return this;
            },

            /**
             * Sets query parameter key-value pair. Overwrites existing parameter entry by the same `paramName`.
             * @param {string} paramName Name of query parameter.
             * @param {*} paramValue Query parameter value.
             * @returns {giant.Request}
             */
            setParam: function (paramName, paramValue) {
                giant.isString(paramName, "Invalid param name");
                this.params.setItem(paramName, paramValue);
                return this;
            },

            /**
             * Sets multiple query parameter key-value pairs. Overwrites existing query parameter entries
             * having the same keys.
             * @param {object} params
             * @returns {giant.Request}
             */
            addParams: function (params) {
                giant.isObject(params, "Invalid params");

                var that = this;

                giant.Collection.create(params)
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

giant.amendPostponed(giant, 'Endpoint', function () {
    "use strict";

    giant.Endpoint
        .addMethods(/** @lends giant.Endpoint# */{
            /**
             * Converts endpoint to `Request`.
             * @param {object} [params]
             * @returns {giant.Request}
             */
            toRequest: function (params) {
                return giant.Request.create(this, params);
            }
        });
});

(function () {
    "use strict";

    giant.addTypes(/** @lends giant */{
        /** @param {string} expr */
        isHttpMethod: function (expr) {
            return expr && giant.Request.httpMethods[expr] === expr;
        },

        /** @param {string} expr */
        isBodyFormat: function (expr) {
            return expr && giant.Request.bodyFormats[expr] === expr;
        },

        /** @param {giant.Request} expr */
        isRequest: function (expr) {
            return giant.Request.isBaseOf(expr);
        },

        /** @param {giant.Request} [expr] */
        isRequestOptional: function (expr) {
            return typeof expr === 'undefined' ||
                giant.Request.isBaseOf(expr);
        }
    });

    giant.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Request`.
         * @param {object} [params]
         * @returns {giant.Request}
         * @example
         * ['foo', 'bar'].toRequest()
         */
        toRequest: function (params) {
            return giant.Request.create(this.toEndpoint(), params);
        }
    });

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Request`.
         * @param {object} [params]
         * @returns {giant.Request}
         * @example
         * 'foo/bar'.toRequest()
         */
        toRequest: function (params) {
            return giant.Request.create(this.toEndpoint(), params);
        }
    });
}());
