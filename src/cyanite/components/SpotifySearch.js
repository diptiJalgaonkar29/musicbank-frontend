import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import Autocomplete, {
  createFilterOptions,
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

//https://developer.spotify.com/console/get-search-item/?q=Muse&type=track&market=&limit=&offset=&include_external=

const filter = createFilterOptions();

class SpotifySearch extends React.Component {
  state = {
    loading: true,
    spotify_search_data: null,
  };

  loadSpotifySearchResultData(searchTerm) {
    //axios request
    return axios
      .get(
        'https://api.spotify.com/v1/search?q=' + searchTerm + '&type=track',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer BQD6UaU_fp7mMk0ZyhJOkl3W50mC_LGtRr_O4lDbYuR-5kxq2Xerb-gL9-ucWUn3BbEs-d9qs-uP1QgjM08NfqjNPUnK1cmiwq77bDekcYyYFy61S7Nus4CRqCpkgxAqU7-kAHBLLV6G5zmIE0WhEx1IROgD2_WGnfNpWSMImizHqmgFqaRCZgFmrGuKGjcH5L0byUk',
          },
        }
      )
      .then((res) => {
        this.setState({
          spotify_search_data: res.data.tracks.items,
        });
      })
      .catch(() => {
        console.log('error while catching cyanite data  ');
      });
  }

  render() {
    return (
      <div className="combinedUserTextBlock">
        <Autocomplete
          freeSolo
          id="combinedUserList"
          size="medium"
          debug="true"
          value={this.state.spotify_search_data}
          //filterSelectedOptions
          autoComplete="true"
          options={this.state.spotify_search_data}
          filterOptions={(options, params) => {
            const inputValue = params.inputValue;
            if (
              inputValue.length === 2 &&
              inputValue !== this.state.searchValue
            ) {
              axios
                .get(
                  'https://api.spotify.com/v1/search?q=' +
                    inputValue +
                    '&type=track',
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization:
                        'Bearer BQBqxhTjqPzDKlwkzY3toyVG-OUY4203v6TFB6tKvvHRSZguM2yI7gu5XloUE-vLa6bsus2Gxvz4FXeCL2RtknF174Kdu2LvXR5NDh6lHz6Z-HNZJeaH6cWeC34qM94EW5l5n2CxgU1LMkQ5jlVHTvAuuxn4pjVKfD6ecxk-XT55ZRHt-tb2bTZXLicsA8ijgH7rq0w',
                    },
                  }
                )
                .then((res) => {
                  this.setState({
                    spotify_search_data: res.data.tracks.items,
                  });
                  return res.data.tracks.items;
                })
                .catch(() => {
                  console.log('error while catching cyanite data  ');
                });
            }
            if (options !== undefined) {
              // console.log('filteroptions: ' + params.inputValue.length);

              const filtered = filter(options, params);

              if (params.inputValue.length > 2) {
                filtered.push({
                  inputValue: params.inputValue,
                  email: params.inputValue,
                });
              }
              return filtered;
            }
          }}
          getOptionLabel={(option) => {
            return option.name;
          }}
          renderInput={(params) => {
            return (
              <TextField
                className="combinedUserOptions"
                {...params}
                variant="standard"
                placeholder="email"
              />
            );
          }}
          onChange={this.handleChange.bind(this)}
        />
        <p className="errorBox">{this.state.errorText}</p>
      </div>
    );
  }

  handleChange(event, value) {
    console.log(
      'handlechange: ' +
        value +
        '|' +
        event.target.value +
        '|' +
        event.target.textContent
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    search_result: state.search.search_result,
    refinement_items_redux: state.search.refinement_items,
  };
};

export default connect(mapStateToProps)(SpotifySearch);
