import React, { useEffect, useRef, useState } from "react";
import AccordionWrapper from "../../../branding/componentWrapper/AccordionWrapper";
import RangeSliderWrapper from "../../../branding/componentWrapper/RangeSliderWrapper";
import { isEqual } from "lodash";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import FilterAccordion from "../FilterAccordion/FilterAccordion";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import {
  setTrackFilters,
  setTrackTypeFilters,
} from "../../../redux/actions/trackFilterActions/trackFilterActions";
import { MultiSelect } from "react-multi-select-component";
import "./BrowseV2Sidebar.css";
import AsyncService from "../../../networking/services/AsyncService";

const validateBPMInput = (evt) => {
  var custEvent = evt || window.event;
  var key;
  // chk copy paste
  if (custEvent.type === "paste") {
    key = evt.clipboardData.getData("text/plain");
  } else {
    //chk key press
    key = custEvent.keyCode || custEvent.which;
    key = String.fromCharCode(key);
  }
  //validate for only numbers
  var regex = /[0-9]/;
  if (!regex.test(key)) {
    custEvent.returnValue = false;
    if (custEvent.preventDefault) custEvent.preventDefault();
  }
};

const BrowseV2Sidebar = ({
  trackTypeFilters,
  filteredTags,
  tracks,
  filterItems,
  filterItemsMemo,
}) => {
  const dispatch = useDispatch();
  const tempoRanges = {
    Slow: [1, 66],
    "Medium Slow": [67, 76],
    Medium: [77, 108],
    "Medium Fast": [109, 120],
    Fast: [121, 300],
  };
  const getTrackMaster = async () => {
    try {
      let trackMeta = await AsyncService.loadData(`trackType/getAllTrackTypes`);
      setTrackTypeMaster(
        trackMeta?.data?.map((e, i) => ({ value: e?.id, label: e?.trackType }))
      );
    } catch (error) {
      console.log("error", error);
    }
  };
  const [trackTypeMaster, setTrackTypeMaster] = useState([]);
  useEffect(() => {
    getTrackMaster();
  }, []);

  const setTempoFilterBPM = (bpmInputValue) => {
    let inputValv, inputMinv, inputMaxv;
    inputValv = parseInt(bpmInputValue);
    inputMinv = inputValv - 10;
    inputMaxv = inputValv + 10;
    dispatch(
      setTrackFilters({
        tempo: [
          {
            label: `BPM:${inputMinv}-${inputMaxv}`,
            value: [inputMinv, inputMaxv],
          },
        ],
      })
    );
  };

  const formikRef = useRef();

  const filterByTempo = (tempo) => {
    formikRef.current?.setFieldValue("bpm", "");
    // console.log("tempo", tempo, tempoRanges[tempo]);
    // dispatch(
    //   setTrackFilters({
    //     tempo: [
    //       {
    //         label: `BPM:${tempoRanges[tempo][0]}-${tempoRanges[tempo][1]}`,
    //         value: tempoRanges[tempo],
    //       },
    //     ],
    //   })
    // );
    dispatch(
      setTrackFilters({
        tag_tempo: [
          {
            label: tempo,
            value: tempo,
          },
        ],
      })
    );
  };

  const onTrackTypeChange = (e) => {
    dispatch(setTrackTypeFilters(e));
  };

  return (
    <aside className="browseV2_sidebar">
      <h3 className="filter_header">Choose your Libraries</h3>
      <MultiSelect
        options={trackTypeMaster}
        value={trackTypeFilters}
        onChange={onTrackTypeChange}
        disableSearch
        hasSelectAll
        labelledBy="Select"
        className={`multi_select_track_type_filter selectAll`}
        overrideStrings={{
          selectSomeItems: "All Libraries",
          allItemsAreSelected: "All Libraries",
          selectAll: "All Libraries",
        }}
      // isOpen
      />
      <h3 className="filter_header" style={{ marginTop: "1.5rem" }}>
        Filter By
      </h3>
      <AccordionWrapper title={"BPM (Tempo)"}>
        <div className={`ais-RangeSlider-wrapper`}>
          <RangeSliderWrapper
            min={tracks?.tempo?.[0]?.min_tempo ?? 0}
            max={tracks?.tempo?.[0]?.max_tempo ?? 185}
            disabled={
              tracks?.tempo?.[0]?.min_tempo === tracks?.tempo?.[0]?.max_tempo
            }
            values={
              !filterItems?.tempo?.[0]?.value ||
                filterItems?.tempo?.[0]?.value?.length === 0
                ? [tracks?.tempo?.[0]?.min_tempo, tracks?.tempo?.[0]?.max_tempo]
                : filterItemsMemo?.tempo?.[0]?.value
            }
            onChange={(e) => {
              if (
                e?.values?.some((x) => isNaN(x) || !Boolean) ||
                isEqual(e?.values, [
                  tracks?.tempo?.[0]?.min_tempo,
                  tracks?.tempo?.[0]?.max_tempo,
                ])
              ) {
                return;
              }
              dispatch(
                setTrackFilters({
                  tempo: [
                    {
                      label: `BPM:${e?.values?.[0]}-${e?.values?.[1]}`,
                      value: e?.values,
                    },
                  ],
                })
              );
            }}
          />
          <div className="ais-RangeSlider-tempo">
            <div className="ais-RangeSlider-tempoSlowFast">
              {["Slow", "Fast"].map((tempo) => (
                <ChipWrapper
                  key={tempo}
                  label={tempo}
                  onClick={() => {
                    filterByTempo(tempo);
                  }}
                />
              ))}
            </div>
            <div className="ais-RangeSlider-tempoRange">
              {["Medium Slow", "Medium", "Medium Fast"].map((tempo) => (
                <ChipWrapper
                  key={tempo}
                  label={tempo}
                  onClick={() => {
                    filterByTempo(tempo);
                  }}
                />
              ))}
            </div>
          </div>
          <Formik
            initialValues={{ bpm: "" }}
            onSubmit={(values) => {
              setTempoFilterBPM(values?.bpm);
            }}
            innerRef={formikRef}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <div className="custom-Input-wrapper">
                  <div className="custom-inputicon-wrapper">
                    <InputWrapper
                      name="bpm"
                      size="s"
                      type="number"
                      min={tracks?.tempo?.[0]?.min_tempo ?? 0}
                      max={tracks?.tempo?.[0]?.max_tempo ?? 185}
                      placeholder="Search BPM..."
                      value={values.bpm}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onKeyPress={(e) => {
                        validateBPMInput?.(e);
                      }}
                      onBlur={handleBlur}
                    />
                  </div>
                  <IconButtonWrapper
                    icon="Search"
                    className="submitInput"
                    type="submit"
                    disabled={
                      !values.bpm ||
                      Number(values.bpm) >
                      (tracks?.tempo?.[0]?.max_tempo ?? 185) ||
                      Number(values.bpm) < (tracks?.tempo?.[0]?.min_tempo ?? 0)
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AccordionWrapper>
      <FilterAccordion
        label={"Musical Feel"}
        items={tracks?.AMPTagCountList}
        attribute="tag_amp_allmood_ids"
        filteredTags={filteredTags}
      />
      <FilterAccordion
        label={"Instruments"}
        attribute="instrument_ids"
        items={tracks?.InstrumentList}
        filteredTags={filteredTags}
      />
      <FilterAccordion
        label={"Key"}
        items={tracks?.TagKeyCountList}
        attribute="tag_key"
        filteredTags={filteredTags}
      />
      <FilterAccordion
        label={"Genre"}
        items={tracks?.GenreList}
        attribute="tag_genre"
        filteredTags={filteredTags}
      />
      <FilterAccordion
        label={"Asset Type"}
        items={tracks?.AssetTypeList}
        attribute="assetTypeId"
        filteredTags={filteredTags}
      />
    </aside>
  );
};

export default BrowseV2Sidebar;
