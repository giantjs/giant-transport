/*jshint node:true */
$oop.postpone($transport, 'File', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented),
        fs;

    /**
     * Creates an File instance.
     * @name $transport.File.create
     * @function
     * @param {$transport.FilePath} filePath File location.
     * @returns {$transport.File}
     */

    /**
     * File implements file operations for local files using the Node filesystem (fs) API.
     * New methods should follow the fs naming conventions.
     * TODO: Perhaps throttler could be class-level?
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     */
    $transport.File = self
        .setEventSpace($event.eventSpace)
        .addPrivateMethods(/** @lends $transport.File# */{
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
             * @returns {$utils.Promise}
             * @private
             */
            _readFile: function () {
                var that = this,
                    filePath = this.filePath,
                    deferred = $utils.Deferred.create(),
                    event;

                this.spawnEvent($transport.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync();

                this._readFileProxy(filePath.toString(), null, function (err, data) {
                    if (err) {
                        event = that.spawnEvent($transport.EVENT_FILE_READ_FAILURE)
                            .setFilePath(filePath)
                            .setFileError(err)
                            .triggerSync();

                        deferred.reject(event);
                    } else {
                        event = that.spawnEvent($transport.EVENT_FILE_READ_SUCCESS)
                            .setFilePath(filePath)
                            .setFileData(data)
                            .triggerSync();

                        deferred.resolve(event);
                    }
                });

                return deferred.promise;
            }
        })
        .addMethods(/** @lends $transport.File# */{
            /**
             * @param {$transport.FilePath} filePath
             * @ignore
             */
            init: function (filePath) {
                $assertion.isLocation(filePath, "Invalid image URL");

                $event.Evented.init.call(this);

                this.elevateMethod('_readFile');

                /**
                 * Local path to the current file.
                 * @type {$transport.FilePath}
                 */
                this.filePath = filePath;

                /** @type {$transport.MultiThrottler} */
                this.readFileThrottler = this._readFile.toMultiThrottler();

                this.setEventPath(filePath.eventPath);
            },

            /**
             * Reads the current local file, triggering events and returning a promise.
             * @returns {$utils.Promise}
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

                this.spawnEvent($transport.EVENT_FILE_READ_START)
                    .setFilePath(filePath)
                    .triggerSync();

                try {
                    data = this._readFileSyncProxy(filePath.toString(), null);

                    this.spawnEvent($transport.EVENT_FILE_READ_SUCCESS)
                        .setFilePath(filePath)
                        .setFileData(data)
                        .triggerSync();
                } catch (e) {
                    this.spawnEvent($transport.EVENT_FILE_READ_FAILURE)
                        .setFilePath(filePath)
                        .setFileError(e)
                        .triggerSync();
                }

                return data;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($transport, /** @lends $transport */{
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

$oop.amendPostponed($transport, 'FilePath', function () {
    "use strict";

    $transport.FilePath
        .addMethods(/** @lends $transport.ImageUrl */{
            /**
             * Converts `FilePath` to `File`.
             * @returns {$transport.File}
             */
            toFile: function () {
                return $transport.File.create(this);
            }
        });
});
