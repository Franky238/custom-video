/**
 * Main class
 * videos: {
 * https://archive.org/download/CC_1916_10_02_ThePawnshop/CC_1916_10_02_ThePawnshop_512kb.mp4
 * https://archive.org/download/CC_1916_05_15_TheFloorwalker/CC_1916_05_15_TheFloorwalker_512kb.mp4
 * https://archive.org/download/014674/014674_512kb.mp4
 * }
 */
var CustomVideo = (function (videoRenderer, videoController, config) {

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
                            name: 'Play',
                            className: 'playPause',
                            id: 'playPause',
                            title: 'Play',
                            toggleTo: {
                                name: 'Pause',
                                title: 'Pause'
                            }
                        },
                        previous: {
                            name: 'Previous',
                            className: 'previous',
                            id: 'previous',
                            title: 'Previous'
                        },
                        next: {
                            name: 'Next',
                            className: 'next',
                            id: 'next',
                            title: 'Next'
                        }
                        // fullscreen: false // Todo
                    },
                    progressBar: {
                        enabled: true,
                        className: 'progressBar',
                        timeBarClassName: 'timeBar',
                        width: '100%', // like in css
                        height: '10px',
                        border: '1px solid black',
                        playedColor: '#ae2',
                        progressColor: '#eee'
                    },
                    time: {
                        enabled: true,
                        className: 'timeDigits',
                        separatorClass: 'timeSeparator'
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

            document.addEventListener(config['events']['onVideoChanged'], function () {
                resetControls();
            });
            videoElement.addEventListener(config['events']['onVideoPlay'], function () {
                console.log('Played!')
            });
            videoElement.addEventListener(config['events']['onVideoPause'], function () {
                console.log('Paused!')
            });
            videoElement.addEventListener(config['events']['onVideoEnded'], function () {
                console.log('Ended!');
                resetControls();
            });
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

                if (controls['progressBar']['enabled']) {
                    var progressBar = videoRenderer.renderFullProgressBar(wrapper);
                    var timeBar = progressBar.querySelector('.timeBar');

                    videoElement.addEventListener('timeupdate', function () {
                        videoRenderer.updateProgressBar(timeBar);
                    });
                }

                if (controls['time']['enabled']) {
                    videoRenderer.renderTimeDigits(wrapper);
                }
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

        var resetControls = function () {
            videoRenderer.removeControls();
            handleControls();
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

})(VideoRenderer, VideoController, Config);

new CustomVideo();