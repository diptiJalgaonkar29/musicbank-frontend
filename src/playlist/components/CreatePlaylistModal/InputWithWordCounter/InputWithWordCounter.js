import React from "react";
import "../../../../_styles/InputWithWordCounter.css";

export class InputWithWordCounter extends React.Component {
  render() {
    const {
      placeholderProp,
      labelProp,
      maxLength,
      formInkProps,
      formInkPropsName,
      readOnly = false,
    } = this.props;

    let inputLength = 0;

    if (formInkPropsName === "Playlist_name") {
      if (formInkProps.values.Playlist_name) {
        inputLength = formInkProps.values.Playlist_name.split("").length;
      }
    } else {
      if (formInkProps.values.Playlist_cover_image) {
        inputLength = formInkProps.values.Playlist_cover_image.split("").length;
      }
    }

    return (
      <div className="InputWithWordCounter__container">
        <div className="MB_Input--tag">
          <span>{labelProp}</span>
          <span className="MB_Input--counter">
            {inputLength} / {maxLength}
          </span>
        </div>
        <input
          maxLength={maxLength}
          type="text"
          className="MB_Input"
          placeholder={placeholderProp}
          onChange={formInkProps.handleChange}
          onBlur={formInkProps.handleBlur}
          value={
            formInkPropsName === "Playlist_name"
              ? formInkProps.values.Playlist_name
              : formInkProps.values.Playlist_cover_image
          }
          name={
            formInkPropsName === "Playlist_name"
              ? "Playlist_name"
              : "Playlist_cover_image"
          }
          readOnly={readOnly}
        />
      </div>
    );
  }
}

export class TextAreaWithWordCounter extends React.Component {
  render() {
    const { placeholderProp, labelProp, maxLength, formInkProps } = this.props;

    let inputLength = 0;
    if (formInkProps.values.Playlist_description) {
      inputLength = formInkProps.values.Playlist_description.split("").length;
    }
    return (
      <div className="TextAreaWithWordCounter__container">
        <div className="MB_TextArea--tag">
          <span>{labelProp}</span>
          <span className="MB_TextArea--counter">
            {inputLength} / {maxLength}
          </span>
        </div>

        <textarea
          maxLength={maxLength}
          type="text"
          cols="40"
          rows="5"
          className="MB_TextArea"
          placeholder={placeholderProp}
          onChange={formInkProps.handleChange}
          onBlur={formInkProps.handleBlur}
          value={formInkProps.values.Playlist_description}
          name="Playlist_description"
        />
      </div>
    );
  }
}
