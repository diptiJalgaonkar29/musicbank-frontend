import React from 'react';
import { connectHighlight } from 'react-instantsearch-dom';
import { TagInDropDown } from './SearchBarStyles';

const styles = {
  color: 'black',
  fontWeight: 'bolder',
};

export const CustomHighlight = connectHighlight(
  ({ highlight, attribute, hit }) => {
    const parsedHit = highlight({
      attribute,
      hit,
      highlightProperty: '_highlightResult',
    });

    const highlightedHits = parsedHit.map((part, i) => {
      if (part.isHighlighted)
        return (
          <span style={styles} key={i}>
            {part.value}
          </span>
        );
      return part.value;
    });

    return <TagInDropDown>{highlightedHits}</TagInDropDown>;
  }
);

export const CustomHighlightArray = connectHighlight(
  ({ highlight, attribute, hit }) => {
    const parsedHit = highlight({
      attribute,
      hit,
      highlightProperty: '_highlightResult',
    });

    const filteredArray = parsedHit.map((item, i) => {
      // if it is an array
      if (item.length === 2) {
        return (
          <p>
            <span style={styles} key={i}>
              {item[0].value}
            </span>
            {item[1].value}
          </p>
        );
      } else if (item.length === 1 && item[0].isHighlighted) {
        return (
          <p>
            <span style={styles} key={i}>
              {item[0].value}
            </span>
          </p>
        );
      }
      return (
        <TagInDropDown key={'TagInDropDown' + i}>{filteredArray}</TagInDropDown>
      );
    });
  }
);
