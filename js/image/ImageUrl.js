/*global giant, giant, giant, giant, jQuery, giant */
giant.postpone(giant, 'ImageUrl', function () {
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
             * @param {giant.Path} imagePath
             * @ignore
             */
            init: function (imagePath) {
                base.init.call(this, imagePath);
                this.setEventSpace(giant.imageEventSpace);
            },

            /**
             * Initiates loading of image.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                return giant.Image.create(this).loadImage();
            }
        });
});

giant.amendPostponed(giant, 'Path', function () {
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

    giant.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
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
        },
        false, false, false
    );

    giant.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `ImageUrl`.
             * @returns {giant.ImageUrl}
             */
            toImageUrl: function () {
                return giant.ImageUrl.create(this.toPath());
            }
        },
        false, false, false
    );
}());
