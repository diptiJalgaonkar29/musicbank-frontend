import React, { useState } from "react";
import { Highlight, connectRefinementList } from "react-instantsearch-dom";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { SSCustomCurrentRefinements } from "./SSCustomCurrentRefinements";
import { lab } from "d3-color";

var selectedTags = [];

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  ssBaseRef,
}) => {
  const [val, setVal] = useState([]);

  function handleChange(event, value, reason) {
    // console.log("handlechange: " + reason + value + "|" + event.target.value + "|" + event.target.textContent)
    if (reason === "remove-option") {
      let result = selectedTags.filter((o1) => !value.some((o2) => o1 === o2));
      // console.log("removed ",result)
      event.preventDefault();
      refine(result[0]);
    } else {
      // console.log("added ", event.target.textContent)
      refine(event.target.textContent);
    }

    selectedTags = value;
  }

  const valHtml = val.map((option, index) => {
    // This is to handle new options added by the user (allowed by freeSolo prop).
    const label = option.title || option;
    // console.log("valhtml " + label)
    refine(label);
    return (
      <Chip
        key={label}
        label={label}
        //deleteIcon={<RemoveIcon />}
        onDelete={() => {
          var dle = val.filter((entry) => entry !== option);
          // console.log("deleted ", dle, label);
          //setVal(dle);
          //refine(label);
        }}
      />
    );
  });

  return (
    <ul>
      <li>
        <input
          type="search"
          onChange={(event) => searchForItems(event.currentTarget.value)}
        />
      </li>

      <li style={{ backgroundColor: "antiquewhite" }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={items.map((item) => item.label)}
          //getOptionLabel={(item) => item.label}
          //defaultValue={items[0]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Multiple values"
              placeholder="Favorites"
            />
          )}
          /* renderTags={(items) => {
                        return (items.map(item => (
                            <Chip
                                key={item}
                                label={item}
                                //deleteIcon={<RemoveIcon />}
                                onDelete={() => {
                                    var dle = val.filter((entry) => entry !== item);
                                    console.log("deleted ", dle, item);
                                    //setVal(dle);
                                    refine(item);
                                }}
                            />
                        )))
                    }} */
          onChange={handleChange}
          //onDelete={(e) => handleDelete(e, item)}
        />

        {/* <Autocomplete
                    multiple
                    id="tags-outlined"
                    //filterSelectedOptions
                    options={items.map((item) => item.label)}
                    onChange={(e, newValue) => {
                        console.log("handlechange: " + newValue)
                        setVal(newValue)
                    }}
                    //defaultValue={items[0]}
                    //getOptionLabel={(item) => item}
                    //getOptionLabel={(item) => item.label}
                    renderTags={(items) => {
                        return (items.map(item => (
                            <Chip
                                key={item}
                                label={item}
                                //deleteIcon={<RemoveIcon />}
                                onDelete={() => {
                                    var dle = val.filter((entry) => entry !== item);
                                    console.log("deleted ", dle, item);
                                    setVal(dle);
                                    refine(item);
                                }}
                            />
                        )))
                    }}
                    //value={val}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Enter Tag Name"
                            margin="normal"
                            fullWidth
                        />
                    )}
                /> */}
        <div className="selectedTags">{valHtml}</div>
        <SSCustomCurrentRefinements ssBaseRef={ssBaseRef} />
      </li>
      {/* {items.map(item => (
                <li key={item.label}>
                    <a
                        href={createURL(item.value)}
                        style={{ fontWeight: item.isRefined ? 'bold' : '' }}
                        onClick={event => {
                            event.preventDefault();
                            refine(item.value);
                        }}
                    >
                        {isFromSearch ? (
                            <Highlight attribute="label" hit={item} />
                        ) : (
                            item.label
                        )}{' '}
                        ({item.count})
                    </a>
                </li>
            ))} */}
    </ul>
  );
};

export const SSCustomRefinementSearchTag =
  connectRefinementList(RefinementList);

function handleChange1(event, value, reason, refine) {
  // console.log("handlechange: " + reason + value + "|" + event.target.value + "|" + event.target.textContent)
  if (reason === "remove-option") {
    let result = selectedTags.filter((o1) => !value.some((o2) => o1 === o2));
    console.log("removed ", result);
    event.preventDefault();
    refine(result[0]);
  } else {
    // console.log("added ", event.target.textContent)
    refine(event.target.textContent);
  }

  selectedTags = value;
}

const handleDelete = (e, value) => {
  e.preventDefault();
  // console.log("clicked delete", value);
};

const handleClick = () => {
  // console.info('You clicked the Chip.');
};
