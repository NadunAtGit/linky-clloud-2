import React, { useState } from "react";
import PasswordInput from "../../components/inputs/PasswordInput";
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!email) errors.push("Please enter email.");
    if (!password) errors.push("Please enter password.");

    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    setError(""); // Clear error before API call.

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        // Debug logging in development mode
        if (process.env.NODE_ENV === "development") {
          console.log("Error Response:", error.response);
        }
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message); // Use server-provided message
        } else {
          setError("An unexpected error occurred, Please try again.");
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        setError("No response from server. Please check your network connection.");
      } else {
        console.log("Error during request setup:", error.message);
        setError("An unexpected error occurred, Please try again.");
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden relative bg-cyan-50">
      <div className="container h-screen px-30 mx-auto flex items-center justify-center">
        {/* Left image */}
        <div className="w-1/3 flex flex-col items-start justify-end h-[70vh] border-purple-400 rounded-xl p-10 z-50 bg-login-bg-img bg-cover bg-center shadow-md shadow-purple-400">
          <h4 className="text-7xl font-semibold leading-[50px] text-black">Linky</h4>
          <p className="text-[20px] text-black leading-6 pr-7 mt-6">
            "Connect Your World,
            <br />
            All Your Links, One Place."
          </p>
        </div>

        {/* Login Form */}
        <div className="w-1/3 h-[65vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200">
          <form onSubmit={handleLogin}>
            <h1 className="text-5xl font-semibold mb-7">Login</h1>

            <input
              type="email"
              className="input-box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>

            <p className="text-xs text-slate-400 text-center my-4">OR</p>

            <button
              type="button"
              className="btn-light btn-primary"
              onClick={() => navigate("/signin")}
            >
              SIGNUP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
