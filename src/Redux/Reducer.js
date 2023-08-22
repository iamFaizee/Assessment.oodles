
const initialState = {
    userInfo: [],
    isLoading: false,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_USER_INFO':
            return {
                ...state,
                userInfo: action.payload,
                isLoading: false
            };
        
        case 'LOADING':
            return {
                ...state,
                isLoading: true,
            }
        default:
            return state;
    }
};

export default rootReducer;
