import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../utils/axiosConfig";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token"); // Extract the token from URL

      if (!token) {
        setMessage("Invalid or missing token.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Make a request to your backend to verify the email
        const response = await axios.get(`/auth/verify-email?token=${token}`);

        setMessage(response.data.message || "Email verified successfully!");
        setError(false);

        // Redirect to login or dashboard after verification
        setTimeout(() => navigate("/login"), 1000); // Redirect in 3 seconds
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setMessage(
            error.response?.data?.message ||
              "Failed to verify email. Try again."
          );
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <p>Verifying your email, please wait...</p>
      ) : (
        <div>
          <p style={{ color: error ? "red" : "green" }}>{message}</p>
          {error && <button onClick={() => navigate("/login")}>ReLogin</button>}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
