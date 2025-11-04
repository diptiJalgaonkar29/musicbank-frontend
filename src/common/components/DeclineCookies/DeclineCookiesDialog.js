import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

import { withRouterCompat } from '../../utils/withRouterCompat';

function removeCookies() {
  var res = document.cookie;
  var multiple = res.split(';');
  for (var i = 0; i < multiple.length; i++) {
    var key = multiple[i].split('=');
    document.cookie =
            key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC';
  }
}

function DeclineCookiesDialog({ dialogOpen, handleClose, navigate }) {
  const handleAccectDeclineCookies = () => {
    removeCookies();
    navigate('/logout');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="decline-cookies-diaglog-title"
        aria-describedby="decline-cookies-diaglog-description"
      >
        <DialogTitle id="decline-cookies-diaglog-title">
          {'Decline Accaptance of Privacy Policy ?'}
        </DialogTitle>
        <DialogContent >
          <DialogContentText id="decline-cookies-diaglog-description" style={{ fontSize: '1.2rem' }}>
            Declining the Privacy Policy will log you out !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>
            Abort
          </Button>
          <Button
            onClick={handleAccectDeclineCookies}
            style={{ color: 'grey', fontSize: '1.2rem' }}
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRouterCompat(DeclineCookiesDialog);
