import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {search} from '../Redux/ActionCreators/searchActions';

const SearchComponent = () => {

  const [searchInput, setSearchInput] = useState('');

  const {mainCategory, subCategory} = useSelector(store => store.search);

  const dispatch = useDispatch();

  const currentPath = useLocation().pathname;

  useEffect(() => {
    dispatch({
        type: 'UPDATE_SEARCH_MAIN_CATEGORY',
        payload: (currentPath === '/patients' ? 'patients' : 
        currentPath === '/medicine' ? 'medicines' : 'patients')
    });
  }, [currentPath]);

  useEffect(() => {
    if(mainCategory === '') {
        dispatch({
            type: 'UPDATE_SEARCH_MAIN_CATEGORY',
            payload: 'patients'
        })
    }
  }, [mainCategory]);

  return (
    <div className="layout-control">
        <input onChange={(event) => setSearchInput(event.target.value)} value={searchInput} type="text" className="layout-searchbar" />
        <div className='layout-search-wrapper'>
            <button onClick={() => dispatch(search({mainCategory, subCategory, val: searchInput}))} 
                    className="layout-search">
                Search for : 
            </button>

            <div className='layout-search-select-wrapper'>
                <select onChange={(event) => {
                    dispatch({
                        type: 'UPDATE_SEARCH_MAIN_CATEGORY',
                        payload: event.target.value
                    });
                }} value={mainCategory ? mainCategory : 'patients'} className='layout-dropdown' name="" id="">
                    <option value="patients">Patients</option>
                    <option value="medicines">Medicines</option>
                </select>

                <select onChange={event => {
                    dispatch({
                        type: 'UPDATE_SEARCH_SUB_CATEGORY',
                        payload: event.target.value
                    });
                }} name="" id="">
                    {mainCategory === 'medicines' && 
                    <>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    {/* <option value="price">Price</option>
                    <option value="stock">Stock</option> */}
                    </>}

                    {(mainCategory === 'patients')  && 
                    <>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="complain">Complain</option> 
                    <option value="medPrescribed">Medicine Prescribed</option>
                    </>}
                </select>
            </div>
        </div>
    </div> 
  )
}

export default SearchComponent