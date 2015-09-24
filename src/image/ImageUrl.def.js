/*global giant, jQuery */
$oop.postpone(giant, 'ImageUrl', function () {
    "use strict";

    var base = giant.Location,
        self = base.extend();

    /**
     * Creates an ImageUrl instance.
     * @name giant.ImageUrl.create
     * @function
     * @param {giant.Path} imagePath
     * @returns {giant.ImageUrl}
     */

    /**
     * The ImageUrl is a Location that allows dynamic loading of images via DOM image element.
     * @class
     * @extends giant.Location
     */
    giant.ImageUrl = self
        .addConstants(/** @lends giant.ImageUrl */{
            /**
             * Root path for all image event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'image'
        })
        .addMethods(/** @lends giant.ImageUrl# */{
            /**
             * Initiates loading of image.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                return giant.ImageLoader.create(this).loadImage();
            }
        });
});

$oop.amendPostponed(giant, 'Path', function () {
    "use strict";

    giant.Path.addMethods(/** @lends giant.Path# */{
        /**
         * Converts `Path` to `ImageUrl`.
         * @returns {giant.ImageUrl}
         */
        toImageUrl: function () {
            return giant.ImageUrl.create(this);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `ImageUrl`.
         * @returns {giant.ImageUrl}
         */
        toImageUrl: function () {
            return giant.ImageUrl.create(this
                .replace(giant.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `ImageUrl`.
         * @returns {giant.ImageUrl}
         */
        toImageUrl: function () {
            return giant.ImageUrl.create(this.toPath());
        }
    });
}());
