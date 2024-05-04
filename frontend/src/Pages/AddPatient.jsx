import React from 'react'

const AddPatient = () => {
    return (
        <div className='add'>
         <h1 className="add-header">Add New Patient</h1>
            <form className="add-form">
                <input type="text" className="add-input" placeholder='Enter Patients Name' />
                <input type="text" className="add-input" placeholder='Enter Category' />
                <input type="text" className="add-input" placeholder='Enter Complain' />
                <input type="text" className="add-input" placeholder='Visited Date'  onFocus={(e)=>e.target.type="date"} onBlur={(e)=>e.target.type="text"} />
                <input type="text" className="add-input" placeholder='Medicine Prescribed' />
                <input type="text" className="add-input" placeholder='Follow Up Date'  onFocus={(e)=>e.target.type="date"} onBlur={(e)=>e.target.type="text"} />
                <button className="add-btn" type='submit'>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default AddPatient
