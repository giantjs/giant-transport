/*global giant, giant, giant, giant, giant */
giant.postpone(giant, 'fileSystemEventSpace', function () {
    "use strict";

    /**
     * Event space for image related events.
     * @type {giant.EventSpace}
     */
    giant.fileSystemEventSpace = giant.EventSpace.create();
});
