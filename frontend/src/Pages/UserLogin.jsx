import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import {userLogin} from '../Redux/ActionCreators/userActions';

import Backdrop from '../Components/UIElements/Backdrop';
import BottomRightCard from '../Components/UIElements/BottomRightCard';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';

const UserLogin = ({appMessageHandler}) => {

    const [userLoginMessage, setUserLoginMessage] = useState(null);
    const [formState, setFormState] = useState({email: '', password: ''});

    const {isLoggedInState, loginStateLoading} = useSelector(store => store.userState);

    let userLoginMessageTimerID;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFormSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(userLogin(formState, appMessageHandler));
    }

    const userLoginMessageHandler = (message) => {
        setUserLoginMessage(message);
        userLoginMessageTimerID = setTimeout(() => {
            setUserLoginMessage(null);
        }, 4000);
    }

    useEffect(() => {
        if(isLoggedInState) {
            navigate('/');
        }

        return () => {
            clearTimeout(userLoginMessageTimerID);
        }
    }, [isLoggedInState, navigate]);

    return (
        <>
        {userLoginMessage && 
        <BottomRightCard>
            <h3 style={{fontSize: '1.5rem', color: 'white', width: 'max-content'}}>{userLoginMessage}</h3>
        </BottomRightCard>}

        {/* {loginStateLoading && 
        <Backdrop>
            <LoadingSpinner></LoadingSpinner>
        </Backdrop>} */}
        <div className='login'>
            <div className="login-wrapper">
              <h1 className="login-header">Please login to continue</h1>
              <form onSubmit={loginFormSubmitHandler} className="login-form">
                  <input onChange={event => setFormState(formState => 
                    { return {...formState, email: event.target.value}})} type="email" className="login-input" placeholder='Enter Email' name="email" />
                  <input onChange={(event) => setFormState(formState => 
                    { return {...formState, password: event.target.value} })} type="password" className="login-input" placeholder='Enter Password' name="password" />
                  <button className="login-btn" type="submit">
                     Login
                 </button>
             </form>
           </div>
        </div>
        </>
    )
}

export default UserLogin



