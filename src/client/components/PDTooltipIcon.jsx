import { useState, useEffect } from 'react';
import { QuestionCircle } from 'react-bootstrap-icons';

const TooltipIcon = () => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const tooltipIcon = document.querySelector("#pd-tooltip-icon");

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        tooltipIcon.addEventListener("mouseenter", handleMouseEnter);
        tooltipIcon.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            tooltipIcon.removeEventListener("mouseenter", handleMouseEnter);
            tooltipIcon.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
            <div className='icon-container'>
            <a href="https://imslp.org/wiki/Public_domain" target="_blank" rel="noreferrer" className='d-flex align-items-center'><QuestionCircle id='pd-tooltip-icon' size={16} /></a>
                {isHovered && (
                    <div className='pd-tooltip'>
                        <p>As of 2024, works published before January 1, 1923, are generally in the public domain in the United States.</p>
                        <p>For information on specific pieces, check IMSLP.</p>
                    </div>
                )}
            </div>
    );
};

export default TooltipIcon;
