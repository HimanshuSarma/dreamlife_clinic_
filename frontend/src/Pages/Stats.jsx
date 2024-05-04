import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {Bar} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js'; 
import {fetchSalesOfReqdYear, fetchMedicinesWithGivenStocks} from '../Redux/ActionCreators/statsActions';

Chart.register(...registerables);


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Stats = () => {

  const [viewProfitsFromMonth, setViewProductFromMonth] = useState(null);
  const [date, setDate] = useState(moment().utc());
  const [yearInputVal, setYearInputVal] = useState(date ? date.year() : null);
  const [medicineStock, setMedicineStock] = useState(100);

  const {salesOfReqdYear} = useSelector(store => store.salesOfReqdYear);
  const {medicinesWithGivenStock} = useSelector(store => store.medicinesWithGivenStock);

  const dateYear = date ? date.year() : null;

  const dispatch = useDispatch();

  useEffect(() => {
    if(typeof yearInputVal === 'number' && yearInputVal >= 2021) {
      setDate(moment().set('year', yearInputVal))
    } else {
      setDate(null);
    }
  }, [yearInputVal]);

  useEffect(() => {
    if(dateYear && dateYear >= 2021) {
      dispatch(fetchSalesOfReqdYear(dateYear));
    } else {
      dispatch({type: 'SALES_OF_THE_YEAR_DELETE'});
    }
  }, [dateYear, dispatch]);

  useEffect(() => {
    if(typeof medicineStock === 'number' && medicineStock >= 0) {
      dispatch(fetchMedicinesWithGivenStocks(medicineStock));
    }
  }, [medicineStock, dispatch]);

  return (
    <div className='stats-page-wrapper'>
      <div className='stats-wrapper'>
        <h3 className='page-primary-header'>Profits/Revenue: </h3>
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
          <p className='stats-secondary-header'>View profits/revenue for the year: </p>
          <input style={{padding: '0.25rem 0.5rem'}} onChange={e => {
            if(e.target.value !== '') {
              setYearInputVal(parseInt(e.target.value));
            } else setYearInputVal('');
          }} value={`${yearInputVal}`} type="number" />
        </div>

        
        <div>
        {salesOfReqdYear && salesOfReqdYear.length > 0 && date &&
          <Bar 
            data = {{
              labels: date.year() === moment().utc().year() ? months.filter((month, idx) => idx <= date.month()) : months,
              datasets: [{
                  label: 'Profits: ',
                  data: date.year() === moment().utc().year() ? 
                    months.filter((month, idx) => idx <= date.month()).map((currentMonth, currentMonthIdx) => {
                      let totalSaleProfitForCurrentMonth = 0;
                      for(let i = 0; i < salesOfReqdYear.length; i++) {
                        if(salesOfReqdYear[i].createdAt.month === currentMonthIdx+1) {
                          for(let j = 0; j < salesOfReqdYear[i].products.length; j++) {
                            totalSaleProfitForCurrentMonth += salesOfReqdYear[i].products[j].profit *
                            salesOfReqdYear[i].products[j].qty;
                          }
                        }
                      }

                      return totalSaleProfitForCurrentMonth;
                    }) : 
                    months.map((currentMonth, currentMonthIdx) => {
                      let totalSaleProfitForCurrentMonth = 0;
                      for(let i = 0; i < salesOfReqdYear.length; i++) {
                        if(salesOfReqdYear[i].createdAt.month === currentMonthIdx+1) {
                          for(let j = 0; j < salesOfReqdYear[i].products.length; j++) {
                            totalSaleProfitForCurrentMonth += salesOfReqdYear[i].products[j].profit *
                            salesOfReqdYear[i].products[j].qty;
                          }
                        }
                      }

                      return totalSaleProfitForCurrentMonth;
                    }),
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                  ]
              }, {
                label: 'Revenue',
                  data: date.year() === moment().utc().year() ? 
                  months.filter((month, idx) => idx <= date.month()).map((currentMonth, currentMonthIdx) => {
                    let totalRevenueForCurrentMonth = 0;
                    for(let i = 0; i < salesOfReqdYear.length; i++) {
                      if(salesOfReqdYear[i].createdAt.month === currentMonthIdx+1) {
                        for(let j = 0; j < salesOfReqdYear[i].products.length; j++) {
                          totalRevenueForCurrentMonth += salesOfReqdYear[i].products[j].sellingPrice * 
                          salesOfReqdYear[i].products[j].qty;
                        }
                      }
                    }

                    return totalRevenueForCurrentMonth;
                  }) : 
                  months.map((currentMonth, currentMonthIdx) => {
                    let totalRevenueForCurrentMonth = 0;
                    for(let i = 0; i < salesOfReqdYear.length; i++) {
                      if(salesOfReqdYear[i].createdAt.month === currentMonthIdx+1) {
                        for(let j = 0; j < salesOfReqdYear[i].products.length; j++) {
                          totalRevenueForCurrentMonth += salesOfReqdYear[i].products[j].sellingPrice *
                            salesOfReqdYear[i].products[j].qty;
                        }
                      }
                    }

                    return totalRevenueForCurrentMonth;
                  }),
                  backgroundColor: [
                      'rgba(54, 162, 235, 0.8)',
                  ]
              }]
            }}

            style={{
              width: '700px',
              height: '300px'
            }} 
            options={{
              maintainAspectRatio: false
            }}
          />}

          {salesOfReqdYear && salesOfReqdYear.length === 0 &&
            <p style={{fontSize: '1.5rem'}}>No sales for this year</p>
          }
        </div>
      </div>

      <div className='stats-wrapper'>
        <h3 className='page-primary-header'>Check stocks of medicines: </h3>
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
          <p className='stats-secondary-header'>View medicines with less than: </p>
          <input style={{padding: '0.25rem 0.5rem'}} onChange={e => {
            if(e.target.value !== '') {
              setMedicineStock(parseInt(e.target.value));
            } else setMedicineStock('');
          }} value={`${medicineStock}`} type="number" />
          <p className='stats-secondary-header'> units.</p>
        </div>

        {medicinesWithGivenStock && medicinesWithGivenStock.length > 0 && 
        <div className='stats-stocks-wrapper' style={{display: 'flex', flexWrap: 'wrap'}}>
          {medicinesWithGivenStock.map((currentMedicine, currentMedicineIndex) => {
            return (
              <div key={currentMedicineIndex} className='stats-stocks-medicine-wrapper'>
                <p style={{fontSize: '1.5rem', fontWeight: '500'}}>{`${currentMedicine.name}, `}</p>
                <span style={{fontSize: '1.5rem'}}>{currentMedicine.stock}</span>
              </div>
            )
          })}
        </div>}

        {medicinesWithGivenStock && medicinesWithGivenStock.length === 0 &&
        <div className='stats-stocks-wrapper'>
          <p style={{fontSize: '1.5rem', fontWeight: '500'}}>No medicines for the given quantity in stock</p>
        </div>}
      </div>
    </div>
  )
}

export default Stats;