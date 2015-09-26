$oop.postpone($transport, 'ImageEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * Creates an ImageEvent instance.
     * @name $transport.ImageEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {$event.EventSpace} eventSpace Event space
     * @returns {$transport.ImageEvent}
     */

    /**
     * The ImageEvent class pertains to dynamic loading of images. The purpose of such events is to carry information
     * about the image being / having been loaded.
     * ImageLoader events are usually triggered at various stages of the loading process.
     * @class
     * @extends $event.Event
     */
    $transport.ImageEvent = self
        .addMethods(/** @lends $transport.ImageEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {$event.EventSpace} eventSpace Event space
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Location of image associated with event.
                 * @type {$transport.ImageUrl}
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
             * @param {$transport.ImageUrl} imageUrl
             * @returns {$transport.ImageEvent}
             */
            setImageLocation: function (imageUrl) {
                $assertion.isLocation(imageUrl, "Invalid location");
                this.imageUrl = imageUrl;
                return this;
            },

            /**
             * Sets image DOM element property.
             * @param {HTMLImageElement} imageElement
             */
            setImageElement: function (imageElement) {
                $assertion.isImageElement(imageElement, "Invalid image element");
                this.imageElement = imageElement;
                return this;
            },

            /**
             * Clones event instance. In addition to `$event.Event.clone()`, also copies image-specific properties
             * (by reference).
             * @param {$data.Path} [currentPath]
             * @returns {$transport.ImageEvent}
             */
            clone: function (currentPath) {
                var clone = /** @type {$transport.ImageEvent} */base.clone.call(this, currentPath);

                return clone
                    .setImageLocation(this.imageUrl)
                    .setImageElement(this.imageElement);
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($transport, 'ImageEvent', function (eventName) {
            var prefix = 'image';
            return eventName.substr(0, prefix.length) === prefix;
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $transport */{
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