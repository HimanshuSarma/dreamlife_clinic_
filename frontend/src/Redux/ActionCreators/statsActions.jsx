import base_url from "../../setup/appSetup";

export const fetchSalesOfReqdYear = (payload) => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_SALES_OF_YEAR_LOADING'});

        try {
            const fetchSalesOfReqdYearReq = await fetch(`${base_url}/sales/year/${payload}`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchSalesOfReqdYearReqData = await fetchSalesOfReqdYearReq.json();

            if(fetchSalesOfReqdYearReq.ok) {
                dispatch({
                    type: 'FETCH_SALES_OF_YEAR_LOADED',
                    payload: fetchSalesOfReqdYearReqData.payload
                })
            } else {
                dispatch({type: 'FETCH_SALES_OF_YEAR_LOADING_FAILED'})
            }
        } catch(err) {
            console.log(err);
        }
    }
}


export const fetchMedicinesWithGivenStocks = (payload) => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_MEDICINES_WITH_STOCKS_LOADING'});

        try {
            const fetchMedicinesWithGivenStocksReq = await fetch(`${base_url}/medicine/stocks/${payload}`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchMedicinesWithGivenStocksReqData = await fetchMedicinesWithGivenStocksReq.json();

            if(fetchMedicinesWithGivenStocksReq.ok) {
                dispatch({
                    type: 'FETCH_MEDICINES_WITH_STOCKS_LOADED',
                    payload: fetchMedicinesWithGivenStocksReqData.payload
                });
            } else {
                dispatch({type: 'FETCH_MEDICINES_WITH_STOCKS_LOADING_FAILED'});
            }
        } catch(err) {
            console.log(err);
        }
    }
}