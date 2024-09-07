import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, InputLabel, OutlinedInput,
  Button, CircularProgress
} from '@mui/material';
import Input from '@mui/joy/Input';
import joi from 'joi';
import { joiFormikAdapter } from 'joi-formik-adapter';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {AiFillDelete} from "react-icons/ai";

import BottomRightCard from '../Components/UIElements/BottomRightCard';

import MedicineTable from '../Components/MedicineTable';

import {postMedicine} from '../Redux/ActionCreators/medicineActions';
import { createDateFromDateString } from '../utils/dateAndTimeHandlers';
import base_url from '../setup/appSetup';

let medicineMessageTimerID;

const Medicine = () => {

  const initialValues = useMemo(() => {
    return {
      name: '',
      batches: [{
        MRP: '',
        costPrice: '',
        discount: '',
        expDate: '',
        stock: '',
      }],
      shelves: ''
    }
  }, []);

  const formSchema = joi.object({
    name: joi.string().min(1).required()
      .messages({
        "any.required": "name is required"
      }),
    batches: joi.array().items(
      joi.object({
        MRP: joi.number().min(1),
        costPrice: joi.number().min(1),
        discount: joi.number().min(1),
        expDate: joi.string().required()
          .custom((value, helper) => {
            const dateParsed = value?.split('-');
            const year = parseInt(dateParsed?.[0]);
            const month = parseInt(dateParsed?.[1]);
            const dateOfMonth = parseInt(dateParsed?.[2]);

            console.log(dateOfMonth, 'dateOfMonth');
    
            if (dateOfMonth >= 1 && dateOfMonth <= 31 
              && month >= 1 && month <= 12
              && year >= 2000) {
              return true;
            } else {
              console.log('expDateError')
              return helper?.message(`expDate is either invalid or not in the format yyyy-mm-dd`);
            }
          })
          .messages({
            "any.required": "Expiry date is required",
          }),
        stock: joi.number().min(1).required()
          .messages({
            "any.required": "stock is required"
          }),
      })
    ).min(1),
    shelves: joi.string()
      .custom((value, helper) => {
        const splittedShelves = value?.split(',');
        for (let i = 0; i < splittedShelves?.length; i++) {
          if (splittedShelves?.[i]?.trim() === '') {
            return helper?.message(`Please check all the shelf names`);
          }
        }
      })
  });

  const newMedicine = useSelector(store => store.newMedicine);
  // const {fetchedMedicines} = useSelector(store => store.fetchedMedicinesData);

  const [medicineMessage, setMedicineMessage] = useState(null);
  const [showMedicines, setShowMedicines] = useState(true);
  // const [showMedicineInputs, setShowMedicineInputs] = useState(medicineFormState.length > 0 ? true : false);
  const [totalMedicinesInputVal, setTotalMedicinesInputVal] = useState(1);
  const [totalMedicines, setTotalMedicines] = useState(1);
  const [tab, setTab] = useState("AddMedicine");
  const [fetchedMedicines, setFetchedMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  // const medicineFormStateLength = medicineFormState.length;
  // const fetchedMedicinesLength = fetchedMedicines ? fetchedMedicines.length : 0;


  const formik = useFormik({
    initialValues,
    validationSchema: joiFormikAdapter(formSchema),
    onSubmit: (values) => {
      console.log('onSubmit', values);

      const valuesCpy = {
        ...values
      };

      if (tab === "AddMedicine") {

        const shelves = [];

        const splittedShelves = valuesCpy?.shelves?.split(',');
        for (let i = 0; i < splittedShelves?.length; i++) {
          shelves.push(splittedShelves?.[i]?.trim());
        }

        const payload = {
          ...valuesCpy,
          batches: valuesCpy?.batches?.map((currBatch) => {
            const currBatchCpy = {};
            for (let i = 0; i < Object.entries(currBatch).length; i++) {
              if (Object.entries(currBatch)?.[i]?.[1] !== '') {
                currBatchCpy[Object.entries(currBatch)?.[i]?.[0]] = Object.entries(currBatch)?.[i]?.[1];
              }
            }

            return {
              ...currBatchCpy,
            }
          }),
          shelves
        }

        dispatch(
          postMedicine({
            payload,
            successCallback: () => {
              toast.success("Medicine added!");
            },
            failureCallback: ({
              error
            }) => {
              console.log(error, 'failureCallback');
              toast.error(error?.data?.errorMessage);
            },
            afterResponseCallback: ({
              payload
            }) => {
              console.log(payload, 'payload');
            }
          })
        )
      } else {

        const shelves = [];

        const splittedShelves = valuesCpy?.shelves?.split(',');
        for (let i = 0; i < splittedShelves?.length; i++) {
          shelves.push(splittedShelves?.[i]?.trim());
        }

        const payload = {
          batches: valuesCpy?.batches?.map((currBatch) => {

            const currBatchCpy = {};

            for (let i = 0; i < Object.entries(currBatch).length; i++) {
              if (Object.entries(currBatch)?.[i]?.[1] !== '') {
                currBatchCpy[Object.entries(currBatch)?.[i]?.[0]] = Object.entries(currBatch)?.[i]?.[1];
              }
            }

            return {
              ...currBatchCpy,
            }
          }),
          shelves
        }

        dispatch(
          postMedicine({
            payload,
            params: {
              name: selectedMedicine?.name || valuesCpy?.name,
            },
            successCallback: () => {
              toast.success("Medicine batch added!");
              setSelectedMedicine(null);
            },
            failureCallback: ({
              error
            }) => {
              toast.error(error?.data?.errorMessage || "Some error occured");
            },
            afterResponseCallback: ({
              payload
            }) => {
              console.log(payload, 'payload');
            }
          })
        )
      }
    }
  });

  const { 
    values, setValues, handleChange, handleBlur, 
    touched, errors, setFieldValue, submitForm,
    resetForm
  } = formik;

  const medicineMessageHandler = (message) => {
    setMedicineMessage(message);
    medicineMessageTimerID = setTimeout(() => {
      setMedicineMessage(null);
    }, 4000);
  }

  const submitAddMedicineFormHandler = async (e) => {
    e?.preventDefault();
    console.log('submitFormHandler');
    submitForm();
  }

  const submitAddBatchMedicineFormHandler = async (e) => {
    e?.preventDefault();
    console.log('submitFormHandler');
    submitForm();
  }

  // useEffect(() => {
  //   if(!showMedicineInputs) {
  //     dispatch({type: 'DELETE_MEDICINES_FORM'});
  //   }

  //   return () => {
  //     clearTimeout(medicineMessageTimerID);
  //   }
  // }, [showMedicineInputs, dispatch]);

  // useEffect(() => {
  //   if(!medicineFormStateLength) {
  //     setShowMedicineInputs(false);
  //   }
  // }, [medicineFormStateLength]);

  useEffect(() => {
    if (tab === "AddBatch") {
      (async () => {
        const fetchedMedicinesRes = await (await fetch(`${base_url}/medicine/${values?.name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        }))?.json();

        setFetchedMedicines(fetchedMedicinesRes?.payload);

        console.log(fetchedMedicinesRes, 'fetchedMedicinesRes');
      })();
    }
  }, [values?.name, tab]);

  console.log(values, errors, fetchedMedicines, selectedMedicine, 'medicineFormState')

  return (
    <>
    {medicineMessage && 
    <BottomRightCard>
      <h3 style={{fontSize: '1.5rem', color: 'white', width: 'max-content'}}>{medicineMessage}</h3>
    </BottomRightCard>}
    <div className='layout'>
    <div className="layout-wrapper">
      <div className="layout-main">
        {/* {showMedicines && <h1 className="layout-heading">All Medicines</h1>} */}
        {/* {showMedicines && <MedicineTable setShowMedicines={setShowMedicines} medicineMessageHandler={medicineMessageHandler} 
          comp='medicine-list' />} */}
        {/* <div className='layout-add-wrapper'>
          {!showMedicineInputs && 
          <button onClick={() => {
              if(totalMedicinesInputVal !== '') {
                dispatch({type: 'ADD_MEDICINE', amount: parseInt(totalMedicinesInputVal)});
                setShowMedicineInputs(true);
                setTotalMedicines(parseInt(totalMedicinesInputVal));
              }
            }} className="layout-btn">
            Add Medicines
          </button>}
          {showMedicineInputs && 
          <button onClick={() => {
            if(totalMedicinesInputVal !== '') {
              dispatch({type: 'ADD_MEDICINE', amount: parseInt(totalMedicinesInputVal)});
              setTotalMedicines((currentVal) => parseInt(totalMedicinesInputVal) + currentVal);
            }
          }} className='layout-btn'>Add more</button>}
          <input value={totalMedicinesInputVal} onChange={(event) => {
              setTotalMedicinesInputVal(event.target.value);
            }} className='layout-amount' type="number" /> 
        </div> */}


        <div className='layout-add-wrapper'>
          {tab === "AddMedicine" ? (
            <button 
              onClick={() => {
                setTab("AddBatch");
              }} 
              className="layout-btn">
              Add Batch
            </button>
          ) : (
            <button 
              onClick={() => {
                setTab("AddMedicine");
              }} 
              className="layout-btn">
              Add Medicines
            </button>
          )}
        </div>

        {tab === "AddMedicine" ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              "& *": {
                fontSize: '2rem !important'
              },
              "& .MuiInput-root": {
                // fontSize: '2rem !important'
                outline: '1px solid black'
              },
            }}
            // className='!text-2xl'
          >
            <form
              onSubmit={submitAddMedicineFormHandler}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  width: '100%'
                }}
              >
                <InputLabel 
                  htmlFor="name"
                >
                  Name
                </InputLabel>
                <Input 
                  type="text"
                  id="name"
                  name="name" 
                  value={values?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant='outlined'
                  size='lg'
                  // sx={{
                  //   outline: '2px solid black'
                  // }}
                />

                {touched?.name && errors?.name ? (
                  <Typography>
                    {errors?.name}
                  </Typography>
                ) : null}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem'
                }}
              >
                {values?.batches?.map?.((currBatch, currBatchIdx) => {
                  return (
                    <React.Fragment key={currBatchIdx}>
                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].MRP`}>
                          MRP
                        </InputLabel>
                        <Input 
                          type="number"
                          id={`batches[${currBatchIdx}].MRP`}
                          name={`batches[${currBatchIdx}].MRP`}
                          value={currBatch?.MRP}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.MRP && errors?.batches?.[currBatchIdx]?.MRP ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.MRP}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].costPrice`}>
                          Cost Price
                        </InputLabel>
                        <Input 
                          type="number" 
                          id={`batches[${currBatchIdx}].MRP`}
                          name={`batches[${currBatchIdx}].costPrice`}
                          value={currBatch?.costPrice}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.costPrice && errors?.batches?.[currBatchIdx]?.costPrice ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.costPrice}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].discount`}>
                          Discount
                        </InputLabel>
                        <Input 
                          type="number"
                          id={`batches[${currBatchIdx}].discount`}
                          name={`batches[${currBatchIdx}].discount`}
                          value={currBatch?.discount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.discount && errors?.batches?.[currBatchIdx]?.discount ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.discount}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].stock`}>
                          Stock
                        </InputLabel>
                        <Input 
                          type="number" 
                          id={`batches[${currBatchIdx}].stock`}
                          name={`batches[${currBatchIdx}].stock`}
                          placeholder=''
                          value={currBatch?.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.stock && errors?.batches?.[currBatchIdx]?.stock ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.stock}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`shelves`}>
                          Shelves
                        </InputLabel>
                        <Input 
                          type="text" 
                          id={`shelves`}
                          name={`shelves`}
                          placeholder='Shelf names (comma separated)'
                          value={values?.shelves}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.shelves && errors?.shelves ? (
                          <Typography>
                            {errors?.shelves}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].expDate`}>
                          Expiry Date
                        </InputLabel>
                        <Input 
                          type="text" 
                          id={`batches[${currBatchIdx}].expDate`}
                          name={`batches[${currBatchIdx}].expDate`}
                          placeholder='yyyy-mm-dd'
                          value={currBatch?.expDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.expDate && errors?.batches?.[currBatchIdx]?.expDate ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.expDate}
                          </Typography>
                        ) : null}
                      </Box>
                    </React.Fragment>
                  )
                })}
              </Box>

              <button
                className='text-3xl font-bold underline'
                variant='outlined'
              >
                Submit
              </button>
            </form>

            <button
              className='text-3xl font-bold underline'
              variant='outlined'
              onClick={() => {
                resetForm();
              }}
            >
              Clear form
            </button>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              "& *": {
                fontSize: '2rem !important'
              },
              "& .MuiInput-root": {
                // fontSize: '2rem !important'
                outline: '1px solid black'
              },
            }}
            // className='!text-2xl'
          >
            <form
              onSubmit={submitAddBatchMedicineFormHandler}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}
            >
              <Box
                sx={{
                  width: '100%'
                }}
              >
                <InputLabel 
                  htmlFor="name"
                >
                  Name
                </InputLabel>
                <Input 
                  type="text"
                  id="name"
                  name="name" 
                  value={values?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant='outlined'
                  size='lg'
                  // sx={{
                  //   outline: '2px solid black'
                  // }}
                />
                
                <Box
                  sx={{
                    border: '1px solid black',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {fetchedMedicines?.map((fetchedMedicine, fetchedMedicineIdx) => {
                    return (
                      <React.Fragment key={fetchedMedicine?._id}>
                        <Box
                          sx={{
                            padding: '0.25rem 1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            border: `1px solid black`,
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            console.log('clicked');
                            setSelectedMedicine(fetchedMedicine);
                            setFieldValue('name', fetchedMedicine?.name);
                          }}
                        >
                          <Typography>
                            {fetchedMedicine?.name}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    )
                  })}
                </Box>

                {touched?.name && errors?.name ? (
                  <Typography>
                    {errors?.name}
                  </Typography>
                ) : null}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem'
                }}
              >
                {values?.batches?.map?.((currBatch, currBatchIdx) => {
                  return (
                    <React.Fragment key={currBatchIdx}>
                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].MRP`}>
                          MRP
                        </InputLabel>
                        <Input 
                          type="number"
                          id={`batches[${currBatchIdx}].MRP`}
                          name={`batches[${currBatchIdx}].MRP`}
                          value={currBatch?.MRP}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.MRP && errors?.batches?.[currBatchIdx]?.MRP ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.MRP}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].costPrice`}>
                          Cost Price
                        </InputLabel>
                        <Input 
                          type="number" 
                          id={`batches[${currBatchIdx}].MRP`}
                          name={`batches[${currBatchIdx}].costPrice`}
                          value={currBatch?.costPrice}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.costPrice && errors?.batches?.[currBatchIdx]?.costPrice ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.costPrice}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].discount`}>
                          Discount
                        </InputLabel>
                        <Input 
                          type="number"
                          id={`batches[${currBatchIdx}].discount`}
                          name={`batches[${currBatchIdx}].discount`}
                          value={currBatch?.discount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.discount && errors?.batches?.[currBatchIdx]?.discount ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.discount}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].stock`}>
                          Stock
                        </InputLabel>
                        <Input 
                          type="number" 
                          id={`batches[${currBatchIdx}].stock`}
                          name={`batches[${currBatchIdx}].stock`}
                          placeholder=''
                          value={currBatch?.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.stock && errors?.batches?.[currBatchIdx]?.stock ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.stock}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`shelves`}>
                          Shelves
                        </InputLabel>
                        <Input 
                          type="text" 
                          id={`shelves`}
                          name={`shelves`}
                          placeholder='Shelf names (comma separated)'
                          value={values?.shelves}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.shelves && errors?.shelves ? (
                          <Typography>
                            {errors?.shelves}
                          </Typography>
                        ) : null}
                      </Box>

                      <Box>
                        <InputLabel htmlFor={`batches[${currBatchIdx}].expDate`}>
                          Expiry Date
                        </InputLabel>
                        <Input 
                          type="text" 
                          id={`batches[${currBatchIdx}].expDate`}
                          name={`batches[${currBatchIdx}].expDate`}
                          placeholder='yyyy-mm-dd'
                          value={currBatch?.expDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                          size='lg'
                        />
                        {touched?.batches?.[currBatchIdx]?.expDate && errors?.batches?.[currBatchIdx]?.expDate ? (
                          <Typography>
                            {errors?.batches?.[currBatchIdx]?.expDate}
                          </Typography>
                        ) : null}
                      </Box>
                    </React.Fragment>
                  )
                })}
              </Box>

              <button
                className='text-3xl font-bold underline'
                variant='outlined'
              >
                Submit
              </button>
            </form>
          </Box>
        )} 
        

        {/* {showMedicineInputs && 
          <div className='layout-table-wrapper'>
            <table className='layout-table'>
              <tbody className='layout-tablebody'>
                <tr className='layout-tableheading'>
                  <th className="layout-tableheader">Name</th>
                  <th className="layout-tableheader">Category</th>
                  <th className="layout-tableheader">MRP</th>
                  <th className="layout-tableheader">Cost Price</th>
                  <th className="layout-tableheader">Default discount</th>
                  <th className="layout-tableheader">Exp. Date</th>
                  <th className="layout-tableheader">Stock</th>
                  <th className="layout-tableheader">Save</th>
                  <th className="layout-tableheader">Delete</th>
                </tr>
              {medicineFormState.length > 0 && medicineFormState.map((medicineInput, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={index}>
                      <td data-label="Name" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'name', index
                          }})} 
                        value={medicineInput.name} className='layout-input' type="text" placeholder="Name" /></td>
                      <td data-label="Category" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'category', index
                          }})}  
                        value={medicineInput.category} className='layout-input' type="text" placeholder="Category" /></td>
                      <td data-label="MRP" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', property: 'MRP', index
                          }})}  
                        value={medicineInput.MRP} className='layout-input' type="number" placeholder="MRP" /></td>
                      <td data-label="Cost Price" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', property: 'costPrice', index
                          }})}  
                        value={medicineInput.costPrice} className='layout-input' type="number" placeholder="Cost Price" /></td>
                      <td data-label="Discount" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : '', property: 'discount', index
                          }})}  
                        value={medicineInput.discount} className='layout-input' type="number" placeholder="Discount" /></td>
                      <td data-label="Exp. Date" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'expDate', index
                          }})}  
                        value={medicineInput.expDate} className='layout-input' type="date" placeholder="Exp. Date" /></td>
                      <td data-label="Stock" className='layout-tabledata'><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', property: 'stock', index
                          }})}  
                        value={medicineInput.stock} className='layout-input' type="number" placeholder="Stock" /></td>
                      <td data-label="Save" className='layout-tabledata'>
                        <div onClick={() => {
                            dispatch(postMedicine(index, medicineMessageHandler));
                          }} style={{cursor: 'pointer'}} className='layout-icon-wrapper'>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                          </svg>
                        </div>
                      </td>
                      <td data-label="Delete" className='layout-tabledata'>
                        <div onClick={() => {
                          dispatch({
                            type: 'DELETE_MEDICINE', 
                            payload: index
                          })}} className='layout-icon-wrapper' style={{cursor: 'pointer'}}>
                          <AiFillDelete />
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
              </tbody>
            </table>

            <div onClick={() => {setShowMedicineInputs(false)}} className='layout-close-wrapper'>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
            </div>
          </div>}     */}
      </div>
      </div>
    </div>
    </>
  )
}

export default Medicine;
