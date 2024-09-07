export const fetchedPatientsReducer = (currentFetchedPatientsState = {
    fetchedPatients: null,
    fetchedPatientsLoading: false}, action) => {
    
    if(action.type === 'FETCH_PATIENTS_LOADING') {
        return {...currentFetchedPatientsState, fetchedPatientsLoading: true};
    } else if(action.type === 'FETCH_PATIENTS_LOADED') {
        return {fetchedPatients: action.payload, fetchedPatientsLoading: false};
    } else if(action.type === 'POST_PATIENT_LOADING') {
        return {...currentFetchedPatientsState, fetchedPatientsLoading: true};
    } else if(action.type === 'POST_PATIENT_LOADED') {
        return {fetchedPatients: [...currentFetchedPatientsState.fetchedPatients, action.payload], fetchedPatientsLoading: false};
    } else if(action.type === 'DELETE_PATIENT_LOADING') {
        return {...currentFetchedPatientsState, fetchedPatientsLoading: true};
    } else if(action.type === 'DELETE_PATIENT_LOADED') {
        return {fetchedPatients: currentFetchedPatientsState.fetchedPatients.filter(currentPatient => {
            return currentPatient._id !== action.payload;
        }), fetchedPatientsLoading: false};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_FETCHED_PATIENTS') {
        return {fetchedPatients: null, fetchedPatientsLoading: false};
    }   

    return currentFetchedPatientsState;
}


export const patientsFormReducer = (currentPatientsFormState = [], action) => {

    if(action.type === 'ADD_PATIENT') {
        const newPatientForm = currentPatientsFormState;
        for(let i = 0; i < action.amount; i++) {
            newPatientForm.push({
                name: '',
                category: '',
                complain: '',
                visitDate: '',
                medPrescribed: '',
                phone: ''
            });
        } 

        return newPatientForm;

    } else if(action.type === 'UPDATE_PATIENT') {
        return currentPatientsFormState.map((formItem, i) => {
            if(i === action.payload.index) {
                return {...formItem, [action.payload.property]: action.payload.value};
            } else return formItem;
        })
    } else if(action.type === 'DELETE_PATIENT') {
        return currentPatientsFormState.filter((formItem, i) => action.payload !== i);
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_PATIENTS_FORM') {
        return [];
    }

    return currentPatientsFormState;
}