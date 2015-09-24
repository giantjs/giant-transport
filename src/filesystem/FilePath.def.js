/*global giant */
$oop.postpone(giant, 'FilePath', function () {
    "use strict";

    var base = giant.Location,
        self = base.extend();

    /**
     * Creates an FilePath instance.
     * @name giant.FilePath.create
     * @function
     * @param {$data.Path} imagePath
     * @returns {giant.FilePath}
     */

    /**
     * The FilePath is a Location that allows loading of local files.
     * @class
     * @extends giant.Location
     */
    giant.FilePath = self
        .addConstants(/** @lends giant.FilePath */{
            /**
             * Root path for all file event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'file'
        })
        .addMethods(/** @lends giant.FilePath# */{
            /**
             * Reads the file at the current path.
             * @returns {Q.Promise}
             */
            readFile: function () {
                return giant.File.create(this).readFile();
            },

            /**
             * @returns {*}
             */
            readFileSync: function () {
                return giant.File.create(this).readFileSync();
            }
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path.addMethods(/** @lends $data.Path# */{
        /**
         * Converts `Path` to `FilePath`.
         * @returns {giant.FilePath}
         */
        toFilePath: function () {
            return giant.FilePath.create(this);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `FilePath`.
         * @returns {giant.FilePath}
         */
        toFilePath: function () {
            return giant.FilePath.create(this
                .replace(giant.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `FilePath`.
         * @returns {giant.FilePath}
         */
        toFilePath: function () {
            return giant.FilePath.create(this.toPath());
        }
    });
}());
