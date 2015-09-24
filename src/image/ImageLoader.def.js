/*global giant, jQuery */
$oop.postpone(giant, 'ImageLoader', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented);

    /**
     * Creates an ImageLoader instance.
     * @name giant.ImageLoader.create
     * @function
     * @param {giant.ImageUrl} imageUrl Location of image.
     * @returns {giant.ImageLoader}
     */

    /**
     * The ImageLoader class represents an image file, and manages its dynamic loading via a DOM element.
     * Triggers events upon start, success, and failure of loading an image.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     */
    giant.ImageLoader = self
        .setEventSpace($event.eventSpace)
        .addPrivateMethods(/** @lends giant.ImageLoader# */{
            /**
             * @returns {HTMLImageElement}
             * @private
             */
            _createImageElementProxy: function () {
                return document.createElement('img');
            },

            /**
             * Applies the specified src attribute to the specified image DOM element, and subscribes to its events.
             * @param {HTMLImageElement} imageElement
             * @param {string} srcAttribute
             * @returns {jQuery.Promise}
             * @private
             */
            _loadImage: function (imageElement, srcAttribute) {
                var deferred = $.Deferred();

                imageElement.onload = deferred.resolve.bind(deferred);
                imageElement.onerror = deferred.reject.bind(deferred);

                imageElement.src = srcAttribute;

                return deferred.promise();
            }
        })
        .addMethods(/** @lends giant.ImageLoader# */{
            /**
             * @param {giant.ImageUrl} imageUrl
             * @ignore
             */
            init: function (imageUrl) {
                $assertion.isLocation(imageUrl, "Invalid image URL");

                $event.Evented.init.call(this);

                /** @type {giant.ImageUrl} */
                this.imageUrl = imageUrl;

                this.setEventPath(imageUrl.eventPath);
            },

            /**
             * Loads image dynamically. Triggers appropriate events at each stage of the loading process.
             * @returns {jQuery.Promise}
             */
            loadImage: function () {
                var that = this,
                    imageUrl = this.imageUrl,
                    imageElement = this._createImageElementProxy(),
                    deferred = $.Deferred();

                this.spawnEvent(giant.EVENT_IMAGE_LOAD_START)
                    .setImageLocation(imageUrl)
                    .setImageElement(imageElement)
                    .triggerSync();

                this._loadImage(imageElement, imageUrl.toString())
                    .done(function () {
                        that.spawnEvent(giant.EVENT_IMAGE_LOAD_SUCCESS)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.resolve(imageUrl, imageElement);
                    })
                    .fail(function () {
                        that.spawnEvent(giant.EVENT_IMAGE_LOAD_FAILURE)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.reject(imageUrl, imageElement);
                    });

                return deferred.promise();
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call(giant, /** @lends giant */{
        /**
         * Signals that an Image started loading.
         * @constant
         */
        EVENT_IMAGE_LOAD_START: 'image.load.start',

        /**
         * Signals that an Image has finished loading.
         * @constant
         */
        EVENT_IMAGE_LOAD_SUCCESS: 'image.load.success',

        /**
         * Signals that an Image failed to load.
         * @constant
         */
        EVENT_IMAGE_LOAD_FAILURE: 'image.load.failure'
    });
}());

$oop.amendPostponed(giant, 'ImageUrl', function () {
    "use strict";

    giant.ImageUrl
        .addMethods(/** @lends giant.ImageUrl */{
            /**
             * Converts `ImageUrl` to `ImageLoader`.
             * @returns {giant.ImageLoader}
             */
            toImageLoader: function () {
                return giant.ImageLoader.create(this);
            }
        });
});


