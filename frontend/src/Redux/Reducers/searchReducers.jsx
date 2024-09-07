export const searchReducer = (currentSearchOptionState = {
    mainCategory: 'patients',
    subCategory: 'name'
}, action) => {

    if(action.type === 'UPDATE_SEARCH_MAIN_CATEGORY') {
        return {mainCategory: action.payload, subCategory: 'name'};
    } else if(action.type === 'UPDATE_SEARCH_SUB_CATEGORY')  {
        return {...currentSearchOptionState, subCategory: action.payload};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_SEARCH_CATEGORY') {
        return {mainCategory: '', subCategory: ''};
    }

    return currentSearchOptionState;
}


export const searchItemsReducer = (currentSearchItemsState = {patientSearchedItems: [], 
    medicineSearchedItems: [], searched: '', isSearchItemsLoading: false}, action) => {
    if(action.type === 'SEARCH_LOADING') {
        return {...currentSearchItemsState, isSearchItemsLoading: true};
    } else if(action.type === 'SEARCH_PATIENTS_LOADED') {
        return {...currentSearchItemsState, patientSearchedItems: action.payload, 
                searched: 'patients', isSearchItemsLoading: false};
    } else if(action.type === 'SEARCH_MEDICINES_LOADED') {
        return {...currentSearchItemsState, medicineSearchedItems: action.payload, 
                searched: 'medicines', isSearchItemsLoading: false};
    } else if(action.type === 'SEARCH_FAILED') {
        return {...currentSearchItemsState, searched: '', isSearchItemsLoading: false};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_SEARCHED_ITEMS') {
        return {patientSearchedItems: [], medicineSearchedItems: [], searched: '', isSearchItemsLoading: false};
    }

    return currentSearchItemsState;
}