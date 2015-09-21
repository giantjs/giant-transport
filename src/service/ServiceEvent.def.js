/*global giant */
giant.postpone(giant, 'ServiceEvent', function () {
    "use strict";

    var base = giant.Event,
        self = base.extend();

    /**
     * Creates a ServiceEvent instance.
     * @name giant.ServiceEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {giant.EventSpace} eventSpace Event space
     * @returns {giant.ServiceEvent}
     */

    /**
     * The ServiceEvent class represents an event that relates to services. Offers an API to access the internals
     * of relevant properties, eg. the response node of the service that triggered the event.
     * Service events are usually triggered at different stages of a service call.
     * @class
     * @extends giant.Event
     */
    giant.ServiceEvent = self
        .addMethods(/** @lends giant.ServiceEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {giant.EventSpace} eventSpace Event space
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Request associated with the event.
                 * @type {giant.Request}
                 */
                this.request = undefined;

                /**
                 * Custom data associated with the event.
                 * @type {*}
                 */
                this.responseNode = undefined;

                /**
                 * jQuery XHR object associated with the event.
                 * @type {jQuery.jqXHR}
                 */
                this.jqXhr = undefined;
            },

            /**
             * Sets request property.
             * @param {giant.Request} request
             * @returns {giant.ServiceEvent}
             */
            setRequest: function (request) {
                giant.isRequest(request, "Invalid request");
                this.request = request;
                return this;
            },

            /**
             * Fetches the value of the specified request parameter.
             * @param {string} paramName
             * @returns {string}
             */
            getRequestParam: function (paramName) {
                return this.request ?
                    this.request.params.getItem(paramName) :
                    undefined;
            },

            /**
             * Sets the response data node property.
             * @param {*} responseNode
             * @returns {giant.ServiceEvent}
             */
            setResponseNode: function (responseNode) {
                this.responseNode = responseNode;
                return this;
            },

            /**
             * Fetches a data node from inside the response node at the specified path.
             * Treats the response node as a `Tree` instance.
             * @example
             * var node = event.getResponseNode('foo>bar'.toPath());
             * @param {giant.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {*}
             */
            getResponseNode: function (path) {
                giant.isPathOptional(path, "Invalid path");
                return path ?
                    giant.Tree.create(this.responseNode).getNode(path) :
                    this.responseNode;
            },

            /**
             * Fetches data node from the response node, wrapped in a `Hash` instance.
             * @param {giant.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {giant.Hash}
             * @see giant.ServiceEvent#getResponseNode
             */
            getResponseNodeAsHash: function (path) {
                giant.isPathOptional(path, "Invalid path");
                return path ?
                    giant.Tree.create(this.responseNode).getNodeAsHash(path) :
                    giant.Hash.create(this.responseNode);
            },

            /**
             * Fetches the value of the specified response field. Equivalent to `.getResponseNode()` called
             * with a primitive path.
             * @example
             * var field = event.getResponseField('foo');
             * // equivalent to:
             * var node = event.getResponseNode('foo'.toPath());
             * @param {string} fieldName
             * @returns {*}
             */
            getResponseField: function (fieldName) {
                giant.isString(fieldName, "Invalid field name");
                var responseNode = this.responseNode;
                return responseNode ?
                    responseNode[fieldName] :
                    undefined;
            },

            /**
             * Sets jQuery XHR property.
             * @param {jQuery.jqXHR} jqXhr
             * @returns {giant.ServiceEvent}
             */
            setJqXhr: function (jqXhr) {
                this.jqXhr = jqXhr;
                return this;
            },

            /**
             * Retrieves HTTP status code for the response.
             * @returns {number}
             */
            getHttpStatus: function () {
                var jqXhr = this.jqXhr;
                return jqXhr && jqXhr.status;
            },

            /**
             * Clones event instance. In addition to `giant.Event.clone()`, also copies service-specific properties
             * (by reference).
             * @param {giant.Path} [currentPath]
             * @returns {giant.ServiceEvent}
             * @see giant.Event#clone
             */
            clone: function (currentPath) {
                var clone = /** @type {giant.ServiceEvent} */base.clone.call(this, currentPath);

                return clone
                    .setRequest(this.request)
                    .setResponseNode(this.responseNode)
                    .setJqXhr(this.jqXhr);
            }
        });
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'ServiceEvent', function (eventName) {
            var prefix = 'service';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
