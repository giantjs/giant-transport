$oop.postpone($transport, 'ImageLoader', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented);

    /**
     * Creates an ImageLoader instance.
     * @name $transport.ImageLoader.create
     * @function
     * @param {$transport.ImageUrl} imageUrl Location of image.
     * @returns {$transport.ImageLoader}
     */

    /**
     * The ImageLoader class represents an image file, and manages its dynamic loading via a DOM element.
     * Triggers events upon start, success, and failure of loading an image.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     */
    $transport.ImageLoader = self
        .setEventSpace($event.eventSpace)
        .addPrivateMethods(/** @lends $transport.ImageLoader# */{
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
             * @returns {$utils.Promise}
             * @private
             */
            _loadImage: function (imageElement, srcAttribute) {
                var deferred = $utils.Deferred.create();

                imageElement.onload = deferred.resolve.bind(deferred);
                imageElement.onerror = deferred.reject.bind(deferred);

                imageElement.src = srcAttribute;

                return deferred.promise;
            }
        })
        .addMethods(/** @lends $transport.ImageLoader# */{
            /**
             * @param {$transport.ImageUrl} imageUrl
             * @ignore
             */
            init: function (imageUrl) {
                $assertion.isLocation(imageUrl, "Invalid image URL");

                $event.Evented.init.call(this);

                /** @type {$transport.ImageUrl} */
                this.imageUrl = imageUrl;

                this.setEventPath(imageUrl.eventPath);
            },

            /**
             * Loads image dynamically. Triggers appropriate events at each stage of the loading process.
             * @returns {$utils.Promise}
             */
            loadImage: function () {
                var that = this,
                    imageUrl = this.imageUrl,
                    imageElement = this._createImageElementProxy(),
                    deferred = $utils.Deferred.create();

                this.spawnEvent($transport.EVENT_IMAGE_LOAD_START)
                    .setImageLocation(imageUrl)
                    .setImageElement(imageElement)
                    .triggerSync();

                this._loadImage(imageElement, imageUrl.toString())
                    .then(function () {
                        that.spawnEvent($transport.EVENT_IMAGE_LOAD_SUCCESS)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.resolve(imageUrl, imageElement);
                    },
                    function () {
                        that.spawnEvent($transport.EVENT_IMAGE_LOAD_FAILURE)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.reject(imageUrl, imageElement);
                    });

                return deferred.promise;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($transport, /** @lends $transport */{
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

$oop.amendPostponed($transport, 'ImageUrl', function () {
    "use strict";

    $transport.ImageUrl
        .addMethods(/** @lends $transport.ImageUrl */{
            /**
             * Converts `ImageUrl` to `ImageLoader`.
             * @returns {$transport.ImageLoader}
             */
            toImageLoader: function () {
                return $transport.ImageLoader.create(this);
            }
        });
});


