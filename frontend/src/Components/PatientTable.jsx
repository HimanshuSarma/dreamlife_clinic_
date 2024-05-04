import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {AiFillEdit, AiFillDelete} from "react-icons/ai";

import moment from 'moment';

import {fetchPatients, deletePatient} from '../Redux/ActionCreators/patientActions';

const PatientTable = ({comp, setShowSearchResults, setShowPatients, patientsMessageHandler, totalPatients, showPatientInputs}) => {

  const searchedArray = useSelector(store => store.searchedItems.patientSearchedItems);
  const {fetchedPatients} = useSelector(store => store.fetchedPatientsData)

  const patientArray = comp === 'search-results' ? searchedArray : comp === 'patient-list' ? fetchedPatients : [];

  const dispatch = useDispatch();

  useEffect(() => {
    if(comp === 'patient-list') {
        dispatch(fetchPatients());
    }
  }, [dispatch, comp]); 

  return (
    <>
    {(patientArray && patientArray.length > 0) && 
    <div className="layout-container">
        <table className='layout-table'>
        <thead>
        <tr className='layout-tableheading'>
            <th className="layout-tableheader">Sl. No</th>
            <th className="layout-tableheader">Name</th>
            <th className="layout-tableheader">Category</th>
            <th className="layout-tableheader">Complain</th>
            <th className="layout-tableheader">Visit Date</th>
            <th className="layout-tableheader">Med. Prescribed</th>
            <th className="layout-tableheader">Phone</th>
            {comp !== 'search-results' && 
            <th className="layout-tableheader">Edit</th>}
            {comp !== 'search-results' && 
            <th className="layout-tableheader">Delete</th>}
        </tr>
        </thead>
        <tbody className='layout-tablebody'>
            {patientArray.map((patient, index) => {
                const date = patient.visitDate.date;
                const year = patient.visitDate.year;
                const month = patient.visitDate.month;
                return (
                    <tr key={index}>
                    <td data-label="Sl. No" className="layout-tabledata">{index + 1}</td>
                    <td data-label="Name" className="layout-tabledata">{patient.name}</td>
                    <td data-label="Category" className="layout-tabledata">{patient.category}</td>
                    <td data-label="Complain" className="layout-tabledata">{patient.complain}</td>
                    <td data-label="Visit Date" className="layout-tabledata">{`${date}/${month}/${year}`}</td>
                    <td data-label="Med. Prescribed" className="layout-tabledata">{patient.medPrescribed}</td>
                    <td data-label="Phone" className="layout-tabledata">{`${patient.phone ? patient.phone : '-' }`}</td>
                    <td data-label="Edit" className="layout-tabledata">
                    {comp !== 'search-results' && 
                    <div className='layout-icon-wrapper'>
                    <Link style={{cursor: 'pointer'}} to={`/edit/patient/${patient._id}`}>
                        <AiFillEdit />
                    </Link>
                    </div>}
                    </td>
                    {comp !== 'search-results' && 
                    <td data-label="Delete" style={{cursor: 'pointer'}} className="layout-tabledata">
                        <div className='layout-icon-wrapper'>
                            <AiFillDelete onClick={() => {
                                dispatch(deletePatient(patient._id, patientsMessageHandler));
                            }} />
                        </div>
                    </td>}
                    </tr>
                )
            }) }
            
        </tbody>
        </table>

        <div onClick={() => {
                if(comp === 'search-results')
                    setShowSearchResults(false);
                else if(comp === 'patient-list')
                    setShowPatients(false);
            }} className='layout-close-wrapper'>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
        </div>
    </div>}

    {patientArray && patientArray.length === 0 && 
    <h2 style={{marginBottom: '1rem'}}>No results found.</h2>}
    </>
  )
}

export default PatientTable