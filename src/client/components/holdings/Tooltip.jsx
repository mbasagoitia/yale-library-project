import React, { useState } from 'react';
import { QuestionCircle } from 'react-bootstrap-icons';

const Tooltip = ({ content }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className='icon-container' 
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <QuestionCircle id='tooltip-icon' size={12} className='mb-1' />
            {isHovered && (
                <div className='tooltip-content'>
                {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
