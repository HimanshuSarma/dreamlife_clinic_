import base_url from "../../setup/appSetup";

export const postSale = (payload, salesMessageHandler, date) => {
    return async(dispatch, getState) => {
        if((typeof payload.custPhone === 'number' && payload.custPhone > 0) || payload.custPhone === '') {
            for(let i = 0; i < payload.products.length; i++) {
                const {name, sellingPrice, profit, qty} = payload.products[i];
                console.log(name, sellingPrice, profit, qty);
                if(name === '' || !sellingPrice || typeof sellingPrice !== 'number' || 
                sellingPrice <= 0 || !profit || typeof profit !== 'number' || 
                profit < 0 || !qty || typeof qty !== 'number' || qty <= 0) {
                    salesMessageHandler(`Please check out all the inputs ${name ? `of ${name}` : ''}`);
                    return;
                }
            }
        }

        dispatch({type: 'POST_SALE_LOADING'});
        
        try {
            const postSaleReq = await fetch(`${base_url}/sales/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const postSaleReqData = await postSaleReq.json();
            
            if(postSaleReq.ok) {
                salesMessageHandler('Sale posted successfully');

                if(postSaleReqData.payload.createdAt.year === date.year && postSaleReqData.payload.createdAt.month === date.month) {
                    dispatch({
                        type: 'POST_SALE_LOADED',
                        payload: postSaleReqData.payload
                    });
                }               
            } else {
                salesMessageHandler(postSaleReqData.message);
                dispatch({
                    type: 'POST_SALE_LOAD_FAILED'
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
} 

export const postEditedSaleProduct = (payload) => {
    return async(dispatch) => {
        const {data} = payload;

        if(data && typeof data.name === 'string' && data.name !== '' && typeof data.sellingPrice === 'number' && 
        data.sellingPrice >= 0 && typeof data.profit === 'number' && data.profit >= 0 && typeof data.qty === 'number' &&
        data.qty >= 0) {
            dispatch({type: 'POST_EDITED_SALE_PRODUCT_LOADING'});

            try {
                const postEditedSaleProductReq = await fetch(`${base_url}/sales/products/${payload.saleID}/${payload.productID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload.data)
                });

                const postEditedSaleProductReqData = await postEditedSaleProductReq.json();

                if(postEditedSaleProductReq.ok) {
                    dispatch({
                        type: 'POST_EDITED_SALE_PRODUCT_LOADED',
                        payload: postEditedSaleProductReqData.payload
                    });
                } else {

                }
            } catch(err) {
                console.log(err);
            }
        }
    }   
}

export const fetchSalesOfGivenYearAndMonth = (payload) => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADING'});

        try {
            const fetchSalesOfGivenYearAndMonthReq = await fetch(
                `${base_url}/sales/year-month/${payload.year}/${payload.month}`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchSalesOfGivenYearAndMonthReqData = await fetchSalesOfGivenYearAndMonthReq.json();

            if(fetchSalesOfGivenYearAndMonthReq.ok) {
                dispatch({
                    type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADED',
                    payload: {
                        data: fetchSalesOfGivenYearAndMonthReqData.payload,
                        yearAndMonth: fetchSalesOfGivenYearAndMonthReqData.yearAndMonth
                    }
                })
            } else {
                dispatch({type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOAD_FAILED'})
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const deleteSale = (_id, salesMessageHandler) => {
    return async(dispatch) => {
        dispatch({type: 'DELETE_SALE_LOADING'});

        const deleteSaleReq = await fetch(`${base_url}/sales/delete/${_id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const deleteSaleReqData = await deleteSaleReq.json();

        if(deleteSaleReq.ok) {
            dispatch({
                type: 'DELETE_SALE_LOADED',
                payload: deleteSaleReqData.payload
            });

            salesMessageHandler(deleteSaleReqData.message);
        } else {
            dispatch({type: 'DELETE_SALE_FAILED'});
            salesMessageHandler(deleteSaleReqData.message);
        }
    }
}