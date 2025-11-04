import React, { useEffect } from "react";
import "./SonicFileInput.css";
// import UploadIcon from "../../../../static/uploadIcon.png";
import { ReactComponent as CloseIcon } from "../../../../static/closeIcon.svg";
import { ReactComponent as UploadIcon } from "../../../../static/upload1.svg";

const SonicFileInput = ({
  field: { value, name, ...restFields },
  id,
  form: { setFieldValue, values, errors, setErrors },
  variant = "filled",
  filePreviewName,
  ...props
}) => {
  const removeBugFile = () => {
    let sonic_file_input = document.getElementById("sonic_file_input");
    sonic_file_input.value = null;
    setFieldValue(name, null);
    if (props.onFileRemove) {
      props.onFileRemove();
    }
  };

  return (
    <React.Fragment>
      <div className={`sonic_file_input_container ${variant}`}>
        <label className="label" htmlFor="sonic_file_input">
          <UploadIcon className="logo" width={20} height={20} />
          <span>
            {values?.[name]?.name
              ? `Your file is selected (${values[name].name.slice(0, 25)}...)`
              : filePreviewName
              ? `Your file is selected ${filePreviewName.slice(0, 25)}...`
              : props.placeholder}
          </span>
        </label>
        {(values?.[name]?.name || filePreviewName) && (
          <button id="remove_sonic_file" onClick={removeBugFile}>
            <CloseIcon />
          </button>
        )}
        <input
          id={`sonic_file_input`}
          name={name}
          {...restFields}
          {...props}
          onChange={(e) => {
            setErrors(name, null);
            setFieldValue(name, e.target.files?.[0] || null);
            if (props.onFileSelect) {
              props.onFileSelect(e.target.files?.[0], removeBugFile);
            }
            // console.log('e.target.files?.[0]', e.target.files?.[0])
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default SonicFileInput;
