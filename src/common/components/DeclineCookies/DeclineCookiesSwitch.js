import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { withStyles } from '@mui/styles';
import Switch from '@mui/material/Switch';
import React from 'react';

const ColoredSwitch = withStyles({
  switchBase: {
    color: 'var(--color-primary)',
    '&$checked': {
      color: 'var(--color-primary)',
    },
    '&$checked + $track': {
      backgroundColor: 'var(--color-primary)',
    },
  },
  checked: {},
  track: {},
})(Switch);

export default function DeclineCookiesSwitch({
  cookiesAreAccepted,
  handleChangeOnSwitchButton,
}) {
  return (
    <FormGroup row style={{ justifyContent: 'flex-end' }}>
      <FormControlLabel
        control={
          <ColoredSwitch
            checked={cookiesAreAccepted}
            onChange={handleChangeOnSwitchButton}
            name="declineCookiesSwitch"
          />
        }
        label="Accept Privacy Policy"
      />
    </FormGroup>
  );
}
