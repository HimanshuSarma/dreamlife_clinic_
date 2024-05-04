import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {AiFillEdit, AiFillDelete} from "react-icons/ai";
import {GiCancel} from 'react-icons/gi';

import {deleteSale, postEditedSaleProduct} from '../Redux/ActionCreators/salesActions';

const SalesTable = ({comp, setShowSales, salesMessageHandler}) => {

  const {salesOfGivenYearAndMonth} = useSelector(store => store.salesOfGivenYearAndMonth);

  const salesArray = comp === 'sales-list' ? salesOfGivenYearAndMonth : [];

  const dispatch = useDispatch();

  return (
    <>
    {(salesArray && salesArray.length > 0) && 
    <div className="layout-container">
        <table className='layout-table'>
        <tbody className='layout-tablebody'>
        {salesArray.map((currentSaleObj, currentSaleIndex) => {
            return (
                <React.Fragment key={currentSaleIndex}>
                <tr className='layout-tableheading'>
                    <th style={{maxWidth: '10rem'}} className="layout-tableheader">Sl.No</th>
                    <th className="layout-tableheader">Product Name</th>
                    <th className="layout-tableheader">Selling Price</th>
                    <th className="layout-tableheader">Profit</th>
                    <th className="layout-tableheader">Discount</th>
                    <th className="layout-tableheader">Sold at</th>
                    <th className="layout-tableheader">Total Units</th>
                    {comp !== 'search-results' && 
                    <th className="layout-tableheader">Edit/Save</th>}
                    {comp !== 'search-results' && 
                    <th className="layout-tableheader">Delete Sale/Cancel edit</th>}
                </tr>

                {currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    const discount = parseFloat(currentProductObj.discount.$numberDecimal);
                    return (
                        <tr key={currentProductIndex}>
                            <td data-label="Sl. No" style={{maxWidth: '10rem'}} className="layout-tabledata">{currentProductIndex + 1}</td>
                            {!currentProductObj.isEditing && 
                            <td data-label="Product Name" className="layout-tabledata">
                                <p>{currentProductObj.name}</p>
                            </td>}
                            {!currentProductObj.isEditing && 
                            <td data-label="Selling Price" className="layout-tabledata">{currentProductObj.sellingPrice}</td>}
                            {!currentProductObj.isEditing && 
                            <td data-label="Profit" className="layout-tabledata">{currentProductObj.profit}</td>}
                            {!currentProductObj.isEditing && 
                            <td data-label="Discount" className="layout-tabledata">{`${discount.toFixed(2)}%`}</td>}
                            {!currentProductObj.isEditing && 
                            <td data-label="Sold at" className="layout-tabledata">{currentProductIndex === 0 ? `${currentSaleObj.createdAt.date}/${
                                currentSaleObj.createdAt.month}/${currentSaleObj.createdAt.year}` : '-'}</td>}
                            {!currentProductObj.isEditing && 
                            <td data-label="Total units" className="layout-tabledata">{currentProductObj.qty}</td>}
                            {comp !== 'search-results' && !currentProductObj.isEditing && 
                            <td data-label="Edit/Save" style={{cursor: 'pointer'}} className="layout-tabledata" onClick={() => {
                                dispatch({
                                    type: 'SALE_PRODUCT_STATE_TO_UPDATE',
                                    payload: {
                                        saleIndex: currentSaleIndex, 
                                        productIndex: currentProductIndex
                                    }
                                })
                            }}>
                                <div className='layout-icon-wrapper'>
                                    <AiFillEdit  />
                                </div>
                            </td>}
                            {comp !== 'search-results' && !currentProductObj.isEditing &&
                            <td data-label="Delete Sale/Cancel edit" style={{cursor: 'pointer'}} className="layout-tabledata">
                                {currentProductIndex === 0 && 
                                <div className='layout-icon-wrapper'>
                                    <AiFillDelete onClick={()=> {
                                        dispatch(deleteSale(currentSaleObj._id, salesMessageHandler));
                                    }} />
                                </div>}
                                {currentProductIndex !== 0 &&
                                <p>{'-'}</p>}
                            </td>}

                            {currentProductObj.isEditing &&
                            <td data-label="Product Name" style={{padding: '0'}} className='layout-tabledata'>
                                <span>{currentProductObj.name}</span>
                            </td> }

                            {currentProductObj.isEditing &&
                            <td data-label="Selling Price" style={{padding: '0'}} className='layout-tabledata'>
                                <input onChange={e => {
                                    dispatch({
                                        type: 'UPDATE_SALE_PRODUCT_PROFIT_SELLING_PRICE_EDIT_FORM',
                                        payload: {
                                            val: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', 
                                            property: 'sellingPrice',
                                            saleIndex: currentSaleIndex, productIndex: currentProductIndex
                                        }
                                    })
                                }} value={currentProductObj.editForm.sellingPrice} type="number" placeholder='S.P.'/>
                            </td> }

                            {currentProductObj.isEditing &&
                            <td data-label="Profit" style={{padding: '0'}} className='layout-tabledata'>
                                <input onChange={e => {
                                    dispatch({
                                        type: 'UPDATE_SALE_PRODUCT_PROFIT_SELLING_PRICE_EDIT_FORM',
                                        payload: {
                                            val: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', 
                                            property: 'profit',
                                            saleIndex: currentSaleIndex, productIndex: currentProductIndex
                                        }
                                    })
                                }} value={currentProductObj.editForm.profit} type="number" placeholder='profit'/>
                            </td>}

                            {currentProductObj.isEditing &&
                            <td data-label="Discount" style={{padding: '0'}} className='layout-tabledata'>
                                <span>{'-'}</span>
                            </td>}

                            {currentProductObj.isEditing &&
                            <td data-label="Sold at" style={{padding: '0'}} className='layout-tabledata'>
                                <span>{'-'}</span>
                            </td>}

                            {currentProductObj.isEditing &&
                            <td data-label="Total units" style={{padding: '0'}} className='layout-tabledata'>
                                <input onChange={e => {
                                    const parsedVal = parseInt(e.target.value);
                                    const val = parsedVal ? parsedVal : '';
                                    dispatch({
                                        type: 'UPDATE_SALE_PRODUCT_EDIT_FORM',
                                        payload: {
                                            val: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', 
                                            property: 'qty',
                                            saleIndex: currentSaleIndex, productIndex: currentProductIndex
                                        }
                                    })
                                }} value={currentProductObj.editForm.qty} type="number" placeholder='qty'/>
                            </td>}

                            {currentProductObj.isEditing && 
                            <td data-label="Edit/Save" style={{padding: '0'}} onClick={e => {
                                dispatch(postEditedSaleProduct({
                                    saleID: currentSaleObj._id,
                                    productID: currentProductObj._id,
                                    data: {
                                        ...currentProductObj.editForm,
                                        name: currentProductObj.name
                                    }
                                }))
                            }} className='layout-tabledata'>
                                {/* Save Svg */}
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                                </svg>
                            </td>}

                            {currentProductObj.isEditing &&
                            <td data-label="Delete Sale/Cancel edit" style={{padding: '0'}} onClick={e => {
                                dispatch({
                                    type: 'SALE_PRODUCT_STATE_TO_CANCEL_UPDATE',
                                    payload: {
                                        saleIndex: currentSaleIndex, 
                                        productIndex: currentProductIndex
                                    }
                                })
                            }} className='layout-tabledata'>
                                <GiCancel />
                            </td>}
                        </tr>
                    )
                })}
                </React.Fragment>
            )})}
        </tbody>
        </table>

        <div onClick={() => {setShowSales(false)}} className='layout-close-wrapper'>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
        </div>
    </div>}

    {salesArray && salesArray.length === 0 && 
    <h2 style={{marginBottom: '2rem'}}>No results found.</h2>}
    </>
  )
}

export default SalesTable;