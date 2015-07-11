/*global giant, giant, giant, giant, jQuery, giant */
giant.postpone(giant, 'Image', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = giant.Base,
        self = base.extend()
            .addTrait(giant.Evented);

    /**
     * Creates an Image instance.
     * @name giant.Image.create
     * @function
     * @param {giant.ImageUrl} imageUrl Location of image.
     * @returns {giant.Image}
     */

    /**
     * The Image class represents an image file, and manages its dynamic loading via a DOM element.
     * Triggers events upon start, success, and failure of loading an image.
     * @class
     * @extends giant.Base
     * @extends giant.Evented
     */
    giant.Image = self
        .addConstants(/** @lends giant.ImageUrl */{
            /**
             * Signals that image started loading.
             * @constant
             */
            EVENT_IMAGE_LOAD_START: 'image-load-start',

            /**
             * Signals that image has finished loading.
             * @constant
             */
            EVENT_IMAGE_LOAD_SUCCESS: 'image-load-success',

            /**
             * Signals that image failed to load.
             * @constant
             */
            EVENT_IMAGE_LOAD_FAILURE: 'image-load-failure'
        })
        .addPrivateMethods(/** @lends giant.Image# */{
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
        .addMethods(/** @lends giant.Image# */{
            /**
             * @param {giant.ImageUrl} imageUrl
             * @ignore
             */
            init: function (imageUrl) {
                giant.isLocation(imageUrl, "Invalid image URL");

                giant.Evented.init.call(this);

                /** @type {giant.ImageUrl} */
                this.imageUrl = imageUrl;

                this
                    .setEventSpace(giant.imageEventSpace)
                    .setEventPath(imageUrl.eventPath);
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

                this.spawnEvent(this.EVENT_IMAGE_LOAD_START)
                    .setImageLocation(imageUrl)
                    .setImageElement(imageElement)
                    .triggerSync();

                this._loadImage(imageElement, imageUrl.toString())
                    .done(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_SUCCESS)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.resolve(imageUrl, imageElement);
                    })
                    .fail(function () {
                        that.spawnEvent(that.EVENT_IMAGE_LOAD_FAILURE)
                            .setImageLocation(imageUrl)
                            .setImageElement(imageElement)
                            .triggerSync();

                        deferred.reject(imageUrl, imageElement);
                    });

                return deferred.promise();
            }
        });
}, jQuery);

giant.amendPostponed(giant, 'ImageUrl', function () {
    "use strict";

    giant.ImageUrl
        .addMethods(/** @lends giant.ImageUrl */{
            /**
             * Converts `ImageUrl` to `Image`.
             * @returns {giant.Image}
             */
            toImage: function () {
                return giant.Image.create(this);
            }
        });
});


