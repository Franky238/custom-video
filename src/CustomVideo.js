/**
 * Main class
 * videos: {
 * https://archive.org/download/CC_1916_10_02_ThePawnshop/CC_1916_10_02_ThePawnshop_512kb.mp4
 * https://archive.org/download/CC_1916_05_15_TheFloorwalker/CC_1916_05_15_TheFloorwalker_512kb.mp4
 * https://archive.org/download/014674/014674_512kb.mp4
 * }
 */
var CustomVideo = (function (videoRenderer) {

    /**
     * @param options
     * @constructor
     */
    function CustomVideo(options) {
        options = options || {
                selector: 'video',
                sources: [
                    {
                        mp4: 'https://archive.org/download/CC_1916_10_02_ThePawnshop/CC_1916_10_02_ThePawnshop_512kb.mp4'
                    },
                    'https://archive.org/download/WebmVp8Vorbis/webmvp8_512kb.mp4'
                ],

                options: {
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    poster: 'https://archive.org/download/WebmVp8Vorbis/webmvp8.gif',
                    width: 480, //in pixels; 0 means auto
                    height: 0 //in pixels; 0 means auto
                }
            };

        //Construct method
        var init = function () {
            toggleSource(0);
            handleVideoOptions();
        };

        // Private methods
        var handleVideoOptions = function () {
            var videoOptions = options['options'];

            Object.keys(videoOptions).forEach(function (key) {
                if (videoOptions[key]) {
                    videoRenderer.renderVideoOptions(options['selector'], key, videoOptions[key]);
                }
            });

        };

        // PUBLIC METHODS
        /**
         * Will toggle source and render it
         *
         * @param index
         * @returns {*}
         */
        var toggleSource = function (index) {
            index = index || 0;
            var sources = options['sources'];

            if (!_.isArray(sources)) {
                throw new Error('Parameter sources is not compatible! It should be Array. See docs');
            }

            videoRenderer.renderSources(sources[index], options['selector']);

            return sources[index];
        };

        // Execute construct
        init();

        return {
            toggleSource: toggleSource
        }
    }

    return CustomVideo;

})(VideoRenderer);