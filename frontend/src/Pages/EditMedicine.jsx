import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import BottomRightCard from '../Components/UIElements/BottomRightCard';
import BottomRightCardMessage from '../Components/UIElements/BottomRightCardMessage';

import {editMedicine} from '../Redux/ActionCreators/medicineActions';

let editMedicineMessageTimerID;

const EditMedicine = () => {

    const [editMedicineForm, setEditMedicineForm] = useState({
        name: '', category: '', MRP: '', costPrice: '', discount: '', expDate: '', stock: ''
    });
    const [editMedicineMessage, setEditMedicineMessage] = useState(null);

    const _id = useParams()._id;

    const dispatch = useDispatch();

    const editMedicineMessageHandler = (message) => {
        setEditMedicineMessage(message);
        editMedicineMessageTimerID = setTimeout(() => {
            setEditMedicineMessage(null);
        }, 3000);
        console.log(editMedicineMessageTimerID);
    }

    const editFormSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(editMedicine({
            _id,
            editData: editMedicineForm
        }, editMedicineMessageHandler));
    }

    useEffect(() => {
        return () => {
            clearTimeout(editMedicineMessageTimerID);
        }
    }, []);

    return (
        <div className='edit'>
            {editMedicineMessage && 
            <BottomRightCard>
                <BottomRightCardMessage message={editMedicineMessage} />
            </BottomRightCard>}
            <h1 className="edit-heading">Edit medicine</h1>
            <form onSubmit={(e) => editFormSubmitHandler(e)} className="edit-form">
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm, name: e.target.value};
                    })
                }} value={editMedicineForm.name} type="text" className="edit-input" placeholder='edit name' />
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm, category: e.target.value};
                    })
                }} value={editMedicineForm.category}  type="text" className="edit-input" placeholder='edit category' />
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm, 
                            MRP: parseInt(e.target.value) ? parseInt(e.target.value) : e.target.value};
                    })
                }} value={editMedicineForm.MRP} type="number" className="edit-input" placeholder='edit MRP'/>
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm, 
                            costPrice: parseInt(e.target.value) ? parseInt(e.target.value) : e.target.value};
                    })
                }} value={editMedicineForm.costPrice} type="number" className="edit-input" placeholder='edit cost price' />
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm,
                            discount: parseInt(e.target.value) ? parseInt(e.target.value) : e.target.value};
                    })
                }} value={editMedicineForm.discount} type="number" className="edit-input" placeholder='edit discount' />
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm, expDate: e.target.value};
                    })
                }} value={editMedicineForm.expDate} type="date" className="edit-input" placeholder='edit exp.date' />
                <input onChange={e => {
                    setEditMedicineForm(currentEditMedicineForm => {
                        return {...currentEditMedicineForm,
                            stock: parseInt(e.target.value) ? parseInt(e.target.value) : e.target.value};
                    })
                }} value={editMedicineForm.stock} type="number" className="edit-input" placeholder='edit stock' />

                <button className="edit-btn">
                    Edit
                </button>
            </form>
        </div>
    )
}

export default EditMedicine
