/*jshint node:true */
$oop.postpone($transport, 'FileEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * Creates an FileEvent instance.
     * @name $transport.FileEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {$event.EventSpace} eventSpace Event space
     * @returns {$transport.FileEvent}
     */

    /**
     * @class
     * @extends $event.Event
     */
    $transport.FileEvent = self
        .addMethods(/** @lends $transport.FileEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {$event.EventSpace} eventSpace Event space
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /** @type {$transport.FilePath} */
                this.filePath = undefined;

                /** @type {Error} */
                this.fileError = undefined;

                /** @type {*} */
                this.fileData = undefined;
            },

            /**
             * @param {$transport.FilePath} filePath
             * @returns {$transport.FileEvent}
             */
            setFilePath: function (filePath) {
                $assertion.isLocation(filePath, "Invalid location");
                this.filePath = filePath;
                return this;
            },

            /**
             * @param {Error} fileError
             * @returns {$transport.FileEvent}
             */
            setFileError: function (fileError) {
                $assertion.assert(fileError instanceof Error, "Invalid file error");
                this.fileError = fileError;
                return this;
            },

            /**
             * @param {string} fileData
             * @returns {$transport.FileEvent}
             */
            setFileData: function (fileData) {
                this.fileData = fileData;
                return this;
            },

            /**
             * Clones event instance. In addition to `$event.Event.clone()`, also copies file-specific properties
             * (by reference).
             * @param {$data.Path} [currentPath]
             * @returns {$transport.FileEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {$transport.FileEvent} */base.clone.call(this, currentPath);

                return clone
                    .setFilePath(this.filePath)
                    .setFileError(this.fileError)
                    .setFileData(this.fileData);
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($transport, 'FileEvent', function (eventName) {
            var prefix = 'file';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
