import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {AiFillDelete} from "react-icons/ai";

import PatientTable from '../Components/PatientTable';
import BottomRightCard from '../Components/UIElements/BottomRightCard';
import BottomRightCardMessage from '../Components/UIElements/BottomRightCardMessage';

import {postPatient, deletePatient} from '../Redux/ActionCreators/patientActions';

let patientsMessageTimerID;

const Patients = () => {

  const patientFormState = useSelector(store => store.patientForm);

  const [patientsMessage, setPatientsMessage] = useState(null);
  const [showPatients, setShowPatients] = useState(true);
  const [totalPatients, setTotalPatients] = useState(1);
  const [totalPatientsInputVal, setTotalPatientsInputVal] = useState(1);
  const [showPatientInputs, setShowPatientInputs] = useState(patientFormState.length > 0 ? true : false);

  const dispatch = useDispatch();

  const patientFormStateLength = patientFormState.length;

  const patientsMessageHandler = (message) => {
    setPatientsMessage(message);
    patientsMessageTimerID = setTimeout(() => {
      setPatientsMessage(null);
    }, 4000);
  }

  useEffect(() => {
    if(!showPatientInputs) {
      dispatch({type: 'DELETE_PATIENTS_FORM'});
    }

    return () => {
      clearTimeout(patientsMessageTimerID);
    }
  }, [showPatientInputs, dispatch]);

  useEffect(() => {
    if(!patientFormStateLength) {
      setShowPatientInputs(false);
    }
  }, [patientFormStateLength]);
  
  return (
    <>
    {patientsMessage && 
    <BottomRightCard>
      <BottomRightCardMessage message={patientsMessage} />
    </BottomRightCard> }
    <div className='layout'>
      <div className="layout-wrapper">
      <div className="layout-main">
          {showPatients && <h1 className="layout-heading">All Patients</h1>}
          {showPatients && <PatientTable setShowPatients={setShowPatients} patientsMessageHandler={patientsMessageHandler}
            showPatientInputs={showPatientInputs} totalPatients={totalPatients} comp='patient-list' />}
          <div className='layout-add-wrapper'>
            {!showPatientInputs && 
            <button onClick={() => {
                if(totalPatientsInputVal !== '') {
                  dispatch({type: 'ADD_PATIENT', amount: parseInt(totalPatientsInputVal)});
                  setShowPatientInputs(true);
                  setTotalPatients(parseInt(totalPatientsInputVal));
                }
              }} className="layout-btn">
              Add Patients
            </button>}
            {showPatientInputs && 
            <button onClick={() => {
              if(totalPatientsInputVal !== '') {
                dispatch({type: 'ADD_PATIENT', amount: parseInt(totalPatientsInputVal)});
                setTotalPatients((currentVal) => parseInt(totalPatientsInputVal) + currentVal);
              }
            }} className='layout-btn'>
              Add more
            </button>}
            <input value={totalPatientsInputVal} onChange={(event) => {
                setTotalPatientsInputVal(event.target.value);
              }} className='layout-amount' type="number" /> 
          </div>

          {showPatientInputs && 
          <div className='layout-table-wrapper'>
            <table className='layout-table'>
              <tbody className='layout-tablebody'>
                <tr className='layout-tableheading'>
                  <th className="layout-tableheader">Name</th>
                  <th className="layout-tableheader">Category</th>
                  <th className="layout-tableheader">Complain</th>
                  <th className="layout-tableheader">Visit Date</th>
                  <th className="layout-tableheader">Phone</th>
                  <th className="layout-tableheader">Med. Prescribed</th>
                  <th className="layout-tableheader">Save</th>
                  <th className="layout-tableheader">Delete</th>
                </tr>
              {patientFormState.length > 0 && patientFormState.map((patientInput, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={index}>
                      <td data-label="Name" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: e.target.value, property: 'name', index
                          }})} 
                        value={patientInput.name} className='layout-input' type="text" placeholder="Name" /></td>
                      <td data-label="Category" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: e.target.value, property: 'category', index
                          }})}  
                        value={patientInput.category} className='layout-input' type="text" placeholder="Category" /></td>
                      <td data-label="Complain" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: e.target.value, property: 'complain', index
                          }})}  
                        value={patientInput.complain} className='layout-input' type="text" placeholder="Complain" /></td>
                      <td data-label="Visit Date" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: e.target.value, property: 'visitDate', index
                          }})}  
                        value={patientInput.visitDate} className='layout-input' type="date" /></td>
                      <td data-label="Phone" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', property: 'phone', index
                          }})} value={patientInput.phone} type="number" className='layout-input' placeholder='Phone'/></td>
                      <td data-label="Med. Prescribed" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_PATIENT',
                          payload: {
                            value: e.target.value, property: 'medPrescribed', index
                          }})}  
                        value={patientInput.medPrescribed} className='layout-input' type="text" placeholder="Med. Prescribed" /></td>
                      <td data-label="Save" className='layout-tabledata'>
                        <div onClick={() => {
                          dispatch(postPatient(index, patientsMessageHandler));
                        }} style={{cursor: 'pointer'}} className='layout-icon-wrapper'>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                          </svg>
                        </div>
                      </td>
                      <td data-label="Delete" className='layout-tabledata'>
                        <div onClick={() => {
                            dispatch({
                              type: 'DELETE_PATIENT',
                              payload: index
                            });
                          }} className='layout-icon-wrapper' style={{cursor: 'pointer'}}>
                            <AiFillDelete />
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
              </tbody>
            </table>

            <div onClick={() => {setShowPatientInputs(false)}} className='layout-close-wrapper'>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
            </div>
          </div>}
      </div>
      </div>
    </div>
    </>
  )
}

export default Patients
