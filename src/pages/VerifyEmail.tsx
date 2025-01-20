import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/verify-email", { token });
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage("Invalid or expired token");
    }
  };

  return (
    <div>
      <h2>Verify Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Verification Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
