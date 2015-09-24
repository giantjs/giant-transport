/*global giant, Q, jQuery */
/*jshint node:true */
$oop.postpone(giant, 'File', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait(giant.Evented),
        fs;

    /**
     * Creates an File instance.
     * @name giant.File.create
     * @function
     * @param {giant.FilePath} filePath File location.
     * @returns {giant.File}
     */

    /**
     * File implements file operations for local files using the Node filesystem (fs) API.
     * New methods should follow the fs naming conventions.
     * TODO: Perhaps throttler could be class-level?
     * @class
     * @extends $oop.Base
     * @extends giant.Evented
     */
    giant.File = self
        .setEventSpace(giant.eventSpace)
        .addPrivateMethods(/** @lends giant.File# */{
            /**
             * @param {string} filename
             * @param {object} options
             * @param {function} callback
             * @private
             */
            _readFileProxy: function (filename, options, callback) {
                fs = fs || require('fs');
                return fs.readFile(filename, options, callback);
            },

            /**
             * @param {string} filename
             * @param {object} options
             * @returns {*}
             * @private
             */
            _readFileSyncProxy: function (filename, options) {
                fs = fs || require('fs');
                return fs.readFileSync(filename, options);
            },

            /**
             * @returns {Q.Promise}
             * @private
             */
            _readFile: function () {
                var that = this,
                    filePath = this.filePath,
                    deferred = Q.defer(),
                    event;

                this.spawnEvent(giant.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync();

                this._readFileProxy(filePath.toString(), null, function (err, data) {
                    if (err) {
                        event = that.spawnEvent(giant.EVENT_FILE_READ_FAILURE)
                            .setFilePath(filePath)
                            .setFileError(err)
                            .triggerSync();

                        deferred.reject(event);
                    } else {
                        event = that.spawnEvent(giant.EVENT_FILE_READ_SUCCESS)
                            .setFilePath(filePath)
                            .setFileData(data)
                            .triggerSync();

                        deferred.resolve(event);
                    }
                });

                return deferred.promise;
            }
        })
        .addMethods(/** @lends giant.File# */{
            /**
             * @param {giant.FilePath} filePath
             * @ignore
             */
            init: function (filePath) {
                $assertion.isLocation(filePath, "Invalid image URL");

                giant.Evented.init.call(this);

                this.elevateMethod('_readFile');

                /**
                 * Local path to the current file.
                 * @type {giant.FilePath}
                 */
                this.filePath = filePath;

                /** @type {giant.Throttler} */
                this.readFileThrottler = this._readFile.toThrottler();

                this.setEventPath(filePath.eventPath);
            },

            /**
             * Reads the current local file, triggering events and returning a promise.
             * @returns {Q.Promise}
             */
            readFile: function () {
                return this.readFileThrottler.runThrottled(this.filePath.toString());
            },

            /**
             * Reads the current local file synchronously, triggering events, and returning the buffer.
             * @returns {*}
             */
            readFileSync: function () {
                var filePath = this.filePath,
                    data;

                this.spawnEvent(giant.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync();

                try {
                    data = this._readFileSyncProxy(filePath.toString(), null);

                    this.spawnEvent(giant.EVENT_FILE_READ_SUCCESS)
                        .setFilePath(filePath)
                        .setFileData(data)
                        .triggerSync();
                } catch (e) {
                    this.spawnEvent(giant.EVENT_FILE_READ_FAILURE)
                        .setFilePath(filePath)
                        .setFileError(e)
                        .triggerSync();
                }

                return data;
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call(giant, /** @lends giant */{
        /**
         * Signals that a File has started loading.
         * @constant
         */
        EVENT_FILE_READ_START: 'file.load.start',

        /**
         * Signals that a File has finished loading.
         * @constant
         */
        EVENT_FILE_READ_SUCCESS: 'file.load.success',

        /**
         * Signals that a File failed to load.
         * @constant
         */
        EVENT_FILE_READ_FAILURE: 'file.load.failure'
    });
}());

$oop.amendPostponed(giant, 'FilePath', function () {
    "use strict";

    giant.FilePath
        .addMethods(/** @lends giant.ImageUrl */{
            /**
             * Converts `FilePath` to `File`.
             * @returns {giant.File}
             */
            toFile: function () {
                return giant.File.create(this);
            }
        });
});
