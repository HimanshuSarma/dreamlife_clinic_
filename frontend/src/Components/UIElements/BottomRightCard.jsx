import React from 'react';

import './BottomRightCard.css';

const BottomRightCard = (props) => {
  return (
    <div style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        bottom: '0',
        backgroundColor: 'var(--darker_green_hex_2)',
        borderRadius: '5px',
        zIndex: '100'
    }} className='bottom-right-card-anim'>
        {props.children}
    </div>
  )
}

export default BottomRightCard