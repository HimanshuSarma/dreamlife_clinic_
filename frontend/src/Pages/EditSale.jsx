import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import BottomRightCard from '../Components/UIElements/BottomRightCard';
import BottomRightCardMessage from '../Components/UIElements/BottomRightCardMessage';

import {editPatient} from '../Redux/ActionCreators/patientActions';

let editSaleMessageTimerID;

const EditSale = () => {

  const saleAndProductIndex = useParams().indices;
  let saleAndProductIndexArray = saleAndProductIndex.split('-').map(index => parseInt(index));

  const {salesOfGivenYearAndMonth} = useSelector(store => store.salesOfGivenYearAndMonth);

  const saleProduct = salesOfGivenYearAndMonth ? salesOfGivenYearAndMonth.length > 0 ? 
    saleAndProductIndexArray.length === 2 ? saleAndProductIndexArray[0] >= 0 ? 
    saleAndProductIndexArray[1] >= 0 ? salesOfGivenYearAndMonth[saleAndProductIndexArray[0]].products[saleAndProductIndexArray[1]] 
    : null : null : null : null : null;

  const [editSaleForm, setEditSaleForm] = useState(saleProduct ? {
      name: saleProduct.name,
      sellingPrice: saleProduct.sellingPrice,
      profit: saleProduct.profit,
      createdAt: saleProduct.createdAt,
      qty:  saleProduct.qty
  } : null);

  const [editSaleMessage, setEditSaleMessage] = useState(null);

  const _id = useParams()._id;

  const dispatch = useDispatch();

  const editSaleMessageHandler = (message) => {
      setEditSaleMessage(message);
      editSaleMessageTimerID = setTimeout(() => {
          setEditSaleMessage(null);
      }, 4000);
  }   

  const editSaleFormSubmitHandler = (e) => {
      e.preventDefault();
      dispatch(editPatient({_id, editData: editSaleForm}, editSaleMessageHandler));
  };

  useEffect(() => {
      return () => {
          clearTimeout(editSaleMessageTimerID);
      }
  }, []);

  return (
      <>
      {editSaleMessage &&
      <BottomRightCard>
          <BottomRightCardMessage message={editSaleMessage}/>
      </BottomRightCard>}

      {saleProduct && 
      <div className='edit'>
        <h1 className="edit-heading">Edit Sale:</h1>
        <form onSubmit={e => editSaleFormSubmitHandler(e)} className="edit-form">
          <input onChange={e => {
              setEditSaleForm(currentEditSaleForm => {return {...currentEditSaleForm, name: e.target.value}});
          }} value={editSaleForm.name} type="text" className="edit-input" placeholder='edit name' />
          <input onChange={e => {
              setEditSaleForm(currentEditSaleForm => {return {...currentEditSaleForm, 
                sellingPrice: parseInt(e.target.value) ? parseInt(e.target.value) : ''}});
          }} value={editSaleForm.sellingPrice} type="text" className="edit-input" placeholder='edit selling price' />
          <input onChange={e => {
              setEditSaleForm(currentEditSaleForm => {return {...currentEditSaleForm, 
                price: parseInt(e.target.value) ? parseInt(e.target.value) : ''}});
          }} value={editSaleForm.profit} type="text" className="edit-input" placeholder='edit profit' />
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '1.5rem', fontWeight: '500'}} htmlFor="sold at">Sold at: </label>
              <input onChange={e => {
                  setEditSaleForm(currentEditSaleForm => {return {...currentEditSaleForm, createdAt: e.target.value}});
              }} value={editSaleForm.createdAt} type="date" id="sold at" className="edit-input" placeholder='edit created at' />
          </div>
          <input onChange={e => {
              setEditSaleForm(currentEditSaleForm => {
                  return {...currentEditSaleForm, 
                  qty: e.target.value !== '' ? parseInt(e.target.value) : e.target.value
              }});
          }} value={editSaleForm.qty} type="number" className="edit-input" placeholder='edit qty' />
          <button className="edit-btn">
              Edit
          </button>
        </form>    
      </div>}

      {!saleProduct && 
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <h3 style={{fontSize: '1.5rem'}}>Please resfresh the page, go to the sales page and try to edit the product.</h3>
      </div>}
      </>
  )
}

export default EditSale;
