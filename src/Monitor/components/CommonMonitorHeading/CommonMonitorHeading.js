import React from 'react';
import './CommonMonitorHeading.css'; // Import the corresponding CSS file

export default function CommonMonitorHeading({ 
    leftText ,
    dateRange,
    rightText 
}) {
    // Determine the content for the right side
    const rightContent = rightText || `Date Range: ${dateRange}`;

    return (
        <div className="monitor-heading-container">
            {/* Left Content */}
            <div className="heading-left-text">
                {leftText}
            </div>

            {/* Right Content (Conditional) */}
            <div className="heading-right-text">
                {rightContent}
            </div>
        </div>
    );
}