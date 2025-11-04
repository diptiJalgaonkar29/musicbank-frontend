import AsyncService from '../../../networking/services/AsyncService';
import { showError, showSuccess } from '../../../redux/actions/notificationActions';


const fileUpload = ({
    formdata,
    configMeta,
    onSuccess,
    onError,
}) => {
    console.log('formdata', formdata)
    AsyncService
        .postFormData(`ai_search/upload`, formdata, configMeta, {
            headers: {
                "Content-Type": "multipart/form-data", // Axios automatically sets the correct boundary
            },
        }
        )
        .then((res) => {
            showSuccess("SUCCESS", "file uploaded succesfully!");
            onSuccess?.(res);
        })
        .catch((err) => {
            console.log("Error", err);
            showError("ERROR", "Something went wrong!");
            onError?.();
        });
};

export default fileUpload;
