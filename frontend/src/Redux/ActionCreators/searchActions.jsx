import base_url from '../../setup/appSetup.jsx';

export const search = (payload) => {
    return async(dispatch) => {
        dispatch({type: 'SEARCH_LOADING'});

        try {
            const searchReq = await fetch(`${base_url}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            const searchReqData = await searchReq.json();

            if(searchReq.ok) {
                dispatch({
                    type: `${searchReqData.searchedItems === 'patients' ? 'SEARCH_PATIENTS_LOADED' : 
                            searchReqData.searchedItems === 'medicines' ? 'SEARCH_MEDICINES_LOADED' : ''}`,
                    payload: searchReqData.payload
                })
            } else {
                dispatch({
                    type: 'SEARCH_FAILED'
                })
            }

        } catch (err) {
            console.log(err);
        }
    }
}

