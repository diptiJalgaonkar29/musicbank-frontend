import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Icon from '@mui/material/Icon';

// only used in Search Filter with two Hierachies
const CustomRefineTitle = connectRefinementList(
  ({ items, refine, ...props }) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="mainIcon__container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            refine(items[0].value);
          }}
        >
          {!items[0].isRefined ? (
            <Tooltip title="Add" placement="left" TransitionComponent={Zoom}>
              <Icon id="mainIcon__add">add_circle</Icon>
            </Tooltip>
          ) : (
            <Tooltip title="Remove" placement="left" TransitionComponent={Zoom}>
              <Icon id="mainIcon__remove">remove_circle</Icon>
            </Tooltip>
          )}
        </div>
        <div id="nested_accordion__title--text" key={props.id}>
          <h3 style={{ display: 'flex', lineHeight: '26px' }}>
            <div
              className="accordion__arrow"
              id="accordion__arrow__nested"
              role="presentation"
              style={{ marginRight: '5px' }}
            />

            {items.length > 0
              ? `${props.attributeName} (${items[0].count})`
              : null}
          </h3>
        </div>
      </div>
    );
  }
);

export default CustomRefineTitle;
