var VideoController = (function (config) {
    var srcIndex = 0;

    return {
        toggleSource: function (index, options) {
            index = index || 0;
            var sources = options['sources'];

            if (!_.isArray(sources)) {
                throw new Error('Parameter sources is not compatible! It should be Array. See docs');
            }

            return sources[index];
        },

        nextIndex: function (options) {
            srcIndex++;

            if (options['controls']['sourceLoop'] && srcIndex >= options['sources'].length) {
                srcIndex = 0;
            } else if (!options['controls']['sourceLoop'] && srcIndex >= options['sources'].length) {
                srcIndex = options['sources'].length - 1;
            }

            return srcIndex;
        },

        previousIndex: function (options) {
            srcIndex--;

            if (options['controls']['sourceLoop'] && srcIndex < 0) {
                srcIndex = options['sources'].length - 1;
            } else if (!options['controls']['sourceLoop'] && srcIndex < 0) {
                srcIndex = 0;
            }

            return srcIndex;
        },

        playPause: function (videoElement) {
            if (videoElement.paused || videoElement.ended) {
                videoElement.play();
                videoElement.dispatchEvent(new Event(config['events']['onVideoPlay']))
            } else {
                videoElement.pause();
                videoElement.dispatchEvent(new Event(config['events']['onVideoPause']))
            }
        },

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
                default:
                    throw new Error('Button type ' + buttonType + ' is not supported!');
            }

            return result;
        }
    }

})(Config);