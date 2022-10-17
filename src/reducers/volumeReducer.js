const initVolumeState = {
    mute: false,
    volume: 1,
    volumePrev: 1,
};

const volumeReducer = (state = initVolumeState, action) => {
    switch (action.type) {
        case 'SET_VOLUME':
            const newState = {
                ...state,
                volume: action.payload,
            };

            return newState;
        case 'SET_MUTE':
            return {
                ...state,
                mute: action.payload,
            };

        case 'SAVE_VOLUME':
            return {
                ...state,
                volumePrev: action.payload,
            };

        default:
            return state;
    }
};

export default volumeReducer;
