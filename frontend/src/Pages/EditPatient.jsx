import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import BottomRightCard from '../Components/UIElements/BottomRightCard';
import BottomRightCardMessage from '../Components/UIElements/BottomRightCardMessage';

import {editPatient} from '../Redux/ActionCreators/patientActions';

let editPatientMessageTimerID;

const EditPatient = () => {

    const [editPatientForm, setEditPatientForm] = useState({
        name: '',
        category: '',
        complain: '',
        visitDate: '',
        medPrescribed: '',
        phone: ''
    });

    const [editPatientMessage, setEditPatientMessage] = useState(null);

    const _id = useParams()._id;

    const dispatch = useDispatch();

    const editPatientMessageHandler = (message) => {
        setEditPatientMessage(message);
        editPatientMessageTimerID = setTimeout(() => {
            setEditPatientMessage(null);
        }, 4000);
    }   

    const editPatientFormSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(editPatient({_id, editData: editPatientForm}, editPatientMessageHandler));
    };

    useEffect(() => {
        return () => {
            clearTimeout(editPatientMessageTimerID);
        }
    }, []);

    return (
        <>
        {editPatientMessage &&
        <BottomRightCard>
            <BottomRightCardMessage message={editPatientMessage}/>
        </BottomRightCard>}

        <div className='edit'>
             <h1 className="edit-heading">Edit Patient</h1>
            <form onSubmit={e => editPatientFormSubmitHandler(e)} className="edit-form">
                <input onChange={e => {
                    setEditPatientForm(currentEditPatientForm => {return {...currentEditPatientForm, name: e.target.value}});
                }} value={editPatientForm.name} type="text" className="edit-input" placeholder='edit name' />
                <input onChange={e => {
                    setEditPatientForm(currentEditPatientForm => {return {...currentEditPatientForm, category: e.target.value}});
                }} value={editPatientForm.category} type="text" className="edit-input" placeholder='edit category' />
                <input onChange={e => {
                    setEditPatientForm(currentEditPatientForm => {return {...currentEditPatientForm, complain: e.target.value}});
                }} value={editPatientForm.complain} type="text" className="edit-input" placeholder='edit complain' />
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <label style={{fontSize: '1.5rem', fontWeight: '500'}} htmlFor="visit date">Visiting date</label>
                    <input onChange={e => {
                        setEditPatientForm(currentEditPatientForm => {return {...currentEditPatientForm, visitDate: e.target.value}});
                    }} value={editPatientForm.visitDate} type="date" id="visit date" className="edit-input" placeholder='edit visit date' />
                </div>
                <input onChange={e => {
                    setEditPatientForm(currentEditPatientForm => {return {...currentEditPatientForm, medPrescribed: e.target.value}});
                }} value={editPatientForm.medPrescribed} type="text" className="edit-input" placeholder='edit medicine prescribed' />
                <input onChange={e => {
                    setEditPatientForm(currentEditPatientForm => {
                        return {...currentEditPatientForm, 
                        phone: e.target.value !== '' ? parseInt(e.target.value) : e.target.value
                    }});
                }} value={editPatientForm.phone} type="number" className="edit-input" placeholder='edit phone' />
                <button className="edit-btn">
                    Edit
                </button>
            </form>    
        </div>
        </>
    )
}

export default EditPatient
