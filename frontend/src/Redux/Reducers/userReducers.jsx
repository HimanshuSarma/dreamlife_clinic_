export const userReducer = (currentUserState =  
    {userDetails: {}, 
    isLoggedInState: false,
    loginStateLoading: false}, action) => {
    
    if(action.type === 'USER_LOGIN_LOADING') {
        return {...currentUserState, isLoggedInState: false, loginStateLoading: true};
    } else if(action.type === 'USER_LOGGED_IN') {
        return {...currentUserState, isLoggedInState: true, loginStateLoading: false};
    } else if(action.type === 'USER_LOGIN_FAILED') {
        return {...currentUserState, isLoggedInState: false, loginStateLoading: false};
    } else if(action.type === 'USER_LOGOUT_LOADING') {
        return {...currentUserState, userDetails: {}, loginStateLoading: true};
    } else if(action.type === 'USER_LOGGED_OUT') {
        return {userDetails: {}, isLoggedInState: false, loginStateLoading: false};
    } 

    return currentUserState;
}