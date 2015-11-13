$oop.postpone($transport, 'FilePath', function () {
    "use strict";

    var base = $transport.Location,
        self = base.extend();

    /**
     * Creates an FilePath instance.
     * @name $transport.FilePath.create
     * @function
     * @param {$data.Path} imagePath
     * @returns {$transport.FilePath}
     */

    /**
     * The FilePath is a Location that allows loading of local files.
     * @class
     * @extends $transport.Location
     */
    $transport.FilePath = self
        .addConstants(/** @lends $transport.FilePath */{
            /**
             * Root path for all file event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'file'
        })
        .addMethods(/** @lends $transport.FilePath# */{
            /**
             * Reads the file at the current path.
             * @returns {$utils.Promise}
             */
            readFile: function () {
                return $transport.File.create(this).readFile();
            },

            /**
             * @returns {*}
             */
            readFileSync: function () {
                return $transport.File.create(this).readFileSync();
            }
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path.addMethods(/** @lends $data.Path# */{
        /**
         * Converts `Path` to `FilePath`.
         * @returns {$transport.FilePath}
         */
        toFilePath: function () {
            return $transport.FilePath.create(this);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `FilePath`.
         * @returns {$transport.FilePath}
         */
        toFilePath: function () {
            return $transport.FilePath.create(this
                .replace($transport.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `FilePath`.
         * @returns {$transport.FilePath}
         */
        toFilePath: function () {
            return $transport.FilePath.create(this.toPath());
        }
    });
}());
