import React from 'react';
import { NavLink } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {userLogout} from '../Redux/ActionCreators/userActions';

const Navbar = () => {

    const {isLoggedInState} = useSelector(store => store.userState);

    const dispatch = useDispatch();

    return (
        <div className='navbar'>
            <div className="navbar-wrapper">
                <div className="navbar-logo">
                   <NavLink className='navbar-home' to={"/"}>
                     Dreamlife Ayurveda Admin Dashboard
                   </NavLink> 
                </div>
                <div className="navbar-control">
                    {isLoggedInState && <NavLink className='navbar-btn' to="/medicine">Medicine</NavLink>}
                    {isLoggedInState && <NavLink className='navbar-btn' to="/patients">Patients</NavLink>}
                    {isLoggedInState && <NavLink className='navbar-btn' to="/sales">Sales</NavLink>}
                    {isLoggedInState && <NavLink className='navbar-btn' to="/stats">Check stats</NavLink>}
                    {!isLoggedInState && <NavLink className='navbar-btn' to='/login'>Login</NavLink>}
                    {isLoggedInState && <button onClick={() => dispatch(userLogout())} className='navbar-btn'>Logout</button>}
                </div>
            </div>
        </div>
    )
}

export default Navbar
