export const setVolume = (volume) => ({
    type: 'SET_VOLUME',
    payload: volume,
});

export const setMute = (bool) => ({
    type: 'SET_MUTE',
    payload: bool,
});

export const saveVolume = (volume) => ({
    type: 'SAVE_VOLUME',
    payload: volume,
});
