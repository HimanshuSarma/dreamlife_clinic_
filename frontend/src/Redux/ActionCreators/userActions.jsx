import base_url from "../../setup/appSetup";

export const userLogin = (payload, handler) => {
    return async(dispatch) => {
        dispatch({type: 'USER_LOGIN_LOADING'});

        try {   
            const userLoginReq = await fetch(`${base_url}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const userLoginReqData = await userLoginReq.json();

            if(userLoginReq.ok) {
                dispatch({type: 'USER_LOGGED_IN'});
                handler(userLoginReqData.message);
            } else {
                dispatch({type: 'USER_LOGIN_FAILED'});
                handler(userLoginReqData.message);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const userLogout = () => {
    return async(dispatch) => {
        dispatch({type: 'USER_LOGOUT_LOADING'});

        try {
            const userLogoutReq = await fetch(`${base_url}/user/logout`, {
                method: 'GET',
                credentials: 'include'
            })

            if(userLogoutReq.ok) {
                dispatch({type: 'USER_LOGGED_OUT'});
            }
        } catch(err) {
            console.log(err);
        }
    }
}

export const checkLogin = () => {
    return async(dispatch) => {
        dispatch({type: 'USER_LOGIN_LOADING'});

        try {
            const checkLoginReq = await fetch(`${base_url}/user/check-login`, {
                method: 'GET',
                credentials: 'include'
            })

            if(checkLoginReq.ok) {
                dispatch({type: 'USER_LOGGED_IN'});
            } else {
                dispatch({type: 'USER_LOGIN_FAILED'});
            }
        } catch (err) {
            console.log(err);
        }
    } 
}