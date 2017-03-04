var VideoRenderer = (function (config, videoController) {
    var options;
    var videoElement;

    return {

        /**
         * Setter for Options
         *
         * @param opts
         */
        setOptions: function (opts) {
            options = opts;
        },

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
         * Render video source tag
         *
         * @param source
         * @param element
         * TODO create a Array input for both situation - array of string and array of objects
         */
        renderSources: function (source, element) {
            var response = [];
            var self = this;
            var isSourceNotValid = !_.isString(source) && !_.isObject(source);

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
        },

        /**
         * Render an video tag into wrapper
         *
         * @param element
         */
        renderVideo: function (element) {
            var video = document.createElement('video');
            video.innerHTML = 'Your browser doesn\'t support HTML5 video tag.'
            videoElement = video;

            element.appendChild(video);

            return video;
        },

        /**
         * Will create direct src on video tag
         *
         * @param element
         * @param source
         */
        toggleSrc: function (element, source) {
            var canPlay;

            if (_.isObject(source)) {
                var types = Object.keys(source); // [mp4, ... ]
                var srcType;
                for (var i = 0; i < types.length; i++) {
                    canPlay = element.canPlayType('video/' + types[i]);

                    if (canPlay) { // if 'maybe' or something else do this else next item
                        srcType = types[i]; // (string) mp4
                        break;
                    }
                }

                element.setAttribute('src', source[srcType]);
            } else {
                canPlay = element.canPlayType('video/' +  config['defaultVideoType']);

                if (canPlay) { // if 'maybe' or something else do this else next item
                    element.setAttribute('src', source);
                }
            }
        },

        /**
         * Render video options
         *
         * @param videoOption
         * @param element
         * @param value
         */
        renderVideoOption: function (element, videoOption, value) {
            element[videoOption] = value;
        },

        /**
         * Will render video controls
         *
         * @param element
         * @param customControls
         * @param renderTo
         */
        renderControls: function (element, customControls, renderTo) { // todo after finish second panel
            var self = this;

            if (!!customControls) {
                var controlsWrapper = document.createElement('div');
                controlsWrapper.className = 'controls-wrapper';

                Object.keys(customControls).forEach(function (item) {
                    if (!!customControls[item]) {
                        var btn = self.renderButton(
                            customControls[item]['name'],
                            customControls[item]['id'],
                            customControls[item]['className'],
                            customControls[item]['title']
                        );

                        var method = videoController.resolveMethod(item);
                        btn.addEventListener('click', function () {
                            self[method]();
                        });

                        controlsWrapper.appendChild(btn);
                    }
                });

                renderTo.appendChild(controlsWrapper);
            } else {
                element.controls = true;
            }
        },

        /**
         * Render one button with params
         *
         * @param name
         * @param id
         * @param className
         * @param title
         * @returns {Element}
         */
        renderButton: function (name, id, className, title) {
            var btn = document.createElement('button');
            id = id || undefined;
            className = className || undefined;
            title = title || undefined;

            btn.type = 'button';

            id === undefined || (btn.id = id);
            className === undefined || (btn.className = className);
            title === undefined || (btn.title = title);

            btn.innerHTML = name;

            return btn;
        },

        /**
         * Render next source
         */
        renderNext: function () {
            var index = videoController.nextIndex(options);
            var newSrc = videoController.toggleSource(index, options);

            this.toggleSrc(videoElement, newSrc);
        },

        /**
         * Render previous source
         */
        renderPrevious: function () {
            var index = videoController.previousIndex(options);
            var newSrc = videoController.toggleSource(index, options);

            this.toggleSrc(videoElement, newSrc);
        },

        renderPlayPause: function () {
            videoController.playPause(videoElement);
        }
    }

})(Config, VideoController);