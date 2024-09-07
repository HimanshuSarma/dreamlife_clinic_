import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

import PatientTable from './PatientTable';
import MedicineTable from './MedicineTable';

const SearchResults = () => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const {searched, patientSearchedItems, medicineSearchedItems} = useSelector(store => store.searchedItems);

  useEffect(() => {
    if(searched) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searched, patientSearchedItems, medicineSearchedItems]);  


  return (
    <>
    {searched && showSearchResults &&
    <div className='layout-search-results'>
        <h3 className='layout-search-results-heading'>Search Results: </h3>
        {searched === 'patients' &&
        <PatientTable setShowSearchResults={setShowSearchResults} comp='search-results' />}
        {searched === 'medicines' && 
        <MedicineTable setShowSearchResults={setShowSearchResults} comp='search-results' /> }
    </div>}
    </>
  )
}

export default SearchResults