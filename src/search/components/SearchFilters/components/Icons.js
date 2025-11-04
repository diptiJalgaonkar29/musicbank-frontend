import React from 'react';
import Icon from '@mui/material/Icon';

// add_circle and remove_circle is not a text ! this describes the shape of the icon 
export function AddIcon() {
  return <Icon id="accordion__body__nested--icon">add_circle</Icon>;
}
export function RemoveIcon() {
  return <Icon id="accordion__body__nested--icon_active">remove_circle</Icon>;
}
