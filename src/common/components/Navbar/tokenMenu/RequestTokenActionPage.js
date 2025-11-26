import React, { useEffect, useState } from "react";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./RequestTokenActionPage.css";
import AsyncService from "../../../../networking/services/AsyncService";

export default function RequestTokenActionPage() {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignTokens, setAssignTokens] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const [status, setStatus] = useState(null);

  // Get requestId from URL hash params
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return { requestId: searchParams.get("requestId") };
  };

  // Fetch request data
  useEffect(() => {
    async function fetchData() {
      const { requestId } = getQueryParams();
      console.log(requestId, "requestId");

      if (!requestId) {
        console.error("No requestId found in URL");
        setLoading(false);
        return;
      }

      try {
        const res = await AsyncService.loadData(`/credit/${requestId}`);
        setRequestData(res.data);
        setStatus(res.data.status);

        if (res.data.userRequestedTokens) {
          setAssignTokens(res.data.userRequestedTokens);
        }
      } catch (err) {
        console.error(err);
        dispatch(showError("Failed to fetch request data"));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [location, dispatch]);

  const callCreditRequestAPI = async (payload) => {
    try {
      const res = await AsyncService.postData(`/credit/creditRequest`,payload)

      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

const handleAccept = async () => {
  try {
    const payload = {
      id: requestData?.id,
      status: "Accepted",
      creditApproved: assignTokens,
    };

    await callCreditRequestAPI(payload);

    dispatch(showSuccess("Tokens Accepted Successfully!"));

    // 🔥 reload data
    const { requestId } = getQueryParams();
    const res = await AsyncService.loadData(`/credit/${requestId}`);
    setRequestData(res.data);
    setStatus(res.data.status);

  } catch (error) {
    dispatch(showError("Failed to Approve Tokens"));
  }
};

const handleReject = async () => {
  try {
    const payload = {
      id: requestData?.id,
      status: "Rejected",
      creditApproved: 0,
    };

    await callCreditRequestAPI(payload);

    dispatch(showError("Tokens Rejected"));

    // 🔥 reload data
    const { requestId } = getQueryParams();
    const res = await AsyncService.loadData(`/credit/${requestId}`);
    setRequestData(res.data);
    setStatus(res.data.status);

  } catch (error) {
    dispatch(showError("Failed to Reject Tokens"));
  }
};


if (loading) return <div className="ra-loader">Loading...</div>;

if (status !== "pending") {
  return (
    <div className="ra-container">
      <h1 className="ra-title">Credit Request Details</h1>

      <div style={{textAlign:'center', marginTop:"40px", fontSize:"22px"}}>
         Tokens were  <span style={{fontWeight:"600",textTransform:'capitalize',color: 'var(--color-primary)'}}>{status}</span>
      </div>

    </div>
  );
}



  return (
    <div className="ra-container">
      <h1 className="ra-title">Credit Request Details</h1>

      <div className="ra-card-container">
        <div className="ra-card">
          {/* User Requested Name */}
          <div className="ra-row">
            <span className="label">User Requested Name:</span>
            <span className="value">{requestData?.UserName}</span>
          </div>
          {requestData?.projectName && (
            <div className="ra-row">
              <span className="label">Project Name:</span>
              <span className="value">{requestData?.projectName}</span>
            </div>
          )}
          {requestData?.description && (
            <div className="ra-row">
              <span className="label">Description:</span>
              <span className="value">{requestData?.description}</span>
            </div>
          )}

          {/* Brand Tokens */}
          <div className="ra-row">
            <span className="label">Brand Tokens:</span>
            <span className="value">{requestData?.brandAvailableTokens}</span>
          </div>

          {/* User Requested Tokens */}
          <div className="ra-row">
            <span className="label">User Requested Tokens:</span>
            <span className="value">{requestData?.userRequestedTokens}</span>
          </div>

          {/* Assign Tokens Input */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "60%", margin: "2rem 0px" }}>
              <span className="label">Assign Tokens:</span>
              <InputWrapper
                type="number"
                className="assign-input"
                value={assignTokens}
                onChange={(e) => setAssignTokens(e.target.value)}
                placeholder="Assign token count"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="ra-button-group">
            <ButtonWrapper onClick={handleReject} variant="outlined"
             disabled={!requestData}
            >
              Reject
            </ButtonWrapper>
            {console.log(
              assignTokens <= requestData?.brandAvailableTokens,
              assignTokens,
              requestData?.brandAvailableTokens,
              "assignTokens <= requestData?.brandAvailableTokens"
            )}
            <ButtonWrapper
              onClick={handleAccept}
              style={{
                background: "var(--color-primary)",
                color: "var(--color-white)",
              }}
              disabled={ assignTokens == '' || assignTokens > requestData?.brandAvailableTokens}
            >
              Accept
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
