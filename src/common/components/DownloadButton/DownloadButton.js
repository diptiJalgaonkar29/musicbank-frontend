import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import './DownloadButton.css';

export default ({ label, onClickProp, disabledProp, disabledMessageProp }) => {
  const cl =
        disabledProp === true
        	? 'TpTc__dl-btn dl-btn--disabled'
        	: 'TpTc__dl-btn';

  const disabledBool = disabledProp === true ? true : false;
  return (
    <Tooltip
      title={disabledMessageProp}
      placement="bottom"
      disableTouchListener={!disabledBool}
      disableFocusListener={!disabledBool}
      disableHoverListener={!disabledBool}
    >
      <button
        type="button"
        disabledMessageProp={disabledMessageProp}
        onClick={onClickProp}
        disabled={disabledBool}
        className={cl}
      >
        {label}
      </button>
    </Tooltip>
  );
};
