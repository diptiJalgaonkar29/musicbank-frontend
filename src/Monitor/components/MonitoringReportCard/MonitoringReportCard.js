
import React from 'react';
import './MonitoringReportCard.css';
const MonitoringReportCard = ({ title, lastOpened }) => {
  

  return (
    <div className='monitoring-report-card'   >
      <h3 className='monitoring-report-card-title'>{title}</h3>
      <p className='monitoring-report-card-last-opened'>Last opened {lastOpened}</p>
    
    </div>
  );
};

export default MonitoringReportCard;