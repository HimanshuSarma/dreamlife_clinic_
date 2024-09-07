import React from 'react';

const AddMedicine = () => {
    return (
        <div className='add'>
             <h1 className="add-header">Add New Medicine</h1>
             <form className="add-form">
                <input type="text" className="add-input" placeholder='Enter Medicine Name' />
                <input type="text" className="add-input" placeholder='Enter Price' />
                <input type="text" className="add-input" placeholder='Enter Discount' />
                <input type="text" className="add-input" placeholder='Expiry Date' onFocus={(e)=>e.target.type="date"} onBlur={(e)=>e.target.type="text"} />
                <input type="text" className="add-input" placeholder='Category' />
                <button className="add-btn" type='submit'>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default AddMedicine
