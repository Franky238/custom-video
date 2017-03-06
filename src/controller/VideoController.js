var VideoController = (function (config) {
    var srcIndex = 0;

    return {
        /**
         * Toggle source of video
         *
         * @param index
         * @param options
         * @returns {*}
         */
        toggleSource: function (index, options) {
            index = index || 0;
            var sources = options['sources'];

            if (!_.isArray(sources)) {
                throw new Error('Parameter sources is not compatible! It should be Array. See docs');
            }

            return sources[index];
        },

        /**
         * Calculate next index for source
         *
         * @param options
         * @returns {number}
         */
        nextIndex: function (options) {
            srcIndex++;

            if (options['controls']['sourceLoop'] && srcIndex >= options['sources'].length) {
                srcIndex = 0;
            } else if (!options['controls']['sourceLoop'] && srcIndex >= options['sources'].length) {
                srcIndex = options['sources'].length - 1;
            }

            return srcIndex;
        },

        /**
         * Calculate previous index for source
         *
         * @param options
         * @returns {number}
         */
        previousIndex: function (options) {
            srcIndex--;

            if (options['controls']['sourceLoop'] && srcIndex < 0) {
                srcIndex = options['sources'].length - 1;
            } else if (!options['controls']['sourceLoop'] && srcIndex < 0) {
                srcIndex = 0;
            }

            return srcIndex;
        },

        /**
         * Toggle play/pause
         *
         * @param videoElement
         */
        playPause: function (videoElement) {
            if (videoElement.paused || videoElement.ended) {
                videoElement.play();
                videoElement.dispatchEvent(new Event(config['events']['onVideoPlay']))
            } else {
                videoElement.pause();
                videoElement.dispatchEvent(new Event(config['events']['onVideoPause']))
            }
        },

        /**
         * Calculate value for progressBar
         *
         * @param videoElement
         * @returns {number}
         */
        updateProgressBar: function (videoElement) {
            return Math.floor((100 / videoElement.duration) * videoElement.currentTime);
        },

        /**
         * Format time digits in right format
         *
         * @param seconds
         * @returns {string}
         */
        formatDigits: function (seconds) {
            var hours = this.pad(parseInt(seconds/3600));
            var restSeconds = this.pad(parseInt(seconds%3600));
            var minutes = this.pad(parseInt(restSeconds/60));
            var rest = this.pad(parseInt(restSeconds%60));

            if(hours == 0) {
                return minutes + ':' + rest;
            }

            return hours + ':' + minutes + ':' + rest;
        },

        toggleMute: function (videoElement) {
            videoElement.muted = !videoElement.muted;

            return videoElement.muted;
        },

        /**
         * Add padding to digit if needed (from 0 -> 00)
         *
         * @param {number} number
         * @returns {string}
         */
        pad: function (number) {
            return number > 10 ? number : '0' + number;
        },

        /**
         * Resolve method base on customControl key from options
         *
         * @param buttonType
         * @returns {*}
         */
        resolveMethod: function (buttonType) {
            var result;

            switch (buttonType) {
                case 'next':
                    result = 'renderNext';
                    break;
                case 'previous':
                    result = 'renderPrevious';
                    break;
                case 'playPause':
                    result = 'renderPlayPause';
                    break;
                case 'fullscreen':
                    result = 'renderFullscreen';
                    break;
                case 'muteButton':
                    result = 'renderMuteButton';
                    break;
                default:
                    throw new Error('Button type ' + buttonType + ' is not supported!');
            }

            return result;
        }
    }

})(Config);