import AsyncService from '../../../networking/services/AsyncService';
import { showSuccess } from '../../../redux/actions/notificationActions';

const aiAnalysisApiRequest = ({
    data,
    onSuccess,
    onError,
}) => {
    AsyncService
        .postData(`/ai_search/`, data)
        .then((res) => {
            // showNotification("SUCCESS", "file uploaded succesfully!");
            onSuccess?.(res);
        })
        .catch((err) => {
            console.log("Error", err);
            showSuccess("ERROR", "Something went wrong!");
            onError?.();
        });
};

export default aiAnalysisApiRequest;