$oop.postpone($transport, 'ServiceEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * Creates a ServiceEvent instance.
     * @name $transport.ServiceEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {$event.EventSpace} eventSpace Event space
     * @returns {$transport.ServiceEvent}
     */

    /**
     * The ServiceEvent class represents an event that relates to services. Offers an API to access the internals
     * of relevant properties, eg. the response node of the service that triggered the event.
     * Service events are usually triggered at different stages of a service call.
     * @class
     * @extends $event.Event
     */
    $transport.ServiceEvent = self
        .addMethods(/** @lends $transport.ServiceEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {$event.EventSpace} eventSpace Event space
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Request associated with the event.
                 * @type {$transport.Request}
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
             * @param {$transport.Request} request
             * @returns {$transport.ServiceEvent}
             */
            setRequest: function (request) {
                $assertion.isRequest(request, "Invalid request");
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
             * @returns {$transport.ServiceEvent}
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
             * @param {$data.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {*}
             */
            getResponseNode: function (path) {
                $assertion.isPathOptional(path, "Invalid path");
                return path ?
                    $data.Tree.create(this.responseNode).getNode(path) :
                    this.responseNode;
            },

            /**
             * Fetches data node from the response node, wrapped in a `Hash` instance.
             * @param {$data.Path} [path] Path pointing to the node to be fetched. When absent,
             * the entire `responseNode` will be returned.
             * @returns {$data.Hash}
             * @see $transport.ServiceEvent#getResponseNode
             */
            getResponseNodeAsHash: function (path) {
                $assertion.isPathOptional(path, "Invalid path");
                return path ?
                    $data.Tree.create(this.responseNode).getNodeAsHash(path) :
                    $data.Hash.create(this.responseNode);
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
                $assertion.isString(fieldName, "Invalid field name");
                var responseNode = this.responseNode;
                return responseNode ?
                    responseNode[fieldName] :
                    undefined;
            },

            /**
             * Sets jQuery XHR property.
             * @param {jQuery.jqXHR} jqXhr
             * @returns {$transport.ServiceEvent}
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
             * Clones event instance. In addition to `$event.Event.clone()`, also copies service-specific properties
             * (by reference).
             * @param {$data.Path} [currentPath]
             * @returns {$transport.ServiceEvent}
             * @see $event.Event#clone
             */
            clone: function (currentPath) {
                var clone = /** @type {$transport.ServiceEvent} */base.clone.call(this, currentPath);

                return clone
                    .setRequest(this.request)
                    .setResponseNode(this.responseNode)
                    .setJqXhr(this.jqXhr);
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($transport, 'ServiceEvent', function (eventName) {
            var prefix = 'service';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
