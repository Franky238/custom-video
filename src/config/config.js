var Config = (function () {

    return {
        defaultVideoType: 'mp4',
        controlsWrapper: 'controls-wrapper',
        events: {
            onVideoChanged: 'onVideoChanged',
            onVideoPlay: 'onVideoPlay',
            onVideoPause: 'onVideoPause',
            onVideoEnded: 'ended'
        }
    }

})();