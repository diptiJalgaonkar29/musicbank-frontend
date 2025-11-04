
import Select from "react-select";
import { useField, useFormikContext } from "formik";

const ReactSelectWapper = ({ name, options, isMulti = false, ...props }) => {
    const { setFieldValue, setTouched } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (selectedOption) => {
        setFieldValue(name, isMulti ? selectedOption : selectedOption?.value);
    };

    return (
        <>
            <Select
                name={name}
                options={options}
                isMulti={isMulti}
                value={
                    isMulti
                        ? options.filter((opt) => field.value?.some?.((val) => val.value === opt.value))
                        : options.find((opt) => opt.value === field.value)
                }
                onChange={handleChange}
                onBlur={() => setTouched({ [name]: true })}
                {...props}
            />
            {
                meta.touched && meta.error ? (
                    <div className="report_form_error">{meta.error}</div>
                ) : null
            }
        </>
    );
};

export default ReactSelectWapper;
