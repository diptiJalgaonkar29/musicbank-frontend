import React, { useState, useMemo } from 'react';
import './DynamicDataTable.css'; 

const DynamicDataTable = ({ 
    data,
    initialToggleState = true,
    toggleText = "Detailed Data",
    showSrNo = false,
    hideToggle = false,
    firstChildBg=true,
    borders=false,
    headerBg=false
}) => {
    
    const [isToggledVisible, setIsToggledVisible] = useState(initialToggleState);

    const isVisible = hideToggle || isToggledVisible;
    
    const headers = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]);
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="no-data-message">No detailed data available.</div>;
    }

    const handleToggle = () => {
        setIsToggledVisible(prev => !prev);
    };

    const toggleIcon = isToggledVisible ? '▲' : '▼'; 

    return (
        <div className="table-container-wrapper">
            
            {!hideToggle && (
                <div className="table-toggle-header" onClick={handleToggle}>
                    <span className="toggle-text">{toggleText}</span>
                    <span className="toggle-icon">{toggleIcon}</span>
                </div>
            )}

            {isVisible && (
                <div className={`table-scroll-wrapper ${borders ? 'border-around-table' : ''}`}>
                    <table className={`dynamic-data-table ${headerBg ? 'add-Bg-header' : ''}`}>
                        <thead>
                            <tr>
                                {showSrNo && (
                                    <th className="sr-no-column"></th>
                                )}
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className={` ${!firstChildBg ? 'first-child-bg-color-visible' : ''}  `  }>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {showSrNo && (
                                        <td className="sr-no-column">{rowIndex + 1}</td>
                                    )}

                                    {headers.map((key, cellIndex) => (
                                        <td key={cellIndex}>
                                            {typeof row[key] === 'number' ? new Intl.NumberFormat().format(row[key]) : row[key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DynamicDataTable;