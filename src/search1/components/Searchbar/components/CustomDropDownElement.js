import React from 'react';
import { calculatePosition } from '../utils/calculatePosition';
import HashTagLogo from '../../../../static/hashtag.png';
import {
  DropDownElement,
  DropDownIconText,
  DropDownItem,
  DropDownItemContent,
  DropDownItemTitle,
  Line
} from '../SearchBarStyles';
import { CustomHighlight } from '../customHighlight';

const IconStyle = {
  width: '2.2rem',
  padding: '1.6rem',
  justifyContent: 'center',
  alignContent: 'center'
};

function CustomDropDownElement({
  position,
  name,
  typeProp,
  attribute,
  hits,
  highlightedIndex,
  getItemProps
}) {
  return (
    <DropDownElement>
      <DropDownItemTitle>Results in {name}</DropDownItemTitle>

      {hits[position].hits.map((item, index) => {
        const n = calculatePosition(position, hits);

        const type = { type: typeProp };
        const manipulatedItem = Object.assign(item, type);
        return (
          <DropDownItem
            key={item.objectID}
            {...getItemProps({
              item,
              manipulatedItem,
              index: index + n
            })}
            highlighted={index + n === highlightedIndex}
          >
            {index >= 1 && <Line />}
            <DropDownItemContent>
              <img src={HashTagLogo} alt="HashTag" style={IconStyle} />
              <DropDownIconText>
                <CustomHighlight
                  attribute={attribute}
                  hit={manipulatedItem}
                  tagName="mark"
                />
              </DropDownIconText>
            </DropDownItemContent>
          </DropDownItem>
        );
      })}
    </DropDownElement>
  );
}

export default CustomDropDownElement;
