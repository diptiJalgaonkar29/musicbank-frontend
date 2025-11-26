import React, { useState } from 'react';
// Remember to import the CSS file globally in your main app file (e.g., App.js)
import './MonitorReportsCommonHeader.css'; 
import IconWrapper from '../../../branding/componentWrapper/IconWrapper';
import { ReactComponent as Project } from '../../../static/Project.svg';
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { ReactComponent as Downloadicon } from '../../../static/download.svg';
import DatePickerField from '../../../common/components/CustomDatePicker/CustomDatePicker';
import { Formik, Form } from 'formik';
import MenuItemWrapper from '../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper';
import MenuWrapper from '../../../branding/componentWrapper/MenuWrapper/MenuWrapper';
const MonitorReportsCommonHeader = () => {
    // State to manage the date range selection
    const [dateRangeType, setDateRangeType] = useState('Custom');
   const [dateFrom, setDateFrom] = useState(new Date("2023-08-01"));
const [dateTo, setDateTo] = useState(new Date("2024-05-01"));
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const projectMenuItems = [
  {
    menuTitle: "Select",
    // icon: <span>📌</span>,   // replace with SVG import
    onClick: () => console.log("Select clicked"),
  },
  {
    menuTitle: "Custom",
    // icon: <span>⚙️</span>,   // replace with SVG import
    onClick: () => console.log("Custom clicked"),
  },
];


    return (
        <header className="statistics-header">
            {/* --- Left Section: Back Link and Title/Description --- */}
            <div className="header-left">
                <div className="back-link">
                   <IconWrapper icon='LeftArrow' /> <p className='back-button-text'>Monitor</p>
                </div>
                <div className="title-group">
                    <div className='' style={{display:'flex', justifyContent:'space-between'}}>
                    <div className='title-sub-group'>
                        <span className="title-icon"><Project/></span>
                        <h1 className="main-title">General Asset Statistics</h1>
                    </div>
                      {/* Utility Icons */}
                    <div className="utility-icons">
                        <span className="icon-share"><ShareOutlinedIcon /></span>
                        <span className="icon-download"><Downloadicon /></span>
                    </div>
                    </div>

                    <p className="description-text">
                        Data and insights about the current Sonic Hub content offered, including some general stats about their usage.
                    </p>
                </div>
            </div>

            {/* --- Right Section: Controls (Date Picker & Utility Icons) --- */}
       <div className="header-right">
  <Formik
    initialValues={{
      "date-from": null,
      "date-to": null,
    }}
    onSubmit={(values) => console.log(values)}
  >
    {() => (
      <Form>
        <div className="date-picker-group">
          <button
            className="open-menu-btn"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            type="button"
          >
            Date Range ▾
          </button>

          {/* MENU WRAPPER */}
          <MenuWrapper
            id="project_menu_dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {projectMenuItems.map((data) => (
              <MenuItemWrapper
                className="project_menu_item"
                onClick={data.onClick}
                key={data.menuTitle}
              >
                {data.menuTitle}
              </MenuItemWrapper>
            ))}

          </MenuWrapper>

          {/* DATE INPUTS */}
          <div className="date-input-container">
            <div className="date-input-wrapper">
              <label htmlFor="date-from">From</label>
              <DatePickerField
                id="date-from"
                name="date-from"
                placeholderText="Select a date"
                minDate={new Date("2022-01-01")}
                properClassName="datepicker-groupDate"
              />
            </div>

            <div className="date-input-wrapper">
              <label htmlFor="date-to">To</label>
              <DatePickerField
                id="date-to"
                name="date-to"
                placeholderText="Select a date"
                minDate={new Date("2022-01-01")}
                properClassName="datepicker-groupDate"
              />
            </div>
          </div>
        </div>
      </Form>
    )}
  </Formik>
</div>


        </header>
    );
};

export default MonitorReportsCommonHeader;