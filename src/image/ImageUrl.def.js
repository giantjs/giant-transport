$oop.postpone($transport, 'ImageUrl', function () {
    "use strict";

    var base = $transport.Location,
        self = base.extend();

    /**
     * Creates an ImageUrl instance.
     * @name $transport.ImageUrl.create
     * @function
     * @param {$data.Path} imagePath
     * @returns {$transport.ImageUrl}
     */

    /**
     * The ImageUrl is a Location that allows dynamic loading of images via DOM image element.
     * @class
     * @extends $transport.Location
     */
    $transport.ImageUrl = self
        .addConstants(/** @lends $transport.ImageUrl */{
            /**
             * Root path for all image event paths.
             * @constant
             * @type {string}
             */
            EVENT_ROOT_PATH: 'image'
        })
        .addMethods(/** @lends $transport.ImageUrl# */{
            /**
             * Initiates loading of image.
             * @returns {$utils.Promise}
             */
            loadImage: function () {
                return $transport.ImageLoader.create(this).loadImage();
            }
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path.addMethods(/** @lends $data.Path# */{
        /**
         * Converts `Path` to `ImageUrl`.
         * @returns {$transport.ImageUrl}
         */
        toImageUrl: function () {
            return $transport.ImageUrl.create(this);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `ImageUrl`.
         * @returns {$transport.ImageUrl}
         */
        toImageUrl: function () {
            return $transport.ImageUrl.create(this
                .replace($transport.Location.LEADING_TRAILING_SLASHES, '') // removing leading & trailing slashes
                .split('/') // splitting up slash-separated path
                .toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `ImageUrl`.
         * @returns {$transport.ImageUrl}
         */
        toImageUrl: function () {
            return $transport.ImageUrl.create(this.toPath());
        }
    });
}());
