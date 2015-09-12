/*global giant */
giant.postpone(giant, 'imageEventSpace', function () {
    "use strict";

    /**
     * Event space for image related events.
     * @type {giant.EventSpace}
     */
    giant.imageEventSpace = giant.EventSpace.create();
});
