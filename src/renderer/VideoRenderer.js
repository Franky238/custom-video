var VideoRenderer = (function (config) {

    return {

        /**
         * Factory for source tag template
         *
         * @param src
         * @param type
         * @returns {string}
         */
        sourceTag: function (src, type) {
            type = type || config['defaultVideoType'];

            return '<source src="' + src + '" type="video/' + type + '">';
        },

        /**
         * Render video options
         *
         * @param videoOption
         * @param selector
         * @param value
         */
        renderVideoOptions: function (selector, videoOption, value) {
            document.querySelector(selector).setAttribute(videoOption, value);
        },

        /**
         * Render video source tag
         *
         * @param source
         * @param selector
         * TODO create a Array input for both situation - array of string and array of objects
         */
        renderSources: function (source, selector) {
            var response = [];
            var self = this;
            var element = document.querySelector(selector);
            var isSourceNotValid = !_.isString(source) && !_.isObject(source);

            if (!element) {
                throw new Error('Can not create DOM element from selector: ' + selector);
            }

            if (isSourceNotValid) {
                throw new Error('Parameter source is not compatible! It should be String or Object. See docs');
            }

            if (_.isObject(source)) {
                Object.keys(source).forEach(function (type) {
                    response.push(self.sourceTag(source[type], type));
                })
            } else {
                response.push(self.sourceTag(source));
            }

            element.innerHTML += response;

            return response;
        }
    }

})(Config);