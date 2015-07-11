/*global giant */
giant.postpone(giant, 'serviceEventSpace', function () {
    "use strict";

    /**
     * Event space for service related events.
     * @type {giant.EventSpace}
     */
    giant.serviceEventSpace = giant.EventSpace.create();
});