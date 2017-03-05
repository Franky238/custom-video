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
                controlsWrapper.className = config['controlsWrapper'];

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
                            self.toggleButton(this, item);
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
         * Remove controls wrapper
         */
        removeControls: function () {
            document.querySelector('.' + config['controlsWrapper']).remove();
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
            document.dispatchEvent(new Event(config['events']['onVideoChanged']));
        },

        /**
         * Render previous source
         */
        renderPrevious: function () {
            var index = videoController.previousIndex(options);
            var newSrc = videoController.toggleSource(index, options);

            this.toggleSrc(videoElement, newSrc);
            document.dispatchEvent(new Event(config['events']['onVideoChanged']));
        },

        renderPlayPause: function () {
            videoController.playPause(videoElement);
        },

        /**
         * Toggle button to toggleTo param from config
         *
         * @param element
         * @param key
         */
        toggleButton: function (element, key) {
            var toggleTo = options['controls']['customControls'][key]['toggleTo'];
            var control = options['controls']['customControls'][key];
            var dataToggle = element['attributes']['data-toggled'];
            var isToggled = dataToggle === undefined ? undefined : parseInt(dataToggle['value']);

            if (toggleTo && !isToggled) {
                toggleTo.id === undefined || (element.id = toggleTo.id);
                toggleTo.className === undefined || (element.className = toggleTo.className);
                toggleTo.title === undefined || (element.title = toggleTo.title);
                toggleTo.name === undefined || (element.innerHTML = toggleTo.name);

                element.setAttribute('data-toggled', '1');
            } else if (isToggled) {
                control.id === undefined || (element.id = control.id);
                control.className === undefined || (element.className = control.className);
                control.title === undefined || (element.title = control.title);
                control.name === undefined || (element.innerHTML = control.name);

                element.setAttribute('data-toggled', '0');
            }
        },

        /**
         * Render progress bar element
         *
         * @returns {Element}
         */
        renderProgressBar: function () {
            var progressBarOpts = options['controls']['progressBar'];
            var progressBar = document.createElement('div');

            progressBar.className = 'progressBar';
            progressBar['style'].position = 'relative';
            progressBar['style'].width = progressBarOpts['width'];
            progressBar['style'].height = progressBarOpts['height'];
            progressBar['style'].border = progressBarOpts['border'];

            return progressBar;
        },

        /**
         * Render time bar element
         *
         * @returns {Element}
         */
        renderTimeBar: function () {
            var progressBarOpts = options['controls']['progressBar'];

            var timeBar = document.createElement('div');
            timeBar.className = 'timeBar';
            timeBar['style'].position = 'relative';
            timeBar['style'].width = '0px';
            timeBar['style'].height = progressBarOpts['height'];
            timeBar['style'].backgroundColor = progressBarOpts['playedColor'];
            timeBar['style'].zIndex = 1;

            return timeBar;
        },

        /**
         * Render loaded bar element
         *
         * @returns {Element}
         */
        renderLoadedBar: function () {
            var progressBarOpts = options['controls']['progressBar'];

            var timeBar = document.createElement('div');
            timeBar.className = 'timeBar';
            timeBar['style'].position = 'absolute';
            timeBar['style'].top = '0px';
            timeBar['style'].width = '0px';
            timeBar['style'].height = progressBarOpts['height'];
            timeBar['style'].backgroundColor = progressBarOpts['progressColor'];
            timeBar['style'].zIndex = 0;

            return timeBar;
        },

        /**
         * Render progress bar
         *
         * @param renderTo
         */
        renderFullProgressBar: function (renderTo) {
            var self = this;
            var controlsWrapper = renderTo.querySelector('.' + config['controlsWrapper']);

            var progressBar = this.renderProgressBar();
            var timeBar = this.renderTimeBar();
            var loadedBar = this.renderLoadedBar();

            progressBar.appendChild(timeBar);
            progressBar.appendChild(loadedBar);
            controlsWrapper.appendChild(progressBar);

            // registered drag events
            var timeDrag = false;
            progressBar.addEventListener('mousedown', function (event) {
                timeDrag = true;
                self.updateVideoTo(event.pageX, progressBar, timeBar);
            });

            progressBar.addEventListener('mouseup', function (event) {
                if (timeDrag) {
                    timeDrag = false;
                    self.updateVideoTo(event.pageX, progressBar, timeBar);
                }
            });

            progressBar.addEventListener('mousemove', function (event) {
                if (timeDrag) {
                    self.updateVideoTo(event.pageX, progressBar, timeBar);
                }
            });

            videoElement.addEventListener('progress', function() {
                self.updateLoaded(progressBar, loadedBar);
            }, false);

            return progressBar;
        },

        /**
         * Update the value of progressBar
         *
         * @param timeBar
         */
        updateProgressBar: function (timeBar) {
            var percentage = videoController.updateProgressBar(videoElement);

            if (!percentage) {
                return;
            }

            timeBar['style'].width = percentage + '%';
        },

        /**
         * Manual video update
         *
         * @param to
         * @param progressBar
         * @param timeBar
         */
        updateVideoTo: function (to, progressBar, timeBar) {
            var maxDuration = videoElement.duration;
            var position = to - progressBar.offsetLeft; // click position
            var percentage = 100 * position / progressBar.clientWidth;

            if (!maxDuration) {
                return;
            }

            //Check within range
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }

            timeBar['style'].width = percentage + '%';
            videoElement.currentTime = maxDuration * percentage / 100;
        },

        /**
         * Update loaded bar
         *
         * @param bufferEnd
         * @param progressBar
         * @param loadedBar
         */
        updateLoaded: function (progressBar, loadedBar) {
            var maxDuration = videoElement.duration;
            var buffer = videoElement.buffered;

            if (!maxDuration || buffer.length < 1) {
                return;
            }
            var bufferEnd = videoElement.buffered.end(videoElement.buffered.length - 1);

            var percentage = (bufferEnd/maxDuration)*100;

            loadedBar['style'].width = percentage + '%';
        }
    }

})(Config, VideoController);