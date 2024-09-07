export const salesOfReqdYearReducer = (currentSalesOfReqdYearState = {
        salesOfReqdYear: [], 
        isSalesOfReqdYearLoading: false}, action) => {
    if(action.type === 'FETCH_SALES_OF_YEAR_LOADING') {
        return {...currentSalesOfReqdYearState, isSalesOfReqdYearLoading: true};
    } else if (action.type === 'FETCH_SALES_OF_YEAR_LOADED') {
        return {salesOfReqdYear: action.payload, isSalesOfReqdYearLoading: false};
    } else if(action.type === 'FETCH_SALES_OF_YEAR_LOADING_FAILED') {
        return {...currentSalesOfReqdYearState, isSalesOfReqdYearLoading: false};
    } else if(action.type === 'SALES_OF_THE_YEAR_DELETE') {
        return {...currentSalesOfReqdYearState, salesOfReqdYear: []};
    }

    return currentSalesOfReqdYearState;
} 

export const medicinesWithGivenStockReducer = (currentMedicinesWithGivenStocks = {
        medicinesWithGivenStock: null,
        isMedicinesWithGivenStockLoading: false
    }, action) => {

    if(action.type === 'FETCH_MEDICINES_WITH_STOCKS_LOADING') {
        return {...currentMedicinesWithGivenStocks, isMedicinesWithGivenStockLoading: true};
    } else if(action.type === 'FETCH_MEDICINES_WITH_STOCKS_LOADED') {
        return {medicinesWithGivenStock: action.payload, isMedicinesWithGivenStockLoading: false};
    } else if(action.type === 'FETCH_MEDICINES_WITH_STOCKS_LOADING_FAILED') {
        return {...currentMedicinesWithGivenStocks, isMedicinesWithGivenStockLoading: false};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT') {
        return {
            medicinesWithGivenStock: null,
            isMedicinesWithGivenStockLoading: false
        };
    }

    return currentMedicinesWithGivenStocks;
}