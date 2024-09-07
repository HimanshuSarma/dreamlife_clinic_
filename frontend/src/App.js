import React, {useState} from 'react';
import {Routes , Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Home from './Pages/Home';
import Stats from './Pages/Stats';
import Sales from './Pages/Sales';
import Medicine from './Pages/Medicine';
import Patients from './Pages/Patients';
import AddMedicine from './Pages/AddMedicine';
import AddPatient from './Pages/AddPatient';
import EditMedicine from './Pages/EditMedicine';
import EditPatient from './Pages/EditPatient';
import EditSale from './Pages/EditSale';
import UserLogin from './Pages/UserLogin';
import Navbar from './Components/Navbar';
import SearchComponent from './Components/SearchComponent';
import SearchResults from './Components/SearchResults';
import BottomRightCard from './Components/UIElements/BottomRightCard';
import BottomRightCardMessage from './Components/UIElements/BottomRightCardMessage';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {checkLogin} from './Redux/ActionCreators/userActions';

import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';

const App = () => {

  const [appMessage, setAppMessage] = useState({
    message: null,
    messageClearTimerID: '',
  });

  const dispatch = useDispatch();

  const appMessageHandler = (message) => {
    setAppMessage(currentMessage => {
      return {...currentMessage, message};
    });

    const timerID = setTimeout(() => {
      setAppMessage(currentMessage => {
        return {...currentMessage, message: null};
      })
    }, 4000);

    setAppMessage(currentMessage => {
      return {...currentMessage, messageClearTimerID: timerID};
    });
  }

  useEffect(() => {
    dispatch(checkLogin());    
  }, [dispatch]);

  useEffect(() => {
    return () => {
      clearTimeout(appMessage.messageClearTimerID);
    }
  }, []);

  return (
    <>
      <ToastContainer 
        position={toast.POSITION.TOP_RIGHT}
        toastClassName={"toastBody"}
      />
      {appMessage.message && 
      <BottomRightCard>
        <BottomRightCardMessage message={appMessage.message} />
      </BottomRightCard>}

      <div>
        <Navbar /> 
        {/* <SearchComponent /> */}
        {/* <SearchResults /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path='/patients' element={<Patients />} />
          <Route path="/addmedicine" element={<AddMedicine />} />
          <Route path="/addpatient" element={<AddPatient />} />
          <Route path='/edit/medicine/:_id' element={<EditMedicine />} />
          <Route path='/edit/patient/:_id' element={<EditPatient />} />
          <Route path='/edit/sales/:indices' element={<EditSale />} />
          <Route path='/login' element={<UserLogin appMessageHandler={appMessageHandler} />} />
        </Routes>
      </div>
    </>
  )
}

export default App

