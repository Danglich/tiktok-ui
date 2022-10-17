const authReducer = (state, action) => {
    const { type, payload } = action;
    const { isAuthenticated, user } = payload;
    switch (type) {
        case 'SET_AUTH':
            return {
                ...state,
                authLoading: false,
                isAuthenticated: isAuthenticated,
                user: user,
            };
        default:
            return state;
    }
};

export default authReducer;
