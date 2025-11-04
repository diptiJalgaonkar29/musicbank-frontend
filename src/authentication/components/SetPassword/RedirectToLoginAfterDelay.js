import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/AuthenticationActions";
export const RedirectToLoginAfterDelay = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
            dispatch(logout());
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ marginTop: "20px" }}>
            <h4 className="form-message highlight_text" id="form-message">
                This is a SSO user account. Redirecting to log in page...
            </h4>
        </div>
    );
};