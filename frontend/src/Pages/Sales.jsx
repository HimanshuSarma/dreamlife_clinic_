import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {AiFillDelete} from 'react-icons/ai';
import moment from 'moment';

import BottomRightCard from '../Components/UIElements/BottomRightCard';
import BottomRightCardMessage from '../Components/UIElements/BottomRightCardMessage';
import SalesTable from '../Components/SalesTable';
import {getCurrentDate} from '../Components/getCurrentDate';

import {fetchMedicineByNameInSales} from '../Redux/ActionCreators/medicineActions';
import {postSale, fetchSalesOfGivenYearAndMonth} from '../Redux/ActionCreators/salesActions';

let salesMessageTimerID;

const Sales = () => {

  const salesFormState = useSelector(store => store.salesForm);

  const date = moment().utc().set('hour', 
  moment().utc().hour() + 5).set('minute', moment().utc().hour() + 30);

  const [showSales, setShowSales] = useState(true);
  const [showSalesInputs, setShowSalesInputs] = useState(salesFormState.length > 0 ? true : false);
  const [showSalesProductSearchedNames, setShowSalesProductSearchedNames] = useState(false);
  const [totalSalesInputVal, setTotalSalesInputVal] = useState(1);
  const [viewSalesYearMonth, setViewSalesYearMonth] = useState({
    year: date.year(),
    month: date.month() + 1
  })
  const [totalProductsInSale, setTotalProductsInSale] = useState(1);
  const [totalSales, setTotalSales] = useState(1);
  const [salesMessage, setSalesMessage] = useState(null);
  // const [date, setDate] = useState();

  const {salesOfGivenYearAndMonth, yearAndMonth} = useSelector(store => store.salesOfGivenYearAndMonth);

  const fetchedSalesYear = yearAndMonth ? yearAndMonth.year : null;
  const fetchSalesMonth = yearAndMonth ? yearAndMonth.month : null;

  const salesFormStateLength = salesFormState.length;

  const dispatch = useDispatch();

  const salesMessageHandler = (message) => {
    setSalesMessage(message);
    salesMessageTimerID = setTimeout(() => {
      setSalesMessage(null);
    }, 4000);
  }

  useEffect(() => {
    if(!showSalesInputs) {
      dispatch({type: 'DELETE_SALES_FORM'});
    }

    return () => {
      clearTimeout(salesMessageTimerID);
    }
  }, [showSalesInputs, dispatch]);

  useEffect(() => {
    if(!salesFormStateLength) {
        setShowSalesInputs(false);  
    }
  }, [salesFormStateLength]);

  useEffect(() => {
    const year = parseInt(viewSalesYearMonth.year);
    const month = parseInt(viewSalesYearMonth.month);
    if(year && year >= 2021 && month && (month >= 1 && month <= 12) && 
     (!salesOfGivenYearAndMonth || (year !== fetchedSalesYear || month !== fetchSalesMonth))) {
      dispatch(fetchSalesOfGivenYearAndMonth({
        year, month
      }));
    }
  }, [viewSalesYearMonth, salesOfGivenYearAndMonth, fetchedSalesYear, fetchSalesMonth, dispatch]);

  return (
    <>
    {salesMessage && 
    <BottomRightCard>
      <BottomRightCardMessage message={salesMessage} />
    </BottomRightCard>}

    <div className='layout-wrapper'>
      <div className="layout-main">
        <div className='sales-fetch-wrapper'>
          <p style={{fontSize: '1.5rem'}} >View sales for the year: </p>
          <input onChange={e => setViewSalesYearMonth(currentVal => {return {
              ...currentVal, year: parseInt(e.target.value) ? parseInt(e.target.value) : ''}})} 
            style={{padding: '0.5rem 1rem'}} value={viewSalesYearMonth.year} type="number" placeholder="year" />
          <p style={{fontSize: '1.5rem'}}> and the month: </p>
          <input onChange={e => setViewSalesYearMonth(currentVal => {return {
              ...currentVal, month: parseInt(e.target.value) ? parseInt(e.target.value) : ''}})} 
            style={{padding: '0.5rem 1rem'}} value={viewSalesYearMonth.month} type="number" placeholder="month" />
        </div>

        {salesOfGivenYearAndMonth && showSales &&
          <h1 className="layout-heading">Sales: </h1>}
        {salesOfGivenYearAndMonth && showSales &&
          <SalesTable setShowSales={setShowSales} salesMessageHandler={salesMessageHandler} comp='sales-list' />
        }


        <div className='layout-add-wrapper'>
        {!showSalesInputs && 
        <button onClick={() => {
            if(totalSalesInputVal !== '' && typeof parseInt(totalSalesInputVal) === 'number' && totalSalesInputVal > 0) {
              dispatch({
                type: 'ADD_SALE', 
                amount: parseInt(totalSalesInputVal)
              });
              setShowSalesInputs(true);
              setTotalSales(parseInt(totalSalesInputVal));
            }
            }} className="layout-btn">
            Add Sales
        </button>}
        {showSalesInputs && 
        <button onClick={() => {
            if(totalSalesInputVal !== '') {
            dispatch({type: 'ADD_SALE', amount: parseInt(totalSalesInputVal)});
            setTotalSales((currentVal) => parseInt(totalSalesInputVal) + currentVal);
            }
        }} className='layout-btn'>Add more sales</button>}
        <input value={totalSalesInputVal} onChange={(event) => {
            setTotalSalesInputVal(event.target.value);
            }} className='layout-amount' type="number" /> 
        </div>

        {showSalesInputs && 
        <div className='layout-table-wrapper'>
          {salesFormState.length > 0 && salesFormState.map((currentSale, currentSaleIndex) => {
            return (
            <React.Fragment key={currentSaleIndex}>
            <div className='layout-table-sales-wrapper'>
            <table className='layout-table'>
            <tbody className='layout-tablebody'>
              <tr className='layout-tableheading layout-sales-row'>
                <th className='layout-tableheader layout-sales-header'>More Products in sale</th>
                <th className='layout-tableheader layout-sales-header'>Add</th>
                <th className='layout-tableheader layout-sales-header'>Cust. Phone(Not. reqd)</th>
                <th className='layout-tableheader layout-sales-header'>Save</th>
                <th className='layout-tableheader layout-sales-header'>Delete</th>
              </tr>

              <tr> 
                <td data-label="More Products in sale" className='layout-tabledata'><input onChange={(e) => {
                  setTotalProductsInSale(parseInt(e.target.value) ? parseInt(e.target.value) : '');
                }} value={totalProductsInSale} type="number" className='layout-input' 
                  placeholder="More products" /></td>  
                <td data-label="Add" className='layout-tabledata'>
                  <button onClick={() => {
                      if(typeof totalProductsInSale === 'number' && totalProductsInSale > 0) {
                          dispatch({
                              type: 'ADD_PRODUCT',
                              payload: {
                                  val: totalProductsInSale,
                                  currentSaleIndex
                              }
                          });
                      }
                  }} style={{padding: '0.5rem 1rem'}}>Add more</button>
                </td>
                <td data-label="Cust. Phone(Not. reqd)" className='layout-tabledata'><input onChange={(e) => {
                  dispatch({
                    type: 'UPDATE_SALE',
                    payload: {
                      property: 'custPhone',
                      index: currentSaleIndex,
                      value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : ''  
                    }
                  })
                }} type="number" className='layout-input'  placeholder='Cust. Phone'/></td>
                <td data-label="Save" className='layout-tabledata'>
                  <div onClick={() => {
                      dispatch(postSale({
                        products: currentSale.products, custPhone: currentSale.custPhone
                      }, salesMessageHandler, {year: viewSalesYearMonth.year, month: viewSalesYearMonth.month}));
                  }} style={{cursor: 'pointer'}} className='layout-icon-wrapper'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                    </svg>
                  </div>
                </td>
                <td data-label="Delete" className='layout-tabledata'>
                  <div onClick={() => {
                      dispatch({
                          type: 'DELETE_SALE', 
                          payload: currentSaleIndex
                      })}} style={{cursor: 'pointer'}} className='layout-icon-wrapper'>
                  <AiFillDelete />
                  </div>
                </td>
              </tr>
            </tbody>
            </table>

            <table className='layout-table layout-sale-product-table'>
            <tbody className='layout-tablebody'>
              <tr className='layout-tableheading'>
                <th className="layout-tableheader layout-tableheader-name">Name</th>
                <th className="layout-tableheader">MRP</th>
                <th className="layout-tableheader">Cost Price</th>
                <th className="layout-tableheader">Selling Price</th>
                <th className="layout-tableheader">Profit</th>
                <th className="layout-tableheader">Qty</th>
                <th className="layout-tableheader">Delete</th>
              </tr>

              {currentSale.products.map((currentProduct, currentProductIndex) => {
                return (
                  <React.Fragment key={currentProductIndex}>
                  <tr className='layout-sale-product-row'>
                    <td data-label="Name" style={{position: 'relative'}} className='layout-tabledata'><input onChange={(e) => {
                            dispatch({
                                type: 'UPDATE_SALES_PRODUCT',
                                payload: {
                                    value: e.target.value, property: 'name', currentProductIndex, currentSaleIndex
                                }
                            });
                            
                            dispatch(fetchMedicineByNameInSales({val: e.target.value, 
                                currentProductIndex, currentSaleIndex}, setShowSalesProductSearchedNames));
                        }} 
                        value={currentProduct.name} className='layout-input' type="text" placeholder="Name" />

                        {showSalesProductSearchedNames && currentProduct.isFocused && 
                          currentProduct.searchedProducts.length > 0 && 
                        <div className='layout-sales-searched-names'>
                          {currentProduct.searchedProducts.map((searchedProduct, searchedProductIndex) => {
                            return (
                              <p key={searchedProductIndex} onClick={() => {
                                dispatch({
                                    type: 'UPDATE_SALES_SELECTED_PRODUCT',
                                    payload: {
                                        currentSaleIndex, currentProductIndex, searchedProductIndex
                                    }
                                });
                                
                                setShowSalesProductSearchedNames(false);
                              }}
                              className='layout-sales-searched-name'>{searchedProduct.name}</p>
                            )
                          })}
                        </div>}
                    </td>
                    <td data-label="MRP" className='layout-tabledata'><p className='layout-sales-tabledata-text'>{currentProduct.name ? currentProduct.MRP ? currentProduct.MRP : '-' : '-'}</p></td>
                    <td data-label="Cost Price" className='layout-tabledata'><p className='layout-sales-tabledata-text'>{currentProduct.name ? currentProduct.costPrice ? currentProduct.costPrice : '-' : '-'}</p></td>
                    <td data-label="Selling Price" className='layout-tabledata'><input onChange={(e) => dispatch({
                        type: 'UPDATE_SALES_PRODUCT_PROFIT_SELLING_PRICE',
                        payload: {
                            value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', 
                            property: 'sellingPrice', 
                            currentProductIndex, currentSaleIndex
                        }})}  
                        value={currentProduct.sellingPrice >= 0 ? currentProduct.sellingPrice : ''} className='layout-input' type="number" placeholder="Selling Price" /></td>
                    <td data-label="Profit" className='layout-tabledata'><input onChange={(e) => dispatch({
                        type: 'UPDATE_SALES_PRODUCT_PROFIT_SELLING_PRICE',
                        payload: {
                          value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '',
                          property: 'profit', 
                          currentProductIndex, currentSaleIndex
                        }})}  
                        value={currentProduct.profit >= 0 ? currentProduct.profit : ''} className='layout-input' type="number" placeholder="Profit" /></td>
                    <td data-label="Total units" className='layout-tabledata'><input onChange={(e) => dispatch({
                        type: 'UPDATE_SALES_PRODUCT',
                        payload: {
                          value: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : '', 
                          property: 'qty', 
                          currentProductIndex, currentSaleIndex
                        }})}  
                        value={currentProduct.qty >= 0 ? currentProduct.qty : ''} className='layout-input' type="number" placeholder="Qty" /></td>
                    <td data-label="Delete" className='layout-tabledata'>
                        <div onClick={() => {
                        dispatch({
                            type: 'DELETE_PRODUCT', 
                            payload: {currentProductIndex, currentSaleIndex}
                        })}} style={{cursor: 'pointer'}} className='layout-icon-wrapper'>
                            <AiFillDelete />
                        </div>
                    </td>
                  </tr>
                  </React.Fragment>
                )
            })}
          </tbody>
          </table>
          </div>
          </React.Fragment>)
          })}


          <div onClick={() => {setShowSalesInputs(false)}} className='layout-close-wrapper'>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
          </div>
        </div>}    
      </div>
    </div>
    </>
  )
}

export default Sales;