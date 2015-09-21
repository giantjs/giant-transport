/*global giant, jQuery */
giant.postpone(giant, 'ImageEvent', function () {
    "use strict";

    var base = giant.Event,
        self = base.extend();

    /**
     * Creates an ImageEvent instance.
     * @name giant.ImageEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {giant.EventSpace} eventSpace Event space
     * @returns {giant.ImageEvent}
     */

    /**
     * The ImageEvent class pertains to dynamic loading of images. The purpose of such events is to carry information
     * about the image being / having been loaded.
     * ImageLoader events are usually triggered at various stages of the loading process.
     * @class
     * @extends giant.Event
     */
    giant.ImageEvent = self
        .addMethods(/** @lends giant.ImageEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {giant.EventSpace} eventSpace Event space
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Location of image associated with event.
                 * @type {giant.ImageUrl}
                 */
                this.imageUrl = undefined;

                /**
                 * ImageLoader DOM element associated with event.
                 * @type {HTMLImageElement}
                 */
                this.imageElement = undefined;
            },

            /**
             * Sets image location property.
             * @param {giant.ImageUrl} imageUrl
             * @returns {giant.ImageEvent}
             */
            setImageLocation: function (imageUrl) {
                giant.isLocation(imageUrl, "Invalid location");
                this.imageUrl = imageUrl;
                return this;
            },

            /**
             * Sets image DOM element property.
             * @param {HTMLImageElement} imageElement
             */
            setImageElement: function (imageElement) {
                giant.isImageElement(imageElement, "Invalid image element");
                this.imageElement = imageElement;
                return this;
            },

            /**
             * Clones event instance. In addition to `giant.Event.clone()`, also copies image-specific properties
             * (by reference).
             * @param {giant.Path} [currentPath]
             * @returns {giant.ImageEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {giant.ImageEvent} */base.clone.call(this, currentPath);

                return clone
                    .setImageLocation(this.imageUrl)
                    .setImageElement(this.imageElement);
            }
        });
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'ImageEvent', function (eventName) {
            var prefix = 'image';
            return eventName.substr(0, prefix.length) === prefix;
        });
});

(function () {
    "use strict";

    giant.addTypes(/** @lends giant */{
        /** @param {HTMLImageElement} expr */
        isImageElement: function (expr) {
            return expr instanceof HTMLImageElement;
        },

        /** @param {HTMLImageElement} [expr] */
        isImageElementOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   expr instanceof HTMLImageElement;
        }
    });
}());