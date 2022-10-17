export const formatTime = (time) => {
    const timeRound = Math.round(time);
    if (timeRound < 10) {
        return '00:0' + timeRound;
    } else if (timeRound < 60) {
        return '00:' + timeRound;
    } else {
        const minutes = Math.floor(timeRound / 60);
        const seconds = timeRound % 60;

        if (minutes < 10) {
            if (seconds < 10) {
                return '0' + minutes + ':0' + seconds;
            } else {
                return '0:' + minutes + ':' + seconds;
            }
        } else {
            if (seconds < 10) {
                return minutes + ':0' + seconds;
            } else {
                return minutes + ':' + seconds;
            }
        }
    }
};
