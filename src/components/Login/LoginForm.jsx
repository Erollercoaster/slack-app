import React, { useState } from "react";
import axiosInstance from "../../utils/API";
import { Link } from "react-router-dom";

function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/sign_in", loginData);

      const authHeaders = {
        "access-token": response.headers["access-token"],
        client: response.headers["client"],
        expiry: response.headers["expiry"],
        uid: response.headers["uid"],
      };
      localStorage.setItem("authHeaders", JSON.stringify(authHeaders));

      console.log("Login successful", response.data);
      localStorage.setItem("userDetails", JSON.stringify(response.data));

      // add logic for successful login (redirect to dashboard)
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error
      );
      // handle login errors
    }
  };

  return (
    <div className="login-wrapper">
      <h2>User Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Login</button>
        <br />
        <span>
          Need an Account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
}

export { LoginForm };
