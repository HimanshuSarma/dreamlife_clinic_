import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import moment from 'moment';

import {fetchMedicines, deleteMedicine} from '../Redux/ActionCreators/medicineActions';

const MedicineTable = ({comp, setShowSearchResults, medicineMessageHandler, setShowMedicines}) => {

    const searchedArray = useSelector(store => store.searchedItems.medicineSearchedItems);
    const {fetchedMedicines} = useSelector(store => store.fetchedMedicinesData);

    const medicineArray = comp === 'search-results' ? searchedArray : comp === 'medicine-list' ? fetchedMedicines : []; 

    const dispatch = useDispatch();

    useEffect(() => {
        if(comp === 'medicine-list') {
            dispatch(fetchMedicines());
        }
    }, [comp, dispatch]);

    return (
        <>
        {medicineArray && medicineArray.length > 0 && 
        <div className="layout-container">
            <table className='layout-table'>
            <thead>
            <tr className='layout-tableheading'>
            <th className="layout-tableheader">Sl. No</th>
            <th className="layout-tableheader">Name</th>
            <th className="layout-tableheader">Category</th>
            <th className="layout-tableheader">MRP</th>
            <th className="layout-tableheader">Cost Price</th>
            <th className="layout-tableheader">Discount</th>
            <th className="layout-tableheader">Exp. Date</th>
            <th className="layout-tableheader">Stock</th>
            {comp !== 'search-results' && 
            <th className="layout-tableheader">Edit</th>}
            {comp !== 'search-results' && 
            <th className="layout-tableheader">Delete</th>}
            </tr>
            </thead>
            <tbody className='layout-tablebody'>
            {medicineArray && medicineArray.map((medicine, index) => {
                return (
                    <tr key={index}>
                        <td data-label="Sl. No" className="layout-tabledata">{index + 1}</td>
                        <td data-label="Name" className="layout-tabledata">{medicine.name}</td>
                        <td data-label="Category" className="layout-tabledata">{medicine.category}</td>    
                        <td data-label="MRP" className="layout-tabledata">{medicine.MRP}</td>
                        <td data-label="Cost Price" className="layout-tabledata">{medicine.costPrice}</td>
                        <td data-label="Discount" className="layout-tabledata">{`${medicine.discount}%`}</td>
                        <td data-label="Exp. Date" className="layout-tabledata">
                            {`${medicine.expDate.date}/${medicine.expDate.month}/${medicine.expDate.year}`}
                        </td>
                        <td data-label="Stock" className="layout-tabledata">{medicine.stock}</td>
                        {comp !== 'search-results' && 
                        <td data-label="Edit" className="layout-tabledata"> 
                        <div className='layout-icon-wrapper'>
                        <Link to={`/edit/medicine/${medicine._id}`}>
                            <AiFillEdit />
                        </Link>  
                        </div>
                        </td>}
                        {comp !== 'search-results' && 
                        <td data-label="Delete" style={{cursor: 'pointer'}} className="layout-tabledata">
                            <div className='layout-icon-wrapper'>
                                <AiFillDelete onClick={e => {
                                dispatch(deleteMedicine(medicine._id, medicineMessageHandler));
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
                    else if(comp === 'medicine-list') 
                        setShowMedicines(false);
                }} className='layout-close-wrapper'>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
            </div>
        </div>}

        {medicineArray && medicineArray.length === 0 && 
        <h2 style={{marginBottom: '1rem'}}>
            No results found.
        </h2>}
        </> 
    )
}

export default MedicineTable
