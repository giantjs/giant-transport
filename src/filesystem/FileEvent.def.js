/*global giant, jQuery */
/*jshint node:true */
giant.postpone(giant, 'FileEvent', function () {
    "use strict";

    var base = giant.Event,
        self = base.extend();

    /**
     * Creates an FileEvent instance.
     * @name giant.FileEvent.create
     * @function
     * @param {string} eventName Event name
     * @returns {giant.FileEvent}
     */

    /**
     * @class
     * @extends giant.Event
     */
    giant.FileEvent = self
        .addMethods(/** @lends giant.FileEvent# */{
            /**
             * @param {string} eventName Event name
             * @ignore
             */
            init: function (eventName) {
                base.init.call(this, eventName, giant.fileSystemEventSpace);

                /** @type {giant.FilePath} */
                this.filePath = undefined;

                /** @type {Error} */
                this.fileError = undefined;

                /** @type {*} */
                this.fileData = undefined;
            },

            /**
             * @param {giant.FilePath} filePath
             * @returns {giant.FileEvent}
             */
            setFilePath: function (filePath) {
                giant.isLocation(filePath, "Invalid location");
                this.filePath = filePath;
                return this;
            },

            /**
             * @param {Error} fileError
             * @returns {giant.FileEvent}
             */
            setFileError: function (fileError) {
                giant.assert(fileError instanceof Error, "Invalid file error");
                this.fileError = fileError;
                return this;
            },

            /**
             * @param {string} fileData
             * @returns {giant.FileEvent}
             */
            setFileData: function (fileData) {
                this.fileData = fileData;
                return this;
            },

            /**
             * Clones event instance. In addition to `giant.Event.clone()`, also copies file-specific properties
             * (by reference).
             * @param {giant.Path} [currentPath]
             * @returns {giant.FileEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {giant.FileEvent} */base.clone.call(this, currentPath);

                return clone
                    .setFilePath(this.filePath)
                    .setFileError(this.fileError)
                    .setFileData(this.fileData);
            }
        });
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'FileEvent', function (eventName, eventSpace) {
            return eventSpace === giant.fileSystemEventSpace;
        });
});