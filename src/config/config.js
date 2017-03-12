var Config = (function () {

    return {
        defaultVideoType: 'mp4',
        controlsWrapper: 'controls-wrapper',
        timeSeparator: '/',
        events: {
            onVideoChanged: 'onVideoChanged',
            onVideoPlay: 'onVideoPlay',
            onVideoPause: 'onVideoPause',
            onVideoEnded: 'ended',
            onVideoMute: 'onVideoMute',
            onVideoUnmute: 'onVideoUnmute',
            onResetControls: 'onResetControls'
        }
    }

})();