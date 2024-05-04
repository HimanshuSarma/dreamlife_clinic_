export const fetchedMedicinesReducer = (currentFetchedMedicinesState = {
    fetchedMedicines: null,
    fetchedMedicinesLoading: false}, action) => {
    
    // if(action.type === 'FETCH_MEDICINES_LOADING') {
    //     return {...currentFetchedMedicinesState, fetchedMedicinesLoading: true};
    // } else if(action.type === 'FETCH_MEDICINES_LOADED') {
    //     return {fetchedMedicines: action.payload, fetchedMedicinesLoading: false};
    // } else if(action.type === 'POST_MEDICINE_LOADED') {
    //     return {fetchedMedicines: [...currentFetchedMedicinesState.fetchedMedicines, action.payload]};
    // } else if(action.type === 'DELETE_MEDICINE_LOADING') {
    //     return {...currentFetchedMedicinesState, fetchedMedicinesLoading: true};
    // } else if(action.type === 'DELETE_MEDICINE_LOADED') {
    //     return {fetchedMedicines: currentFetchedMedicinesState.fetchedMedicines.filter(medicine => {
    //         return medicine._id !== action.payload;
    //     }), fetchedMedicinesLoading: false};
    // } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
    //     action.type === 'DELETE_FETCHED_MEDICINES') {
    //     return {fetchedMedicines: null, fetchedMedicinesLoading: false};
    // }   

    return currentFetchedMedicinesState;
}

export const newMedicineReducer = (
    newMedicineState = {
        isLoading: false,
        payload: null
    }, 
    action
) => {

    const newMedicineStateTemp = {...newMedicineState};

    if (action?.type === 'POST_MEDICINE_LOADING') {
        return {
            ...newMedicineStateTemp,
            isLoading: true,
        }
    } else if (action?.type === 'POST_MEDICINE_LOADED') {
        return {
            ...newMedicineStateTemp,
            isLoading: false
        };
    } else if (action?.type === 'POST_MEDICINE_FAILURE') {
        return {
            ...newMedicineStateTemp,
            isLoading: false
        };
    } 
    
    // else if(action.type === 'ADD_MEDICINE') {
    //     for(let i = 0; i < action.amount; i++) {
    //         newMedicineStateTemp.push({
    //             name: '',
    //             category: '',
    //             MRP: '',
    //             costPrice: '',
    //             discount: '',
    //             expDate: '',
    //             stock: ''
    //         });
    //     } 

    //     return newMedicineStateTemp;

    // } else if(action.type === 'UPDATE_MEDICINE') {
    //     return newMedicineState.map((formItem, i) => {
    //         if(i === action.payload.index) {
    //             return {...formItem, [action.payload.property]: action.payload.value};
    //         } else return formItem;
    //     })
    // } else if(action.type === 'DELETE_MEDICINE') {
    //     return newMedicineState.filter((formItem, i) => action.payload !== i);
    // } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
    //     action.type === 'DELETE_MEDICINES_FORM') {
    //     return [];
    // }

    return newMedicineState;
}