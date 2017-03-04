/**
 * Main class
 * videos: {
 * https://archive.org/download/CC_1916_10_02_ThePawnshop/CC_1916_10_02_ThePawnshop_512kb.mp4
 * https://archive.org/download/CC_1916_05_15_TheFloorwalker/CC_1916_05_15_TheFloorwalker_512kb.mp4
 * https://archive.org/download/014674/014674_512kb.mp4
 * }
 */
var CustomVideo = (function (videoRenderer, videoController) {

    /**
     * @param options
     */
    function CustomVideo(options) {
        options = options || {
                selector: '#video',
                sources: [
                    {
                        mp4: 'https://archive.org/download/CC_1916_10_02_ThePawnshop/CC_1916_10_02_ThePawnshop_512kb.mp4'
                    },
                    'https://archive.org/download/WebmVp8Vorbis/webmvp8_512kb.mp4'
                ],
                options: {
                    autoplay: false,
                    loop: false,
                    muted: false,
                    poster: null,
                    width: 480, //in pixels; 0 means auto
                    height: 0 //in pixels; 0 means auto
                },
                controls: {
                    enabled: true,
                    customControls: {
                        playPause: {
                            name: 'Play/Pause',
                            className: 'playPause',
                            id: 'playPause',
                            title: 'Play/Pause'
                        },
                        next: {
                            name: 'Next',
                            className: 'next',
                            id: 'next',
                            title: 'Next'
                        },
                        previous: {
                            name: 'Previous',
                            className: 'previous',
                            id: 'previous',
                            title: 'Previous'
                        },
                        fullscreen: false
                    },
                    sourceLoop: true
                }
            };

        var wrapper;
        var videoElement;

        /**
         * @constructor
         */
        var init = function () {
            wrapper = document.querySelector(options['selector']);
            videoElement = videoRenderer.renderVideo(wrapper);
            videoRenderer.setOptions(options);
            toggleSource(0);
            handleVideoOptions();
            handleControls();
        };

        // Private methods
        var handleVideoOptions = function () {
            var videoOptions = options['options'];

            Object.keys(videoOptions).forEach(function (key) {
                if (videoOptions[key]) {
                    videoRenderer.renderVideoOption(videoElement, key, videoOptions[key]);
                }
            });
        };

        var handleControls = function () {
            var controls = options['controls'];

            if (controls['enabled']) {
                videoRenderer.renderControls(videoElement, controls['customControls'], wrapper);
            }
        };

        // PUBLIC METHODS
        /**
         * Will toggle source and render it
         *
         * @param index
         * @returns {*}
         */
        var toggleSource = function (index) {
            var newSrc = videoController.toggleSource(index, options);
            videoRenderer.toggleSrc(videoElement, newSrc);
        };

        var next = function () {
            videoRenderer.renderNext();
        };

        var previous = function () {
            videoRenderer.renderPrevious();
        };

        // Execute construct
        init();

        return {
            toggleSource: toggleSource,
            next: next,
            previous: previous
        }
    }

    return CustomVideo;

})(VideoRenderer, VideoController);