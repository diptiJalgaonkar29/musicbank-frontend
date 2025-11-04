import React from 'react';
import './Logo.css';

export default function Logo(props) {    
  const logoSrc = props.logoSrc;
  
  return (
    <div className="LoginPage_CompanyLogo">
      <img src={logoSrc} alt="Company_Logo"></img>
    </div>
  );
}
