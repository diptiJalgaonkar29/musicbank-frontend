import React from 'react';
import DeclineCookiesDialog from './DeclineCookiesDialog';
import DeclineCookiesSwitch from './DeclineCookiesSwitch';

function Index() {
  const [isAccepted, setIsAccepted] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleCloseDiaglog = () => {
    setDialogOpen(false);
    setIsAccepted(true);
  };

  const handleChangeSwitchButton = (event) => {
    const value = event.target.checked;
    if (value === false) {
      setDialogOpen(true);
      setIsAccepted(false);
    } else {
      return;
    }
  };

  return (
    <>
      <DeclineCookiesSwitch
        handleChangeOnSwitchButton={handleChangeSwitchButton}
        cookiesAreAccepted={isAccepted}
      />
      <DeclineCookiesDialog
        handleClose={handleCloseDiaglog}
        dialogOpen={dialogOpen}
      />
    </>
  );
}

export default Index;
